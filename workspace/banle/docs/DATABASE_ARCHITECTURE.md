# Database Architecture – BanLe Multi-Store E-commerce System

## Snapshot Overview
- **Environment**: Local Docker service `banle_postgres_dev` (PostgreSQL 15.4, PostGIS 3.3)
- **Database**: `banle_dev`
- **Dump Source**: `docs/db_schema_dump.sql` (generated via `pg_dump -s -U banle_user banle_dev` on 12 Feb 2026)
- **Tables Present**: 13 application tables + `_prisma_migrations`
- **Purpose**: Provide an accurate, auditable description of the live schema powering the BanLe portal today.

> When the schema changes, rerun the dump command above and refresh this document so that engineers and analysts have a trustworthy reference.

---

## Database Environment
- **Extensions**: `postgis`, `pg_trgm`, `unaccent`
- **Additional Schemas**: `tiger`, `tiger_data`, `topology` (installed automatically with PostGIS)
- **Search Path**: Default `public`
- **Encoding**: UTF-8

### Domain Enums
| Type | Values | Used By |
|------|--------|---------|
| `public."DiscountType"` | `PERCENTAGE`, `FIXED` | `promotions.discount_type` |
| `public."OrderStatus"` | `PENDING`, `CONFIRMED`, `PREPARING`, `READY_FOR_PICKUP`, `SHIPPING`, `DELIVERED`, `CANCELLED` | `orders.order_status` |
| `public."PaymentMethod"` | `COD`, `BANK_TRANSFER`, `MOMO`, `VNPAY`, `CREDIT_CARD` | `orders.payment_method` |
| `public."PaymentStatus"` | `PENDING`, `PAID`, `FAILED`, `REFUNDED` | `orders.payment_status` |
| `public."PromotionStatus"` | `ACTIVE`, `INACTIVE`, `EXPIRED` | `promotions.status` |
| `public."StoreProductStatus"` | `AVAILABLE`, `OUT_OF_STOCK`, `DISCONTINUED` | `store_products.status` |
| `public."StoreStatus"` | `ACTIVE`, `INACTIVE`, `SUSPENDED` | `stores.status` |
| `public."UserRole"` | `CUSTOMER`, `MERCHANT`, `ADMIN` | `users.role` |
| `public."UserStatus"` | `ACTIVE`, `INACTIVE`, `SUSPENDED` | `users.status` |

---

## Tables
The column inventories below mirror the live schema. Data types are shown exactly as defined (mostly `text` rather than sized `varchar`). Default expressions are noted where present.

### 0. `_prisma_migrations`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | varchar(36) | PK | Prisma migration identifier |
| `checksum` | varchar(64) | NOT NULL | Hash of migration contents |
| `finished_at` | timestamptz | NULL | Completion time |
| `migration_name` | varchar(255) | NOT NULL | Human-friendly label |
| `logs` | text | NULL | Execution logs |
| `rolled_back_at` | timestamptz | NULL | Rollback time |
| `started_at` | timestamptz | NOT NULL DEFAULT `now()` | Start timestamp |
| `applied_steps_count` | integer | NOT NULL DEFAULT 0 | Steps applied |

Indexes & constraints: primary key on `id` only.

---

### 1. `users`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | |
| `email` | text | NOT NULL, UNIQUE (`users_email_key`) | Indexed by `users_email_idx` |
| `password_hash` | text | NOT NULL | |
| `full_name` | text | NOT NULL | |
| `phone` | text | NULL | |
| `role` | `UserRole` | NOT NULL DEFAULT `CUSTOMER` | Indexed by `users_role_idx` |
| `avatar_url` | text | NULL | |
| `email_verified` | boolean | NOT NULL DEFAULT false | |
| `status` | `UserStatus` | NOT NULL DEFAULT `ACTIVE` | Indexed by `users_status_idx` |
| `oauth_provider` | text | NULL | |
| `oauth_id` | text | NULL | Part of composite index `users_oauth_provider_oauth_id_idx` |
| `created_at` | timestamp(3) | NOT NULL DEFAULT `CURRENT_TIMESTAMP` | |
| `updated_at` | timestamp(3) | NOT NULL | |

Foreign keys: none (parent table).

---

### 2. `stores`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | |
| `merchant_id` | uuid | NOT NULL | FK → `users(id)` (`stores_merchant_id_fkey`) |
| `store_name` | varchar(100) | NOT NULL, UNIQUE | `stores_store_name_key` + `stores_store_name_idx` |
| `name` | text | NOT NULL | |
| `slug` | text | NOT NULL, UNIQUE (`stores_slug_key`) | Indexed by `stores_slug_idx` |
| `description` | text | NULL | |
| `categories` | text[] | NULL | Indexed by `stores_categories_idx` |
| `logo_url` | text | NULL | |
| `cover_url` | text | NULL | |
| `address` | text | NOT NULL | |
| `latitude` | numeric(10,8) | NOT NULL | |
| `longitude` | numeric(11,8) | NOT NULL | |
| `location` | geography(Point,4326) | NULL | Stored directly (no trigger) |
| `phone` | text | NOT NULL | |
| `email` | text | NULL | |
| `opening_hours` | jsonb | NULL | |
| `status` | `StoreStatus` | NOT NULL DEFAULT `ACTIVE` | Indexed by `stores_status_idx` |
| `rating_average` | numeric(2,1) | NOT NULL DEFAULT 0.0 | |
| `rating_count` | integer | NOT NULL DEFAULT 0 | |
| `created_at` | timestamp(3) | NOT NULL DEFAULT `CURRENT_TIMESTAMP` | |
| `updated_at` | timestamp(3) | NOT NULL | |
| `deleted_at` | timestamp(3) | NULL | Indexed by `stores_deleted_at_idx` |

Additional index: `stores_merchant_id_idx`. There is currently **no** GIST index on `location`.

---

### 3. `categories`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | |
| `name` | text | NOT NULL | |
| `slug` | text | NOT NULL, UNIQUE (`categories_slug_key`) | |
| `description` | text | NULL | |
| `level` | integer | NOT NULL DEFAULT 1 | Indexed by `categories_level_idx` |
| `display_order` | integer | NOT NULL DEFAULT 0 | |
| `parent_id` | uuid | NULL | FK → `categories(id)` (`categories_parent_id_fkey`) |
| `created_at` | timestamp(3) | NOT NULL DEFAULT `CURRENT_TIMESTAMP` | |
| `updated_at` | timestamp(3) | NOT NULL | |
| `block_buyer_platform` | jsonb | NULL | Legacy import metadata |
| `catid` | bigint | NULL, UNIQUE (`categories_catid_key`) | |
| `display_name` | text | NULL | |
| `image` | text | NULL | |
| `parent_catid` | bigint | NULL | Indexed (`categories_parent_catid_idx`) |
| `selected_image` | text | NULL | |
| `unselected_image` | text | NULL | |

Additional index: `categories_parent_id_idx`.

---

### 4. `base_products`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | |
| `category_id` | uuid | NOT NULL | FK → `categories(id)` (`base_products_category_id_fkey`) |
| `name` | text | NOT NULL | |
| `slug` | text | NOT NULL, UNIQUE (`base_products_slug_key`) | Indexed by `base_products_slug_idx` |
| `description` | text | NULL | |
| `unit` | text | NULL | No NOT NULL enforcement yet |
| `attributes` | jsonb | NULL | |
| `images` | jsonb | NULL | |
| `created_by` | uuid | NULL | No FK defined |
| `created_at` | timestamp(3) | NOT NULL DEFAULT `CURRENT_TIMESTAMP` | |
| `updated_at` | timestamp(3) | NOT NULL | |

Additional index: `base_products_category_id_idx`.

---

### 5. `store_products`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | |
| `store_id` | uuid | NOT NULL | FK → `stores(id)` (`store_products_store_id_fkey`) |
| `base_product_id` | uuid | NOT NULL | FK → `base_products(id)` (`store_products_base_product_id_fkey`) |
| `name` | text | NOT NULL | |
| `slug` | text | NOT NULL | Indexed by `store_products_slug_idx`; slug is global |
| `price` | numeric(12,2) | NOT NULL | |
| `sale_price` | numeric(12,2) | NULL | |
| `stock_quantity` | integer | NOT NULL DEFAULT 0 | |
| `images` | jsonb | NULL | |
| `status` | `StoreProductStatus` | NOT NULL DEFAULT `AVAILABLE` | |
| `is_visible` | boolean | NOT NULL DEFAULT true | |
| `created_at` | timestamp(3) | NOT NULL DEFAULT `CURRENT_TIMESTAMP` | |
| `updated_at` | timestamp(3) | NOT NULL | |

Indexes: `store_products_base_product_id_idx`, `store_products_store_id_status_idx`. A uniqueness constraint on `(store_id, base_product_id)` has not been created yet.

---

### 6. `carts`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | |
| `customer_id` | uuid | NOT NULL | FK → `users(id)`; unique index `carts_customer_id_key` |
| `store_id` | uuid | NULL | FK → `stores(id)` (`ON DELETE SET NULL`) |
| `created_at` | timestamp(3) | NOT NULL DEFAULT `CURRENT_TIMESTAMP` | |
| `updated_at` | timestamp(3) | NOT NULL | |

No additional indexes.

---

### 7. `cart_items`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | |
| `cart_id` | uuid | NOT NULL | FK → `carts(id)` (`ON DELETE CASCADE`) |
| `product_id` | uuid | NOT NULL | FK → `store_products(id)` |
| `quantity` | integer | NOT NULL | |
| `price_snapshot` | numeric(10,2) | NOT NULL | Captures price when item was added |
| `created_at` | timestamp(3) | NOT NULL DEFAULT `CURRENT_TIMESTAMP` | |

There is currently no uniqueness constraint on `(cart_id, product_id)`.

---

### 8. `orders`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | |
| `order_number` | text | NOT NULL, UNIQUE (`orders_order_number_key`) | |
| `customer_id` | uuid | NOT NULL | FK → `users(id)` |
| `store_id` | uuid | NOT NULL | FK → `stores(id)` |
| `customer_name` | text | NOT NULL | |
| `customer_phone` | text | NOT NULL | |
| `shipping_address` | text | NOT NULL | |
| `notes` | text | NULL | |
| `subtotal` | numeric(12,2) | NOT NULL | |
| `shipping_fee` | numeric(12,2) | NOT NULL DEFAULT 0 | |
| `discount` | numeric(12,2) | NOT NULL DEFAULT 0 | |
| `total` | numeric(12,2) | NOT NULL | |
| `payment_method` | `PaymentMethod` | NOT NULL DEFAULT `COD` | |
| `payment_status` | `PaymentStatus` | NOT NULL DEFAULT `PENDING` | |
| `order_status` | `OrderStatus` | NOT NULL DEFAULT `PENDING` | |
| `payment_transaction_id` | text | NULL | |
| `created_at` | timestamp(3) | NOT NULL DEFAULT `CURRENT_TIMESTAMP` | |
| `updated_at` | timestamp(3) | NOT NULL | |
| `confirmed_at` | timestamp(3) | NULL | |
| `shipped_at` | timestamp(3) | NULL | |
| `delivered_at` | timestamp(3) | NULL | |

Fields such as `cancellation_reason` or `cancelled_at` are not part of the current schema.

Indexes: `orders_created_at_idx`, `orders_customer_id_idx`, `orders_store_id_idx`, `orders_order_status_idx`, `orders_payment_status_idx`.

---

### 9. `order_items`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | |
| `order_id` | uuid | NOT NULL | FK → `orders(id)` (`ON DELETE CASCADE`) |
| `product_id` | uuid | NOT NULL | FK → `store_products(id)` |
| `product_name` | text | NOT NULL | Snapshot of the name at purchase time |
| `quantity` | integer | NOT NULL | |
| `unit_price` | numeric(12,2) | NOT NULL | |
| `total_price` | numeric(12,2) | NOT NULL | No DB-level check linking it to `quantity` |
| `created_at` | timestamp(3) | NOT NULL DEFAULT `CURRENT_TIMESTAMP` | |

Indexes: `order_items_order_id_idx`, `order_items_product_id_idx`.

---

### 10. `reviews`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | |
| `order_id` | uuid | NOT NULL | FK → `orders(id)` |
| `customer_id` | uuid | NOT NULL | FK → `users(id)` |
| `store_id` | uuid | NOT NULL | FK → `stores(id)` |
| `product_id` | uuid | NULL | FK → `store_products(id)` (`ON DELETE SET NULL`) |
| `rating` | integer | NOT NULL | No CHECK constraint enforcing 1–5 |
| `comment` | text | NULL | |
| `images` | jsonb | NULL | |
| `product_quality_rating` | integer | NULL | |
| `service_rating` | integer | NULL | |
| `merchant_response` | text | NULL | |
| `is_verified_purchase` | boolean | NOT NULL DEFAULT true | |
| `created_at` | timestamp(3) | NOT NULL DEFAULT `CURRENT_TIMESTAMP` | |
| `updated_at` | timestamp(3) | NOT NULL | |

Indexes: `reviews_created_at_idx`, `reviews_customer_id_idx`, `reviews_product_id_idx`, `reviews_store_id_idx`.

---

### 11. `promotions`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | |
| `store_id` | uuid | NOT NULL | FK → `stores(id)` |
| `code` | text | NOT NULL, UNIQUE (`promotions_code_key`) | Indexed by `promotions_code_idx` |
| `name` | text | NOT NULL | |
| `description` | text | NULL | |
| `discount_type` | `DiscountType` | NOT NULL | |
| `discount_value` | numeric(12,2) | NOT NULL | |
| `min_order_value` | numeric(12,2) | NULL | |
| `max_usage` | integer | NULL | No per-customer usage tracking |
| `used_count` | integer | NOT NULL DEFAULT 0 | |
| `applicable_products` | jsonb | NULL | Category targeting not stored |
| `valid_from` | timestamp(3) | NOT NULL | |
| `valid_to` | timestamp(3) | NOT NULL | |
| `status` | `PromotionStatus` | NOT NULL DEFAULT `ACTIVE` | |
| `created_at` | timestamp(3) | NOT NULL DEFAULT `CURRENT_TIMESTAMP` | |
| `updated_at` | timestamp(3) | NOT NULL | |

Indexes: `promotions_status_idx`, `promotions_store_id_idx`, `promotions_valid_from_valid_to_idx`.

---

### 12. `notifications`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PK | |
| `user_id` | uuid | NOT NULL | FK → `users(id)` (`ON DELETE CASCADE`) |
| `type` | text | NOT NULL | |
| `title` | text | NOT NULL | |
| `message` | text | NOT NULL | |
| `data` | jsonb | NULL | |
| `is_read` | boolean | NOT NULL DEFAULT false | |
| `channels` | jsonb | NULL | |
| `created_at` | timestamp(3) | NOT NULL DEFAULT `CURRENT_TIMESTAMP` | |

Indexes: `notifications_created_at_idx`, composite `notifications_user_id_is_read_idx`. There is no `read_at` field.

---

## Relationships Summary
- `users` → `stores`, `orders`, `carts`, `notifications`, `reviews`
- `stores` → `store_products`, `orders`, `reviews`, `promotions`, `carts`
- `categories` → `base_products` and self (parent-child)
- `base_products` → `store_products`
- `orders` → `order_items`, `reviews`
- `carts` → `cart_items`
- `store_products` are referenced by `cart_items`, `order_items`, `reviews`

There are currently **no** join tables for promotion usage, payment transactions, sessions, or activity logging despite earlier design notes.

---

## Index & Constraint Highlights
- Unique constraints exist on: `users.email`, `stores.store_name`, `stores.slug`, `categories.slug`, `categories.catid`, `base_products.slug`, `orders.order_number`, `promotions.code`, `carts.customer_id`.
- Frequently filtered columns already have supporting indexes (status fields, timestamps, foreign keys). However, a GIST index on `stores.location` has **not** been created, so geospatial queries will require either sequential scans or a future migration.
- Several business rules discussed previously (e.g., `price > 0`, rating bounds, `(store_id, base_product_id)` uniqueness) are **not enforced** at the database level.

---

## Gaps vs. Original Blueprint
The prior documentation referenced tables or columns that are missing from the live schema as of 12 Feb 2026:
- `promotion_usage`
- `payment_transactions`
- `activity_logs`
- `sessions`
- Additional review metrics (`delivery_rating`, `packaging_rating`, `helpful_count`)
- Order cancellation fields (`cancellation_reason`, `cancelled_at`)
- Base-product approval metadata (`is_approved`, `base_price`)

If these capabilities are still desired, create migrations to add the structures or remove the unused requirements from the product backlog.

---

## Operational Notes
1. **Refreshing the Snapshot**
  ```bash
  cd /Users/long/Documents/Project/banle
  docker exec banle_postgres_dev pg_dump -s -U banle_user banle_dev > docs/db_schema_dump.sql
  ```
  Re-run after any migration, then re-sync this document.

2. **Recommended Follow-ups**
  - Add the missing geospatial index on `stores(location)` if proximity filtering is needed.
  - Enforce business constraints (`CHECK (price > 0)`, rating bounds, `(store_id, base_product_id)` uniqueness) to align DB rules with application logic.
  - Implement the absent tables/columns listed in the gap section or adjust roadmap expectations.

---

**Last Reviewed**: 12 Feb 2026  
**Maintainer**: Platform Engineering

**Constraints**:
- `CHECK (quantity > 0)`
- `CHECK (unit_price > 0)`
- `CHECK (total_price = quantity * unit_price)`

---

### 10. reviews
**Description**: Product and store reviews by customers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique review identifier |
| order_id | UUID | FOREIGN KEY → orders(id), NOT NULL | Order reference |
| customer_id | UUID | FOREIGN KEY → users(id), NOT NULL | Reviewer reference |
| store_id | UUID | FOREIGN KEY → stores(id), NOT NULL | Store reference |
| product_id | UUID | FOREIGN KEY → store_products(id), NULL | Product reference (NULL = store review) |
| rating | INTEGER | NOT NULL | Star rating (1-5) |
| comment | TEXT | NULL | Review text |
| images | JSONB | NULL | Review image URLs |
| product_quality_rating | INTEGER | NULL | Product quality (1-5) |
| service_rating | INTEGER | NULL | Service quality (1-5) |
| delivery_rating | INTEGER | NULL | Delivery speed (1-5) |
| packaging_rating | INTEGER | NULL | Packaging quality (1-5) |
| merchant_response | TEXT | NULL | Merchant reply |
| merchant_responded_at | TIMESTAMP | NULL | Response timestamp |
| is_verified_purchase | BOOLEAN | NOT NULL, DEFAULT true | Verified buyer |
| helpful_count | INTEGER | DEFAULT 0 | Helpful votes count |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Review submission time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Review edit time |

**Indexes**:
- `idx_reviews_order_id` ON order_id
- `idx_reviews_customer_id` ON customer_id
- `idx_reviews_store_id` ON store_id
- `idx_reviews_product_id` ON product_id
- `idx_reviews_rating` ON rating
- `idx_reviews_created_at` ON created_at DESC

**Constraints**:
- `CHECK (rating BETWEEN 1 AND 5)`
- `CHECK (product_quality_rating IS NULL OR product_quality_rating BETWEEN 1 AND 5)`
- `CHECK (service_rating IS NULL OR service_rating BETWEEN 1 AND 5)`
- `CHECK (delivery_rating IS NULL OR delivery_rating BETWEEN 1 AND 5)`
- `CHECK (packaging_rating IS NULL OR packaging_rating BETWEEN 1 AND 5)`
- `UNIQUE (order_id, product_id)` -- One review per product per order

**Triggers**:
- Update `stores.rating_average` and `rating_count` when review added/updated

---

### 11. promotions
**Description**: Store promotions and coupon codes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique promotion ID |
| store_id | UUID | FOREIGN KEY → stores(id), NOT NULL | Store reference |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Coupon code (uppercase) |
| name | VARCHAR(255) | NOT NULL | Promotion name |
| description | TEXT | NULL | Promotion description |
| discount_type | ENUM('percentage', 'fixed') | NOT NULL | Discount type |
| discount_value | DECIMAL(12, 2) | NOT NULL | Discount amount/percentage |
| min_order_value | DECIMAL(12, 2) | NULL | Minimum order requirement |
| max_discount | DECIMAL(12, 2) | NULL | Maximum discount cap (for percentage) |
| max_usage | INTEGER | NULL | Total usage limit |
| max_usage_per_customer | INTEGER | NULL | Per-customer usage limit |
| used_count | INTEGER | DEFAULT 0 | Current usage count |
| applicable_products | JSONB | NULL | Array of product IDs (NULL = all) |
| applicable_categories | JSONB | NULL | Array of category IDs (NULL = all) |
| valid_from | TIMESTAMP | NOT NULL | Start date/time |
| valid_to | TIMESTAMP | NOT NULL | End date/time |
| status | ENUM('active', 'inactive', 'expired') | NOT NULL, DEFAULT 'active' | Promotion status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record update time |

**Indexes**:
- `idx_promotions_store_id` ON store_id
- `idx_promotions_code` ON code (unique)
- `idx_promotions_status` ON status
- `idx_promotions_valid_dates` ON (valid_from, valid_to)

**Constraints**:
- `CHECK (discount_value > 0)`
- `CHECK (discount_type = 'percentage' AND discount_value <= 100 OR discount_type = 'fixed')`
- `CHECK (valid_to > valid_from)`
- `CHECK (max_usage IS NULL OR max_usage > 0)`
- `CHECK (used_count <= max_usage OR max_usage IS NULL)`

---

### 12. promotion_usage
**Description**: Track promotion usage per customer

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique usage record ID |
| promotion_id | UUID | FOREIGN KEY → promotions(id), NOT NULL | Promotion reference |
| customer_id | UUID | FOREIGN KEY → users(id), NOT NULL | Customer reference |
| order_id | UUID | FOREIGN KEY → orders(id), NOT NULL | Order reference |
| discount_applied | DECIMAL(12, 2) | NOT NULL | Actual discount amount |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Usage timestamp |

**Indexes**:
- `idx_promotion_usage_promotion_id` ON promotion_id
- `idx_promotion_usage_customer_id` ON customer_id
- `idx_promotion_usage_order_id` ON order_id

**Constraints**:
- `CHECK (discount_applied > 0)`

---

### 13. notifications
**Description**: User notifications (push, email, SMS)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique notification ID |
| user_id | UUID | FOREIGN KEY → users(id) ON DELETE CASCADE, NOT NULL | Recipient reference |
| type | VARCHAR(50) | NOT NULL | Notification type |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification content |
| data | JSONB | NULL | Additional metadata |
| channels | JSONB | NULL | Delivery channels (push, email, sms) |
| is_read | BOOLEAN | NOT NULL, DEFAULT false | Read status |
| read_at | TIMESTAMP | NULL | Read timestamp |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Notification time |

**Indexes**:
- `idx_notifications_user_id` ON user_id
- `idx_notifications_type` ON type
- `idx_notifications_read` ON is_read
- `idx_notifications_created_at` ON created_at DESC

**Notification types**:
- `order_confirmed`, `order_shipping`, `order_delivered`, `order_cancelled`
- `new_order` (merchant)
- `low_stock` (merchant)
- `new_review` (merchant)
- `promotion` (customer)
- `back_in_stock` (customer)

---

### 14. payment_transactions
**Description**: Payment transaction logs

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique transaction ID |
| order_id | UUID | FOREIGN KEY → orders(id), NOT NULL | Order reference |
| external_transaction_id | VARCHAR(255) | NULL | Payment gateway transaction ID |
| payment_method | VARCHAR(50) | NOT NULL | Payment method used |
| amount | DECIMAL(12, 2) | NOT NULL | Transaction amount |
| currency | VARCHAR(3) | NOT NULL, DEFAULT 'VND' | Currency code |
| status | ENUM('pending', 'success', 'failed', 'refunded') | NOT NULL | Transaction status |
| gateway_response | JSONB | NULL | Raw gateway response |
| error_message | TEXT | NULL | Error details if failed |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Transaction time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Status update time |

**Indexes**:
- `idx_payment_transactions_order_id` ON order_id
- `idx_payment_transactions_external_id` ON external_transaction_id
- `idx_payment_transactions_status` ON status
- `idx_payment_transactions_created_at` ON created_at DESC

---

### 15. activity_logs
**Description**: Audit trail for important actions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique log ID |
| user_id | UUID | FOREIGN KEY → users(id), NULL | User who performed action |
| entity_type | VARCHAR(50) | NOT NULL | Entity type (order, product, store) |
| entity_id | UUID | NOT NULL | Entity ID |
| action | VARCHAR(50) | NOT NULL | Action performed (create, update, delete) |
| changes | JSONB | NULL | Changed fields (before/after) |
| ip_address | VARCHAR(45) | NULL | Request IP address |
| user_agent | TEXT | NULL | Request user agent |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Action timestamp |

**Indexes**:
- `idx_activity_logs_user_id` ON user_id
- `idx_activity_logs_entity` ON (entity_type, entity_id)
- `idx_activity_logs_created_at` ON created_at DESC

---

### 16. sessions
**Description**: User sessions and refresh tokens

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique session ID |
| user_id | UUID | FOREIGN KEY → users(id) ON DELETE CASCADE, NOT NULL | User reference |
| refresh_token | VARCHAR(500) | UNIQUE, NOT NULL | JWT refresh token |
| device_info | JSONB | NULL | Device information |
| ip_address | VARCHAR(45) | NULL | Login IP address |
| expires_at | TIMESTAMP | NOT NULL | Token expiration time |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Session creation time |
| last_used_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last activity time |

**Indexes**:
- `idx_sessions_user_id` ON user_id
- `idx_sessions_refresh_token` ON refresh_token
- `idx_sessions_expires_at` ON expires_at

**Cleanup**: Periodically delete expired sessions

---

## Relationships Summary

### One-to-Many (1:N)
- `users` → `stores` (merchant owns multiple stores)
- `users` → `orders` (customer places multiple orders)
- `stores` → `store_products` (store has multiple products)
- `stores` → `orders` (store receives multiple orders)
- `stores` → `promotions` (store has multiple promotions)
- `categories` → `base_products` (category has multiple base products)
- `base_products` → `store_products` (base product cloned to multiple stores)
- `orders` → `order_items` (order contains multiple items)
- `orders` → `reviews` (order can have multiple reviews)
- `carts` → `cart_items` (cart contains multiple items)
- `users` → `notifications` (user receives multiple notifications)

### Many-to-Many (N:M) via Junction Tables
- `stores` ↔ `base_products` via `store_products` (store stocks multiple products, product available in multiple stores)
- `promotions` ↔ `orders` via `promotion_usage` (promotion used in multiple orders, order can use multiple promotions)

### Self-Referencing
- `categories` → `categories` (parent-child hierarchy)

---

## Indexes Strategy

### Spatial Indexes (PostGIS)
- `stores.location` - GIST index for distance queries

### Full-Text Search Indexes (pg_trgm)
- `base_products.name` - GIN trigram index
- `store_products.name` - GIN trigram index

### B-tree Indexes
- Foreign keys (automatic performance boost)
- Status fields (frequent filtering)
- Date fields (range queries, sorting)
- Unique fields (email, slug, order_number)

### Composite Indexes
- `(store_id, order_status)` on orders
- `(store_id, slug)` on store_products

---

## Constraints Summary

### Primary Keys
- All tables use UUID as PRIMARY KEY

### Foreign Keys
- CASCADE on delete for dependent entities (cart_items, order_items)
- RESTRICT on delete for reference entities (users, stores, products)

### Unique Constraints
- Email addresses (users.email)
- Order numbers (orders.order_number)
- Slugs (categories.slug, base_products.slug)
- Coupon codes (promotions.code)
- One cart per customer (carts.customer_id)

### Check Constraints
- Price validation (price > 0)
- Rating ranges (1-5)
- Coordinate ranges (latitude, longitude)
- Discount logic (sale_price < price)
- Stock non-negative

---

## Database Migrations

**Migration Tool**: Prisma Migrate or TypeORM Migrations

**Migration Strategy**:
1. Version-controlled migration files
2. Up/Down migration support
3. Seed data for development
4. Rollback capability
5. Production migration checklist

---

## Performance Optimization

### Query Optimization
- Use prepared statements
- Avoid N+1 queries (eager loading)
- Pagination for large result sets
- Materialized views for complex reports

### Caching Strategy
- Redis for:
  - Session storage
  - Frequently accessed data (stores, products)
  - Search results
  - Geospatial query results
  - Rate limiting counters

### Partitioning (Future)
- Partition `orders` by created_at (monthly)
- Partition `activity_logs` by created_at (monthly)
- Archive old data to cold storage

---

## Backup & Recovery

### Backup Strategy
- **Daily full backup** (PostgreSQL pg_dump)
- **Hourly incremental backups** (WAL archiving)
- **Retention**: 30 days
- **Off-site backup** (AWS S3 or equivalent)

### Recovery Testing
- Monthly restore drill
- Point-in-time recovery (PITR) capability
- Disaster recovery plan

---

## Security Measures

### Database Security
- Encrypted connections (SSL/TLS)
- Strong password policy for DB users
- Principle of least privilege (role-based access)
- No sensitive data in logs
- Encrypted backups
- SQL injection prevention (parameterized queries)

### Data Privacy
- PII encryption at rest (optional)
- Password hashing (bcrypt/argon2)
- Payment data compliance (PCI DSS)
- GDPR compliance (data deletion, export)

---

## Database Statistics

- **Total Tables**: 16
- **Total Relationships**: 25+
- **Total Indexes**: 60+
- **Estimated Storage** (1 year, 10K users):
  - Users: 10K rows → ~5 MB
  - Stores: 5K rows → ~20 MB
  - Products: 100K rows → ~500 MB
  - Orders: 500K rows → ~2 GB
  - Order Items: 2M rows → ~1 GB
  - Reviews: 100K rows → ~500 MB
  - **Total**: ~4-5 GB (excluding images)

---

**Document Version**: 1.0  
**Last Updated**: January 28, 2026  
**Status**: Complete

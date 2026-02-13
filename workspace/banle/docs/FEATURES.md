# Features List - BanLe Multi-Store E-commerce System

## Overview
This document provides a comprehensive list of all system features organized by modules and user roles.

---

## 1. Authentication & User Management

### 1.1 Registration & Login
- **Multi-method registration**: Email, Phone number
- **Multi-method login**: Email/Password, Google OAuth 2.0, Facebook OAuth 2.0
- **JWT-based authentication** with access and refresh tokens
- **Email verification** via OTP
- **Password reset** via email link
- **Role-based access control** (Customer, Merchant, Admin)
- **Account activation/deactivation**
- **Secure password hashing** (bcrypt/argon2)

### 1.2 Profile Management
- Update personal information (name, phone, email, avatar)
- Change password
- Manage notification preferences
- View account activity history
- Delete account (GDPR compliance)

---

## 2. Store Management (Merchant)

### 2.1 Store CRUD Operations
- **Create store** with complete details
- **Edit store** information
- **Activate/Deactivate** store
- **Soft delete** store
- **Multi-store support** (merchant can own multiple stores)

### 2.2 Store Information Management
- Store name and description
### 2.2 Store Profile Setup
- **Store name** (unique identifier for URL sharing)
- Store display name
- Description and about information
- Logo and cover images upload
- **Store categories/tags** (select multiple categories for better discoverability)
- Contact information (phone, email)
- Physical address with autocomplete
- **Location selection on Google Maps** (drag-and-drop marker)
- Store coordinates (latitude, longitude) storage
- Operating hours configuration (weekday-specific)
- Store status indicator (Open/Closed)
- **Shareable store URL**: `yoursite.com/store_name`

### 2.3 Store Visibility
- Public store listing
- **Store category filtering** (Grocery, Electronics, Fashion, Food & Beverage, etc.)
- Store search optimization
- Store rating display
- Store on map visualization
- **Distance calculation** from customer location
- **Filter stores by category** for easy discovery

### 2.4 Store Search & Discovery
- **Search stores by name**
- **Filter by store categories** (multi-select)
- Filter by distance radius
- Filter by rating (minimum stars)
- Filter by store status (open now)
- Sort by: distance, rating, newest
- **Category-based store browsing**
- View stores by specific category (e.g., all Food stores nearby)

---

## 3. Product & Catalog Management

### 3.1 Category Management (Admin)
- **Hierarchical category structure** (Category → Sub-category)
- Create, edit, delete categories
- Set display order
- Category image upload
- SEO-friendly slugs

### 3.2 Base Product Management (Shared Catalog)
- **System-wide base product library**
- Merchant can create new base products
- Admin approval workflow for new base products
- Product attributes (color, size, material, etc.)
- Product images (multiple)
- Product description templates
- Unit of measurement (kg, piece, liter, etc.)
- Category assignment

### 3.3 Store Product Management (Merchant)
- **Clone base products** to store catalog
- **Store-specific pricing** (independent pricing per store)
- Customize product name and description
- Upload store-specific product images
- Set regular price and sale price
- **Stock/inventory management**
- Product status (Available, Out of Stock, Discontinued)
- Show/hide products from catalog
- **Bulk product import** from CSV/Excel
- Product variants support (size, color combinations)
- **Sync updates** from base product (optional)

### 3.4 Product Discovery
- Full-text product search
- Search autocomplete
- Category-based browsing
- Sub-category filtering
- **Location-based product search** (find products in nearby stores)
- Price range filtering
- Store filtering
- Rating filtering
- Availability filtering (in stock only)
- Sort by: price, distance, rating, relevance

---

## 4. Location-Based Features

### 4.1 Store Locator
- **Automatic geolocation** (browser GPS)
- Manual address input with Google Places autocomplete
- **Find nearby stores** within configurable radius (1km, 3km, 5km, 10km, 20km)
- Display stores on **interactive Google Maps**
- Multiple store markers with clustering
- Store info window on marker click
- Filter by: distance, category, open now
- Sort by distance (nearest first)
- **Get directions** from current location to store

### 4.2 Product Search by Location
- Search products across nearby stores
- Display product availability with store distance
- Sort results by distance or price
- Filter by store, price, category
- Show multiple stores offering same product
- **Distance-aware recommendations**

### 4.3 Geospatial Calculations
- **Haversine formula** for distance calculation
- **PostGIS integration** for spatial queries
- Coordinate indexing for performance
- Radius-based search optimization
- Caching for frequent location queries

---

## 5. Shopping Cart

### 5.1 Cart Operations
- Add products to cart
- Update product quantity
- Remove products from cart
- View cart summary
- Clear entire cart
- **Persistent cart** (saved across sessions)

### 5.2 Cart Business Rules
- **Single-store cart** (one cart per store at a time)
- **Store conflict warning** when adding products from different store
- Option to clear current cart or cancel
- Real-time stock validation
- Real-time price updates
- Total calculation (subtotal, taxes, shipping)

### 5.3 Cart UI/UX
- Inline quantity editing
- Product image thumbnails
- Price per item and line total
- Running total display
- Empty cart state
- Stock availability indicators
- Continue shopping link

---

## 6. Order Management

### 6.1 Checkout Flow (Customer)
- Cart review
- Shipping information form (name, phone, address)
- Order notes/special instructions
- **Payment method selection**:
  - COD (Cash on Delivery)
  - Bank Transfer
  - E-wallets (Momo, ZaloPay, VNPay)
  - Credit/Debit Card
- **Coupon/voucher code** application
- Order summary review
- Terms and conditions acceptance
- Place order confirmation

### 6.2 Order Tracking (Customer)
- View order list (all orders)
- Filter by status, date range
- View detailed order information
- Track order status in real-time
- Order timeline/history
- **Cancel pending orders**
- Request returns/refunds
- Download invoice (PDF)

### 6.3 Order Management (Merchant)
- View incoming orders (real-time)
- Order notification alerts
- Filter orders by:
  - Status
  - Date range
  - Customer name
  - Order number
  - Order value
- **Update order status**:
  - Pending → Confirmed
  - Confirmed → Preparing
  - Preparing → Shipping
  - Shipping → Delivered
  - Any → Cancelled (with reason)
- **Print order invoice**
- **Print delivery slip**
- Process returns/refunds
- Add internal notes to orders

### 6.4 Order States
- **Pending**: Awaiting merchant confirmation
- **Confirmed**: Order accepted by merchant
- **Preparing**: Items being prepared
- **Shipping**: Out for delivery
- **Delivered**: Successfully delivered
- **Cancelled**: Order cancelled (by customer or merchant)
- **Returned**: Product returned by customer

---

## 7. Payment Integration

### 7.1 Payment Methods
- **Cash on Delivery (COD)**
- **Bank Transfer** with payment proof upload
- **VNPay** integration
- **Momo Wallet** integration
- **ZaloPay** integration
- **Credit/Debit Card** processing
- **PCI DSS compliance** for card data

### 7.2 Payment Processing
- Secure payment gateway integration
- Payment callback handling
- Payment verification
- Payment status tracking (Pending, Paid, Failed)
- **Refund processing**
- Transaction logging
- Payment failure retry
- Payment method selection persistence

---

## 8. Reviews & Ratings

### 8.1 Product Reviews (Customer)
- Rate products (1-5 stars)
- Write detailed reviews
- Upload review photos
- Submit review after order delivery
- Edit/delete own reviews
- View other customer reviews
- Sort reviews (most recent, highest rated, lowest rated)
- Helpful/Not helpful voting

### 8.2 Store Reviews (Customer)
- Overall store rating (1-5 stars)
- Rate by criteria:
  - Product quality
  - Service quality
  - Delivery speed
  - Packaging
- Written feedback
- Review submission after completed order

### 8.3 Review Management (Merchant)
- View all reviews for store/products
- **Respond to customer reviews**
- Track average rating
- Review analytics
- Report inappropriate reviews

### 8.4 Review Moderation (Admin)
- Review reported content
- Remove inappropriate reviews
- Ban malicious reviewers
- Set review guidelines

---

## 9. Promotions & Discounts

### 9.1 Promotion Types (Merchant)
- Percentage discount (e.g., 20% off)
- Fixed amount discount (e.g., $10 off)
- Buy X Get Y free
- Free shipping offers
- Combo deals
- Flash sales

### 9.2 Coupon/Voucher Management
- Generate unique coupon codes
- Set discount type and value
- Configure conditions:
  - Minimum order value
  - Maximum usage limit (per code)
  - Maximum usage per customer
  - Valid date range (start/end)
  - Applicable products/categories
  - Target customer segments
- Activate/deactivate coupons
- Track coupon usage statistics
- Export coupon usage reports

### 9.3 Customer Experience
- Apply coupon code at checkout
- View applied discount in order summary
- See available promotions on product pages
- Promotion badges on products
- Promo code validation and error messages

---

## 10. Reports & Analytics (Merchant)

### 10.1 Dashboard Overview
- **Real-time KPI cards**:
  - Today's revenue
  - Pending orders count
  - Low stock alerts
  - New reviews
- **Revenue charts** (line/bar charts)
- **Product distribution** (pie chart)
- **Order status** breakdown
- Quick access to recent orders

### 10.2 Revenue Reports
- Total revenue by period (daily, weekly, monthly, quarterly, yearly, custom range)
- Revenue by product
- Revenue by category
- **Period comparison** (e.g., this month vs last month)
- Revenue trends visualization
- Export to Excel/PDF

### 10.3 Order Reports
- Total orders count
- Orders by status
- Successful vs failed orders
- **Average Order Value (AOV)**
- Order completion rate
- Cancellation rate
- Export to Excel/PDF

### 10.4 Product Reports
- **Top-selling products** (by quantity/revenue)
- **Slow-moving products**
- **Out-of-stock products**
- Current inventory levels
- Product performance comparison
- Stock turnover rate
- Export to Excel/PDF

### 10.5 Customer Reports
- New customers count
- Returning customers
- **Customer Lifetime Value (CLV)**
- Customer segmentation
- Customer acquisition trends
- Export to Excel/PDF

### 10.6 Invoice Generation
- **Single order invoice** (PDF)
- **Summary invoice** for date range (PDF)
- Invoice customization (logo, terms)
- QR code for invoice verification
- Email invoice to customer
- Batch invoice generation

---

## 11. Notifications

### 11.1 Customer Notifications
- **Push notifications** (PWA)
- **Email notifications**
- **SMS notifications** (optional)
- **In-app notifications**

**Notification types**:
- Order confirmation
- Order status updates (confirmed, shipping, delivered)
- Promotional offers
- Abandoned cart reminders
- Wishlist item back in stock
- New store nearby
- Review reminders

### 11.2 Merchant Notifications
- New order alerts (real-time)
- Order cancellation alerts
- Low stock warnings
- Out-of-stock alerts
- New customer review
- Daily/weekly revenue summary
- Payment received confirmation

### 11.3 Admin Notifications
- New merchant registration
- New store creation (requires approval)
- New base product submission
- System errors/alerts
- Performance degradation warnings

### 11.4 Notification Management
- Notification preferences configuration
- Enable/disable by type
- Choose delivery channels (push/email/SMS)
- Quiet hours settings
- Mark as read/unread
- Notification history

---

## 12. Admin Panel

### 12.1 User Management
- View all users (customers, merchants, admins)
- User search and filtering
- User details view
- Activate/deactivate accounts
- Reset user passwords
- Delete accounts
- View user activity logs
- Role assignment

### 12.2 Store Management
- View all stores system-wide
- Store approval workflow
- Suspend/ban stores
- View store performance
- Store analytics (orders, revenue)

### 12.3 Product Management
- Review submitted base products
- Approve/reject base products
- Edit base product details
- Delete inappropriate products
- Category management (CRUD)

### 12.4 Order Management
- View all system orders
- Filter by store, status, date
- Order dispute resolution
- Force refund processing
- Order analytics

### 12.5 Content Moderation
- Review reported products
- Review reported reviews
- Review reported users
- Remove inappropriate content
- Ban malicious actors
- Content policy enforcement

### 12.6 System Configuration
- Payment gateway settings (API keys)
- Email service configuration (SendGrid, AWS SES)
- SMS service configuration (Twilio)
- Google Maps API key management
- Commission/fee settings
- Shipping fee rules
- System announcements
- Maintenance mode

### 12.7 System Analytics
- **Gross Merchandise Value (GMV)**
- Total orders system-wide
- Active stores count
- Active merchants count
- Active customers count
- Revenue by store
- Top-performing stores
- System health metrics
- Export BI data

---

## 13. PWA Features

### 13.1 Progressive Web App Capabilities
- **Install to home screen** (iOS, Android, Desktop)
- **Offline mode** with cached content
- **Service Worker** for background sync
- **App shell** for fast loading
- **Splash screen**
- **App manifest** configuration

### 13.2 Push Notifications
- Browser push notifications
- Notification permission request
- Action buttons in notifications
- Badge updates
- Silent notifications for data sync

### 13.3 Offline Functionality
- **IndexedDB** for local data storage
- Cache API for assets
- Offline page display
- Queue actions for online sync
- Conflict resolution
- Background sync when online

### 13.4 Performance Optimization
- **Lazy loading** images
- Code splitting
- Route-based chunking
- Prefetching strategies
- Asset compression (Brotli/Gzip)
- **CDN delivery**

---

## 14. Responsive Design

### 14.1 Mobile-First Design
- Touch-optimized UI
- Thumb-friendly navigation
- Bottom navigation bar
- Swipe gestures (cart, drawer)
- Mobile-optimized forms
- Large tap targets (44x44px minimum)

### 14.2 Breakpoints
- **Mobile**: 320px - 767px (1 column layouts)
- **Tablet**: 768px - 1023px (2 column layouts)
- **Desktop**: 1024px - 1439px (3-4 column layouts)
- **Large Desktop**: 1440px+ (enhanced layouts)

### 14.3 Adaptive Layouts
- Fluid typography
- Flexible grid systems
- Responsive images (srcset)
- Adaptive navigation (hamburger → sidebar)
- Context-aware UI (hide/show features)

---

## 15. Search & Discovery

### 15.1 Search Features
- **Full-text search** (Elasticsearch/PostgreSQL)
- Search across: products, stores, categories
- **Autocomplete suggestions**
- Search history (recent searches)
- **Trending searches**
- Voice search (optional, Web Speech API)
- Image search (optional, future)

### 15.2 Search Filters
- Category/sub-category
- Price range (min/max)
- Distance/location radius
- Store
- Rating (minimum stars)
- Availability (in stock)
- Brand (if applicable)
- Attributes (color, size, etc.)

### 15.3 Search Results
- Relevant results ranking
- Pagination or infinite scroll
- Grid/list view toggle
- Quick view modal
- Add to cart from results
- Faceted search (filter counts)

---

## 16. Security Features

### 16.1 Authentication Security
- JWT with short expiration (access token)
- Refresh token rotation
- Password strength enforcement
- Account lockout after failed attempts
- Two-factor authentication (optional, future)
- Session management
- Logout from all devices

### 16.2 Data Security
- **HTTPS/TLS** encryption (all traffic)
- Password hashing (bcrypt/argon2)
- Sensitive data encryption at rest
- PCI DSS compliance (payment data)
- GDPR compliance (EU users)
- Data anonymization for analytics

### 16.3 Application Security
- **Rate limiting** on API endpoints
- CORS configuration
- **XSS protection** (Content Security Policy)
- **CSRF protection** (tokens)
- **SQL injection prevention** (parameterized queries)
- Input validation and sanitization
- File upload restrictions (type, size)
- Secure headers (Helmet.js)

### 16.4 Access Control
- **Role-Based Access Control (RBAC)**
- Permission-based feature access
- API endpoint authorization
- Resource ownership validation
- Admin-only routes protection

---

## 17. Internationalization (i18n)

### 17.1 Multi-Language Support
- **Vietnamese** (default)
- **English**
- Language switcher UI
- Translation management
- RTL support (future, Arabic)

### 17.2 Localization
- Date/time formatting
- Currency formatting (VND, USD)
- Number formatting
- Address formats
- Phone number formats

---

## 18. Accessibility (a11y)

### 18.1 WCAG 2.1 Level AA Compliance
- Semantic HTML
- Proper heading hierarchy
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Skip to content links

### 18.2 Assistive Technology Support
- Screen reader compatibility
- High contrast mode
- Text resizing support
- Alt text for images
- Descriptive link text
- Form field labels

---

## 19. Performance Features

### 19.1 Frontend Performance
- **Vite** for fast builds
- **Code splitting** (route-based)
- **Lazy loading** components
- Image optimization (WebP, AVIF)
- Tree shaking (eliminate unused code)
- **React.memo** for expensive components
- **Virtual scrolling** for long lists
- Debouncing/throttling for events

### 19.2 Backend Performance
- **Database indexing** (coordinates, foreign keys)
- **Query optimization** (N+1 prevention)
- **Redis caching** (sessions, frequent queries)
- API response pagination
- Connection pooling (PostgreSQL)
- Gzip/Brotli compression
- **CDN** for static assets

### 19.3 Monitoring
- **Real-time performance metrics**
- API response time tracking
- Error rate monitoring
- Uptime monitoring (99.9% target)
- Resource usage alerts
- Performance budgets

---

## 20. File Management

### 20.1 Image Upload
- Product images (multiple per product)
- Store logos and covers
- User avatars
- Review photos
- Category images
- Banner images

### 20.2 Image Processing
- **Automatic resizing** (Sharp library)
- Thumbnail generation
- Format conversion (WebP)
- Quality optimization
- Image compression
- EXIF data removal

### 20.3 Storage
- **AWS S3** or compatible object storage
- **CDN delivery** (CloudFlare)
- Signed URLs for private content
- Automatic cleanup of unused files
- Backup strategy

### 20.4 File Validation
- File type restrictions (JPEG, PNG, WebP, PDF)
- File size limits (5MB images, 10MB documents)
- Malware scanning
- Dimension validation (min/max)

---

## 21. Email System

### 21.1 Transactional Emails
- Welcome email
- Email verification
- Password reset
- Order confirmation
- Order status updates
- Shipping notifications
- Delivery confirmation
- Invoice/receipt

### 21.2 Marketing Emails (future)
- Promotional campaigns
- Abandoned cart recovery
- Product recommendations
- Weekly newsletters
- Seasonal offers

### 21.3 Email Configuration
- **SendGrid** or **AWS SES** integration
- Email templates (HTML + plain text)
- Template variables
- Unsubscribe management
- Bounce/complaint handling
- Email analytics (open rate, click rate)

---

## 22. Developer Features

### 22.1 API Documentation
- **Swagger/OpenAPI** documentation
- Interactive API explorer
- Request/response examples
- Authentication guide
- Error codes reference
- Rate limit documentation

### 22.2 Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Husky** for git hooks
- **Jest** for unit testing
- **Supertest** for API testing
- **React Testing Library** for component tests
- **Playwright** for E2E testing

### 22.3 DevOps
- **Docker** containerization
- **Docker Compose** for local dev
- **GitHub Actions** CI/CD
- Automated testing pipeline
- Automated deployments
- Database migrations (Prisma)
- Environment management
- Secrets management

---

## 23. Advanced Features (Future Roadmap)

### 23.1 Mobile Apps
- React Native iOS app
- React Native Android app
- Shared codebase with web
- Native push notifications
- Deep linking
- App store optimization

### 23.2 AI & Machine Learning
- Personalized product recommendations
- Smart search (NLP)
- Demand forecasting
- Inventory optimization
- Fraud detection
- Chatbot support

### 23.3 Advanced Logistics
- Real-time GPS order tracking
- Multi-stop route optimization
- Delivery partner integration (Grab, Gojek)
- Delivery slots selection
- Estimated delivery time
- Proof of delivery (photo, signature)

### 23.4 Social & Community
- Social media integration (share products)
- User-generated content campaigns
- Referral program
- Loyalty points system
- Wishlist/favorites
- Follow stores
- Product Q&A

### 23.5 B2B Features
- Wholesale pricing
- Bulk ordering
- Credit terms
- Purchase orders
- Invoice customization
- Multi-user business accounts

---

## Feature Priority Matrix

### Phase 1 (MVP - Weeks 1-10)
✅ **Critical Features**:
- Authentication & User Management
- Store Management (with Google Maps)
- Product Management (Base Items + Store Items)
- Location-based Store Search
- Shopping Cart
- Order Management (basic)
- Payment Integration (COD + 1 gateway)
- Responsive PWA

### Phase 2 (Weeks 11-15)
🔵 **High Priority**:
- Reviews & Ratings
- Reports & Analytics (Merchant)
- Promotions & Coupons
- Admin Panel
- Notifications (Push + Email)
- Invoice Generation

### Phase 3 (Weeks 16+)
🟡 **Medium Priority**:
- Advanced Search & Filters
- Inventory Forecasting
- Marketing Emails
- Multiple Payment Gateways
- SMS Notifications

### Phase 4 (Future)
⚪ **Low Priority / Future**:
- Mobile Native Apps
- AI Recommendations
- Real-time GPS Tracking
- Loyalty Programs
- Social Features
- B2B Features

---

## Summary Statistics

- **Total Feature Categories**: 23
- **Core Modules**: 12
- **Advanced Features**: 11
- **Total Feature Items**: 300+

---

**Document Version**: 1.0  
**Last Updated**: January 28, 2026  
**Status**: Complete

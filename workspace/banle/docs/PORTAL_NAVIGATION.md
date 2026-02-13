# Portal Navigation & Routing Matrix

This document enumerates every navigation entry exposed in `NavDrawer.tsx`, maps it to the actual React Router paths defined in `src/App.tsx`, and highlights gaps per user role. Use it when adding new pages, wiring routes, or auditing permissions.

_Last reviewed: 12 Feb 2026_

---

## Global Context
- **Navigation source**: `portal/src/components/Layout/NavDrawer.tsx`
- **Router source**: `portal/src/App.tsx`
- **Role detection**: `useAuth()` supplies `user.role`; `PrivateRoute` enforces role-based access.
- **Default redirect logic**: unauthenticated users → `/`; admins → `/admin/dashboard`; merchants → `/merchant/dashboard`; customers → `/shop`.

Shared protected routes (all authenticated roles): `/profile`, `/settings`, `/notifications` → currently render the generic `Dashboard` placeholder.

---

## Admin Experience

| Menu Group | Label | Declared Route | Router Support | Component wired in `App.tsx` |
|------------|-------|----------------|----------------|-----------------------------|
| Dashboard | Dashboard | `/admin/dashboard` | ✅ | `Dashboard` |
| Merchants | All Merchants | `/admin/merchants` | ❌ | _not registered_ |
| Merchants | Pending Approval | `/admin/merchants/pending` | ❌ | _not registered_ |
| Stores | All Stores | `/admin/stores` | ❌ | _not registered_ |
| Stores | By Merchant | `/admin/stores/by-merchant` | ❌ | _not registered_ |
| Products | Base Products | `/admin/products/base` | ✅ | `BaseProductListPage` |
| Products | Store Products | `/admin/products/store` | ❌ | _not registered_ |
| Products | Categories | `/admin/categories` | ✅ | `Categories` |
| Orders | All Orders | `/admin/orders` | ❌ | _not registered_ |
| Orders | By Store | `/admin/orders/by-store` | ❌ | _not registered_ |
| Orders | By Status | `/admin/orders/by-status` | ❌ | _not registered_ |
| Users | Customers | `/admin/users/customers` | ❌ | _not registered_ |
| Users | Merchants | `/admin/users/merchants` | ❌ | _not registered_ |
| Users | Admins | `/admin/users/admins` | ❌ | _not registered_ |
| Analytics | System Revenue | `/admin/analytics/revenue` | ❌ | _not registered_ |
| Analytics | User Statistics | `/admin/analytics/users` | ❌ | _not registered_ |
| Analytics | Order Analytics | `/admin/analytics/orders` | ❌ | _not registered_ |
| Analytics | Top Stores | `/admin/analytics/top-stores` | ❌ | _not registered_ |
| Analytics | Top Products | `/admin/analytics/top-products` | ❌ | _not registered_ |
| Settings | System Config | `/admin/settings/config` | ❌ | _not registered_ |
| Settings | Email Templates | `/admin/settings/email` | ❌ | _not registered_ |
| Settings | Payment Gateway | `/admin/settings/payment` | ❌ | _not registered_ |

_Additional admin routes in router:_
- `/admin/products/base/create` → `BaseProductFormPage`
- `/admin/products/base/:id` → `BaseProductDetailPage`
- `/admin/products/base/:id/edit` → `BaseProductFormPage`

These routes do not have corresponding drawer entries yet.

---

## Merchant Experience

| Menu Group | Label | Declared Route | Router Support | Component |
|------------|-------|----------------|----------------|-----------|
| Dashboard | Dashboard | `/merchant/dashboard` | ✅ | `Dashboard` |
| Stores | My Stores | `/merchant/stores` | ✅ | `Stores` |
| Products | All Products | `/products` | ✅ | `Products` (merchant-only via `PrivateRoute`) |
| Products | Add Product | `/products/add` | ❌ | _not registered_ |
| Products | Clone from Base | `/products/clone` | ❌ | _not registered_ |
| Products | Manage Inventory | `/products/inventory` | ❌ | _not registered_ |
| Orders | All Orders | `/orders` | ✅ | `Orders` |
| Orders | Create Order (Guest) | `/orders/create` | ✅ | `CreateOrderPage` |
| Orders | Pending Orders | `/orders/pending` | ❌ | _not registered_ |
| Reports | Revenue Report | `/reports/revenue` | ❌ | _not registered_ |
| Reports | Product Report | `/reports/products` | ❌ | _not registered_ |
| Reports | Order Statistics | `/reports/orders` | ❌ | _not registered_ |
| Reports | Export Invoice | `/reports/export` | ❌ | _not registered_ |
| Shop as Customer | Shop as Customer | `/shop` | ⚠️ | Route exists but locked to `roles=['customer']`; merchants will hit authorization guard |

_Note_: the drawer currently surfaces `/shop` to merchants, but the router restricts that path to customers only. Decide whether to relax the guard or hide the entry for merchants.

---

## Customer Experience

| Menu Label | Route | Router Support | Component |
|------------|-------|----------------|-----------|
| Shop | `/shop` | ✅ | `ShopPage` |
| Search Products | `/shop/search` | ❌ | _not registered_ |
| Find Stores | `/shop/stores` | ❌ | _not registered_ |
| My Cart | `/shop/cart` | ❌ | _not registered_ |
| My Orders | `/shop/orders` | ❌ | _not registered_ |
| Favorites | `/shop/favorites` | ❌ | _not registered_ |

_Public pages accessible without authentication_: `/`, `/login`, `/track`, `/track/:orderNumber`.

---

## Action Items & Recommendations
1. **Align Drawer + Router**: For each ❌ entry, either implement the missing route/component or remove/hide the navigation option to avoid dead links.
2. **Consider role-driven filtering**: e.g., hide "Shop as Customer" from merchants until they can legally access `/shop`.
3. **Document new routes**: Whenever a new page is built, update both `NavDrawer.tsx`, `App.tsx`, and this document to keep the matrix trustworthy.
4. **Add per-route descriptions**: Future iterations may benefit from columns for feature owners or API dependencies.

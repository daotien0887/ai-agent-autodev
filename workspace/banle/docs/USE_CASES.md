# Use Cases - BanLe Multi-Store E-commerce System

## Overview
This document outlines all use cases for the BanLe system, organized by actor/role.

---

## 1. Customer Use Cases

### 1.1 Authentication & Account Management
- **UC-C-001**: Register new customer account (email/phone)
- **UC-C-002**: Login with email/password
- **UC-C-003**: Login with Google OAuth
- **UC-C-004**: Login with Facebook OAuth
- **UC-C-005**: Request password reset
- **UC-C-006**: Reset password via email link
- **UC-C-007**: Verify email with OTP
- **UC-C-008**: Update profile information
- **UC-C-009**: Change password
- **UC-C-010**: Logout from account

### 1.2 Store Discovery & Location
- **UC-C-011**: Allow current location access (Geolocation API)
- **UC-C-012**: Search stores near current location
- **UC-C-013**: Search stores by address input
- **UC-C-014**: Filter stores by radius (1km, 3km, 5km, 10km, 20km)
- **UC-C-015**: Filter stores by category/type (Grocery, Electronics, Fashion, Food & Beverage, etc.)
- **UC-C-016**: Browse stores by specific category
- **UC-C-017**: Filter stores that are currently open
- **UC-C-018**: View stores on Google Maps
- **UC-C-018**: View store details (info, location, hours, rating)
- **UC-C-019**: Access store via direct URL (host/store_name)
- **UC-C-020**: Share store URL with others
- **UC-C-021**: Get directions to store
- **UC-C-022**: Sort stores by distance

### 1.3 Product Search & Discovery
- **UC-C-023**: Search products by name (full-text search)
- **UC-C-024**: Search products by location (nearby stores)
- **UC-C-025**: Browse products by category
- **UC-C-026**: Browse products by sub-category
- **UC-C-027**: Filter products by price range
- **UC-C-028**: Filter products by store
- **UC-C-029**: Filter products by rating
- **UC-C-030**: Filter products by distance
- **UC-C-031**: Filter products by availability (in stock)
- **UC-C-032**: Sort products by price (low to high, high to low)
- **UC-C-033**: Sort products by distance (nearest first)
- **UC-C-034**: Sort products by rating
- **UC-C-035**: View product details
- **UC-C-036**: View product images
- **UC-C-037**: View product reviews
- **UC-C-038**: Use autocomplete search suggestions
- **UC-C-039**: View search history
- **UC-C-040**: View trending searches

### 1.4 Shopping Cart
- **UC-C-041**: Add product to cart
- **UC-C-042**: Update product quantity in cart
- **UC-C-043**: Remove product from cart
- **UC-C-044**: View cart summary
- **UC-C-045**: View total price calculation
- **UC-C-046**: Clear entire cart
- **UC-C-047**: Handle cart store conflict (different store warning)
- **UC-C-048**: Validate stock availability before checkout

### 1.5 Order Management
- **UC-C-049**: Review cart items before checkout
- **UC-C-050**: Enter shipping information (name, phone, address)
- **UC-C-051**: Add order notes
- **UC-C-052**: Select payment method (COD/Bank Transfer/E-wallet/Credit Card)
- **UC-C-053**: Apply promotion/coupon code
- **UC-C-054**: View order summary (subtotal, shipping, discount, total)
- **UC-C-055**: Confirm and place order
- **UC-C-056**: Receive order confirmation (order number)
- **UC-C-057**: View order list (my orders)
- **UC-C-058**: View order details
- **UC-C-059**: Track order status
- **UC-C-060**: Cancel pending order
- **UC-C-061**: Request order return
- **UC-C-062**: Receive order status notifications (push/email/SMS)

### 1.6 Reviews & Ratings
- **UC-C-063**: Rate product (1-5 stars)
- **UC-C-064**: Write product review
- **UC-C-065**: Upload review images
- **UC-C-066**: Rate store overall (1-5 stars)
- **UC-C-067**: Rate product quality
- **UC-C-068**: Rate service quality
- **UC-C-069**: Rate delivery speed
- **UC-C-070**: Rate packaging quality
- **UC-C-071**: View product reviews from other customers
- **UC-C-072**: View store reviews
- **UC-C-073**: View merchant responses to reviews

### 1.7 Notifications
- **UC-C-074**: Receive order confirmation notification
- **UC-C-075**: Receive order shipping notification
- **UC-C-076**: Receive order delivered notification
- **UC-C-077**: Receive promotion notifications
- **UC-C-078**: Receive back-in-stock notifications (wishlist items)
- **UC-C-079**: Manage notification preferences

### 1.8 PWA Features
- **UC-C-080**: Install app to home screen
- **UC-C-081**: Browse offline (cached content)
- **UC-C-082**: Receive push notifications
- **UC-C-083**: View app in mobile-optimized layout
- **UC-C-084**: View app in tablet layout
- **UC-C-085**: View app in desktop layout

---

## 2. Merchant Use Cases

### 2.1 Authentication & Account Management
- **UC-M-001**: Register new merchant account
- **UC-M-002**: Login to merchant portal
- **UC-M-003**: Logout from portal
- **UC-M-004**: Update merchant profile
- **UC-M-005**: Change password
- **UC-M-006**: Reset forgotten password

### 2.2 Store Management
- **UC-M-007**: Create new store
- **UC-M-008**: Choose unique store name identifier (for URL: host/store_name)
- **UC-M-009**: Set store display name
- **UC-M-010**: Select store categories/tags (multi-select for filtering)
- **UC-M-011**: Select store location on Google Maps
- **UC-M-012**: Set store address and coordinates (lat/lng)
- **UC-M-013**: Upload store logo/images
- **UC-M-014**: Set store description
- **UC-M-015**: Set store contact info (phone, email)
- **UC-M-016**: Configure store opening hours
- **UC-M-017**: Edit store information
- **UC-M-018**: Update store categories
- **UC-M-019**: Get shareable store URL
- **UC-M-020**: Share store link via social media/messaging
- **UC-M-021**: Activate store
- **UC-M-022**: Deactivate store
- **UC-M-023**: Delete store (soft delete)
- **UC-M-024**: View store list (owned stores)
- **UC-M-025**: View store details
- **UC-M-026**: View store on map

### 2.3 Category & Base Product Management
- **UC-M-027**: Browse base product catalog
- **UC-M-028**: Search base products
- **UC-M-029**: Filter base products by category
- **UC-M-030**: Create new base product (if not exists)
- **UC-M-031**: Upload base product images
- **UC-M-032**: Set base product attributes
- **UC-M-033**: Submit base product for approval

### 2.4 Store Product Management
- **UC-M-034**: Clone base product to store
- **UC-M-035**: Customize cloned product name
- **UC-M-036**: Customize cloned product description
- **UC-M-037**: Set product price for store
- **UC-M-038**: Set product sale price
- **UC-M-039**: Set stock quantity
- **UC-M-040**: Upload store-specific product images
- **UC-M-041**: Update product information
- **UC-M-042**: Update product price
- **UC-M-043**: Update product stock
- **UC-M-044**: Set product status (available/out of stock/discontinued)
- **UC-M-045**: Show/hide product from catalog
- **UC-M-046**: Delete product from store
- **UC-M-047**: Bulk import products from CSV/Excel
- **UC-M-048**: Sync product info from base product
- **UC-M-049**: Manage product variants (if applicable)

### 2.5 Order Management
- **UC-M-050**: View order list (store orders)
- **UC-M-051**: Filter orders by status
- **UC-M-052**: Filter orders by date range
- **UC-M-053**: Filter orders by customer name
- **UC-M-054**: Filter orders by order number
- **UC-M-055**: Search orders
- **UC-M-056**: View order details
- **UC-M-057**: Confirm pending order
- **UC-M-058**: Update order status to "Preparing"
- **UC-M-059**: Update order status to "Shipping"
- **UC-M-060**: Update order status to "Delivered"
- **UC-M-061**: Cancel order with reason
- **UC-M-062**: Process return/refund
- **UC-M-063**: Print order invoice
- **UC-M-064**: Print delivery slip
- **UC-M-065**: Respond to customer reviews

### 2.6 Reports & Analytics
- **UC-M-066**: View dashboard overview
- **UC-M-067**: View revenue statistics (daily/weekly/monthly/quarterly/yearly)
- **UC-M-068**: View revenue by product
- **UC-M-069**: View revenue by category
- **UC-M-068**: Compare revenue across periods
- **UC-M-069**: View order statistics
- **UC-M-070**: View order success/failure rate
- **UC-M-071**: View average order value (AOV)
- **UC-M-072**: View order completion rate
- **UC-M-073**: View top-selling products
- **UC-M-074**: View slow-moving products
- **UC-M-075**: View out-of-stock products
- **UC-M-076**: View current inventory levels
- **UC-M-077**: View new customer count
- **UC-M-078**: View returning customer count
- **UC-M-079**: View customer lifetime value (CLV)
- **UC-M-080**: Generate revenue report (PDF/Excel)
- **UC-M-081**: Generate order report (PDF/Excel)
- **UC-M-082**: Generate product report (PDF/Excel)
- **UC-M-083**: Export invoice for single order
- **UC-M-084**: Export summary invoice for period
- **UC-M-085**: View revenue charts (line/bar)
- **UC-M-086**: View product distribution charts (pie)
- **UC-M-087**: View real-time KPIs

### 2.7 Promotions & Discounts
- **UC-M-088**: Create promotion campaign
- **UC-M-089**: Generate coupon/voucher code
- **UC-M-090**: Set discount type (percentage/fixed)
- **UC-M-091**: Set discount value
- **UC-M-092**: Set minimum order value requirement
- **UC-M-093**: Set usage limit per coupon
- **UC-M-094**: Set validity period (start/end date)
- **UC-M-095**: Select applicable products/categories
- **UC-M-096**: Select eligible customers
- **UC-M-097**: Activate/deactivate promotion
- **UC-M-098**: View promotion usage statistics
- **UC-M-099**: Edit promotion details
- **UC-M-100**: Delete promotion

### 2.8 Notifications
- **UC-M-101**: Receive new order notification
- **UC-M-102**: Receive order cancellation notification
- **UC-M-103**: Receive low stock alert
- **UC-M-104**: Receive new review notification
- **UC-M-105**: Receive periodic revenue report notification
- **UC-M-106**: Configure notification preferences

### 2.9 PWA Features
- **UC-M-107**: Install portal to home screen
- **UC-M-108**: Access portal offline (cached data)
- **UC-M-109**: Receive push notifications
- **UC-M-106**: View portal in mobile layout
- **UC-M-107**: View portal in tablet layout
- **UC-M-108**: View portal in desktop layout (enhanced features)

---

## 3. Admin Use Cases

### 3.1 Authentication & Authorization
- **UC-A-001**: Login to admin panel
- **UC-A-002**: Logout from admin panel
- **UC-A-003**: Manage admin roles
- **UC-A-004**: Assign permissions

### 3.2 User Management
- **UC-A-005**: View all users (customers/merchants)
- **UC-A-006**: Filter users by role
- **UC-A-007**: Search users by email/name
- **UC-A-008**: View user details
- **UC-A-009**: Activate/deactivate user account
- **UC-A-010**: Delete user account
- **UC-A-011**: Reset user password
- **UC-A-012**: View user activity logs

### 3.3 Store Management
- **UC-A-013**: View all stores
- **UC-A-014**: Filter stores by status
- **UC-A-015**: Search stores
- **UC-A-016**: View store details
- **UC-A-017**: Approve/reject new stores
- **UC-A-018**: Suspend store
- **UC-A-019**: Delete store

### 3.4 Category & Base Product Management
- **UC-A-020**: Create category
- **UC-A-021**: Edit category
- **UC-A-022**: Delete category
- **UC-A-023**: Set category hierarchy (parent/child)
- **UC-A-024**: Reorder categories (display order)
- **UC-A-025**: Create sub-category
- **UC-A-026**: Review submitted base products
- **UC-A-027**: Approve base product
- **UC-A-028**: Reject base product
- **UC-A-029**: Edit base product
- **UC-A-030**: Delete base product

### 3.5 Order Management
- **UC-A-031**: View all orders (system-wide)
- **UC-A-032**: Filter orders by store
- **UC-A-033**: Filter orders by status
- **UC-A-034**: Search orders
- **UC-A-035**: View order details
- **UC-A-036**: Resolve order disputes
- **UC-A-037**: Process refunds

### 3.6 System Configuration
- **UC-A-038**: Configure payment gateway settings
- **UC-A-039**: Configure email service settings
- **UC-A-040**: Configure SMS service settings
- **UC-A-041**: Configure Google Maps API key
- **UC-A-042**: Set system-wide fee/commission
- **UC-A-043**: Configure shipping fee rules
- **UC-A-044**: Manage system announcements

### 3.7 Reports & Analytics
- **UC-A-045**: View system-wide dashboard
- **UC-A-046**: View total GMV (Gross Merchandise Value)
- **UC-A-047**: View total number of orders
- **UC-A-048**: View active stores count
- **UC-A-049**: View registered merchants count
- **UC-A-050**: View registered customers count
- **UC-A-051**: View revenue by store
- **UC-A-052**: View top-performing stores
- **UC-A-053**: View system-wide product statistics
- **UC-A-054**: Generate system reports
- **UC-A-055**: Export data for BI analysis

### 3.8 Content Moderation
- **UC-A-056**: Review reported products
- **UC-A-057**: Review reported reviews
- **UC-A-058**: Remove inappropriate content
- **UC-A-059**: Ban malicious users
- **UC-A-060**: Manage content policies

---

## 4. System Use Cases

### 4.1 Geospatial Features
- **UC-S-001**: Calculate distance between two coordinates (Haversine formula)
- **UC-S-002**: Find stores within radius
- **UC-S-003**: Index store coordinates for fast queries
- **UC-S-004**: Update store location on map
- **UC-S-005**: Geocode address to coordinates
- **UC-S-006**: Reverse geocode coordinates to address

### 4.2 Search & Indexing
- **UC-S-007**: Index products for full-text search
- **UC-S-008**: Update search index on product changes
- **UC-S-009**: Provide autocomplete suggestions
- **UC-S-010**: Track search queries
- **UC-S-011**: Generate trending searches
- **UC-S-012**: Cache search results

### 4.3 Notification System
- **UC-S-013**: Send push notifications (PWA)
- **UC-S-014**: Send email notifications
- **UC-S-015**: Send SMS notifications
- **UC-S-016**: Queue notifications for batch processing
- **UC-S-017**: Track notification delivery status
- **UC-S-018**: Retry failed notifications

### 4.4 Payment Processing
- **UC-S-019**: Process VNPay payment
- **UC-S-020**: Process Momo payment
- **UC-S-021**: Process ZaloPay payment
- **UC-S-022**: Process credit card payment
- **UC-S-023**: Verify payment callback
- **UC-S-024**: Update order payment status
- **UC-S-025**: Process refund
- **UC-S-026**: Log payment transactions

### 4.5 File Management
- **UC-S-027**: Upload image to S3/storage
- **UC-S-028**: Resize/optimize image
- **UC-S-029**: Generate thumbnails
- **UC-S-030**: Serve images via CDN
- **UC-S-031**: Delete unused files
- **UC-S-032**: Validate file types and sizes

### 4.6 Cache & Performance
- **UC-S-033**: Cache frequently accessed data (Redis)
- **UC-S-034**: Invalidate cache on data updates
- **UC-S-035**: Cache API responses
- **UC-S-036**: Cache search results
- **UC-S-037**: Implement rate limiting
- **UC-S-038**: Track API usage per user

### 4.7 Background Jobs
- **UC-S-039**: Send scheduled email reports
- **UC-S-040**: Process bulk product imports
- **UC-S-041**: Generate daily/weekly/monthly reports
- **UC-S-042**: Clean up expired sessions
- **UC-S-043**: Archive old orders
- **UC-S-044**: Update product search index
- **UC-S-045**: Send reminder notifications

### 4.8 Monitoring & Logging
- **UC-S-046**: Log API requests
- **UC-S-047**: Log errors and exceptions
- **UC-S-048**: Track performance metrics
- **UC-S-049**: Monitor system health
- **UC-S-050**: Alert on critical errors
- **UC-S-051**: Generate audit logs
- **UC-S-052**: Track user activities

---

## Summary Statistics

- **Customer Use Cases**: 83
- **Merchant Use Cases**: 108
- **Admin Use Cases**: 60
- **System Use Cases**: 52
- **Total Use Cases**: 303

---

**Document Version**: 1.0  
**Last Updated**: January 28, 2026  
**Status**: Complete

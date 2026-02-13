# Tài Liệu Yêu Cầu Hệ Thống (System Requirements Document)

## Tổng Quan Dự Án

### 1. Mục Đích
Xây dựng hệ thống bán hàng đa cửa hàng (Multi-store E-commerce System) cho phép merchant quản lý cửa hàng và khách hàng mua sắm trực tuyến với khả năng tìm kiếm theo vị trí địa lý.

### 2. Phạm Vi Hệ Thống
- **Backend API**: RESTful API server
- **Portal PWA**: Single Progressive Web App với role-based UI
  - Customer UI: Giao diện mua sắm cho khách hàng
  - Merchant UI: Giao diện quản lý cửa hàng
  - Admin UI: Giao diện quản trị hệ thống
  - Guest UI: Giao diện tra cứu đơn hàng không cần đăng nhập

---

## Kiến Trúc Hệ Thống

### 3. Các Thành Phần Chính

```
┌─────────────────────────────────────────┐
│         Portal PWA (React)              │
│  ┌───────────┬──────────┬──────────┐   │
│  │ Customer  │ Merchant │  Admin   │   │
│  │    UI     │    UI    │   UI     │   │
│  │  (Shop)   │ (Manage) │ (System) │   │
│  └───────────┴──────────┴──────────┘   │
│  ┌─────────────────────────────────┐   │
│  │      Guest UI (Track Order)     │   │
│  └─────────────────────────────────┘   │
│         Role-based Routing              │
└──────────────────┬──────────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │   Backend API   │
         │   (Node.js)     │
         └─────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
  ┌──────▼──────┐   ┌───────▼────────┐
  │  Database   │   │  File Storage  │
  │ (PostgreSQL)│   │   (AWS S3)     │
  └─────────────┘   └────────────────┘

**Single Portal App với Role-based UI:**
- Guest → /track (Tra cứu đơn hàng)
- Customer → /shop (Mua sắm)
- Merchant → /merchant (Quản lý cửa hàng)
- Admin → /admin (Quản trị hệ thống)
```

---

## Yêu Cầu Chức Năng (Functional Requirements)

### 4. Module Quản Lý Người Dùng (User Management)

#### 4.1 Phân Quyền
- **Guest Customer**: Khách vãng lai (không cần tài khoản)
  - Không cần đăng ký/đăng nhập
  - Merchant có thể tạo đơn hàng cho khách vãng lai để tracking bill
  - Chỉ cần thông tin cơ bản: tên, số điện thoại, địa chỉ
  - Không có lịch sử đơn hàng lưu trữ trong hệ thống
  - Có thể tra cứu đơn hàng bằng mã đơn hàng + số điện thoại
- **Customer**: Khách hàng mua sắm (đã đăng ký tài khoản)
  - Mặc định khi đăng ký tài khoản
  - Có thể đăng ký trở thành Merchant
  - Có thể mua hàng từ bất kỳ cửa hàng nào
  - Có lịch sử đơn hàng được lưu trữ
- **Merchant**: Chủ cửa hàng
  - Customer có thể đăng ký trở thành Merchant (upgrade tài khoản)
  - Quản lý cửa hàng của chính mình
  - Chỉ có quyền xem/sửa thông tin cửa hàng của mình
  - Vẫn giữ vai trò Customer để mua hàng từ cửa hàng khác
  - Một tài khoản có thể có cả 2 vai trò: MERCHANT và CUSTOMER đồng thời
- **Admin**: Quản trị viên hệ thống
  - Có quyền xem/sửa tất cả thông tin merchant và cửa hàng
  - Quản lý toàn bộ hệ thống
  - Phê duyệt merchant mới (nếu cần)

#### 4.2 Chức Năng Đăng Ký/Đăng Nhập
- **Đăng ký tài khoản**: 
  - Mặc định role là **CUSTOMER**
  - Đăng ký với email/số điện thoại + password
- **Đăng ký trở thành Merchant**:
  - Customer có thể nâng cấp tài khoản lên MERCHANT
  - Yêu cầu thông tin bổ sung (Tên shop, địa chỉ kinh doanh, giấy phép, etc.)
  - Admin có thể phê duyệt hoặc từ chối (tùy cấu hình hệ thống)
- **Đăng nhập với email/password**:
  - Sau khi đăng nhập thành công, hệ thống redirect theo role:
    - **ADMIN** → Redirect to Admin Dashboard (`/admin/dashboard`)
    - **MERCHANT** → Redirect to Merchant Portal (`/merchant/dashboard`)
    - **CUSTOMER** → Redirect to Customer Home (`/` hoặc `/home`)
- Đăng nhập bằng Google/Facebook (OAuth 2.0)
- Quên mật khẩu & reset password
- Xác thực OTP qua Email
- JWT token authentication

#### 4.3 Quyền Truy Cập (Access Control)
**Guest Customer:**
- Tra cứu đơn hàng bằng mã đơn hàng + số điện thoại
- Xem chi tiết đơn hàng của mình
- Không lưu trữ lịch sử đơn hàng trong hệ thống

**Customer (Registered):**
- Xem danh sách sản phẩm, cửa hàng
- Thêm vào giỏ hàng, đặt hàng
- Xem lịch sử đơn hàng của mình
- Đánh giá sản phẩm/cửa hàng đã mua

**Merchant:**
- Tất cả quyền của Customer (mua hàng từ cửa hàng khác)
- **Quản lý cửa hàng của mình**: tạo/sửa/xóa
- **Quản lý sản phẩm của cửa hàng mình**: thêm/sửa/xóa
- **Quản lý đơn hàng của cửa hàng mình**: xem, cập nhật trạng thái
- **Xem báo cáo doanh thu của cửa hàng mình**
- **KHÔNG có quyền** xem/sửa cửa hàng của merchant khác

**Admin:**
- **Xem/sửa tất cả thông tin merchant**
- **Xem/sửa tất cả cửa hàng** (của mọi merchant)
- Quản lý danh mục sản phẩm chung (Base Products)
- Quản lý người dùng (khóa/mở tài khoản)
- Xem báo cáo tổng hợp toàn hệ thống
- Phê duyệt/từ chối merchant mới

#### 4.4 Role-Based Navigation (NavDrawer)
**Mỗi role có navigation menu riêng tập trung vào tính năng chính:**

**Guest/Public Navigation:**
- 🏠 Home - Trang chủ
- 📦 Track Order - Tra cứu đơn hàng
- 🔐 Login - Đăng nhập
- ✍️ Register - Đăng ký

**Customer Navigation:**
- 🛍️ Shop - Cửa hàng (Home)
- 🔍 Search Products - Tìm kiếm sản phẩm
- 🏪 Find Stores - Tìm cửa hàng gần bạn
- 🛒 My Cart - Giỏ hàng
- 📦 My Orders - Đơn hàng của tôi
- ❤️ Favorites - Yêu thích
- 👤 Profile - Tài khoản
- ⚙️ Settings - Cài đặt
- 🚪 Logout - Đăng xuất

**Merchant Navigation:**
- 📊 Dashboard - Tổng quan
- 🏪 My Stores - Cửa hàng của tôi
- 📦 Products - Quản lý sản phẩm
  - Add Product - Thêm sản phẩm
  - Clone from Base Items - Sao chép từ kho chung
  - Manage Inventory - Quản lý tồn kho
- 🧾 Orders - Quản lý đơn hàng
  - All Orders - Tất cả đơn hàng
  - Create Order (Guest) - Tạo đơn cho khách vãng lai
  - Pending Orders - Đơn chờ xử lý
- 📈 Reports - Báo cáo
  - Revenue Report - Doanh thu
  - Product Report - Sản phẩm
  - Order Statistics - Thống kê đơn hàng
  - Export Invoice - Xuất hóa đơn
- 🛍️ Shop as Customer - Xem giao diện khách hàng
- 👤 Profile - Tài khoản
- ⚙️ Settings - Cài đặt
- 🚪 Logout - Đăng xuất

**Admin Navigation:**
- 📊 Dashboard - Tổng quan hệ thống
- 🏪 Merchants - Quản lý merchant
  - All Merchants - Tất cả merchant
  - Pending Approval - Chờ phê duyệt
  - Active/Inactive - Hoạt động/Vô hiệu
- 🏢 Stores - Quản lý cửa hàng
  - All Stores - Tất cả cửa hàng
  - By Merchant - Theo merchant
- 📦 Products - Quản lý sản phẩm
  - Base Products - Sản phẩm gốc
  - Store Products - Sản phẩm cửa hàng
  - Categories - Danh mục
- 🧾 Orders - Quản lý đơn hàng
  - All Orders - Tất cả đơn hàng
  - By Store - Theo cửa hàng
  - By Status - Theo trạng thái
- 👥 Users - Quản lý người dùng
  - Customers - Khách hàng
  - Merchants - Merchant
  - Admins - Quản trị viên
- 📈 Analytics - Phân tích
  - System Revenue - Doanh thu hệ thống
  - User Statistics - Thống kê người dùng
  - Order Analytics - Phân tích đơn hàng
  - Top Stores - Cửa hàng nổi bật
  - Top Products - Sản phẩm bán chạy
- ⚙️ Settings - Cài đặt hệ thống
  - System Config - Cấu hình
  - Email Templates - Mẫu email
  - Payment Gateway - Cổng thanh toán
- 🚪 Logout - Đăng xuất

**Navigation Features:**
- **Role-based menu**: Tự động hiển thị menu phù hợp với role
- **Active state**: Highlight menu item đang active
- **Badge notifications**: Hiển thị số đơn hàng mới, tin nhắn chưa đọc
- **Collapsible groups**: Group menu có thể thu gọn/mở rộng
- **Quick actions**: Shortcut cho các tác vụ thường dùng
- **Search in menu**: Tìm kiếm nhanh menu item (for Merchant/Admin)
- **Responsive**: Mobile (Bottom Nav), Tablet/Desktop (Drawer/Sidebar)

---

### 5. Module Quản Lý Cửa Hàng (Store Management)

#### 5.1 Tạo & Quản Lý Cửa Hàng
**Merchant có thể:**
- Tạo mới cửa hàng
- Chỉnh sửa thông tin cửa hàng
- Kích hoạt/vô hiệu hóa cửa hàng
- Xóa cửa hàng (soft delete)

**Thông tin cửa hàng bao gồm:**
- Tên cửa hàng
- Mô tả
- Logo/Ảnh đại diện
- Địa chỉ chi tiết
- **Vị trí trên Google Maps** (Latitude, Longitude)
- Số điện thoại
- Email
- Giờ mở cửa/đóng cửa
- Trạng thái hoạt động

#### 5.2 Tích Hợp Google Maps
- **Chọn vị trí cửa hàng**: Khi tạo cửa hàng, merchant phải chọn vị trí chính xác trên Google Maps
- Lưu trữ tọa độ (latitude, longitude) vào database
- Hiển thị bản đồ với marker vị trí cửa hàng
- Tính năng autocomplete địa chỉ (Google Places API)

---

### 6. Module Quản Lý Danh Mục & Sản Phẩm

#### 6.1 Cấu Trúc Phân Cấp
```
Base Items (Hệ thống)
├── Category
│   └── Sub-category
│       └── Base Product
│
Store Items (Cửa hàng)
├── Category (cloned)
│   └── Sub-category (cloned)
│       └── Store Product (cloned from Base Product)
```

#### 6.2 Base Items (Dữ Liệu Chung Toàn Hệ Thống)
**Quản lý bởi Admin/Hệ thống:**
- Tạo Category cơ bản
- Tạo Sub-category
- Tạo Base Product template

**Merchant có thể:**
- Tự tạo Base Item mới nếu chưa tồn tại
- Base Item tự động được thêm vào kho chung để các store khác clone

**Thuộc tính Base Product:**
- Tên sản phẩm
- Mô tả chung
- Danh mục (Category/Sub-category)
- Hình ảnh mẫu
- Đơn vị tính (kg, cái, lít, ...)
- Thuộc tính chung (màu sắc, kích thước, ...)

#### 6.3 Store Items (Sản Phẩm Cửa Hàng)
**Merchant clone từ Base Item:**
- Chọn Base Product để clone vào cửa hàng
- **Tùy chỉnh giá riêng cho từng cửa hàng**
- Cập nhật thông tin bổ sung:
  - Giá bán
  - Giá khuyến mãi
  - Số lượng tồn kho
  - Trạng thái (còn hàng/hết hàng/ngừng kinh doanh)
  - Hình ảnh thực tế của cửa hàng
  - Mô tả chi tiết

**Quản lý Store Product:**
- Thêm/sửa/xóa sản phẩm trong cửa hàng
- Cập nhật giá, tồn kho
- Quản lý biến thể (variants) nếu có
- Bật/tắt hiển thị sản phẩm

#### 6.4 Tính Năng Đặc Biệt
- **Auto-sync**: Khi Base Product có thay đổi (tên, mô tả, hình ảnh), merchant có thể chọn sync hoặc giữ nguyên
- **Search & Clone**: Tìm kiếm Base Product và clone nhanh vào cửa hàng
- **Bulk Import**: Import hàng loạt sản phẩm từ CSV/Excel

---

### 7. Module Giỏ Hàng (Shopping Cart)

#### 7.1 Chức Năng Customer
- Thêm sản phẩm vào giỏ hàng
- Cập nhật số lượng
- Xóa sản phẩm khỏi giỏ
- Xem tổng tiền tạm tính
- Lưu giỏ hàng (persistent cart)

#### 7.2 Quy Tắc Giỏ Hàng
- Một giỏ hàng chỉ chứa sản phẩm từ **một cửa hàng duy nhất**
- Nếu thêm sản phẩm từ cửa hàng khác, hiển thị cảnh báo và cho phép:
  - Xóa giỏ hiện tại
  - Giữ giỏ hiện tại
- Kiểm tra tồn kho trước khi checkout

---

### 8. Module Đặt Hàng (Order Management)

#### 8.1 Quy Trình Đặt Hàng

**A. Customer (Đặt hàng trực tuyến)**
1. **Xem lại giỏ hàng**
2. **Nhập thông tin giao hàng**
   - Họ tên người nhận
   - Số điện thoại
   - Địa chỉ giao hàng
   - Ghi chú đơn hàng
3. **Chọn phương thức thanh toán**
   - COD (Thanh toán khi nhận hàng)
   - Chuyển khoản ngân hàng
   - Ví điện tử (Momo, ZaloPay, VNPay)
   - Thẻ tín dụng/ghi nợ
4. **Xác nhận đặt hàng**
5. **Nhận mã đơn hàng & thông báo**

**B. Merchant Tạo Đơn Hàng Cho Guest Customer**
1. **Merchant chọn "Tạo đơn hàng mới"**
2. **Nhập thông tin khách hàng**
   - Họ tên khách hàng
   - Số điện thoại (bắt buộc)
   - Địa chỉ giao hàng (nếu giao hàng)
   - Ghi chú
3. **Chọn sản phẩm từ cửa hàng**
   - Tìm kiếm & chọn sản phẩm
   - Nhập số lượng
   - Điều chỉnh giá (nếu có giảm giá đặc biệt)
4. **Chọn phương thức thanh toán**
   - COD
   - Tiền mặt tại quầy
   - Chuyển khoản
5. **Xác nhận & tạo đơn hàng**
6. **In bill cho khách** (tùy chọn)
7. **Gửi SMS/Email mã đơn hàng** (nếu có số điện thoại/email)

**C. Tra Cứu Đơn Hàng (Guest Customer)**
- Khách vãng lai truy cập trang tra cứu đơn hàng
- Nhập: Mã đơn hàng + Số điện thoại
- Xem chi tiết đơn hàng, trạng thái, lịch sử cập nhật

#### 8.2 Trạng Thái Đơn Hàng
- **Pending**: Chờ xác nhận
- **Confirmed**: Đã xác nhận
- **Preparing**: Đang chuẩn bị hàng
- **Shipping**: Đang giao hàng
- **Delivered**: Đã giao hàng
- **Cancelled**: Đã hủy
- **Returned**: Đã hoàn trả

#### 8.3 Quản Lý Đơn Hàng (Merchant)
- Xem danh sách đơn hàng
- **Tạo đơn hàng cho khách vãng lai (Guest Customer)**:
  - Nhập thông tin khách hàng: tên, số điện thoại, địa chỉ
  - Chọn sản phẩm từ cửa hàng
  - Nhập số lượng và giá (có thể điều chỉnh giá đặc biệt)
  - Chọn phương thức thanh toán
  - Tạo mã đơn hàng để tracking
  - In bill/hóa đơn cho khách
- Cập nhật trạng thái đơn hàng
- In hóa đơn/phiếu giao hàng
- Hủy đơn hàng (với lý do)
- Tìm kiếm/lọc đơn hàng theo:
  - Mã đơn hàng
  - Tên khách hàng
  - Số điện thoại
  - Ngày đặt
  - Trạng thái
  - Giá trị đơn hàng
  - Loại khách hàng (Guest/Registered)

#### 8.4 Chi Tiết Đơn Hàng
- Mã đơn hàng (unique ID)
- Loại khách hàng (Guest/Registered)
- Thông tin khách hàng (tên, số điện thoại, địa chỉ)
- User ID (nếu là registered customer, null nếu là guest)
- Thông tin cửa hàng
- Nguồn đơn hàng (Customer đặt online / Merchant tạo tại quầy)
- Danh sách sản phẩm (tên, số lượng, giá, thành tiền)
- Tổng tiền hàng
- Phí vận chuyển
- Giảm giá (nếu có)
- Tổng thanh toán
- Phương thức thanh toán
- Trạng thái thanh toán
- Thời gian đặt hàng
- Thời gian cập nhật

---

### 9. Module Xuất Hóa Đơn & Báo Cáo (Invoice & Reporting)

#### 9.1 Xuất Hóa Đơn
**Merchant có thể:**
- **Xuất hóa đơn theo đơn hàng** (Invoice per Order)
  - PDF format
  - Bao gồm thông tin: Logo cửa hàng, thông tin khách hàng, chi tiết sản phẩm, tổng tiền
  - Mã QR code cho tra cứu
  
- **Xuất hóa đơn tổng hợp** (Summary Invoice)
  - Theo ngày
  - Theo tuần
  - Theo tháng
  - Theo quý
  - Theo năm
  - Theo khoảng thời gian tùy chỉnh

#### 9.2 Báo Cáo Doanh Thu (Revenue Reports)
**Các loại báo cáo:**
- **Báo cáo doanh thu**
  - Tổng doanh thu theo thời gian
  - Doanh thu theo sản phẩm
  - Doanh thu theo danh mục
  - So sánh theo kỳ

- **Báo cáo đơn hàng**
  - Tổng số đơn hàng
  - Đơn hàng thành công/thất bại
  - Giá trị trung bình đơn hàng (AOV)
  - Tỷ lệ hoàn thành

- **Báo cáo sản phẩm**
  - Top sản phẩm bán chậy nhất
  - Top sản phẩm bán ít nhất
  - Sản phẩm hết hàng
  - Tồn kho hiện tại

- **Báo cáo khách hàng**
  - Số khách hàng mới
  - Khách hàng quay lại
  - Customer Lifetime Value (CLV)

#### 9.3 Export Formats
- PDF
- Excel (XLSX)
- CSV
- Print-friendly view

#### 9.4 Dashboard Analytics
- Biểu đồ doanh thu (Line chart, Bar chart)
- Biểu đồ tròn phân bố sản phẩm
- Thống kê real-time
- KPI cards (Doanh thu hôm nay, Đơn hàng pending, ...)

---

### 10. Module Tìm Kiếm Theo Vị Trí (Location-Based Search)

#### 10.1 Tìm Cửa Hàng Lân Cận (Store Finder)
**Chức năng Customer:**
- **Tự động lấy vị trí hiện tại** (Geolocation API)
- **Hoặc nhập địa chỉ** để tìm kiếm
- Hiển thị danh sách cửa hàng gần nhất theo khoảng cách
- Hiển thị trên bản đồ (Google Maps)
- Lọc theo:
  - Bán kính (1km, 3km, 5km, 10km, 20km)
  - Loại cửa hàng/danh mục
  - Đang mở cửa
  
**Thông tin hiển thị:**
- Tên cửa hàng
- Khoảng cách (km)
- Địa chỉ
- Đánh giá (rating) nếu có
- Trạng thái (Đang mở/Đóng cửa)
- Nút "Xem cửa hàng" & "Chỉ đường"

#### 10.2 Tìm Sản Phẩm Theo Vị Trí
**Tìm kiếm sản phẩm:**
- Nhập tên sản phẩm cần tìm
- Hệ thống tìm trong các cửa hàng lân cận (trong bán kính X km)
- Hiển thị kết quả:
  - Tên sản phẩm
  - Tên cửa hàng
  - Giá
  - Khoảng cách đến cửa hàng
  - Hình ảnh
  - Trạng thái còn hàng
  
**Sắp xếp kết quả:**
- Theo khoảng cách (gần nhất)
- Theo giá (thấp đến cao, cao đến thấp)
- Theo đánh giá

**Lọc kết quả:**
- Khoảng giá
- Cửa hàng cụ thể
- Danh mục
- Còn hàng

#### 10.3 Thuật Toán Tìm Kiếm
- Sử dụng **Haversine formula** hoặc **PostGIS** để tính khoảng cách
- Index coordinates để tối ưu performance
- Caching kết quả tìm kiếm phổ biến
- Giới hạn số lượng kết quả (pagination)

#### 10.4 Map Integration
- Google Maps JavaScript API
- Hiển thị multiple markers
- Clustering markers khi zoom out
- Info window khi click vào marker
- Route direction từ vị trí hiện tại đến cửa hàng

---

### 11. Module Tìm Kiếm & Lọc (Search & Filter)

#### 11.1 Tìm Kiếm Sản Phẩm (General Search)
- Full-text search (Elasticsearch/PostgreSQL Full-Text Search)
- Tìm theo tên sản phẩm
- Tìm theo mô tả
- Autocomplete suggestions
- Search history
- Trending searches

#### 11.2 Bộ Lọc Nâng Cao
- Danh mục
- Khoảng giá
- Cửa hàng
- Đánh giá
- Khoảng cách (khi có vị trí)
- Tình trạng (Còn hàng/Hết hàng)

---

### 12. Module Đánh Giá & Nhận Xét (Reviews & Ratings)

#### 12.1 Đánh Giá Sản Phẩm
- Khách hàng đánh giá sau khi nhận hàng
- Rating: 1-5 sao
- Viết nhận xét
- Upload hình ảnh sản phẩm thực tế
- Merchant có thể phản hồi đánh giá

#### 12.2 Đánh Giá Cửa Hàng
- Rating tổng thể cửa hàng
- Đánh giá theo tiêu chí:
  - Chất lượng sản phẩm
  - Thái độ phục vụ
  - Tốc độ giao hàng
  - Đóng gói

---

### 13. Module Thông Báo (Notifications)

#### 13.1 Thông Báo Cho Customer
- Đơn hàng được xác nhận
- Đơn hàng đang giao
- Đơn hàng đã giao thành công
- Khuyến mãi/giảm giá
- Sản phẩm yêu thích có hàng trở lại

#### 13.2 Thông Báo Cho Merchant
- Có đơn hàng mới
- Khách hàng hủy đơn
- Sản phẩm sắp hết hàng
- Đánh giá mới từ khách hàng
- Báo cáo doanh thu định kỳ

#### 13.3 Kênh Thông Báo
- Push notification (PWA)
- Email
- SMS (optional)
- In-app notification

---

### 14. Module Khuyến Mãi (Promotions)

#### 14.1 Loại Khuyến Mãi
- Giảm giá theo phần trăm
- Giảm giá theo số tiền cố định
- Mua X tặng Y
- Freeship theo điều kiện
- Combo deals

#### 14.2 Mã Voucher/Coupon
- Tạo mã giảm giá
- Thiết lập điều kiện áp dụng:
  - Giá trị đơn hàng tối thiểu
  - Số lần sử dụng
  - Thời gian có hiệu lực
  - Sản phẩm/danh mục áp dụng
  - Khách hàng cụ thể

---

## Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

### 15. Performance (Hiệu Năng)
- API response time < 500ms (95th percentile)
- Page load time < 3s (First Contentful Paint)
- Hỗ trợ 1000+ concurrent users
- Database query optimization với indexing
- CDN cho static assets & images
- Lazy loading images
- Pagination cho danh sách lớn

### 16. Security (Bảo Mật)
- HTTPS/TLS cho tất cả connections
- JWT token với refresh token mechanism
- Password hashing (bcrypt, argon2)
- Rate limiting cho API
- CORS configuration
- XSS & CSRF protection
- SQL injection prevention (Prepared statements)
- Input validation & sanitization
- Role-based access control (RBAC)
- Secure payment gateway integration
- PCI DSS compliance cho payment data

### 17. Scalability (Khả Năng Mở Rộng)
- Horizontal scaling với load balancer
- Database replication (Master-Slave)
- Redis caching
- Message queue (RabbitMQ/Redis) cho async tasks
- Microservices architecture (optional)
- CDN cho static content

### 18. Availability (Tính Khả Dụng)
- Uptime target: 99.9%
- Auto-failover mechanisms
- Health check endpoints
- Monitoring & alerting (Prometheus, Grafana)
- Backup strategy:
  - Database daily backup
  - File storage backup
  - Backup retention: 30 days

### 19. Usability (Tính Khả Dụng)
- **Mobile-first design approach**
  - Thiết kế ưu tiên cho mobile devices
  - Tối ưu touch interactions
  - Thumb-friendly navigation
  - Bottom navigation bars
  - Swipe gestures
- **Responsive design**
  - Adaptive layouts cho mọi screen sizes
  - Fluid typography & spacing
  - Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1440px+ (large desktop)
  - Desktop view: Enhanced layouts with multi-column, sidebars, expanded navigation
  - Grid systems: Mobile (1 column), Tablet (2 columns), Desktop (3-4 columns)
- PWA features:
  - Offline mode
  - Install to home screen
  - Push notifications
- Multi-language support (i18n)
  - Tiếng Việt (default)
  - English
- Accessibility (WCAG 2.1 Level AA)
- Intuitive UI/UX
- Loading states & error messages

### 20. Compatibility (Tương Thích)
- **Browsers:**
  - Chrome (2 latest versions)
  - Firefox (2 latest versions)
  - Safari (2 latest versions)
  - Edge (2 latest versions)
- **Mobile:**
  - iOS Safari (iOS 13+)
  - Chrome Mobile (Android 8+)
- **Screen sizes:**
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+

---

## Công Nghệ & Stack (Technology Stack)

### 21. Backend (BE)
**Đề xuất stack:**
- **Runtime:** Node.js 18+ LTS
- **Framework:** Express.js hoặc NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL 15+ (với PostGIS extension)
- **Cache:** Redis 7+
- **ORM:** Prisma hoặc TypeORM
- **Authentication:** JWT, Passport.js
- **File Upload:** Multer, Sharp (image processing)
- **Payment Gateway:** VNPay SDK, Momo SDK
- **Email Service:** SendGrid, AWS SES
- **SMS Service:** Twilio, SMSAPI.vn

**Cấu trúc thư mục (Clean Architecture):**
```
be/
├── src/
│   ├── core/                           # Infrastructure
│   │   ├── container.ts
│   │   ├── errors/AppError.ts
│   │   ├── interfaces/IRepository.ts
│   │   └── middleware/
│   │       ├── errorHandler.ts
│   │       └── validateDto.ts
│   ├── modules/
│   │   ├── auth/                       # ✅ Clean structure
│   │   │   ├── dtos/auth.dto.ts
│   │   │   ├── interfaces/IAuthRepository.ts
│   │   │   ├── repositories/AuthRepository.ts
│   │   │   ├── services/AuthService.ts
│   │   │   ├── controllers/AuthController.ts
│   │   │   └── auth.routes.ts
│   │   ├── stores/                     # ✅ Clean structure
│   │   │   ├── dtos/store.dto.ts
│   │   │   ├── interfaces/IStoreRepository.ts
│   │   │   ├── repositories/StoreRepository.ts
│   │   │   ├── services/StoreService.ts
│   │   │   ├── controllers/StoreController.ts
│   │   │   └── stores.routes.ts
│   │   └── products/                   # ✅ Clean structure
│   │       ├── dtos/product.dto.ts
│   │       ├── interfaces/IProductRepository.ts
│   │       ├── repositories/ProductRepository.ts
│   │       ├── services/ProductService.ts
│   │       ├── controllers/ProductController.ts
│   │       └── products.routes.ts
│   ├── app.ts
│   └── server.ts
├── prisma/
├── README.md                           # ✅ New
├── PROJECT_STRUCTURE.md                # ✅ New
└── package.json
```

**Architecture principles:**
- **Dependency Injection**: Using tsyringe for IoC container
- **DTOs**: class-validator for automatic validation
- **Repository Pattern**: Data access abstraction
- **Custom Errors**: Semantic error handling with HTTP status codes
- **Clean separation**: Controller → Service → Repository → Database

See `docs/BACKEND_ARCHITECTURE.md` for detailed documentation.

### 22. Portal PWA (Single App với Role-based UI)
**Stack:**
- **Framework:** React 18+
- **Language:** TypeScript
- **Build Tool:** Vite
- **State Management:** Redux Toolkit hoặc Zustand
- **Routing:** React Router v6 (với role-based routes)
- **UI Library:** Material-UI (MUI) hoặc Ant Design
- **Forms:** React Hook Form + Yup/Zod validation
- **HTTP Client:** Axios hoặc TanStack Query
- **Maps:** @react-google-maps/api
- **PWA:** Workbox, vite-plugin-pwa
- **CSS:** Tailwind CSS hoặc Styled Components
- **Local Storage:** IndexedDB (Dexie.js) hoặc LocalForage
- **Charts:** Recharts hoặc Chart.js (for merchant/admin)
- **Tables:** TanStack Table (for merchant/admin)
- **Export:** xlsx, jsPDF (for merchant/admin)

**Architecture Pattern:** Clean Architecture với Layer separation

**Role-based UI Routing:**
```
/                          # Public home (Guest)
/track                     # Guest order tracking
/login                     # Login page
/register                  # Register page

# Customer UI (role: CUSTOMER)
/shop                      # Customer home
/shop/products             # Product listing
/shop/products/:id         # Product detail
/shop/stores               # Store listing
/shop/stores/:id           # Store detail
/shop/cart                 # Shopping cart
/shop/checkout             # Checkout
/shop/orders               # Order history
/shop/profile              # Customer profile

# Merchant UI (role: MERCHANT)
/merchant/dashboard        # Merchant dashboard
/merchant/stores           # My stores
/merchant/products         # My products
/merchant/orders           # My orders
/merchant/orders/create    # Create order for guest
/merchant/reports          # Reports
/merchant/profile          # Merchant profile

# Admin UI (role: ADMIN)
/admin/dashboard           # Admin dashboard
/admin/merchants           # All merchants
/admin/stores              # All stores
/admin/products            # All products
/admin/orders              # All orders
/admin/users               # User management
/admin/reports             # System reports
/admin/settings            # System settings
```

**Cấu trúc thư mục Single Portal (Role-based):**
```
portal/
├── src/
│   ├── presentation/              # VIEW LAYER
│   │   ├── pages/                 # Page components (Routes)
│   │   │   ├── public/            # Public pages (Guest)
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── TrackOrderPage.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── customer/          # Customer UI (CUSTOMER role)
│   │   │   │   ├── ShopHomePage.tsx
│   │   │   │   ├── ProductListPage.tsx
│   │   │   │   ├── ProductDetailPage.tsx
│   │   │   │   ├── StoreListPage.tsx
│   │   │   │   ├── CartPage.tsx
│   │   │   │   ├── CheckoutPage.tsx
│   │   │   │   ├── OrdersPage.tsx
│   │   │   │   └── ProfilePage.tsx
│   │   │   ├── merchant/          # Merchant UI (MERCHANT role)
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── StoresPage.tsx
│   │   │   │   ├── ProductsPage.tsx
│   │   │   │   ├── OrdersPage.tsx
│   │   │   │   ├── CreateOrderPage.tsx  # Create order for guest
│   │   │   │   ├── ReportsPage.tsx
│   │   │   │   └── ProfilePage.tsx
│   │   │   └── admin/             # Admin UI (ADMIN role)
│   │   │       ├── DashboardPage.tsx
│   │   │       ├── MerchantsPage.tsx
│   │   │       ├── StoresPage.tsx
│   │   │       ├── ProductsPage.tsx
│   │   │       ├── OrdersPage.tsx
│   │   │       ├── UsersPage.tsx
│   │   │       ├── ReportsPage.tsx
│   │   │       └── SettingsPage.tsx
│   │   │   ├── products/
│   │   │   │   ├── ProductListPage.tsx
│   │   │   │   ├── ProductDetailPage.tsx
│   │   │   │   └── index.ts
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── orders/
│   │   │   ├── store-locator/
│   │   │   └── auth/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── common/
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Card/
│   │   │   │   └── Modal/
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   └── ProductFilter.tsx
│   │   │   ├── cart/
│   │   │   ├── store/
│   │   │   └── map/
│   │   ├── layouts/               # Layout components
│   │   │   ├── MainLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   └── CheckoutLayout.tsx
│   │   └── styles/                # Global styles
│   │
│   ├── viewmodels/                # VIEW MODEL LAYER
│   │   ├── useProductViewModel.ts
│   │   ├── useCartViewModel.ts
│   │   ├── useOrderViewModel.ts
│   │   ├── useStoreViewModel.ts
│   │   ├── useAuthViewModel.ts
│   │   └── useLocationViewModel.ts
│   │
│   ├── domain/                    # DOMAIN LAYER
│   │   ├── entities/              # Business entities (models)
│   │   │   ├── User.ts
│   │   │   ├── Store.ts
│   │   │   ├── Product.ts
│   │   │   ├── Cart.ts
│   │   │   ├── Order.ts
│   │   │   └── Category.ts
│   │   ├── usecases/              # USE CASE LAYER
│   │   │   ├── auth/
│   │   │   │   ├── LoginUseCase.ts
│   │   │   │   ├── RegisterUseCase.ts
│   │   │   │   └── LogoutUseCase.ts
│   │   │   ├── product/
│   │   │   │   ├── GetProductsUseCase.ts
│   │   │   │   ├── GetProductDetailUseCase.ts
│   │   │   │   ├── SearchProductsUseCase.ts
│   │   │   │   └── SearchProductsByLocationUseCase.ts
│   │   │   ├── cart/
│   │   │   │   ├── AddToCartUseCase.ts
│   │   │   │   ├── UpdateCartItemUseCase.ts
│   │   │   │   ├── RemoveFromCartUseCase.ts
│   │   │   │   └── GetCartUseCase.ts
│   │   │   ├── order/
│   │   │   │   ├── CreateOrderUseCase.ts
│   │   │   │   ├── GetOrdersUseCase.ts
│   │   │   │   ├── GetOrderDetailUseCase.ts
│   │   │   │   └── CancelOrderUseCase.ts
│   │   │   ├── store/
│   │   │   │   ├── GetStoresUseCase.ts
│   │   │   │   ├── GetStoreDetailUseCase.ts
│   │   │   │   ├── SearchNearbyStoresUseCase.ts
│   │   │   │   └── GetStoreProductsUseCase.ts
│   │   │   └── location/
│   │   │       ├── GetCurrentLocationUseCase.ts
│   │   │       └── CalculateDistanceUseCase.ts
│   │   └── interfaces/            # Repository interfaces
│   │       ├── IProductRepository.ts
│   │       ├── ICartRepository.ts
│   │       ├── IOrderRepository.ts
│   │       ├── IStoreRepository.ts
│   │       ├── IAuthRepository.ts
│   │       └── ILocationRepository.ts
│   │
│   ├── data/                      # DATA LAYER
│   │   ├── repositories/          # REPOSITORY LAYER (Implementation)
│   │   │   ├── ProductRepository.ts
│   │   │   ├── CartRepository.ts
│   │   │   ├── OrderRepository.ts
│   │   │   ├── StoreRepository.ts
│   │   │   ├── AuthRepository.ts
│   │   │   └── LocationRepository.ts
│   │   ├── datasources/
│   │   │   ├── remote/            # REMOTE API LAYER
│   │   │   │   ├── api/
│   │   │   │   │   ├── apiClient.ts       # Axios instance
│   │   │   │   │   ├── authApi.ts
│   │   │   │   │   ├── productApi.ts
│   │   │   │   │   ├── cartApi.ts
│   │   │   │   │   ├── orderApi.ts
│   │   │   │   │   ├── storeApi.ts
│   │   │   │   │   └── interceptors.ts    # Request/Response interceptors
│   │   │   │   ├── dto/                   # Data Transfer Objects
│   │   │   │   │   ├── ProductDTO.ts
│   │   │   │   │   ├── CartDTO.ts
│   │   │   │   │   ├── OrderDTO.ts
│   │   │   │   │   └── StoreDTO.ts
│   │   │   │   └── mappers/              # DTO to Entity mappers
│   │   │   │       ├── ProductMapper.ts
│   │   │   │       ├── CartMapper.ts
│   │   │   │       ├── OrderMapper.ts
│   │   │   │       └── StoreMapper.ts
│   │   │   └── local/             # LOCAL DB LAYER
│   │   │       ├── db/
│   │   │       │   ├── indexedDB.ts       # IndexedDB setup
│   │   │       │   └── schema.ts          # Local DB schema
│   │   │       ├── dao/                   # Data Access Objects
│   │   │       │   ├── CartDAO.ts
│   │   │       │   ├── ProductDAO.ts
│   │   │       │   └── UserDAO.ts
│   │   │       └── cache/
│   │   │           ├── CacheManager.ts
│   │   │           └── CacheStrategy.ts
│   │   └── models/                # Data models (DTOs)
│   │
│   ├── core/                      # CORE/SHARED LAYER
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useGeolocation.ts
│   │   │   └── useIntersectionObserver.ts
│   │   ├── utils/                 # Utility functions
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   ├── services/              # Third-party services
│   │   │   ├── GoogleMapsService.ts
│   │   │   ├── NotificationService.ts
│   │   │   └── AnalyticsService.ts
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   └── app.config.ts
│   │   └── types/                 # TypeScript types
│   │       ├── index.ts
│   │       └── global.d.ts
│   │
│   ├── state/                     # State management
│   │   ├── store.ts               # Redux store config
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── cartSlice.ts
│   │   │   ├── productSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── selectors/
│   │
│   ├── routes/                    # Routing configuration
│   │   ├── index.tsx
│   │   ├── PrivateRoute.tsx
│   │   └── PublicRoute.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── public/
│   ├── icons/
│   ├── images/
│   └── manifest.json
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**Luồng dữ liệu (Data Flow):**
```
View (React Component)
  ↓ user action
ViewModel (custom hook)
  ↓ business logic call
UseCase (business logic)
  ↓ data operation
Repository (interface implementation)
  ↓ fetch/save data
  ├→ Remote API (REST calls)
  └→ Local DB (IndexedDB cache)
      ↓ data returned
      ↑
    DTO → Entity mapping
      ↓
ViewModel (state update)
  ↓ re-render
View (UI update)
```

**Components organized by role:**
```
│   │   ├── components/
│   │   │   ├── common/            # Shared components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── NavDrawer.tsx  # Role-based navigation drawer
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Loading.tsx
│   │   │   ├── customer/          # Customer-specific components
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── StoreCard.tsx
│   │   │   │   ├── CartItem.tsx
│   │   │   │   └── MapView.tsx
│   │   │   ├── merchant/          # Merchant-specific components
│   │   │   │   ├── DashboardStats.tsx
│   │   │   │   ├── RevenueChart.tsx
│   │   │   │   ├── OrderTable.tsx
│   │   │   │   ├── CreateOrderForm.tsx  # For guest orders
│   │   │   │   └── ProductForm.tsx
│   │   │   └── admin/             # Admin-specific components
│   │   │       ├── SystemStats.tsx
│   │   │       ├── MerchantTable.tsx
│   │   │       ├── UserManagement.tsx
│   │   │       └── ReportExporter.tsx
│   │   ├── layouts/               # Layout components
│   │   │   ├── PublicLayout.tsx   # For guest/public pages
│   │   │   ├── CustomerLayout.tsx # For customer pages
│   │   │   ├── MerchantLayout.tsx # For merchant pages
│   │   │   └── AdminLayout.tsx    # For admin pages
│   │   │       └── InvoiceGenerator.tsx
│   │   └── layouts/
│   │       ├── DashboardLayout.tsx
│   │       └── AuthLayout.tsx
│   │
│   ├── viewmodels/                # VIEW MODEL LAYER
│   │   ├── useDashboardViewModel.ts
│   │   ├── useStoreViewModel.ts
│   │   ├── useProductViewModel.ts
│   │   ├── useBaseItemViewModel.ts
│   │   ├── useOrderViewModel.ts
│   │   ├── useReportViewModel.ts
│   │   └── useAuthViewModel.ts
│   │
│   ├── domain/                    # DOMAIN LAYER
│   │   ├── entities/
│   │   │   ├── Merchant.ts
│   │   │   ├── Store.ts
│   │   │   ├── Product.ts
│   │   │   ├── BaseItem.ts
│   │   │   ├── Order.ts
│   │   │   ├── Category.ts
│   │   │   └── Report.ts
│   │   ├── usecases/              # USE CASE LAYER
│   │   │   ├── store/
│   │   │   │   ├── CreateStoreUseCase.ts
│   │   │   │   ├── UpdateStoreUseCase.ts
│   │   │   │   ├── DeleteStoreUseCase.ts
│   │   │   │   ├── GetStoresUseCase.ts
│   │   │   │   └── GetStoreDetailUseCase.ts
│   │   │   ├── product/
│   │   │   │   ├── CreateProductUseCase.ts
│   │   │   │   ├── UpdateProductUseCase.ts
│   │   │   │   ├── DeleteProductUseCase.ts
│   │   │   │   ├── CloneFromBaseItemUseCase.ts
│   │   │   │   └── UpdatePriceUseCase.ts
│   │   │   ├── base-item/
│   │   │   │   ├── CreateBaseItemUseCase.ts
│   │   │   │   ├── GetBaseItemsUseCase.ts
│   │   │   │   └── SearchBaseItemsUseCase.ts
│   │   │   ├── order/
│   │   │   │   ├── GetOrdersUseCase.ts
│   │   │   │   ├── UpdateOrderStatusUseCase.ts
│   │   │   │   └── CancelOrderUseCase.ts
│   │   │   ├── report/
│   │   │   │   ├── GenerateRevenueReportUseCase.ts
│   │   │   │   ├── GenerateOrderReportUseCase.ts
│   │   │   │   ├── ExportInvoiceUseCase.ts
│   │   │   │   └── ExportSummaryReportUseCase.ts
│   │   │   └── dashboard/
│   │   │       ├── GetDashboardStatsUseCase.ts
│   │   │       └── GetRevenueChartDataUseCase.ts
│   │   └── interfaces/
│   │       ├── IStoreRepository.ts
│   │       ├── IProductRepository.ts
│   │       ├── IBaseItemRepository.ts
│   │       ├── IOrderRepository.ts
│   │       └── IReportRepository.ts
│   │
│   ├── data/                      # DATA LAYER
│   │   ├── repositories/          # REPOSITORY LAYER
│   │   │   ├── StoreRepository.ts
│   │   │   ├── ProductRepository.ts
│   │   │   ├── BaseItemRepository.ts
│   │   │   ├── OrderRepository.ts
│   │   │   └── ReportRepository.ts
│   │   ├── datasources/
│   │   │   ├── remote/            # REMOTE API LAYER
│   │   │   │   ├── api/
│   │   │   │   │   ├── apiClient.ts
│   │   │   │   │   ├── authApi.ts
│   │   │   │   │   ├── storeApi.ts
│   │   │   │   │   ├── productApi.ts
│   │   │   │   │   ├── baseItemApi.ts
│   │   │   │   │   ├── orderApi.ts
│   │   │   │   │   ├── reportApi.ts
│   │   │   │   │   └── interceptors.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── StoreDTO.ts
│   │   │   │   │   ├── ProductDTO.ts
│   │   │   │   │   ├── OrderDTO.ts
│   │   │   │   │   └── ReportDTO.ts
│   │   │   │   └── mappers/
│   │   │   │       ├── StoreMapper.ts
│   │   │   │       ├── ProductMapper.ts
│   │   │   │       └── OrderMapper.ts
│   │   │   └── local/             # LOCAL DB LAYER
│   │   │       ├── db/
│   │   │       │   ├── indexedDB.ts
│   │   │       │   └── schema.ts
│   │   │       ├── dao/
│   │   │       │   ├── StoreDAO.ts
│   │   │       │   ├── ProductDAO.ts
│   │   │       │   └── OrderDAO.ts
│   │   │       └── cache/
│   │   │           └── CacheManager.ts
│   │   └── models/
│   │
│   ├── core/                      # CORE/SHARED LAYER
│   │   ├── hooks/
│   │   ├── utils/
│   │   │   ├── exportHelpers.ts   # Excel/PDF export
│   │   │   ├── chartHelpers.ts
│   │   │   └── validators.ts
│   │   ├── services/
│   │   │   ├── GoogleMapsService.ts
│   │   │   ├── ExportService.ts
│   │   │   ├── InvoiceService.ts
│   │   │   └── NotificationService.ts
│   │   ├── config/
│   │   └── types/
│   │
│   ├── state/                     # State management
│   │   ├── store.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── storeSlice.ts
│   │       ├── productSlice.ts
│   │       ├── orderSlice.ts
│   │       └── uiSlice.ts
│   │
│   ├── routes/                    # Role-based routing
│   │   ├── index.tsx              # Main router with role checks
│   │   ├── PublicRoutes.tsx       # Guest/public routes
│   │   ├── CustomerRoutes.tsx     # Customer role routes
│   │   ├── MerchantRoutes.tsx     # Merchant role routes
│   │   ├── AdminRoutes.tsx        # Admin role routes
│   │   └── PrivateRoute.tsx       # HOC for protected routes
│   │
│   ├── App.tsx
│   └── main.tsx
├── public/
├── tests/
├── package.json
└── tsconfig.json
```

**Role-based Routing Example:**
```typescript
// routes/index.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AppRoutes() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/track" element={<TrackOrderPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer Routes */}
      <Route path="/shop/*" element={
        <PrivateRoute roles={['customer', 'merchant', 'admin']}>
          <CustomerRoutes />
        </PrivateRoute>
      } />

      {/* Merchant Routes */}
      <Route path="/merchant/*" element={
        <PrivateRoute roles={['merchant', 'admin']}>
          <MerchantRoutes />
        </PrivateRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <PrivateRoute roles={['admin']}>
          <AdminRoutes />
        </PrivateRoute>
      } />

      {/* Default redirect based on role */}
      <Route path="*" element={
        isAuthenticated ? (
          user?.role === 'admin' ? <Navigate to="/admin/dashboard" /> :
          user?.role === 'merchant' ? <Navigate to="/merchant/dashboard" /> :
          <Navigate to="/shop" />
        ) : <Navigate to="/" />
      } />
    </Routes>
  );
}
```

**Lợi ích của Single Portal với Role-based UI:**
- **Single codebase**: Dễ maintain và deploy
- **Shared components**: Tái sử dụng components giữa các role
- **Consistent UX**: Trải nghiệm đồng nhất trên toàn hệ thống
- **Role switching**: Merchant có thể dễ dàng chuyển giữa merchant UI và customer UI
- **Simplified deployment**: Chỉ cần deploy 1 app thay vì 2-3 app riêng biệt

**Lợi ích của Clean Architecture:**
- **Separation of Concerns**: Mỗi layer có trách nhiệm riêng biệt
- **Testability**: Dễ dàng unit test từng layer độc lập
- **Maintainability**: Code dễ maintain và mở rộng
- **Flexibility**: Dễ thay đổi implementation (ví dụ: đổi từ Axios sang Fetch, đổi State management)
- **Reusability**: UseCase có thể tái sử dụng cho nhiều View
- **Independence**: View không phụ thuộc trực tiếp vào API implementation

---

## Database Schema (Sơ Đồ Cơ Sở Dữ Liệu)

### 24. Các Bảng Chính

#### Users
```sql
users
- id (PK, UUID)
- email (unique)
- password_hash
- full_name
- phone
- role (customer/merchant/admin)
- avatar_url
- email_verified (boolean)
- status (active/inactive/suspended)
- created_at
- updated_at

Note: 
- Default role on registration: CUSTOMER
- Users upgrade to MERCHANT role when registering a store
- MERCHANT users retain CUSTOMER privileges for purchasing from other stores
- Check role='MERCHANT' to determine merchant capabilities
```

#### Stores
```sql
stores
- id (PK, UUID)
- merchant_id (FK -> users.id)
- name
- description
- logo_url
- address
- latitude (decimal)
- longitude (decimal)
- phone
- email
- opening_hours (JSON)
- status (active/inactive)
- created_at
- updated_at

Index: spatial index on (latitude, longitude)
```

#### Categories
```sql
categories
- id (PK, UUID)
- name
- slug
- parent_id (FK -> categories.id, nullable)
- description
- image_url
- level (1=category, 2=sub-category)
- display_order
- created_at
- updated_at
```

#### Base_Products (Base Items)
```sql
base_products
- id (PK, UUID)
- category_id (FK -> categories.id)
- name
- slug
- description
- unit (kg/piece/liter/...)
- attributes (JSON) // màu sắc, size, etc
- images (JSON array)
- created_by (FK -> users.id)
- is_approved (boolean)
- created_at
- updated_at
```

#### Store_Products
```sql
store_products
- id (PK, UUID)
- store_id (FK -> stores.id)
- base_product_id (FK -> base_products.id)
- name (can override)
- description (can override)
- price (decimal)
- sale_price (decimal, nullable)
- stock_quantity
- images (JSON array)
- status (available/out_of_stock/discontinued)
- created_at
- updated_at

Index: (store_id, base_product_id)
```

#### Carts
```sql
carts
- id (PK, UUID)
- customer_id (FK -> users.id)
- store_id (FK -> stores.id)
- created_at
- updated_at

Unique: (customer_id)
```

#### Cart_Items
```sql
cart_items
- id (PK, UUID)
- cart_id (FK -> carts.id)
- product_id (FK -> store_products.id)
- quantity
- price_snapshot (decimal)
- created_at
- updated_at
```

#### Orders
```sql
orders
- id (PK, UUID)
- order_number (unique, auto-generated)
- customer_id (FK -> users.id, NULLABLE)  # NULL for guest customers
- customer_type (enum: 'guest', 'registered')
- store_id (FK -> stores.id)
- customer_name
- customer_phone (indexed for guest lookup)
- customer_email (nullable)
- shipping_address
- notes
- subtotal (decimal)
- shipping_fee (decimal)
- discount (decimal)
- total (decimal)
- payment_method
- payment_status (pending/paid/failed)
- order_status (enum)
- order_source (enum: 'online', 'merchant_created')  # Tracking order source
- created_by (FK -> users.id, nullable)  # Merchant who created order
- created_at
- updated_at

Index: 
- (customer_id)
- (store_id)
- (order_number)
- (customer_phone, order_number)  # For guest order lookup
- (created_at)
- (customer_type)

Note:
- customer_id is NULL for guest customers
- customer_type = 'guest' when merchant creates order for walk-in customer
- customer_type = 'registered' when customer has account
- Guest customers can lookup order using: order_number + phone
```

#### Order_Items
```sql
order_items
- id (PK, UUID)
- order_id (FK -> orders.id)
- product_id (FK -> store_products.id)
- product_name (snapshot)
- quantity
- unit_price (decimal)
- total_price (decimal)
- created_at
```

#### Reviews
```sql
reviews
- id (PK, UUID)
- order_id (FK -> orders.id)
- customer_id (FK -> users.id)
- store_id (FK -> stores.id)
- product_id (FK -> store_products.id, nullable)
- rating (1-5)
- comment
- images (JSON array)
- created_at
- updated_at
```

#### Promotions
```sql
promotions
- id (PK, UUID)
- store_id (FK -> stores.id)
- code (unique)
- name
- description
- discount_type (percentage/fixed)
- discount_value (decimal)
- min_order_value (decimal)
- max_usage
- used_count
- valid_from
- valid_to
- status (active/inactive)
- created_at
- updated_at
```

#### Notifications
```sql
notifications
- id (PK, UUID)
- user_id (FK -> users.id)
- type
- title
- message
- data (JSON)
- is_read (boolean)
- created_at
```

---

## API Endpoints

### 25. Authentication APIs
```
POST   /api/auth/register              # Default: CUSTOMER role
POST   /api/auth/register-merchant     # Customer upgrades to MERCHANT
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
GET    /api/auth/me                    # Get current user profile
```

### 26. Store APIs
```
# Customer endpoints
GET    /api/stores                           # List all stores
GET    /api/stores/:id                       # Get store details
GET    /api/stores/nearby?lat={lat}&lng={lng}&radius={km}
GET    /api/stores/:id/products

# Merchant endpoints (own stores only)
POST   /api/stores                           # Create store (requires MERCHANT role)
PUT    /api/stores/:id                       # Update own store
DELETE /api/stores/:id                       # Delete own store
GET    /api/stores/my-stores                 # Get merchant's own stores

# Admin endpoints (all stores)
GET    /api/admin/stores                     # List all stores (admin only)
GET    /api/admin/stores/:id                 # View any store (admin only)
PUT    /api/admin/stores/:id                 # Update any store (admin only)
DELETE /api/admin/stores/:id                 # Delete any store (admin only)
PUT    /api/admin/stores/:id/status          # Activate/deactivate store (admin only)
```

### 27. Product APIs
```
# Customer endpoints
GET    /api/products                         # List all products
GET    /api/products/:id                     # Get product details
GET    /api/products/search?q={query}&lat={lat}&lng={lng}

# Merchant endpoints (own store products only)
POST   /api/products                         # Add product to own store
PUT    /api/products/:id                     # Update own product
DELETE /api/products/:id                     # Delete own product
GET    /api/products/my-products             # Get merchant's products

# Admin endpoints (all products)
GET    /api/admin/products                   # List all products (admin only)
PUT    /api/admin/products/:id               # Update any product (admin only)
DELETE /api/admin/products/:id               # Delete any product (admin only)
```

### 28. Base Product APIs
```
GET    /api/base-products
GET    /api/base-products/:id
POST   /api/base-products (merchant/admin)
POST   /api/base-products/:id/clone (merchant)
```

### 29. Category APIs
```
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories (admin)
PUT    /api/categories/:id (admin)
```

### 30. Cart APIs
```
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/:id
DELETE /api/cart/items/:id
DELETE /api/cart
```

### 31. Order APIs
```
# Customer endpoints
GET    /api/orders                           # Get customer's own orders
GET    /api/orders/:id                       # Get order details (own orders only)
POST   /api/orders                           # Create order
POST   /api/orders/:id/cancel                # Cancel own order

# Guest customer endpoints (no authentication required)
GET    /api/orders/track?order_number={number}&phone={phone}  # Track guest order

# Merchant endpoints
GET    /api/orders/store/:storeId            # Get orders for merchant's store
GET    /api/orders/:id                       # View order (if from own store)
POST   /api/orders/merchant/create           # Create order for guest customer
PUT    /api/orders/:id/status                # Update order status (own store only)
POST   /api/orders/:id/invoice               # Generate invoice/bill
GET    /api/orders/store/:storeId/filter?type={guest|registered|all}  # Filter by customer type

# Admin endpoints
GET    /api/admin/orders                     # View all orders (admin only)
GET    /api/admin/orders/:id                 # View any order (admin only)
PUT    /api/admin/orders/:id/status          # Update any order status (admin only)
```

**POST /api/orders/merchant/create - Request Body:**
```json
{
  "store_id": "uuid",
  "customer_name": "Nguyen Van A",
  "customer_phone": "0901234567",
  "customer_email": "optional@email.com",
  "shipping_address": "123 Street, District, City",
  "notes": "Customer notes",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "unit_price": 50000  // Can adjust price
    }
  ],
  "payment_method": "cash",
  "discount": 10000,
  "shipping_fee": 0
}
```

**GET /api/orders/track - Query Parameters:**
```
order_number: BL-2026-001 (required)
phone: 0901234567 (required)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_number": "BL-2026-001",
    "customer_name": "Nguyen Van A",
    "customer_phone": "0901234567",
    "store_name": "Best Bánh Mì",
    "status": "confirmed",
    "total": 80000,
    "items": [...],
    "status_history": [...],
    "created_at": "2026-01-30T10:00:00Z"
  }
}
```

### 32. Report APIs
```
# Merchant endpoints (own store only)
GET    /api/reports/revenue?start_date={}&end_date={}        # Own store revenue
GET    /api/reports/orders?period={daily|monthly|quarterly}  # Own store orders
GET    /api/reports/products/top-selling                     # Own store products
POST   /api/reports/invoice/:order_id/download               # Own store orders
POST   /api/reports/summary/download?start_date={}&end_date={}

# Admin endpoints (all stores)
GET    /api/admin/reports/revenue?start_date={}&end_date={}         # All stores
GET    /api/admin/reports/orders?period={daily|monthly|quarterly}   # All orders
GET    /api/admin/reports/products/top-selling                      # All products
GET    /api/admin/reports/merchants                                 # Merchant analytics
POST   /api/admin/reports/summary/download                          # System-wide report
```

---

## Quy Trình Phát Triển (Development Workflow)

### 33. Phases

#### Phase 1: Setup & Infrastructure (Week 1-2)
- [ ] Setup repositories (monorepo hoặc separate repos)
- [ ] Initialize BE với Express/NestJS + TypeScript
- [ ] Initialize Portal với React + Vite + TypeScript (single app)
- [ ] Setup PostgreSQL + PostGIS
- [ ] Setup Redis
- [ ] Configure Docker & Docker Compose
- [ ] Setup CI/CD pipeline (GitHub Actions)

#### Phase 2: Core Backend (Week 3-5)
- [ ] Implement authentication & authorization
- [ ] Database schema & migrations
- [ ] User management APIs
- [ ] Store management APIs
- [ ] Category & Base Product APIs
- [ ] Store Product APIs
- [ ] File upload service

#### Phase 3: Portal UI - Public & Customer (Week 6-8)
- [ ] Setup PWA infrastructure
- [ ] Role-based routing configuration
- [ ] Authentication pages (Login, Register)
- [ ] Public pages (Home, Track Order for guest)
- [ ] Customer UI: Home page & navigation
- [ ] Customer UI: Store listing & detail
- [ ] Customer UI: Product listing & detail
- [ ] Customer UI: Store locator (Google Maps integration)
- [ ] Customer UI: Product search by location
- [ ] Customer UI: Shopping cart

#### Phase 4: Order & Payment (Week 9-10)
- [ ] Cart APIs
- [ ] Order APIs (including merchant create order for guest)
- [ ] Guest order tracking API
- [ ] Payment gateway integration
- [ ] Customer UI: Checkout flow
- [ ] Customer UI: Order tracking
- [ ] Guest UI: Order tracking page (no login required)

#### Phase 5: Merchant UI (Week 11-13)
- [ ] Merchant UI: Dashboard
- [ ] Merchant UI: Store management
- [ ] Merchant UI: Product management (Base & Store items)
- [ ] Merchant UI: Order management
- [ ] Merchant UI: Create order for guest customer
- [ ] Merchant UI: Google Maps integration for store creation
- [ ] Merchant UI: Report & analytics
- [ ] Merchant UI: Invoice generation
- [ ] Role switching: Merchant can access Customer UI

#### Phase 6: Admin UI (Week 14-15)
- [ ] Admin UI: Dashboard
- [ ] Admin UI: Merchant management
- [ ] Admin UI: Store management (all stores)
- [ ] Admin UI: Product management (all products)
- [ ] Admin UI: Order management (all orders)
- [ ] Admin UI: User management
- [ ] Admin UI: System reports
- [ ] Admin UI: Settings

#### Phase 7: Advanced Features (Week 16)
- [ ] Reviews & ratings
- [ ] Promotions & coupons
- [ ] Notification system (Push, Email, SMS)
- [ ] Search optimization (Elasticsearch)

#### Phase 8: Testing & Optimization (Week 17-18)
- [ ] Unit testing (all layers)
- [ ] Integration testing (APIs)
- [ ] E2E testing (Playwright/Cypress) - role-based flows
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing

#### Phase 9: Deployment & Launch (Week 19)
- [ ] Production environment setup
- [ ] Database migration
- [ ] SSL certificate
- [ ] Domain configuration
- [ ] Monitoring & logging
- [ ] Soft launch & beta testing
- [ ] Official launch

---

## Testing Strategy

## Testing Strategy

### 34. Test Coverage
- **Backend:**
  - Unit tests cho business logic (Jest)
  - Integration tests cho APIs (Supertest)
  - Database tests
  - Target coverage: 80%+

- **Frontend:**
  - Component tests (React Testing Library)
  - E2E tests (Playwright)
  - Visual regression tests (optional)
  - Target coverage: 70%+

---

## Environment Configuration

### 35. Development & Production Environments

#### Development Environment (Local)
**Backend API:**
- **Port:** 8082
- **Base URL:** http://localhost:8082
- **Database:** PostgreSQL (local instance)
- **Redis:** localhost:6379
- **Environment Variables:**
  ```
  NODE_ENV=development
  PORT=8082
  DATABASE_URL=postgresql://user:password@localhost:5432/banle_dev
  REDIS_URL=redis://localhost:6379
  JWT_SECRET=dev_secret_key_change_in_production
  JWT_EXPIRES_IN=7d
  API_BASE_URL=http://localhost:8082
  FRONTEND_URL=http://localhost:3001
  PORTAL_URL=http://localhost:3002
  CORS_ORIGIN=http://localhost:3001,http://localhost:3002
  ```

**Customer Frontend (FE):**
- **Port:** 3001
- **Base URL:** http://localhost:3001
- **Environment Variables:**
  ```
  VITE_APP_ENV=development
  VITE_API_BASE_URL=http://localhost:8082/api
  VITE_GOOGLE_MAPS_API_KEY=your_dev_key
  VITE_APP_NAME=BanLe Customer
  ```

**Admin Portal:**
- **Port:** 3002
- **Base URL:** http://localhost:3002
- **Environment Variables:**
  ```
  VITE_APP_ENV=development
  VITE_API_BASE_URL=http://localhost:8082/api
  VITE_GOOGLE_MAPS_API_KEY=your_dev_key
  VITE_APP_NAME=BanLe Merchant Portal
  ```

**Docker Compose cho Development:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:15-3.3
    container_name: banle_postgres_dev
    environment:
      POSTGRES_DB: banle_dev
      POSTGRES_USER: banle_user
      POSTGRES_PASSWORD: banle_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: banle_redis_dev
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

#### Production Environment
**Backend API:**
- **Domain:** api.banle.com
- **Port:** 443 (HTTPS)
- **Database:** PostgreSQL (managed service - AWS RDS/DigitalOcean)
- **Redis:** Managed Redis (AWS ElastiCache/DigitalOcean)
- **Environment Variables:**
  ```
  NODE_ENV=production
  PORT=8082
  DATABASE_URL=postgresql://user:password@prod-db-host:5432/banle_prod
  REDIS_URL=redis://prod-redis-host:6379
  JWT_SECRET=strong_random_secret_key_generate_securely
  JWT_EXPIRES_IN=7d
  API_BASE_URL=https://api.banle.com
  FRONTEND_URL=https://app.banle.com
  PORTAL_URL=https://portal.banle.com
  CORS_ORIGIN=https://app.banle.com,https://portal.banle.com
  
  # File Storage
  AWS_S3_BUCKET=banle-prod-assets
  AWS_REGION=ap-southeast-1
  AWS_ACCESS_KEY_ID=your_access_key
  AWS_SECRET_ACCESS_KEY=your_secret_key
  
  # Third-party Services
  GOOGLE_MAPS_API_KEY=your_prod_key
  VNPAY_TMN_CODE=your_vnpay_code
  VNPAY_SECRET_KEY=your_vnpay_secret
  MOMO_PARTNER_CODE=your_momo_code
  MOMO_ACCESS_KEY=your_momo_key
  SENDGRID_API_KEY=your_sendgrid_key
  TWILIO_ACCOUNT_SID=your_twilio_sid
  TWILIO_AUTH_TOKEN=your_twilio_token
  ```

**Customer Frontend (FE):**
- **Domain:** app.banle.com
- **CDN:** CloudFlare
- **Environment Variables:**
  ```
  VITE_APP_ENV=production
  VITE_API_BASE_URL=https://api.banle.com/api
  VITE_GOOGLE_MAPS_API_KEY=your_prod_key
  VITE_APP_NAME=BanLe
  ```

**Admin Portal:**
- **Domain:** portal.banle.com
- **CDN:** CloudFlare
- **Environment Variables:**
  ```
  VITE_APP_ENV=production
  VITE_API_BASE_URL=https://api.banle.com/api
  VITE_GOOGLE_MAPS_API_KEY=your_prod_key
  VITE_APP_NAME=BanLe Merchant Portal
  ```

#### Environment Files Structure
```
# Backend
be/
├── .env.development
├── .env.production
├── .env.example
└── src/config/env.ts

# Frontend
fe/
├── .env.development
├── .env.production
└── .env.example

# Portal
portal/
├── .env.development
├── .env.production
└── .env.example
```

#### Running Development Environment
```bash
# Start databases with Docker Compose
docker-compose up -d

# Backend
cd be
npm install
npm run dev  # Runs on port 8082

# Customer Frontend (new terminal)
cd fe
npm install
npm run dev  # Runs on port 3001

# Admin Portal (new terminal)
cd portal
npm install
npm run dev  # Runs on port 3002
```

#### Environment-specific Configuration
**Backend (src/config/env.ts):**
```typescript
export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8082', 10),
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  database: {
    url: process.env.DATABASE_URL!,
  },
  redis: {
    url: process.env.REDIS_URL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [],
  },
};
```

**Frontend (src/core/config/env.ts):**
```typescript
export const config = {
  env: import.meta.env.VITE_APP_ENV || 'development',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
};
```

---

## Deployment Architecture

### 36. Production Environment
```
┌─────────────────┐
│   CloudFlare    │  (CDN + DDoS Protection)
│   DNS & CDN     │
└────────┬────────┘
         │
         ├──────────────────────────────┐
         │                              │
┌────────▼────────┐            ┌────────▼────────┐
│ app.banle.com   │            │portal.banle.com │
│ (Customer PWA)  │            │ (Admin Portal)  │
│   Port: 443     │            │   Port: 443     │
└─────────────────┘            └─────────────────┘
         │                              │
         └──────────────┬───────────────┘
                        │
                ┌───────▼────────┐
                │api.banle.com   │
                │  (Backend API) │
                │   Port: 443    │
                └───────┬────────┘
                        │
                ┌───────▼────────┐
                │ Load Balancer  │  (Nginx/AWS ALB)
                └───────┬────────┘
                        │
                   ┌────┴────┐
                   │         │
               ┌───▼──┐  ┌──▼───┐
               │ App  │  │ App  │  (Docker containers - Port 8082)
               │Node 1│  │Node 2│
               └───┬──┘  └──┬───┘
                   │        │
    └────┬───┘
         │
┌────────▼────────┐
│   PostgreSQL    │  (Master-Replica)
│   with PostGIS  │
└─────────────────┘
         │
┌────────▼────────┐
│     Redis       │  (Cache & Sessions)
└─────────────────┘
```

**Hosting Options:**
- **Cloud:** AWS, Google Cloud, Azure
- **VPS:** DigitalOcean, Linode, Vultr
- **Container:** Docker + Kubernetes
- **Database:** RDS, Cloud SQL, hoặc self-hosted
- **File Storage:** AWS S3, Google Cloud Storage
- **CDN:** CloudFlare, AWS CloudFront

**Port Mapping:**
- Development:
  - Backend: localhost:8082
  - Customer FE: localhost:3001
  - Admin Portal: localhost:3002
- Production:
  - Backend internal: 8082 (behind load balancer on port 443)
  - Customer FE: Static files served via CDN (port 443)
  - Admin Portal: Static files served via CDN (port 443)

---

## Security Checklist

### 37. Security Best Practices
- [ ] HTTPS only
- [ ] Strong password policy (min 8 chars, uppercase, lowercase, number, special char)
- [ ] Rate limiting on API endpoints
- [ ] JWT with short expiration + refresh token
- [ ] Input validation & sanitization
- [ ] SQL injection prevention
- [ ] XSS protection (Content Security Policy)
- [ ] CSRF protection
- [ ] Secure headers (Helmet.js)
- [ ] Environment variables for secrets
- [ ] API key rotation
- [ ] Regular security updates
- [ ] Penetration testing
- [ ] GDPR compliance (if applicable)

---

## Monitoring & Maintenance

## Monitoring & Maintenance

### 38. Monitoring Tools
- **Application Monitoring:** New Relic, Datadog, AppSignal
- **Error Tracking:** Sentry
- **Log Management:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **Uptime Monitoring:** UptimeRobot, Pingdom
- **Performance:** Google Lighthouse, WebPageTest

### 39. Maintenance Tasks
- **Daily:**
  - Check error logs
  - Monitor system health
  
- **Weekly:**
  - Review performance metrics
  - Database cleanup
  
- **Monthly:**
  - Security patches
  - Database backup verification
  - Dependency updates
  
- **Quarterly:**
  - Performance audit
  - Security audit
  - Cost optimization

---

## Budget Estimation (Dự Toán)

### 40. Development Cost (Approx.)
- Backend Development: 200-250 hours
- Customer Frontend: 180-200 hours
- Admin Portal: 180-200 hours
- Testing & QA: 80-100 hours
- DevOps & Deployment: 40-50 hours
- **Total:** 680-800 hours

### 41. Infrastructure Cost (Monthly)
- VPS/Cloud Server: $50-150
- Database: $30-100
- File Storage: $10-50
- CDN: $20-50
- Email Service: $10-30
- SMS Service: $20-50 (usage-based)
- Monitoring: $20-50
- **Total:** $160-480/month

### 42. Third-Party Services
- Google Maps API: ~$200/month (depending on usage)
- Payment Gateway: Transaction fees (1.5-3%)
- Domain & SSL: $15-50/year

---

## Success Metrics (KPIs)

### 43. Key Performance Indicators
- **Technical:**
  - API response time < 500ms
  - Page load time < 3s
  - Uptime > 99.9%
  - Error rate < 0.1%

- **Business:**
  - Number of registered merchants
  - Number of active stores
  - Number of products listed
  - Number of orders/day
  - GMV (Gross Merchandise Value)
  - Customer retention rate
  - Average order value
  - Conversion rate

- **User Experience:**
  - User satisfaction score (CSAT)
  - Net Promoter Score (NPS)
  - App store ratings
  - Time to first order

---

## Future Enhancements (Roadmap)

### 44. Phase 2 Features
- [ ] Mobile apps (iOS & Android - React Native)
- [ ] Real-time order tracking with GPS
- [ ] In-app chat (Customer ↔ Merchant)
- [ ] Loyalty program & points system
- [ ] Referral program
- [ ] Flash sales & limited time offers
- [ ] Pre-order functionality
- [ ] Subscription orders (weekly/monthly)
- [ ] Multi-vendor marketplace
- [ ] Delivery partner integration (Grab, Gojek, etc.)
- [ ] AI-powered product recommendations
- [ ] Voice search
- [ ] AR product preview
- [ ] Social media integration (Share products)
- [ ] Wishlist & favorites
- [ ] Price comparison across stores
- [ ] Inventory forecasting
- [ ] Advanced analytics & BI dashboard

---

## Appendix

### 45. Glossary
- **PWA**: Progressive Web App
- **GMV**: Gross Merchandise Value (tổng giá trị hàng hóa)
- **AOV**: Average Order Value (giá trị đơn hàng trung bình)
- **CLV**: Customer Lifetime Value
- **COD**: Cash On Delivery
- **SKU**: Stock Keeping Unit
- **PostGIS**: PostgreSQL extension cho geospatial data

### 46. References
- Google Maps Platform Documentation
- React PWA Best Practices
- PostgreSQL PostGIS Documentation
- REST API Design Guidelines
- OAuth 2.0 Specification
- Payment Gateway Integration Guides

---

## Document Control

**Version:** 1.0  
**Last Updated:** January 27, 2026  
**Author:** Development Team  
**Status:** Draft  

**Approval:**
- [ ] Product Owner
- [ ] Technical Lead
- [ ] Project Manager

---

**END OF DOCUMENT**

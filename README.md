# Travel Tour Vietnam 🏖️

Một ứng dụng web toàn diện để tìm kiếm, đặt tour du lịch và quản lý du lịch tại Việt Nam. Hệ thống cung cấp giao diện dành cho khách hàng và bảng điều khiển quản trị viên.

## 📋 Mô Tả Dự Án

**Travel Tour Vietnam** là một nền tảng e-commerce chuyên về tour du lịch trong nước, cho phép:
- Khách hàng tìm kiếm, xem chi tiết và đặt tour du lịch
- Quản lý giỏ hàng và thực hiện thanh toán
- Theo dõi đơn hàng và lịch sử mua sắm
- Nhân viên quản lý đơn hàng, tour, danh mục, người dùng
- Quản trị viên kiểm soát toàn bộ hệ thống

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Node.js & Express.js** - Framework web server
- **MongoDB & Mongoose** - Cơ sở dữ liệu và ODM
- **JWT (jsonwebtoken)** - Xác thực người dùng
- **Bcryptjs** - Mã hóa mật khẩu
- **Nodemailer** - Gửi email
- **Cloudinary** - Lưu trữ ảnh trên cloud
- **Multer** - Xử lý upload file

### Frontend
- **Pug (Jade)** - Template engine
- **Express Static** - Phục vụ file tĩnh
- **Bootstrap/CSS** - Styling giao diện

### Tools & Utilities
- **Joi** - Validation dữ liệu
- **Dotenv** - Quản lý biến môi trường
- **Moment & Moment Timezone** - Xử lý thời gian
- **Slugify** - Tạo slug URL
- **Nodemon** - Tự động reload server

## 📁 Cấu Trúc Thư Mục

```
project-1/
├── config/                          # Cấu hình ứng dụng
│   ├── database.config.js          # Kết nối MongoDB
│   └── variable.config.js          # Biến toàn cục
├── controllers/                     # Logic xử lý
│   ├── admin/                      # API admin
│   └── client/                     # API khách hàng
├── middlewares/                     # Middleware
│   ├── admin/                      # Middleware admin
│   └── client/                     # Middleware khách hàng
├── models/                          # Schema MongoDB
│   ├── accounts-admin.model.js     # Tài khoản admin
│   ├── category.model.js           # Danh mục tour
│   ├── city.model.js               # Thành phố
│   ├── contact.model.js            # Liên hệ
│   ├── order.model.js              # Đơn hàng
│   ├── otp-password.model.js       # OTP đặt lại mật khẩu
│   ├── role.model.js               # Quyền hạn
│   ├── sale.model.js               # Khuyến mãi
│   ├── tours.model.js              # Tour du lịch
│   └── web-info.model.js           # Thông tin website
├── routes/                          # Định tuyến API
│   ├── admin/                      # Routes admin
│   │   ├── account-admin.route.js  # Quản lý tài khoản admin
│   │   ├── tour.route.js           # Quản lý tour
│   │   ├── order.route.js          # Quản lý đơn hàng
│   │   ├── category.route.js       # Quản lý danh mục
│   │   ├── user.route.js           # Quản lý người dùng
│   │   ├── contact.route.js        # Quản lý liên hệ
│   │   ├── dashboard.route.js      # Dashboard
│   │   ├── setting.route.js        # Cài đặt
│   │   ├── profile.route.js        # Hồ sơ admin
│   │   └── upload.route.js         # Upload file
│   └── client/                     # Routes khách hàng
│       ├── home.route.js           # Trang chủ
│       ├── tour.route.js           # Danh sách tour
│       ├── category.route.js       # Danh mục tour
│       ├── cart.route.js           # Giỏ hàng
│       ├── order.route.js          # Đặt hàng
│       ├── contact.route.js        # Liên hệ
│       └── search.route.js         # Tìm kiếm
├── views/                           # Template Pug
│   ├── admin/                      # Giao diện admin
│   └── client/                     # Giao diện khách hàng
├── public/                          # File tĩnh
│   ├── admin/                      # Assets admin
│   └── assets/                     # Assets khách hàng
├── validates/                       # Validation logic
├── helpers/                         # Hàm hỗ trợ
├── index.js                        # Entry point
├── package.json                    # Dependencies
├── .env                            # Biến môi trường
└── .example.env                    # Template .env
```

## 🗂️ Models (MongoDB)

### Tour (tours)
```javascript
{
  name: String,                  // Tên tour
  category: String,              // Danh mục
  avatar: String,                // Ảnh đại diện
  images: Array,                 // Danh sách ảnh
  priceAdult: Number,            // Giá người lớn
  priceChildren: Number,         // Giá trẻ em
  priceBaby: Number,             // Giá em bé
  stockAdult: Number,            // Số chỗ người lớn
  stockChildren: Number,         // Số chỗ trẻ em
  stockBaby: Number,             // Số chỗ em bé
  locations: Array,              // Địa điểm tham quan
  departureDate: Date,           // Ngày khởi hành
  vehicle: String,               // Phương tiện vận chuyển
  schedules: Array,              // Lịch trình chi tiết
  information: String,           // Thông tin mô tả
  status: String,                // Trạng thái (active/inactive)
  slug: String,                  // URL slug
  deleted: Boolean,              // Soft delete flag
}
```

### Order (orders)
```javascript
{
  code: String,                  // Mã đơn hàng
  fullName: String,              // Tên khách hàng
  phone: String,                 // Số điện thoại
  email: String,                 // Email
  items: Array,                  // Danh sách tour đặt
  total: Number,                 // Tổng tiền
  paymentMethod: String,         // Phương thức thanh toán
  paymentStatus: String,         // Trạng thái thanh toán
  status: String,                // Trạng thái đơn (pending/confirmed/completed)
  note: String,                  // Ghi chú
  deleted: Boolean,              // Soft delete flag
}
```

### Account Admin (accounts-admin)
```javascript
{
  fullName: String,              // Tên đầy đủ
  email: String,                 // Email
  phone: String,                 // Số điện thoại
  role: String,                  // Vai trò
  positionCompany: String,       // Vị trí công ty
  password: String,              // Mật khẩu (hash)
  avatar: String,                // Ảnh đại diện
  status: String,                // Trạng thái (active/inactive)
  slug: String,                  // URL slug
  deleted: Boolean,              // Soft delete flag
}
```

### Category, City, Contact, Sale, Web-Info
Các model phụ trợ khác để quản lý danh mục, thành phố, thông tin liên hệ, khuyến mãi và thông tin website.

## 🚀 Cài Đặt & Khởi Chạy

### Yêu Cầu Hệ Thống
- Node.js >= 14.x
- npm hoặc yarn
- MongoDB
- Tài khoản Cloudinary (tùy chọn, để upload ảnh)

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd project-1
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
# hoặc
yarn install
```

### Bước 3: Cấu Hình Biến Môi Trường
Sao chép file `.example.env` thành `.env`:
```bash
cp .example.env .env
```

Chỉnh sửa `.env` với thông tin của bạn:
```env
DATABASE=mongodb+srv://username:password@cluster0.lstqvtt.mongodb.net/project-1
JWT_SECRET=your_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_APP=your_app_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_APIKEY=your_api_key
CLOUDINARY_APISECRET=your_api_secret
```

### Bước 4: Khởi Chạy Server
```bash
npm start
# Server sẽ chạy tại http://localhost:3000
```

**Lưu ý:** Sử dụng `nodemon` tự động reload khi thay đổi code.

## 📚 API Endpoints

### Admin Routes (Đòi hỏi xác thực JWT)
```
POST   /admin/account/login              # Đăng nhập
GET    /admin/dashboard                  # Xem dashboard
GET    /admin/tour                       # Danh sách tour
POST   /admin/tour/create                # Tạo tour
PUT    /admin/tour/:id                   # Cập nhật tour
DELETE /admin/tour/:id                   # Xóa tour
GET    /admin/order                      # Danh sách đơn hàng
PUT    /admin/order/:id                  # Cập nhật đơn hàng
GET    /admin/category                   # Danh sách danh mục
GET    /admin/user                       # Danh sách người dùng
GET    /admin/contact                    # Quản lý liên hệ
PUT    /admin/setting                    # Cập nhật cài đặt
```

### Client Routes (Công khai)
```
GET    /                                 # Trang chủ
GET    /tour                             # Danh sách tour
GET    /tour/:slug                       # Chi tiết tour
GET    /category/:slug                   # Tour theo danh mục
GET    /search                           # Tìm kiếm tour
GET    /cart                             # Xem giỏ hàng
POST   /cart/add                         # Thêm tour vào giỏ
POST   /order                            # Đặt hàng
POST   /contact                          # Gửi liên hệ
```

## 🔐 Xác Thực & Bảo Mật

- **JWT (JSON Web Token)** được sử dụng để xác thực admin
- **Bcryptjs** để mã hóa mật khẩu
- **Soft Delete** - Dữ liệu không bị xóa vĩnh viễn, chỉ đánh dấu `deleted: true`
- **Role-based Access Control** - Phân quyền theo vai trò

## 📧 Email Configuration

Ứng dụng sử dụng **Nodemailer** để gửi email:
- Hỗ trợ gửi OTP đặt lại mật khẩu
- Gửi xác nhận đơn hàng
- Gửi thông báo liên hệ

**Cấu hình Gmail:**
1. Bật 2-factor authentication
2. Tạo App Password
3. Sử dụng App Password trong `.env`

## 🖼️ Quản Lý Ảnh

Sử dụng **Cloudinary** để lưu trữ ảnh:
- Upload ảnh tour
- Lưu avatar người dùng
- Tối ưu hóa ảnh tự động

## 📊 Tính Năng Chính

### Cho Khách Hàng
✅ Xem danh sách tour  
✅ Tìm kiếm và lọc tour  
✅ Xem chi tiết tour (lịch trình, giá, địa điểm)  
✅ Thêm tour vào giỏ hàng  
✅ Quản lý giỏ hàng  
✅ Thanh toán trực tuyến  
✅ Theo dõi đơn hàng  
✅ Liên hệ với quản trị viên  

### Cho Quản Trị Viên
✅ Dashboard với thống kê  
✅ Quản lý tour (CRUD)  
✅ Quản lý danh mục tour  
✅ Quản lý đơn hàng  
✅ Quản lý người dùng  
✅ Quản lý tài khoản admin  
✅ Xem liên hệ từ khách hàng  
✅ Cài đặt thông tin website  

## 🔄 Workflow

### Đặt Hàng
1. Khách hàng tìm kiếm tour
2. Xem chi tiết tour
3. Thêm tour vào giỏ hàng
4. Checkout giỏ hàng
5. Điền thông tin và thanh toán
6. Đơn hàng được tạo (pending)
7. Admin xác nhận đơn hàng

### Quản Lý Tour
1. Admin đăng nhập
2. Truy cập Quản lý Tour
3. Tạo/Sửa/Xóa tour
4. Cập nhật lịch trình, giá, ảnh
5. Kích hoạt/vô hiệu hóa tour

## 🐛 Xử Lý Lỗi

- **Validation Error** - Dữ liệu không hợp lệ
- **Authentication Error** - Không đăng nhập hoặc token hết hạn
- **Authorization Error** - Không có quyền truy cập
- **Not Found** - Tài nguyên không tìm thấy
- **Server Error** - Lỗi máy chủ

## 🚀 Deployment

### Heroku
```bash
heroku create app-name
heroku config:set DATABASE=your_mongodb_uri
git push heroku main
```

### Railway/Render
Tương tự Heroku, chỉ cần set environment variables qua dashboard.

## 📝 Ghi Chú

- Ứng dụng sử dụng **Pug** (Jade) cho frontend, phù hợp cho SSR
- **Multer** kết hợp với **Cloudinary** để upload ảnh an toàn
- **Mongoose Slug Updater** tự động tạo URL slug từ tên
- Sử dụng **Soft Delete** để bảo mật dữ liệu lịch sử

## 🤝 Đóng Góp

Để đóng góp vào dự án:
1. Fork repository
2. Tạo branch tính năng (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 Giấy Phép

Dự án này được cấp phép dưới [MIT License](LICENSE)

## 📞 Liên Hệ & Hỗ Trợ

Nếu bạn có câu hỏi hoặc cần hỗ trợ, vui lòng:
- Tạo Issue trên GitHub
- Gửi email đến team hỗ trợ
- Sử dụng form liên hệ trên website

## 🎯 Roadmap

- [ ] Tích hợp thanh toán VNPay/Stripe
- [ ] Thêm hệ thống review/rating
- [ ] Gửi email xác nhận đơn hàng tự động
- [ ] Mobile app
- [ ] Chatbot hỗ trợ khách hàng
- [ ] Hệ thống loyalty points
- [ ] Đặt tour lặp lại

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** In Development ✨

# Circasku - Hệ thống Quản lý Sản phẩm

Hệ thống quản lý sản phẩm với đầy đủ chức năng CRUD (Create, Read, Update, Delete) sử dụng Next.js 15, TypeScript, Tailwind CSS và MongoDB Atlas.

## Tính năng

- ✅ **Create**: Thêm sản phẩm mới với tên và loại tem
- ✅ **Read**: Hiển thị danh sách tất cả sản phẩm
- ✅ **Update**: Chỉnh sửa thông tin sản phẩm
- ✅ **Delete**: Xóa sản phẩm với xác nhận
- ✅ **Responsive Design**: Giao diện đẹp, tương thích mọi thiết bị
- ✅ **Real-time Updates**: Cập nhật dữ liệu theo thời gian thực
- ✅ **Error Handling**: Xử lý lỗi và hiển thị thông báo

## Cấu trúc Dữ liệu

Mỗi sản phẩm bao gồm:
- **ID**: Tự động tạo bởi MongoDB
- **Product_name**: Tên sản phẩm (bắt buộc)
- **Tag_type**: Loại tem (Chưa xác định, tem thường, tem gập)
- **CreatedAt**: Thời gian tạo
- **UpdatedAt**: Thời gian cập nhật cuối

## Cài đặt

1. **Clone repository:**
```bash
git clone <repository-url>
cd circasku
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Tạo file .env.local:**
```env
MONGODB_URI=mongodb+srv://admin:Abc123@thanhyarn.imdlw.mongodb.net/circasku?retryWrites=true&w=majority&appName=thanhyarn
```

4. **Chạy ứng dụng:**
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Cấu trúc Project

```
src/
├── app/
│   ├── api/
│   │   └── products/
│   │       ├── route.ts          # API endpoints (GET, POST)
│   │       └── [id]/route.ts     # API endpoints (GET, PUT, DELETE) theo ID
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ProductForm.tsx           # Form thêm/chỉnh sửa sản phẩm
│   ├── ProductList.tsx           # Danh sách sản phẩm
│   └── ProductManager.tsx        # Component chính quản lý CRUD
├── lib/
│   └── mongodb.ts                # Kết nối MongoDB
└── models/
    └── Product.ts                # Model Product với Mongoose
```

## API Endpoints

### Products
- `GET /api/products` - Lấy tất cả sản phẩm
- `POST /api/products` - Tạo sản phẩm mới
- `GET /api/products/[id]` - Lấy sản phẩm theo ID
- `PUT /api/products/[id]` - Cập nhật sản phẩm
- `DELETE /api/products/[id]` - Xóa sản phẩm

## Công nghệ sử dụng

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas với Mongoose ODM
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: Tailwind CSS với responsive design

## Tính năng nâng cao

- **Loading States**: Hiển thị trạng thái loading khi thực hiện API calls
- **Error Handling**: Xử lý và hiển thị lỗi một cách thân thiện
- **Form Validation**: Kiểm tra dữ liệu đầu vào
- **Confirmation Dialogs**: Xác nhận trước khi xóa
- **Auto-refresh**: Tự động cập nhật danh sách sau khi thay đổi
- **Responsive Table**: Bảng responsive với horizontal scroll

## Hướng dẫn sử dụng

1. **Thêm sản phẩm mới:**
   - Click nút "Thêm Sản phẩm mới"
   - Điền tên sản phẩm (bắt buộc)
   - Chọn loại tem
   - Click "Thêm mới"

2. **Chỉnh sửa sản phẩm:**
   - Click nút "Chỉnh sửa" trong danh sách
   - Thay đổi thông tin cần thiết
   - Click "Cập nhật"

3. **Xóa sản phẩm:**
   - Click nút "Xóa" trong danh sách
   - Xác nhận trong hộp thoại
   - Sản phẩm sẽ bị xóa vĩnh viễn

## Lưu ý

- Đảm bảo MongoDB Atlas đang hoạt động và có thể kết nối
- Kiểm tra file `.env.local` có thông tin kết nối đúng
- Sử dụng Node.js version 18+ để tương thích với Next.js 15

## Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Console logs trong browser
2. Terminal logs khi chạy `npm run dev`
3. Kết nối MongoDB Atlas
4. Cấu hình file `.env.local`

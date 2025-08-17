# Tách Rời Token User và Admin

## Vấn đề trước đây

Trước khi cải tiến, hệ thống sử dụng chung một key `token` trong localStorage cho cả user thường và admin. Điều này gây ra tình trạng:

- Đăng nhập user thường ở route `/` → token được lưu vào `localStorage.setItem('token', 'user-token')`
- Khi vào route `/admin` → hệ thống kiểm tra cùng key `token` đó và có thể nhầm lẫn với admin token
- Tương tự, admin đăng nhập ở `/admin` có thể bị nhầm là user thường ở `/`

## Giải pháp đã triển khai

### 1. Token Utils (`src/utils/tokenUtils.js`)
- Tạo utility quản lý token riêng biệt:
  - `user_token`: cho user thường truy cập route `/`
  - `admin_token`: cho admin truy cập route `/admin`
- Đảm bảo khi set token này sẽ clear token kia để tránh conflict
- Có function migration để chuyển đổi token cũ

### 2. Admin Auth API riêng (`src/API/apiAdminAuth.js`)
- API riêng cho admin authentication
- Chỉ sử dụng `admin_token`
- Interceptors riêng để xử lý admin-specific logic

### 3. Admin Auth Context riêng (`src/contexts/AdminAuthContext.jsx`)
- Context riêng cho admin, tách biệt hoàn toàn với user context
- Quản lý state admin riêng

### 4. Cập nhật User Auth (`src/API/apiAuth.js`, `src/contexts/AuthContext.jsx`)
- Chỉ sử dụng `user_token`
- Đảm bảo admin không thể đăng nhập vào user context

## Cách hoạt động

### Route `/` (User)
1. Sử dụng `AuthContext` và `AuthAPI`
2. Token được lưu vào `user_token`
3. Chỉ cho phép user role, từ chối admin role

### Route `/admin` (Admin)
1. Sử dụng `AdminAuthContext` và `AdminAuthAPI`
2. Token được lưu vào `admin_token`
3. Chỉ cho phép admin role

### Token Debug Component
- Component `TokenDebugInfo` hiển thị trạng thái token hiện tại
- Giúp debug và kiểm tra tình trạng tách biệt token
- Hiển thị ở góc dưới bên phải màn hình

## Migration
- Hệ thống tự động migration token cũ sang token mới khi load
- Token cũ sẽ được chuyển thành `user_token` hoặc `admin_token` tùy theo nội dung
- Clear token cũ sau khi migration

## Lợi ích

1. **Tách biệt hoàn toàn**: User và admin không thể truy cập cross-route
2. **Security**: Mỗi role có token riêng, giảm nguy cơ privilege escalation
3. **Clear separation**: Code admin và user tách biệt rõ ràng
4. **Easy debugging**: Debug component giúp kiểm tra trạng thái token

## Test Cases

1. **Đăng nhập user ở `/`**:
   - Chỉ có `user_token`, không có `admin_token`
   - Vào `/admin` sẽ thấy trang login admin

2. **Đăng nhập admin ở `/admin`**:
   - Chỉ có `admin_token`, không có `user_token`
   - Vào `/` sẽ thấy trang login user

3. **Switch giữa các role**:
   - Đăng nhập role mới sẽ tự động clear token role cũ
   - Không thể đồng thời authenticated cả user và admin

4. **Migration**:
   - Token cũ được tự động chuyển đổi
   - Hệ thống hoạt động bình thường với user đã đăng nhập trước đó

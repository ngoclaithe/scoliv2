# 🏗️ Hệ Thống Route Dynamic - Điều Khiển Từ Xa

## 📋 Tổng Quan

Hệ thống cho phép **Client1 (Admin)** điều khiển giao diện hiển thị trên **Client2 (Display)** thông qua route dynamic `/:accessCode` bằng Socket.IO.

## 🎯 Kiến Trúc Hệ Thống

```
┌─────────────────┐    Socket.IO    ┌─────────────────┐    Socket.IO    ┌─────────────────┐
│   Client1       │ ──────────────► │     Server      │ ──────────────► │   Client2       │
│   (Admin)       │                 │   (Backend)     │                 │   (Display)     │
���   /             │                 │                 │                 │ /:accessCode    │
└─────────────────┘                 └─────────────────┘                 └─────────────────┘
```

## 🏠 Client1 - Giao Diện Admin

### URL: `/`

**3 Tab Chính:**
1. **🏆 UPLOAD LOGO** - Quản lý logo đội bóng và nhà tài trợ
2. **⚽ QUẢN LÝ TRẬN** - Điều khiển trận đấu và view hiển thị  
3. **🎙️ BÌNH LUẬN** - Quản lý audio và bình luận

### Các Button Điều Khiển View:

#### Tab "QUẢN LÝ TRẬN":
- **🏆 GIỚI THIỆU**: Chuyển Client2 sang component `Intro.jsx`
- **🥤 NGHỈ GIỮA HIỆP**: Chuyển Client2 sang component `HalfTime.jsx`
- **🖼️ POSTER**: 
  - Chọn "Poster Tre Trung" → `PosterTreTrung.jsx`
  - Chọn "Poster Hao Quang" → `PosterHaoQuang.jsx`
- **📊 TỈ SỐ DƯỚI**: Chuyển Client2 sang `ScoreboardAbove.jsx`
- **🎨 TEMPLATE**: Đổi template/skin hiển thị

## 📺 Client2 - Giao Diện Hiển Thị

### URL: `/:accessCode` (ví dụ: `/DEMO123`)

**Component Controller**: `DisplayController.jsx`

**Các View Có Thể Hiển Thị:**
- `poster` (mặc định): Hiển thị poster theo loại đã chọn
- `intro`: Component giới thiệu trận đấu (`Intro.jsx`)
- `halftime`: Component nghỉ giữa hiệp (`HalfTime.jsx`)
- `scoreboard`: Bảng tỉ số (`ScoreboardAbove.jsx`)

## 🔄 Luồng Giao Tiếp

### 1. Khởi Tạo:
```javascript
// Client2 kết nối với accessCode
await socketService.connect(accessCode);
```

### 2. Admin Thực Hiện Hành Động:
```javascript
// Client1 gửi lệnh thay đổi view
updateView('intro'); // hoặc 'halftime', 'poster', 'scoreboard'
```

### 3. Socket Events:
```javascript
// Server nhận và broadcast
socket.emit('view_update', { viewType: 'intro' });

// Client2 nhận và cập nhật
socketService.on('view_updated', (data) => {
  setCurrentView(data.viewType);
});
```

## 🛠️ Implementation

### Socket Service Events:

```javascript
// Gửi từ Client1
socketService.updateView(viewType);

// Nhận tại Client2
socketService.on('view_updated', callback);
```

### Context Updates:

#### MatchContext (Client1):
```javascript
const updateView = useCallback((viewType) => {
  if (socketConnected) {
    socketService.emit('view_update', { viewType });
  }
}, [socketConnected]);
```

#### PublicMatchContext (Client2):
```javascript
const [currentView, setCurrentView] = useState('poster');

socketService.on('view_updated', (data) => {
  setCurrentView(data.viewType);
  setLastUpdateTime(Date.now());
});
```

## 📱 Components Map

| Button Click (Client1) | View Type | Component (Client2) |
|------------------------|-----------|---------------------|
| 🏆 GIỚI THIỆU | `intro` | `Intro.jsx` |
| 🥤 NGHỈ GIỮA HIỆP | `halftime` | `HalfTime.jsx` |
| 🖼️ Poster Tre Trung | `poster` | `PosterTreTrung.jsx` |
| 🖼️ Poster Hao Quang | `poster` | `PosterHaoQuang.jsx` |
| 📊 TỈ SỐ DƯỚI | `scoreboard` | `ScoreboardAbove.jsx` |

## 🎮 Cách Sử Dụng

### Bước 1: Đăng nhập Admin
1. Truy cập `/`
2. Nhập access code (ví dụ: `DEMO123`)

### Bước 2: Mở Display
1. Truy cập `/:accessCode` (ví dụ: `/DEMO123`)
2. Màn hình sẽ hiển thị poster mặc định

### Bước 3: Điều khiển
1. Từ Admin, chọn tab "QUẢN LÝ TRẬN"
2. Click vào các button để thay đổi view:
   - **GIỚI THIỆU** → Màn hình Display chuyển sang giới thiệu
   - **NGHỈ GIỮA HIỆP** → Hiển thị nghỉ giữa hiệp
   - **POSTER** → Chọn loại poster
   - **TỈ SỐ DƯỚI** → Hiển thị bảng tỉ số

## 🔧 Debugging

### Connection Status:
- Client2 hiển thị trạng thái kết n���i ở góc trên phải
- Kiểm tra console để xem log events

### Development Mode:
- Client2 hiển thị debug info ở góc dưới trái
- Xem current view, poster type, template, socket status

## 🚀 Mở Rộng

### Thêm View Mới:
1. Tạo component mới
2. Thêm case vào `DisplayController.jsx`
3. Thêm button ở Admin
4. Update `updateView()` call

### Thêm Socket Events:
1. Định nghĩa event trong `socketService.js`
2. Thêm listener trong Context
3. Gửi từ Admin khi cần

## 📋 Todo List

- [x] Tạo DisplayController
- [x] Cập nhật PublicMatchContext với currentView
- [x] Thêm updateView vào MatchContext
- [x] Cập nhật MatchManagementSection với buttons
- [x] Thêm button "Nghỉ giữa hiệp"
- [x] Cập nhật route để dùng DisplayController
- [x] Tạo NewHomeLayout với 3 tab
- [ ] Test toàn bộ luồng
- [ ] Tối ưu UI/UX
- [ ] Thêm animations chuyển view
- [ ] Error handling khi mất kết nối

## 📞 Hỗ Trợ

Nếu có vấn đề, kiểm tra:
1. Socket connection status
2. Console logs
3. Access code hợp lệ
4. Network connectivity

---
*Cập nhật lần cuối: ${new Date().toLocaleString('vi-VN')}*

# Hướng Dẫn Test Flow Audio Control

## Mô tả chức năng
Khi ở giao diện Home (admin) ấn nút Audio ON/OFF, server sẽ gửi lệnh xuống các display clients để bật/tắt audio và ngắt ngay audio đang phát.

## Flow hoạt động

### 1. Từ Home (Admin)
- User ấn nút Audio ON/OFF trong MatchManagementSection
- `toggleAudioEnabled()` được gọi trong AudioContext
- AudioContext gọi `socketService.enableAudioForDisplays()` hoặc `disableAudioForDisplays()`
- SocketService emit event `audio_control_broadcast` với:
  ```javascript
  {
    command: 'ENABLE_AUDIO' | 'DISABLE_AUDIO',
    target: 'display',
    senderType: 'admin',
    timestamp: Date.now()
  }
  ```

### 2. Server xử lý
- Server nhận `audio_control_broadcast` event
- Server forward event này thành `audio_control` đến các clients có `clientType === 'display'`

### 3. Tại Display (DisplayController)
- AudioContext lắng nghe event `audio_control`
- Khi nhận `DISABLE_AUDIO`:
  - Gọi `forceStopAudio()` ngay lập tức
  - Dừng audio đang phát
  - Clear pending audio queue
  - Set `audioEnabled = false`
- Khi nhận `ENABLE_AUDIO`:
  - Set `audioEnabled = true`

### 4. Logging để test
Theo dõi console log với các pattern:
- `🎵 [MatchManagement] Audio toggle clicked`
- `📡 Sending enable/disable audio to display clients`
- `📡 Received audio_control from server`
- `📡 Server command: DISABLE_AUDIO - Force stopping all audio`
- `🚫 Force stopping audio from server`
- `🎮 [DisplayController] Audio enabled changed from server`

## Cách test

### Test 1: Tắt audio
1. Mở Home (admin) và Display (/display/:accessCode) 
2. Ở Display, để có audio đang phát (vào bất kỳ view nào có audio)
3. Ở Home, ấn nút Audio để tắt (nút chuyển từ 🔊 thành 🔇)
4. **Kết quả mong đợi**: Audio ở Display dừng ngay lập tức

### Test 2: Bật audio  
1. Ở Home, ấn nút Audio để bật (nút chuyển từ 🔇 thành 🔊)
2. Ở Display, chuyển sang view kh��c có audio
3. **Kết quả mong đợi**: Audio ở Display phát bình thường

### Test 3: Multiple displays
1. Mở nhiều tab Display với cùng accessCode
2. Thực hiện Test 1 và Test 2
3. **Kết quả mong đợi**: Tất cả displays đều dừng/phát audio đồng thời

## Troubleshooting
- Nếu audio không dừng: Kiểm tra server có forward đúng target không
- Nếu lệnh không gửi: Kiểm tra socket connection và clientType
- Nếu display không nhận: Kiểm tra audio_control listener setup

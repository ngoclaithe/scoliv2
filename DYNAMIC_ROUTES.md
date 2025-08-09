# Dynamic Routes Documentation

## Giới thiệu

Hệ thống hỗ trợ dynamic routes cho phép truyền các tham số trận đấu trực tiếp qua URL và tự động cập nhật lên backend thông qua socket connection.

## Cấu trúc URL Dynamic Route

```
/{accessCode}/{location}/{matchTitle}/{liveText}/{teamA.logo.code}/{teamB.logo.code}/{teamAname}/{teamBname}/{teamAKitcolor}/{teamBKitcolor}/{teamA.score}/{teamB.score}/{view}/{matchTime}
```

### Các tham số:

1. **accessCode** - Mã truy cập phòng
2. **location** - Địa điểm thi đấu (ví dụ: "My_Dinh_Stadium")
3. **matchTitle** - Tiêu đề trận đấu (ví dụ: "V_League_2024")
4. **liveText** - Text hiển thị live (ví dụ: "LIVE_STREAMING")
5. **teamA.logo.code** - Mã logo đội A (ví dụ: "HN")
6. **teamB.logo.code** - Mã logo đội B (ví dụ: "TPHCM")
7. **teamAname** - Tên đội A (ví dụ: "Ha_Noi_FC")
8. **teamBname** - Tên đội B (ví dụ: "Ho_Chi_Minh_City")
9. **teamAKitcolor** - Màu áo đội A (hex không có #, ví dụ: "FF0000")
10. **teamBKitcolor** - Màu áo đội B (hex không có #, ví dụ: "0000FF")
11. **teamA.score** - Tỉ số đội A (số nguyên, ví dụ: "2")
12. **teamB.score** - Tỉ số đội B (số nguyên, ví dụ: "1")
13. **view** - Loại hiển thị (ví dụ: "poster", "scoreboard", "intro")
14. **matchTime** - Thời gian trận đấu (ví dụ: "45:00", "Hiep_1")

## Ví dụ URL

```
/ABC123/My_Dinh_Stadium/V_League_2024/LIVE_STREAMING/HN/TPHCM/Ha_Noi_FC/Ho_Chi_Minh_City/FF0000/0000FF/2/1
```

URL này sẽ:
- Kết nối đến phòng với access code `ABC123`
- Hiển thị địa điểm: "My Dinh Stadium"
- Tiêu đề trận đấu: "V League 2024"
- Text live: "LIVE STREAMING"
- Đội A: "Ha Noi FC" với màu áo đỏ (#FF0000), tỉ số 2, logo code "HN"
- Đội B: "Ho Chi Minh City" với màu áo xanh (#0000FF), tỉ số 1, logo code "TPHCM"

## Quy tắc encode

1. **Spaces (khoảng trắng)**: Thay thế bằng dấu gạch dưới `_`
2. **Special characters**: Sử dụng URL encoding
3. **Colors**: Ch��� hex code không có dấu # (ví dụ: FF0000 thay vì #FF0000)
4. **Numbers**: Số nguyên thuần (ví dụ: 2, không phải 2.0)

## Xử lý tự động

Khi truy cập dynamic route, hệ thống sẽ:

1. **Validate access code** - Kiểm tra mã truy cập hợp lệ
2. **Parse parameters** - Phân tích và validate tất cả tham số từ URL
3. **Initialize socket** - Kết nối socket với backend
4. **Find logos** - Tìm kiếm logo URL dựa trên logo codes (nếu có)
5. **Update backend** - Gửi tất cả dữ liệu lên backend qua socket
6. **Render view** - Hiển thị view dựa trên currentView từ backend

## Utility Functions

### `buildDynamicRoute(params)`
Tạo URL dynamic route từ object parameters:

```javascript
import { buildDynamicRoute } from '../utils/dynamicRouteUtils';

const url = buildDynamicRoute({
  accessCode: 'ABC123',
  location: 'My Dinh Stadium',
  matchTitle: 'V League 2024',
  liveText: 'LIVE STREAMING',
  teamALogoCode: 'HN',
  teamBLogoCode: 'TPHCM',
  teamAName: 'Ha Noi FC',
  teamBName: 'Ho Chi Minh City',
  teamAKitColor: '#FF0000',
  teamBKitColor: '#0000FF',
  teamAScore: 2,
  teamBScore: 1
});
// Kết quả: "/ABC123/My_Dinh_Stadium/V_League_2024/LIVE_STREAMING/HN/TPHCM/Ha_Noi_FC/Ho_Chi_Minh_City/FF0000/0000FF/2/1"
```

### `findTeamLogos(teamACode, teamBCode)`
Tìm logo URLs dựa trên codes:

```javascript
import { findTeamLogos } from '../utils/dynamicRouteUtils';

const { teamALogo, teamBLogo } = await findTeamLogos('HN', 'TPHCM');
```

## Lưu ý quan trọng

1. **Thứ tự tham số**: Phải đúng thứ tự trong URL, không thể bỏ qua tham số giữa
2. **Tham số bắt buộc**: Tất cả tham số đều bắt buộc, sử dụng giá trị mặc định nếu trống
3. **Logo codes**: Phải tồn tại trong database để tìm được logo URL
4. **Socket connection**: Cần kết nối socket thành công mới có thể cập nhật dữ liệu
5. **Error handling**: Có xử lý lỗi cho từng bước (validation, socket, logo lookup)

## Tương thích với view hiện tại

Dynamic route sẽ hiển thị view dựa trên `currentView` từ backend:
- `poster` - Hiển thị poster với các tham số đã cập nhật
- `intro` - Hiển thị màn hình giới thiệu
- `scoreboard` - Hiển thị bảng tỉ số
- `halftime` - Hiển thị màn hình giải lao
- Và các view khác...

## Testing

Để test dynamic route:

1. Tạo access code hợp lệ trong hệ thống
2. Tạo URL với các tham số mong muốn
3. Truy cập URL trong browser
4. Kiểm tra console logs để xem quá trình xử lý
5. Verify dữ liệu đã được cập nhật trên backend và hiển thị đúng

## Ví dụ thực tế

```bash
# URL với tất cả tham số
http://localhost:3000/DEMO123/My_Dinh_Stadium/V_League_2024/LIVE_NOW/HN/TPHCM/Ha_Noi_FC/Ho_Chi_Minh_City/FF0000/0000FF/2/1

# URL với tên đội có dấu (encode UTF-8)
http://localhost:3000/DEMO123/San_My_Dinh/V_League_2024/TRUC_TIEP/HN/TPHCM/H%C3%A0_N%E1%BB%99i_FC/TP_H%E1%BB%93_Ch%C3%AD_Minh/FF0000/0000FF/3/2
```

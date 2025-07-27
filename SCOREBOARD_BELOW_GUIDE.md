# 📊 Hướng Dẫn Sử Dụng Component ScoreboardBelow

## 🎯 Tổng Quan
ScoreboardBelow là component hiển thị bảng tỉ số ở phía dưới màn hình với đầy đủ tính năng tương tác, responsive design và hiệu ứng penalty đặc biệt.

## 📍 Vị Trí Trong Hệ Thống

### Route Access:
```
Admin Panel: / → Tab "QUẢN LÝ TRẬN" → Button "TỈ SỐ DƯỚI"
Display View: /:accessCode → Tự động chuyển sang scoreboard_below
```

### Integration:
```javascript
// Trong DisplayController.jsx
case 'scoreboard_below':
  return <ScoreboardBelow accessCode={accessCode} />;

// Trong MatchManagementSection.jsx  
onClick={() => {
  updateView('scoreboard_below');
  setSelectedOption("ti-so-duoi");
}}
```

## 🎨 Giao Diện & Layout

### Desktop Layout:
```
┌─────────────────────────────────────────────────────────────┐
│                     Main Content Area                       │
│                                                             │
│                                                             │
│  [NSB/BDPXT]                                         [Edit] │
│                                                             │
│                                                             │
│             ┌─────────────────────────────────┐             │
│             │ [Logo1] TEAM-A  0-0  TEAM-B [Logo2] │      │
│             │         45' - Hiệp 1           │             │
│             │      🔴 LIVE: Platform         │             │
│             │           [SCO]                │             │
│             └─────────────────────────────────┘             │
│═════════════════════════════════════���═══════════════════════│
│                    📜 Marquee Text                         │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout:
- Auto-scale từ 50% → 120% dựa trên kích thước màn hình
- Font size tự động điều chỉnh theo độ dài tên đội
- Responsive grid trong control panel

## ⚡ Tính Năng Chính

### 1. 🏆 Quản Lý Đội Bóng
```javascript
// Chỉnh sửa tên đội
- Click vào tên đội → Chế độ edit
- Gõ tên mới → Enter để lưu
- Auto-adjust font size theo độ dài tên

// Upload logo
- Click vào vùng logo → File picker
- Support: jpg, png, gif
- Auto crop thành hình tròn
```

### 2. 📊 Quản Lý Tỉ Số
```javascript
// Tỉ số chính
handleScoreUpdate(team, increment) // +1 hoặc -1
scoreboardData.score1 // Đội nhà  
scoreboardData.score2 // Đội khách

// Penalty mode
scoreboardData.penaltyMode = true
scoreboardData.penaltyScore1 // P: X
scoreboardData.penaltyScore2 // P: Y
```

### 3. 🎬 Hiệu Ứng Penalty
```javascript
// Khi ghi penalty:
1. showPenaltyAnimation = true
2. Hiển thị "⚽ GOAL! ⚽" animation
3. Auto hide sau 2 giây
4. Bounce effect + highlight
```

### 4. 🎨 Tùy Chỉnh Giao Diện
```javascript
// Màu sắc đội
color1: "#ff0000" // Đội nhà
color2: "#0000ff" // Đội khách

// Live stream
live: "FACEBOOK LIVE"
// Special logos: NSB, BDPXT, SCO

// Chữ chạy
showMarquee: true
marqueeText: "Nội dung..."
```

## 🎮 Control Panel

### Kích Hoạt Edit Mode:
1. **Button "⚙️ Edit"** (góc dưới phải)
2. **Click tên đội** để edit nhanh
3. **Click logo area** để upload

### Control Panel Sections:

#### 🔴 Team 1 (Red Section):
- Input: Team name
- Buttons: +1, -1 score
- Color picker: Team color

#### 🔵 Team 2 (Blue Section):  
- Input: Team name
- Buttons: +1, -1 score
- Color picker: Team color

#### ⏱️ Timer Controls:
- Timer: "45:30", "90+3", etc.
- Period: "Hiệp 1", "Hiệp 2", "Hiệp phụ"

#### 🥅 Penalty Controls:
- Checkbox: Enable penalty mode
- Buttons: T1 +⚽, T1 -1
- Buttons: T2 +⚽, T2 -1
- Animation: Auto trigger on goal

#### 🔴 Live Stream:
- Input: Platform name
- Auto detect: NSB, BDPXT → Special logos

#### 📜 Marquee:
- Checkbox: Enable marquee
- Input: Marquee text
- Auto scroll bottom screen

## 🎯 Responsive Features

### Auto-Scale System:
```javascript
// Base width: 800px
// Target: 50% of screen width
// Max scale: 1.2x
const targetWidth = 0.5 * windowWidth;
const newScale = Math.min(targetWidth / baseWidth, 1.2);
```

### Font Adaptation:
```javascript
// Auto adjust cho tên đội dài
adjustFontSize(text, minSize=18, maxSize=32)
// Ví dụ: "REAL MADRID CF" → 18px
// "MU" → 32px
```

### Mobile Optimizations:
- Touch-friendly buttons (min 44px)
- Scrollable control panel
- Landscape orientation support
- Gesture-friendly interactions

## 🔧 Technical Integration

### Props Interface:
```javascript
<ScoreboardBelow 
  accessCode="DEMO123"           // Required
  onTeamUpdate={handleTeam}      // Optional callback
  onScoreUpdate={handleScore}    // Optional callback  
  onLogoUpdate={handleLogo}      // Optional callback
/>
```

### Socket Events:
```javascript
// Admin gửi
updateView('scoreboard_below')

// Display nhận
socketService.on('view_updated', (data) => {
  if (data.viewType === 'scoreboard_below') {
    // Show ScoreboardBelow component
  }
});
```

### State Management:
```javascript
const [scoreboardData, setScoreboardData] = useState({
  team1: "ĐỘI A",
  team2: "ĐỘI B",
  score1: 0,
  score2: 0,
  logo1: null,
  logo2: null,
  timer: "00:00",
  period: "Chưa bắt đầu", 
  penaltyMode: false,
  penaltyScore1: 0,
  penaltyScore2: 0,
  showPenaltyAnimation: false
});
```

## 🎨 Styling & Animations

### CSS Classes:
```css
/* Main container */
.fixed.bottom-8.left-1/2 → Bottom center positioned

/* Scoreboard */
.bg-gradient-to-r.from-blue-900.via-gray-800.to-blue-900 → Gradient background
.rounded-xl.border-4.border-yellow-400 → Rounded corners + gold border

/* Penalty animation */
.animate-bounce → Goal celebration
.bg-yellow-400.text-black → High contrast alert

/* Responsive scaling */
transform: scale(${scoreboardScale}) → Auto-scale
transform-origin: bottom center → Scale from bottom
```

### Custom Animations:
```css
@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

@keyframes bounce {
  /* Custom penalty celebration bounce */
}
```

## 🚀 Quick Start Guide

### 1. Kích Hoạt Scoreboard Below:
```
Admin Panel → QUẢN LÝ TRẬN → TỈ SỐ DƯỚI
```

### 2. Chỉnh Sửa Cơ Bản:
```
1. Click "⚙️ Edit" → Control panel mở
2. Nhập tên đội trong Team 1/Team 2
3. Click +1/-1 để thay đổi tỉ số  
4. Upload logo bằng cách click vào vùng logo
5. Click "✖ Close" đ��� ẩn control panel
```

### 3. Penalty Mode:
```
1. Check "Penalty Mode" trong control panel
2. Click "T1 +⚽" khi team 1 ghi penalty
3. Xem animation "⚽ GOAL! ⚽" 
4. Tỉ số penalty hiển thị dưới tỉ số chính
```

### 4. Tùy Chỉnh Nâng Cao:
```
1. Đổi màu team bằng color picker
2. Set timer/period cho trận đấu
3. Nhập platform live stream
4. Enable marquee + nhập text
```

## 📱 Mobile Usage

### Gestures:
- **Tap logo area**: Upload logo
- **Tap team name**: Edit mode
- **Long press edit button**: Quick access
- **Swipe control panel**: Scroll sections

### Performance:
- Optimized cho touch devices
- 60fps animations
- Minimal re-renders
- Lazy loading images

## 🔍 Troubleshooting

### Common Issues:

#### Logo không hiển thị:
```
- Check file format (jpg/png/gif)
- File size < 5MB
- Browser có support FileReader API
```

#### Animation lag:
```
- Reduce penalty animation duration
- Check device performance
- Clear browser cache
```

#### Scale issues:
```
- Window resize → Auto re-calculate
- Check CSS transform support
- Verify viewport meta tag
```

#### Socket connection:
```
- Check accessCode validity
- Verify socket server running
- Review browser console errors
```

## 📋 Best Practices

### Content Guidelines:
- Tên đội: Max 15 ký tự cho hiển thị tốt
- Logo: Nên là hình vuông, min 200x200px
- Timer: Format "MM:SS" hoặc "MM+SS"
- Marquee: Max 100 ký tự

### Performance Tips:
- Upload logo một lần, cache browser
- Minimize state updates
- Use debounced inputs
- Optimize images before upload

### UX Guidelines:
- Always provide visual feedback
- Use consistent color schemes
- Maintain responsive behavior
- Test trên multiple devices

## 🔮 Future Enhancements

### Planned Features:
- [ ] Drag & drop logo upload
- [ ] Multiple penalty rounds
- [ ] Team formation overlay
- [ ] Statistics integration
- [ ] Sound effects
- [ ] Export scoreboard as image

### API Extensions:
- [ ] Real-time sync với backend
- [ ] Cloud logo storage
- [ ] Match history
- [ ] Multi-language support

---

## 📞 Support

**File Location**: `src/components/scoreboard_preview/ScoreboardBelow.jsx`

**Dependencies**:
- React Hooks (useState, useEffect)
- Tailwind CSS
- File upload APIs

**Last Updated**: ${new Date().toLocaleDateString('vi-VN')}

---

*🏆 Component này được thiết kế để cung cấp trải nghiệm tương tác tốt nhất cho việc hiển thị bảng tỉ số football/futsal với đầy đủ tính năng chuyên nghiệp.*

# Socket Events mà Backend cần emit

## Backend cần emit các events sau:

### 1. Match Data Events (Server → Client)
```javascript
// Cập nhật thông tin trận đấu
socket.emit('match_info_updated', {
  matchInfo: {
    homeTeam: { name: "...", score: 0, logo: "..." },
    awayTeam: { name: "...", score: 0, logo: "..." },
    tournament: "...",
    stadium: "...",
    matchDate: "...",
    liveText: "..."
  }
});

// Cập nhật tỉ số
socket.emit('score_updated', {
  scores: { home: 2, away: 1 }
});

// Cập nhật thống kê
socket.emit('match_stats_updated', {
  stats: {
    possession: { team1: 60, team2: 40 },
    totalShots: { team1: 12, team2: 8 },
    shotsOnTarget: { team1: 4, team2: 3 },
    corners: { team1: 6, team2: 2 },
    yellowCards: { team1: 1, team2: 2 },
    fouls: { team1: 8, team2: 12 }
  }
});

// Cập nhật thời gian trận đấu
socket.emit('match_time_updated', {
  time: {
    matchTime: "45:30",
    period: "Hiệp 1",
    status: "live" // waiting, live, paused, ended
  }
});

// Cập nhật penalty
socket.emit('penalty_updated', {
  penaltyData: {
    homeGoals: 3,
    awayGoals: 2,
    currentTurn: 'home',
    shootHistory: [
      { team: 'home', player: 'Nguyễn Văn A', result: 'goal' },
      { team: 'away', player: 'Trần Văn B', result: 'miss' }
    ],
    status: 'active',
    lastUpdated: Date.now()
  }
});

// Cập nhật danh sách cầu thủ
socket.emit('lineup_updated', {
  lineup: {
    home: [
      { id: 1, name: "Nguyễn Văn A", number: 10, position: "ST" },
      // ...
    ],
    away: [
      { id: 2, name: "Trần Văn B", number: 9, position: "GK" },
      // ...
    ]
  }
});

// Cập nhật logo đội
socket.emit('team_logos_updated', {
  logos: {
    home: "https://example.com/logo1.png",
    away: "https://example.com/logo2.png"
  }
});

// Cập nhật tên đội
socket.emit('team_names_updated', {
  names: {
    home: "Hà Nội FC",
    away: "TP.HCM FC"
  }
});

// Cập nhật chữ chạy
socket.emit('marquee_updated', {
  marqueeData: {
    text: 'Chào mừng đến với trận đấu!',
    mode: 'continuous', // none, continuous, interval
    interval: 5000,
    color: '#ffffff',
    fontSize: 16
  }
});
```

### 2. Display Events (Server → Client)
```javascript
// Cập nhật template/skin
socket.emit('template_updated', {
  templateId: 1 // ID của template cần hiển thị
});

// Cập nhật poster type
socket.emit('poster_updated', {
  posterType: 'tretrung' // 'tretrung' hoặc 'haoquang'
});

// Cập nhật nhà tài trợ
socket.emit('sponsors_updated', {
  sponsors: {
    main: [
      { id: 1, name: "Sponsor A", logo: "url", position: "top" }
    ],
    secondary: [
      { id: 2, name: "Sponsor B", logo: "url", position: "bottom" }
    ],
    media: [
      { id: 3, name: "Media Partner", logo: "url", position: "side" }
    ]
  }
});
```

### 3. Connection Events (Server → Client)
```javascript
// Xác nhận tham gia room
socket.emit('room_joined', {
  accessCode: "BXL2Q2",
  roomId: "match_room_123",
  message: "Đã tham gia phòng thành công"
});

// Lỗi room
socket.emit('room_error', {
  error: "Access code không hợp lệ"
});

// Rời room
socket.emit('room_left', {
  accessCode: "BXL2Q2",
  message: "Đã rời khỏi phòng"
});
```

### 4. Client Events mà Backend cần lắng nghe:
```javascript
// Tham gia room
socket.on('join_room', (accessCode) => {
  // Xác thực access code và cho phép tham gia room
});

// Các events update từ admin
socket.on('match_info_update', (data) => {
  // Broadcast đến tất cả clients trong room
});

socket.on('score_update', (data) => {
  // Broadcast đến tất cả clients trong room
});

socket.on('template_update', (data) => {
  // Broadcast đến tất cả clients trong room
});

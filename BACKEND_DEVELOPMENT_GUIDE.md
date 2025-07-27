# 🔧 Hướng Dẫn Backend Development - Socket Events & Flow Analysis

## 📋 Mục Lục
1. [Phân Tích Luồng Hoạt Động Hiện Tại](#1-phân-tích-luồng-hoạt-động-hiện-tại)
2. [Đề Xuất Cấu Trúc Socket Đầy Đủ Cho Backend](#2-đề-xuất-cấu-trúc-socket-đầy-đủ-cho-backend)
3. [Implementation Guide](#3-implementation-guide)
4. [Testing & Debugging](#4-testing--debugging)

---

# 1. 📊 PHÂN TÍCH LUỒNG HOẠT ĐỘNG HIỆN TẠI

## 1.1 🏗️ Kiến Trúc Tổng Quan

```mermaid
graph TB
    A[Admin Browser] -->|Socket.IO| C[Backend Server]
    B[Display Browser] -->|Socket.IO| C
    C -->|Broadcast| A
    C -->|Broadcast| B
    
    subgraph "Frontend Routes"
        A1[/ - Admin Panel]
        B1[/:accessCode - Display]
    end
    
    subgraph "Backend Services"
        C1[Socket Server]
        C2[Room Manager]
        C3[Access Code Validator]
    end
```

## 1.2 🔄 User Journey Flow

### **Admin Side (Client1) - Route: `/`**

```
1. LOGIN PROCESS:
   ┌─────────────────┐
   │ LoginPage.jsx   │ → Có 2 cách đăng nhập:
   └─────────────────┘   
   
   Cách 1: Email + Password
   ├── AuthContext.authType = 'account'
   ├── App.js → ManageAccessCode.jsx
   └── Chọn mã trận đấu → authType = 'full'
   
   Cách 2: Chỉ AccessCode
   ├── AuthContext.authType = 'code'  
   └── App.js → NewHomeLayout.jsx (Home.jsx)

2. MAIN INTERFACE:
   ┌─────────────────┐
   │ Home.jsx        │ → 3 Tabs chính:
   └─────────────────┘   
   ├── Tab 1: "UP LOGO" (UploadLogoSection.jsx)
   ├── Tab 2: "QUẢN LÝ TRẬN" (MatchManagementSection.jsx) ⭐
   └── Tab 3: "BÌNH LUẬN" (CommentarySection.jsx)

3. MANAGEMENT CONTROLS:
   ┌─────────────────────────┐
   │ MatchManagementSection  │ → Các button điều khiển:
   └─────────────────────────┘   
   ├── "GIỚI THIỆU" → updateView('intro')
   ├── "NGHỈ GIỮA HIỆP" → updateView('halftime')  
   ├── "TỈ SỐ DƯỚI" → updateView('scoreboard_below')
   ├── "POSTER" → updatePoster() + updateView('poster')
   ├── "TEMPLATE" → updateTemplate(templateId)
   ├── Score Controls → updateScore(team, increment)
   ├── Team Names → updateTeamNames()
   ├── Statistics → updateStats()
   └── Penalty → updatePenalty()
```

### **Display Side (Client2) - Route: `/:accessCode`**

```
1. INITIALIZATION:
   ┌─────────────────────┐
   │ DisplayController   │ → URL: /DEMO123
   └─────────────────────┘   
   ├── useParams() → accessCode = "DEMO123"
   ├── PublicAPI.verifyAccessCode(accessCode)
   ├── initializeSocket(accessCode)
   └── socketService.connect(accessCode)

2. SOCKET LISTENERS:
   ┌────────────────────────┐
   │ PublicMatchContext      │ → Lắng nghe tất cả events:
   └─────────────────────────┘   
   ├── 'view_updated' → setCurrentView()
   ├── 'score_updated' → setMatchData()
   ├── 'poster_updated' → setDisplaySettings()
   ├── 'template_updated' → setDisplaySettings()
   ├── 'team_names_updated' → setMatchData()
   ├── 'match_stats_updated' → setMatchStats()
   └── ... (tất cả events khác)

3. VIEW RENDERING:
   ┌─────────────────────┐
   │ renderCurrentView() │ → Switch theo currentView:
   └─────────────────────┘   
   ├── 'intro' → Intro.jsx
   ├── 'halftime' → HalfTime.jsx
   ├── 'scoreboard' → ScoreboardAbove.jsx
   ├── 'scoreboard_below' → ScoreboardBelow.jsx
   └── 'poster' → PosterTreTrung/PosterHaoQuang.jsx
```

## 1.3 🔌 Socket Communication Flow

### **Connection Flow:**
```
1. Admin connects:
   socketService.connect(accessCode) 
   ↓
   socket.emit('join_room', accessCode)
   ↓
   Backend validates & joins room

2. Display connects:
   socketService.connect(accessCode)
   ↓  
   socket.emit('join_room', accessCode)
   ↓
   Backend validates & joins same room

3. Admin action:
   updateView('intro')
   ↓
   socketService.emit('view_update', {accessCode, viewType: 'intro'})
   ↓
   Backend broadcasts to room
   ↓
   Display receives 'view_updated' event
   ↓
   setCurrentView('intro') → Render Intro.jsx
```

## 1.4 📱 Component Hierarchy

### **Admin Side:**
```
App.js
├── LoginPage.jsx (authType = null)
├── ManageAccessCode.jsx (authType = 'account')  
└── NewHomeLayout.jsx (authType = 'code' | 'full')
    └── Home.jsx
        ├── UploadLogoSection.jsx
        ├── MatchManagementSection.jsx ⭐ (Main control)
        │   ├── ScoreDisplay.jsx (Preview)
        │   ├── PosterManager.jsx (Modal)
        │   ├── TeamLineupModal.jsx
        │   └── SimplePenaltyModal.jsx
        └── CommentarySection.jsx
```

### **Display Side:**
```
DisplayController.jsx
├── Loading State (Connecting...)
├── Error State (Invalid access code)
└── Main Content:
    ├── Intro.jsx (currentView = 'intro')
    ├── HalfTime.jsx (currentView = 'halftime')
    ├── ScoreboardAbove.jsx (currentView = 'scoreboard')
    ├── ScoreboardBelow.jsx (currentView = 'scoreboard_below')
    └── Poster Components (currentView = 'poster')
        ├── PosterTreTrung.jsx
        └── PosterHaoQuang.jsx
```

## 1.5 🗂️ State Management

### **Context Providers:**
```javascript
// Admin Side (Route: /)
AuthProvider
└── MatchProvider (src/contexts/MatchContext.jsx)
    ├── matchData (teams, scores, time)
    ├── matchStats (possession, shots, etc.)
    ├── displaySettings (skin, poster)
    ├── socketConnected
    └── Action Methods:
        ├── updateView()
        ├── updateScore() 
        ├── updateTemplate()
        ├── updatePoster()
        └── updateStats()

// Display Side (Route: /:accessCode)  
PublicMatchProvider (src/contexts/PublicMatchContext.jsx)
├── matchData (synced from admin)
├── matchStats (synced from admin)
├── displaySettings (synced from admin)
├── currentView ⭐ (controls what component renders)
├── socketConnected
└── Action Methods:
    └── initializeSocket()
```

---

# 2. 🔧 ĐỀ XUẤT CẤU TRÚC SOCKET ĐẦY ĐỦ CHO BACKEND

## 2.1 🏠 Server Setup

### **Dependencies Cần Thiết:**
```javascript
// package.json
{
  "dependencies": {
    "socket.io": "^4.8.1",
    "express": "^4.18.0",
    "cors": "^2.8.5"
  }
}
```

### **Basic Server Structure:**
```javascript
// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Configure properly in production
    methods: ["GET", "POST"]
  }
});

// Room management
const rooms = new Map(); // accessCode -> roomData
const userSessions = new Map(); // socketId -> userData

// Import handlers
const {
  handleConnection,
  handleRoomManagement, 
  handleViewUpdates,
  handleMatchData,
  handleDisplaySettings
} = require('./socketHandlers');

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Setup all event handlers
  handleConnection(io, socket, rooms, userSessions);
  handleRoomManagement(io, socket, rooms, userSessions);
  handleViewUpdates(io, socket, rooms, userSessions);
  handleMatchData(io, socket, rooms, userSessions);
  handleDisplaySettings(io, socket, rooms, userSessions);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 2.2 🏢 Room Management System

### **Room Data Structure:**
```javascript
// roomData structure
const roomData = {
  accessCode: "DEMO123",
  createdAt: Date.now(),
  lastActivity: Date.now(),
  clients: new Set([socketId1, socketId2]),
  adminClients: new Set([adminSocketId]),
  displayClients: new Set([displaySocketId]),
  
  // Current state
  currentState: {
    view: 'poster', // Current view on display
    matchData: {
      homeTeam: { name: "ĐỘI A", score: 0, logo: null },
      awayTeam: { name: "ĐỘI B", score: 0, logo: null },
      matchTime: "00:00",
      period: "Chưa bắt đầu",
      status: "waiting"
    },
    matchStats: {
      possession: { team1: 50, team2: 50 },
      totalShots: { team1: 0, team2: 0 },
      // ... other stats
    },
    displaySettings: {
      selectedSkin: 1,
      selectedPoster: 'tretrung'
    },
    penaltyData: {
      homeGoals: 0,
      awayGoals: 0,
      currentTurn: 'home',
      status: 'ready'
    }
  }
};
```

### **socketHandlers/connection.js:**
```javascript
// handleConnection
function handleConnection(io, socket, rooms, userSessions) {
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Cleanup user session
    const userData = userSessions.get(socket.id);
    if (userData && userData.accessCode) {
      const room = rooms.get(userData.accessCode);
      if (room) {
        room.clients.delete(socket.id);
        
        // Remove from specific client types
        room.adminClients.delete(socket.id);
        room.displayClients.delete(socket.id);
        
        // Clean up empty rooms
        if (room.clients.size === 0) {
          rooms.delete(userData.accessCode);
          console.log(`Room ${userData.accessCode} cleaned up`);
        }
      }
    }
    
    userSessions.delete(socket.id);
  });
}

module.exports = { handleConnection };
```

## 2.3 🔐 Access Code Validation & Room Joining

### **socketHandlers/roomManagement.js:**
```javascript
function handleRoomManagement(io, socket, rooms, userSessions) {
  
  // Join room event
  socket.on('join_room', async (accessCode) => {
    try {
      console.log(`Client ${socket.id} joining room: ${accessCode}`);
      
      // Validate access code
      const isValid = await validateAccessCode(accessCode);
      if (!isValid) {
        socket.emit('room_error', {
          error: 'Invalid access code',
          accessCode: accessCode
        });
        return;
      }
      
      // Create room if doesn't exist
      if (!rooms.has(accessCode)) {
        rooms.set(accessCode, createNewRoom(accessCode));
        console.log(`Created new room: ${accessCode}`);
      }
      
      const room = rooms.get(accessCode);
      
      // Join socket to room
      socket.join(`room_${accessCode}`);
      room.clients.add(socket.id);
      room.lastActivity = Date.now();
      
      // Store user session
      userSessions.set(socket.id, {
        accessCode: accessCode,
        joinedAt: Date.now(),
        lastActivity: Date.now()
      });
      
      // Determine client type based on route
      // (You might need to send this info from frontend)
      const userData = userSessions.get(socket.id);
      
      // Send current state to newly joined client
      socket.emit('room_joined', {
        accessCode: accessCode,
        roomId: `room_${accessCode}`,
        currentState: room.currentState,
        clientCount: room.clients.size
      });
      
      // Notify other clients about new join
      socket.to(`room_${accessCode}`).emit('client_joined', {
        clientId: socket.id,
        clientCount: room.clients.size
      });
      
      console.log(`Client ${socket.id} joined room ${accessCode}. Total clients: ${room.clients.size}`);
      
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('room_error', {
        error: 'Failed to join room',
        details: error.message
      });
    }
  });
  
  // Leave room event
  socket.on('leave_room', (accessCode) => {
    socket.leave(`room_${accessCode}`);
    
    const room = rooms.get(accessCode);
    if (room) {
      room.clients.delete(socket.id);
      socket.to(`room_${accessCode}`).emit('client_left', {
        clientId: socket.id,
        clientCount: room.clients.size
      });
    }
    
    userSessions.delete(socket.id);
    
    socket.emit('room_left', {
      accessCode: accessCode,
      message: 'Left room successfully'
    });
  });
}

// Helper functions
async function validateAccessCode(accessCode) {
  // TODO: Implement your validation logic
  // Check database, format, expiry, etc.
  
  // For now, accept any non-empty code
  return accessCode && accessCode.length > 0;
}

function createNewRoom(accessCode) {
  return {
    accessCode: accessCode,
    createdAt: Date.now(),
    lastActivity: Date.now(),
    clients: new Set(),
    adminClients: new Set(),
    displayClients: new Set(),
    currentState: {
      view: 'poster',
      matchData: {
        homeTeam: { name: "ĐỘI A", score: 0, logo: null },
        awayTeam: { name: "ĐỘI B", score: 0, logo: null },
        matchTime: "00:00",
        period: "Chưa bắt đầu",
        status: "waiting",
        tournament: "",
        stadium: "",
        matchDate: "",
        liveText: ""
      },
      matchStats: {
        possession: { team1: 50, team2: 50 },
        totalShots: { team1: 0, team2: 0 },
        shotsOnTarget: { team1: 0, team2: 0 },
        corners: { team1: 0, team2: 0 },
        yellowCards: { team1: 0, team2: 0 },
        fouls: { team1: 0, team2: 0 }
      },
      displaySettings: {
        selectedSkin: 1,
        selectedPoster: 'tretrung',
        showStats: false,
        showPenalty: false
      },
      penaltyData: {
        homeGoals: 0,
        awayGoals: 0,
        currentTurn: 'home',
        shootHistory: [],
        status: 'ready'
      },
      marqueeData: {
        text: '',
        mode: 'none',
        interval: 0,
        color: '#ffffff',
        fontSize: 16
      }
    }
  };
}

module.exports = { handleRoomManagement };
```

## 2.4 📺 View Control Events (Quan Trọng Nhất)

### **socketHandlers/viewUpdates.js:**
```javascript
function handleViewUpdates(io, socket, rooms, userSessions) {
  
  // Main view update event - CORE FEATURE
  socket.on('view_update', (data) => {
    const { accessCode, viewType, timestamp } = data;
    
    console.log(`View update request: ${viewType} for room ${accessCode}`);
    
    // Validate room exists
    const room = rooms.get(accessCode);
    if (!room) {
      socket.emit('room_error', { error: 'Room not found' });
      return;
    }
    
    // Update room state
    room.currentState.view = viewType;
    room.lastActivity = Date.now();
    
    // Broadcast to all clients in room EXCEPT sender
    socket.to(`room_${accessCode}`).emit('view_updated', {
      viewType: viewType,
      timestamp: timestamp || Date.now(),
      accessCode: accessCode
    });
    
    console.log(`Broadcasted view_updated: ${viewType} to room ${accessCode}`);
  });
  
  // Poster type update
  socket.on('poster_update', (data) => {
    const { accessCode, posterType, timestamp } = data;
    
    const room = rooms.get(accessCode);
    if (!room) return;
    
    // Update room state
    room.currentState.displaySettings.selectedPoster = posterType;
    room.lastActivity = Date.now();
    
    // Broadcast to room
    socket.to(`room_${accessCode}`).emit('poster_updated', {
      posterType: posterType,
      timestamp: timestamp || Date.now()
    });
    
    console.log(`Poster updated: ${posterType} for room ${accessCode}`);
  });
  
  // Template/Skin update
  socket.on('template_update', (data) => {
    const { accessCode, templateId, timestamp } = data;
    
    const room = rooms.get(accessCode);
    if (!room) return;
    
    // Update room state
    room.currentState.displaySettings.selectedSkin = templateId;
    room.lastActivity = Date.now();
    
    // Broadcast to room
    socket.to(`room_${accessCode}`).emit('template_updated', {
      templateId: templateId,
      timestamp: timestamp || Date.now()
    });
    
    console.log(`Template updated: ${templateId} for room ${accessCode}`);
  });
}

module.exports = { handleViewUpdates };
```

## 2.5 ⚽ Match Data Events

### **socketHandlers/matchData.js:**
```javascript
function handleMatchData(io, socket, rooms, userSessions) {
  
  // Score updates
  socket.on('score_update', (data) => {
    const { accessCode, scores, timestamp } = data;
    
    const room = rooms.get(accessCode);
    if (!room) return;
    
    // Update room state
    room.currentState.matchData.homeTeam.score = scores.home;
    room.currentState.matchData.awayTeam.score = scores.away;
    room.lastActivity = Date.now();
    
    // Broadcast to room
    socket.to(`room_${accessCode}`).emit('score_updated', {
      scores: {
        home: scores.home,
        away: scores.away
      },
      timestamp: timestamp || Date.now()
    });
  });
  
  // Team names update
  socket.on('team_names_update', (data) => {
    const { accessCode, names, timestamp } = data;
    
    const room = rooms.get(accessCode);
    if (!room) return;
    
    // Update room state
    room.currentState.matchData.homeTeam.name = names.home;
    room.currentState.matchData.awayTeam.name = names.away;
    room.lastActivity = Date.now();
    
    // Broadcast to room
    socket.to(`room_${accessCode}`).emit('team_names_updated', {
      names: {
        home: names.home,
        away: names.away
      },
      timestamp: timestamp || Date.now()
    });
  });
  
  // Team logos update
  socket.on('team_logos_update', (data) => {
    const { accessCode, logos, timestamp } = data;
    
    const room = rooms.get(accessCode);
    if (!room) return;
    
    // Update room state
    room.currentState.matchData.homeTeam.logo = logos.home;
    room.currentState.matchData.awayTeam.logo = logos.away;
    room.lastActivity = Date.now();
    
    // Broadcast to room
    socket.to(`room_${accessCode}`).emit('team_logos_updated', {
      logos: {
        home: logos.home,
        away: logos.away
      },
      timestamp: timestamp || Date.now()
    });
  });
  
  // Match info update (time, period, status)
  socket.on('match_time_update', (data) => {
    const { accessCode, time, timestamp } = data;
    
    const room = rooms.get(accessCode);
    if (!room) return;
    
    // Update room state
    Object.assign(room.currentState.matchData, {
      matchTime: time.matchTime,
      period: time.period,
      status: time.status
    });
    room.lastActivity = Date.now();
    
    // Broadcast to room
    socket.to(`room_${accessCode}`).emit('match_time_updated', {
      time: {
        matchTime: time.matchTime,
        period: time.period,
        status: time.status
      },
      timestamp: timestamp || Date.now()
    });
  });
  
  // Match statistics update
  socket.on('match_stats_update', (data) => {
    const { accessCode, stats, timestamp } = data;
    
    const room = rooms.get(accessCode);
    if (!room) return;
    
    // Update room state
    Object.assign(room.currentState.matchStats, stats);
    room.lastActivity = Date.now();
    
    // Broadcast to room
    socket.to(`room_${accessCode}`).emit('match_stats_updated', {
      stats: stats,
      timestamp: timestamp || Date.now()
    });
  });
  
  // Penalty updates
  socket.on('penalty_update', (data) => {
    const { accessCode, penaltyData, timestamp } = data;
    
    const room = rooms.get(accessCode);
    if (!room) return;
    
    // Update room state
    Object.assign(room.currentState.penaltyData, penaltyData);
    room.lastActivity = Date.now();
    
    // Broadcast to room
    socket.to(`room_${accessCode}`).emit('penalty_updated', {
      penaltyData: penaltyData,
      timestamp: timestamp || Date.now()
    });
  });
  
  // Lineup updates
  socket.on('lineup_update', (data) => {
    const { accessCode, lineup, timestamp } = data;
    
    const room = rooms.get(accessCode);
    if (!room) return;
    
    // Update room state (you might need to add lineup to room structure)
    room.currentState.lineupData = lineup;
    room.lastActivity = Date.now();
    
    // Broadcast to room
    socket.to(`room_${accessCode}`).emit('lineup_updated', {
      lineup: {
        home: lineup.home,
        away: lineup.away
      },
      timestamp: timestamp || Date.now()
    });
  });
  
  // Marquee updates
  socket.on('marquee_update', (data) => {
    const { accessCode, marqueeData, timestamp } = data;
    
    const room = rooms.get(accessCode);
    if (!room) return;
    
    // Update room state
    Object.assign(room.currentState.marqueeData, marqueeData);
    room.lastActivity = Date.now();
    
    // Broadcast to room
    socket.to(`room_${accessCode}`).emit('marquee_updated', {
      marqueeData: marqueeData,
      timestamp: timestamp || Date.now()
    });
  });
}

module.exports = { handleMatchData };
```

## 2.6 🎨 Display Settings Events

### **socketHandlers/displaySettings.js:**
```javascript
function handleDisplaySettings(io, socket, rooms, userSessions) {
  
  // Sponsors update
  socket.on('sponsors_update', (data) => {
    const { accessCode, sponsors, timestamp } = data;
    
    const room = rooms.get(accessCode);
    if (!room) return;
    
    // Update room state (add sponsors to room structure if needed)
    room.currentState.sponsors = sponsors;
    room.lastActivity = Date.now();
    
    // Broadcast to room
    socket.to(`room_${accessCode}`).emit('sponsors_updated', {
      sponsors: sponsors,
      timestamp: timestamp || Date.now()
    });
  });
  
  // General match info update
  socket.on('match_info_update', (data) => {
    const { accessCode, matchInfo, timestamp } = data;
    
    const room = rooms.get(accessCode);
    if (!room) return;
    
    // Update room state
    Object.assign(room.currentState.matchData, {
      tournament: matchInfo.tournament,
      stadium: matchInfo.stadium,
      matchDate: matchInfo.matchDate,
      liveText: matchInfo.liveText
    });
    room.lastActivity = Date.now();
    
    // Broadcast to room
    socket.to(`room_${accessCode}`).emit('match_info_updated', {
      matchInfo: matchInfo,
      timestamp: timestamp || Date.now()
    });
  });
}

module.exports = { handleDisplaySettings };
```

---

# 3. 🛠️ IMPLEMENTATION GUIDE

## 3.1 📁 Project Structure

```
backend/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── socketHandlers/           # Socket event handlers
│   ├── connection.js         # Connection/disconnection
│   ├── roomManagement.js     # Room join/leave/validation
│   ├── viewUpdates.js        # View control events ⭐
│   ├── matchData.js          # Match data events
│   └── displaySettings.js    # Display settings
├── middleware/               # Express middleware
│   ├── cors.js
│   └── auth.js
├── utils/                    # Utility functions
│   ├── validation.js         # Access code validation
│   ├── roomCleanup.js        # Room cleanup tasks
│   └── logger.js             # Logging utility
└── config/
    ├── database.js           # Database config
    └── socket.js             # Socket.io config
```

## 3.2 🚀 Step-by-Step Implementation

### **Step 1: Basic Server Setup**
```bash
# Initialize project
npm init -y
npm install express socket.io cors dotenv

# Create main server
touch server.js
```

### **Step 2: Implement Socket Handlers**
```bash
mkdir socketHandlers
touch socketHandlers/connection.js
touch socketHandlers/roomManagement.js
touch socketHandlers/viewUpdates.js
touch socketHandlers/matchData.js
touch socketHandlers/displaySettings.js
```

### **Step 3: Environment Configuration**
```bash
# .env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### **Step 4: Database Integration (Optional)**
```javascript
// If you want to persist access codes
const accessCodes = new Map(); // In-memory for now

// Or use database
// const db = require('./config/database');
// async function validateAccessCode(code) {
//   const result = await db.query('SELECT * FROM access_codes WHERE code = ?', [code]);
//   return result.length > 0;
// }
```

## 3.3 🔄 Frontend Integration

### **Update socketService.js:**
```javascript
// src/services/socketService.js
// Đã có sẵn các methods:

// Core view control methods:
updateView(viewType) // ⭐ Most important
updatePoster(posterType)
updateTemplate(templateId)

// Match data methods:
updateScore(homeScore, awayScore)
updateTeamNames(homeTeamName, awayTeamName)
updateTeamLogos(homeTeamLogo, awayTeamLogo)
updateMatchStats(stats)
updatePenalty(penaltyData)
updateMatchTime(matchTime, period, status)

// Listeners:
on('view_updated', callback) // ⭐ Most important
on('poster_updated', callback)
on('template_updated', callback)
// ... etc
```

---

# 4. 🧪 TESTING & DEBUGGING

## 4.1 🔍 Testing Strategy

### **Manual Testing:**
```
1. Start backend server
2. Open Admin: http://localhost:3000/
3. Open Display: http://localhost:3000/DEMO123
4. Test each button in MatchManagementSection:
   - GIỚI THIỆU → Display shows Intro
   - TỈ SỐ DƯỚI → Display shows ScoreboardBelow
   - POSTER → Display changes poster
   - etc.
```

### **Socket Event Testing:**
```javascript
// Test trong browser console (Admin side):
window.socketService.updateView('intro');
window.socketService.updatePoster('haoquang');
window.socketService.updateScore(2, 1);

// Check trong browser console (Display side):
// Should see corresponding events in console logs
```

## 4.2 🐛 Common Issues & Solutions

### **Issue 1: Socket not connecting**
```javascript
// Check CORS configuration
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"]
  }
});
```

### **Issue 2: Events not broadcasting**
```javascript
// Wrong: socket.emit() - only to sender
socket.emit('view_updated', data);

// Correct: socket.to().emit() - to room except sender  
socket.to(`room_${accessCode}`).emit('view_updated', data);
```

### **Issue 3: Room state not syncing**
```javascript
// Always update room state before broadcasting
room.currentState.view = viewType; // Update first
socket.to(`room_${accessCode}`).emit('view_updated', data); // Then broadcast
```

## 4.3 📊 Monitoring & Logging

### **Add logging to track events:**
```javascript
// Add to each handler
console.log(`[${new Date().toISOString()}] ${eventName}:`, data);

// Monitor room status
setInterval(() => {
  console.log(`Active rooms: ${rooms.size}`);
  rooms.forEach((room, accessCode) => {
    console.log(`  ${accessCode}: ${room.clients.size} clients`);
  });
}, 30000); // Every 30 seconds
```

### **Health check endpoint:**
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: rooms.size,
    totalClients: Array.from(rooms.values()).reduce((sum, room) => sum + room.clients.size, 0),
    uptime: process.uptime()
  });
});
```

---

## 📋 Quick Reference

### **Priority Events (Must Implement First):**
1. ✅ `join_room` - Room management
2. ✅ `view_update` - Main view control ⭐
3. ✅ `score_update` - Score changes
4. ✅ `poster_update` - Poster selection
5. ✅ `template_update` - Template selection

### **Secondary Events:**
6. `team_names_update` - Team names
7. `match_stats_update` - Statistics
8. `penalty_update` - Penalty scores
9. `marquee_update` - Marquee text
10. `match_time_update` - Timer/period

---

## 🎯 Production Considerations

### **Security:**
- Validate all input data
- Implement rate limiting
- Use environment variables for secrets
- Add authentication for admin actions

### **Performance:**
- Implement room cleanup for inactive rooms
- Add connection limits per room
- Use Redis for multi-server deployment
- Monitor memory usage

### **Reliability:**
- Add error handling for all events
- Implement reconnection logic
- Add heartbeat/ping system
- Log all critical events

---

**🚀 Backend Ready for Implementation!**

Hướng dẫn này cung cấp đầy đủ thông tin để implement backend socket system hoạt động với frontend hiện tại. Follow từng bước và test thoroughly để đảm bảo real-time sync giữa Admin và Display clients.

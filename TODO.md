# TODO Backend - WebRTC Audio Commentary System

## 🎯 Overview
Hybrid architecture implementation: Socket.io cho audio control/sync + WebRTC cho real-time commentary streaming.

## ✅ Core Implementation (Completed)
- [x] Basic WebRTC signaling events
- [x] Socket audio control và sync
- [x] Room management cơ bản

## 🚧 WebRTC Enhancement TODO

### 1. WebRTC State Management
- [ ] Implement connection state tracking
  ```javascript
  const webrtcConnections = new Map(); // roomId -> { commentators, listeners, connections }
  const connectionStates = new Map(); // socketId -> 'connecting'|'connected'|'disconnected'|'failed'
  ```
- [ ] Connection lifecycle management
- [ ] State persistence across disconnections

### 2. Advanced Room Management
- [ ] **Commentator limits**: Max 2 commentators per room
  ```javascript
  const MAX_COMMENTATORS_PER_ROOM = 2;
  const validateCommentatorJoin = (accessCode) => {
    const room = commentaryRooms.get(accessCode);
    return !room || room.commentators.length < MAX_COMMENTATORS_PER_ROOM;
  };
  ```
- [ ] **Auto cleanup**: Remove disconnected sockets từ rooms
- [ ] **Queue system**: Waiting list cho commentators khi room full
- [ ] **Priority system**: Admin có thể kick commentators

### 3. Connection Quality Monitoring
- [ ] **Quality metrics tracking**
  ```javascript
  socket.on('webrtc_connection_quality', (data) => {
    // Monitor: latency, packet loss, audio quality
    // Auto-suggest fallback if quality poor
  });
  ```
- [ ] **Real-time quality dashboard** cho admin
- [ ] **Adaptive quality**: Tự động giảm chất lượng khi mạng yếu
- [ ] **Connection diagnostics**: Chi tiết lỗi cho troubleshooting

### 4. Error Handling & Recovery
- [ ] **Comprehensive error handling**
  ```javascript
  socket.on('webrtc_connection_failed', (data) => {
    // Suggest fallback, notify participants
    // Log errors for debugging
  });
  ```
- [ ] **Auto-reconnection logic**: Retry với exponential backoff
- [ ] **Graceful degradation**: Fallback to socket audio
- [ ] **Error analytics**: Track common failure patterns

### 5. Security & Validation
- [ ] **Access code validation**: Check active matches
- [ ] **Rate limiting**: Prevent spam/DOS attacks
  ```javascript
  const checkRateLimit = (socketId, eventType) => {
    // Max 10 WebRTC events per minute per socket
  };
  ```
- [ ] **Input sanitization**: Validate all WebRTC data
- [ ] **Authentication**: Verify user permissions

### 6. Analytics & Monitoring
- [ ] **WebRTC metrics collection**
  ```javascript
  const webrtcAnalytics = {
    connectionsCreated: 0,
    connectionsSuccessful: 0,
    connectionsFailed: 0,
    averageSetupTime: 0,
    activeConnections: new Map()
  };
  ```
- [ ] **Dashboard cho admin**: Real-time stats
- [ ] **Performance monitoring**: Setup time, success rate
- [ ] **Usage analytics**: Peak times, popular features

### 7. Mobile/Network Optimization
- [ ] **Device detection**
  ```javascript
  socket.on('client_capabilities', (data) => {
    if (data.isMobile || data.bandwidth < 1000) {
      // Suggest lower quality settings
    }
  });
  ```
- [ ] **Adaptive audio quality**: Tự động adjust theo network
- [ ] **Mobile-specific optimizations**: Battery, bandwidth saving
- [ ] **Network-aware switching**: 4G/WiFi detection

### 8. Advanced Features
- [ ] **Multi-commentator support**: Mix multiple audio streams
- [ ] **Audio effects**: Noise reduction, echo cancellation
- [ ] **Recording capability**: Save commentary for replay
- [ ] **Push-to-talk mode**: Better cho noisy environments

## 🔧 Infrastructure TODO

### Database Schema
- [ ] **Commentary sessions table**
  ```sql
  CREATE TABLE commentary_sessions (
    id UUID PRIMARY KEY,
    access_code VARCHAR(50),
    commentator_id VARCHAR(100),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    connection_quality JSONB,
    errors JSONB
  );
  ```

### API Endpoints
- [ ] `GET /api/commentary/:accessCode/stats` - Room statistics
- [ ] `POST /api/commentary/:accessCode/kick` - Admin kick commentator
- [ ] `GET /api/commentary/analytics` - System analytics

### Performance Optimization
- [ ] **Redis**: Cache active rooms và connections
- [ ] **Load balancing**: Distribute WebRTC signaling
- [ ] **CDN**: Optimize STUN/TURN server selection
- [ ] **Monitoring**: Prometheus metrics, Grafana dashboards

## 📱 Testing TODO
- [ ] **Unit tests**: Core WebRTC functions
- [ ] **Integration tests**: End-to-end commentary flow
- [ ] **Load testing**: High CCU scenarios
- [ ] **Mobile testing**: iOS/Android compatibility
- [ ] **Network testing**: Poor connection scenarios

## 🚀 Deployment TODO
- [ ] **Environment configs**: STUN/TURN servers
- [ ] **SSL certificates**: Required cho WebRTC
- [ ] **Firewall rules**: WebRTC ports
- [ ] **Monitoring setup**: Alerts cho failures

## 📋 Priority Levels

### 🔴 High Priority (Week 1)
1. Error handling & recovery
2. Connection quality monitoring  
3. Security & rate limiting
4. Mobile optimization

### 🟡 Medium Priority (Week 2-3)
1. Advanced room management
2. Analytics & monitoring
3. Performance optimization
4. Testing suite

### 🟢 Low Priority (Future)
1. Advanced features (recording, effects)
2. Multi-commentator mixing
3. Advanced analytics dashboard

## 📝 Notes
- WebRTC chỉ hoạt động qua HTTPS
- Cần STUN/TURN servers cho production
- Fallback to socket audio luôn phải available
- Mobile browsers có limitations khác nhau
- Bandwidth requirements: ~64kbps per commentary stream

## 🔗 Related Documentation
- [WebRTC API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Socket.io Documentation](https://socket.io/docs/)
- [Frontend WebRTC Implementation](src/contexts/AudioContext.jsx)
- [Commentary UI](src/components/sections/CommentarySection.jsx)

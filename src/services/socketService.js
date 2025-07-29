import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentAccessCode = null;
    this.listeners = new Map();
    this.connectionPromise = null;
    this.clientType = null; // Lưu loại client: "client", "admin", "display"
  }

  // Khởi tạo kết nối socket với access code
  async connect(accessCode, clientType = 'client') {
    if (this.socket && this.currentAccessCode === accessCode && this.clientType === clientType) {
      return this.socket;
    }

    this.disconnect();
    this.currentAccessCode = accessCode;
    this.clientType = clientType;

    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://192.168.31.186:5000';
    
    this.connectionPromise = new Promise((resolve, reject) => {
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        upgrade: true,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        query: {
          accessCode: accessCode
        }
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        this.socket.emit('join_room', {
          accessCode: accessCode,
          clientType: this.clientType,
          timestamp: Date.now(),
          viewType: 'intro'
        });
        resolve(this.socket);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
        reject(error);
      });

      // Auto-reconnect khi mất kết nối
      this.socket.on('reconnect', () => {
        this.isConnected = true;
        if (this.currentAccessCode && this.clientType) {
          this.socket.emit('join_room', {
            accessCode: this.currentAccessCode,
            clientType: this.clientType,
            timestamp: Date.now(),
            viewType: 'intro'
          });
        }
      });
    });

    return this.connectionPromise;
  }

  // Ngắt kết nối
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.currentAccessCode = null;
    this.clientType = null;
    this.connectionPromise = null;
  }

  // Emit event đến server
  async emit(eventName, data) {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket not connected, cannot emit:', eventName);
      return false;
    }

    const payload = {
      accessCode: this.currentAccessCode,
      timestamp: Date.now(),
      ...data
    };

    this.socket.emit(eventName, payload);
    return true;
  }

  // Lắng nghe event từ server
  on(eventName, callback) {
    if (!this.socket) {
      console.warn('Socket not initialized, cannot listen to:', eventName);
      return;
    }

    // Lưu callback để có thể remove sau
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(callback);

    this.socket.on(eventName, callback);
  }

  // Bỏ lắng nghe event
  off(eventName, callback) {
    if (!this.socket) return;

    this.socket.off(eventName, callback);
    
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).delete(callback);
    }
  }

  // Bỏ tất cả listener của một event
  removeAllListeners(eventName) {
    if (!this.socket) return;

    this.socket.removeAllListeners(eventName);
    this.listeners.delete(eventName);
  }

  // Lấy trạng thái kết nối
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      accessCode: this.currentAccessCode,
      clientType: this.clientType,
      socketId: this.socket?.id
    };
  }

  // === MATCH DATA EVENTS ===

  // Cập nhật thông tin trận đấu
  updateMatchInfo(matchInfo) {
    return this.emit('match_info_update', { matchInfo });
  }

  // Cập nhật tỉ số
  updateScore(teamAScore, teamBScore) {
    return this.emit('score_update', {
      scores: { teamA: teamAScore, teamB: teamBScore }
    });
  }

  // Cập nhật thống kê trận đấu
  updateMatchStats(stats) {
    return this.emit('match_stats_update', { stats });
  }

  // Cập nhật template/skin
  updateTemplate(templateId) {
    return this.emit('template_update', { templateId });
  }

  // Cập nhật poster
  updatePoster(posterType) {
    return this.emit('poster_update', { posterType });
  }

  // Cập nhật logo đội bóng
  updateTeamLogos(teamALogo, teamBLogo) {
    return this.emit('team_logos_update', {
      logos: { teamA: teamALogo, teamB: teamBLogo }
    });
  }

  // Cập nhật tên đội
  updateTeamNames(teamAName, teamBName) {
    return this.emit('team_names_update', {
      names: { teamA: teamAName, teamB: teamBName }
    });
  }

  // Cập nhật chữ chạy
  updateMarquee(marqueeData) {
    return this.emit('marquee_update', { marqueeData });
  }

  // Cập nhật thời gian trận đấu
  updateMatchTime(matchTime, period, status) {
    return this.emit('match_time_update', { 
      time: { matchTime, period, status }
    });
  }

  // Cập nhật danh sách cầu thủ
  updateLineup(teamALineup, teamBLineup) {
    return this.emit('lineup_update', {
      lineup: { teamA: teamALineup, teamB: teamBLineup }
    });
  }

  // Cập nhật penalty
  updatePenalty(penaltyData) {
    return this.emit('penalty_update', { penaltyData });
  }

  // Cập nhật logo nhà tài trợ
  updateSponsors(sponsors) {
    return this.emit('sponsors_update', { sponsors });
  }

  // Cập nhật view hiện tại cho route dynamic (MỚI)
  updateView(viewType) {
    return this.emit('view_update', { viewType });
  }

  // Request toàn bộ state hiện tại từ server
  requestCurrentState() {
    return this.emit('request_current_state', {
      timestamp: Date.now(),
      clientType: this.clientType
    });
  }

  // === AUDIO CONTROL EVENTS ===

  // Gửi lệnh điều khiển audio đến tất cả client trong room
  sendAudioControl(controlData) {
    return this.emit('audio_control_broadcast', {
      ...controlData,
      senderType: this.clientType,
      timestamp: Date.now(),
      target: controlData.target || 'display', // Ưu tiên target được truyền vào, mặc định là 'display'
    });
  }

  // Broadcast audio sync để đồng bộ trạng thái audio
  broadcastAudioSync(syncData) {
    return this.emit('audio_sync_broadcast', {
      ...syncData,
      senderType: this.clientType,
      timestamp: Date.now()
    });
  }

  // Bật audio cho tất cả client
  enableAudioForAll() {
    return this.sendAudioControl({
      command: 'ENABLE_AUDIO',
      target: 'all' // 'all', 'clients', 'displays', hoặc specific clientId
    });
  }

  // Tắt audio cho tất cả client
  disableAudioForAll() {
    return this.sendAudioControl({
      command: 'DISABLE_AUDIO',
      target: 'all'
    });
  }

  // Điều chỉnh volume cho tất cả client
  setVolumeForAll(volume) {
    return this.sendAudioControl({
      command: 'SET_VOLUME',
      payload: { volume: Math.max(0, Math.min(1, volume)) },
      target: 'all'
    });
  }

  // Mute tất cả client
  muteAll() {
    return this.sendAudioControl({
      command: 'MUTE',
      target: 'all'
    });
  }

  // Unmute tất cả client
  unmuteAll() {
    return this.sendAudioControl({
      command: 'UNMUTE',
      target: 'all'
    });
  }

  // Phát audio trên tất cả client
  playAudioForAll(audioFile, component = null) {
    return this.sendAudioControl({
      command: 'PLAY_AUDIO',
      payload: { audioFile, component },
      target: 'all'
    });
  }

  // Dừng audio trên tất cả client
  stopAudioForAll() {
    return this.sendAudioControl({
      command: 'STOP_AUDIO',
      target: 'all'
    });
  }

  // Điều khiển audio cho client cụ thể
  controlClientAudio(clientId, command, payload = {}) {
    return this.sendAudioControl({
      command,
      payload,
      target: clientId
    });
  }

  // Điều khiển audio cho loại client cụ thể (client, admin, display)
  controlClientTypeAudio(clientType, command, payload = {}) {
    return this.sendAudioControl({
      command,
      payload,
      target: clientType
    });
  }

  // === AUDIO & COMMENTARY EVENTS ===

  // === TIMER REAL-TIME EVENTS ===

  // Start timer từ server
  startServerTimer(startTime, period, status = "live") {
    return this.emit('timer_start', {
      startTime,
      period,
      status,
      serverTimestamp: Date.now()
    });
  }

  // Pause timer từ server
  pauseServerTimer() {
    return this.emit('timer_pause', {
      serverTimestamp: Date.now()
    });
  }

  // Resume timer từ server
  resumeServerTimer() {
    return this.emit('timer_resume', {
      serverTimestamp: Date.now()
    });
  }

  // Reset timer từ server
  resetServerTimer(resetTime = "00:00", period = "Hiệp 1", status = "waiting") {
    return this.emit('timer_reset', {
      resetTime,
      period,
      status,
      serverTimestamp: Date.now()
    });
  }

  // === LISTENER HELPERS ===

  // Lắng nghe tất cả các update của match
  onMatchUpdate(callback) {
    const events = [
      'match_info_updated',
      'score_updated',
      'match_stats_updated',
      'template_updated',
      'poster_updated',
      'team_logos_updated',
      'team_names_updated',
      'marquee_updated',
      'match_time_updated',
      'lineup_updated',
      'penalty_updated',
      'sponsors_updated'
    ];

    events.forEach(event => {
      this.on(event, (data) => {
        callback(event, data);
      });
    });
  }

  // Lắng nghe các sự kiện audio
  onAudioEvents(callback) {
    const audioEvents = [
      'voice-chunk-received',          // Nhận voice chunk từ người khác
      'audio_control',                // Nhận lệnh điều khiển audio từ server
    ];

    audioEvents.forEach(event => {
      this.on(event, (data) => {
        callback(event, data);
      });
    });
  }

  // Lắng nghe các sự kiện điều khiển audio cụ thể
  onAudioControl(callback) {
    this.on('audio_control', callback);
  }

  // Lắng nghe các sự kiện đồng bộ audio
  onAudioSync(callback) {
    this.on('audio_sync', callback);
  }

  // Lắng nghe trạng thái audio của các client khác
  onAudioStatusUpdate(callback) {
    this.on('audio_status_update', callback);
  }

  // Lắng nghe trạng thái room
  onRoomStatus(callback) {
    this.on('room_joined', callback);
    this.on('room_left', callback);
    this.on('room_error', callback);
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;

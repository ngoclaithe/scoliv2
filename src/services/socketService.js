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

    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    
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
        console.log(`Socket connected for access code: ${accessCode}`);
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
        console.log('Socket disconnected');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
        reject(error);
      });

      // Auto-reconnect khi mất kết nối
      this.socket.on('reconnect', () => {
        console.log('Socket reconnected');
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
    console.log(`Emitted ${eventName}:`, payload);
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

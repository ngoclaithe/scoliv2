const logger = require('../utils/logger');

/**
 * Handles all match data related socket events
 */
function handleMatchData(io, socket, rooms, userSessions) {
  
  // Cập nhật tỉ số
  socket.on('score_update', (data) => {
    try {
      const { accessCode, scores, timestamp = Date.now() } = data;
      
      if (!accessCode || !scores) {
        throw new Error('Access code and scores data are required');
      }
      
      const room = rooms.get(accessCode);
      if (!room) {
        throw new Error('Room not found');
      }
      
      // Verify user has permission (only admin can update scores)
      const userData = userSessions.get(socket.id);
      if (!userData || !room.adminClients.has(socket.id)) {
        throw new Error('Unauthorized: Only admin can update scores');
      }
      
      // Update scores data
      if (scores.teamA !== undefined) {
        room.currentState.matchData.teamA.score = scores.teamA;
      }
      if (scores.teamB !== undefined) {
        room.currentState.matchData.teamB.score = scores.teamB;
      }
      
      room.lastActivity = timestamp;
      
      // Broadcast to all clients in the room
      io.to(`room_${accessCode}`).emit('score_updated', {
        scores: {
          teamA: room.currentState.matchData.teamA.score,
          teamB: room.currentState.matchData.teamB.score
        },
        timestamp: timestamp
      });
      
      logger.info(`Scores updated for room ${accessCode}: teamA=${scores.teamA}, teamB=${scores.teamB}`);
      
    } catch (error) {
      logger.error('Error in score_update:', error);
      socket.emit('score_error', {
        error: 'Lỗi khi cập nhật tỉ số',
        details: error.message
      });
    }
  });
  
  // Cập nhật tên đội
  socket.on('team_names_update', (data) => {
    try {
      const { accessCode, names, timestamp = Date.now() } = data;
      
      if (!accessCode || !names) {
        throw new Error('Access code and team names are required');
      }
      
      const room = rooms.get(accessCode);
      if (!room) {
        throw new Error('Room not found');
      }
      
      // Verify user has permission (only admin can update team names)
      const userData = userSessions.get(socket.id);
      if (!userData || !room.adminClients.has(socket.id)) {
        throw new Error('Unauthorized: Only admin can update team names');
      }
      
      // Update team names
      if (names.teamA !== undefined) {
        room.currentState.matchData.teamA.name = names.teamA;
      }
      if (names.teamB !== undefined) {
        room.currentState.matchData.teamB.name = names.teamB;
      }
      
      room.lastActivity = timestamp;
      
      // Broadcast to all clients in the room
      io.to(`room_${accessCode}`).emit('team_names_updated', {
        names: {
          teamA: room.currentState.matchData.teamA.name,
          teamB: room.currentState.matchData.teamB.name
        },
        timestamp: timestamp
      });
      
      logger.info(`Team names updated for room ${accessCode}: teamA=${names.teamA}, teamB=${names.teamB}`);
      
    } catch (error) {
      logger.error('Error in team_names_update:', error);
      socket.emit('team_names_error', {
        error: 'Lỗi khi cập nhật tên đội',
        details: error.message
      });
    }
  });
  
  // Cập nhật logo đội
  socket.on('team_logos_update', (data) => {
    try {
      const { accessCode, logos, timestamp = Date.now() } = data;
      
      if (!accessCode || !logos) {
        throw new Error('Access code and team logos are required');
      }
      
      const room = rooms.get(accessCode);
      if (!room) {
        throw new Error('Room not found');
      }
      
      // Verify user has permission (only admin can update team logos)
      const userData = userSessions.get(socket.id);
      if (!userData || !room.adminClients.has(socket.id)) {
        throw new Error('Unauthorized: Only admin can update team logos');
      }
      
      // Update team logos
      if (logos.teamA !== undefined) {
        room.currentState.matchData.teamA.logo = logos.teamA;
      }
      if (logos.teamB !== undefined) {
        room.currentState.matchData.teamB.logo = logos.teamB;
      }
      
      room.lastActivity = timestamp;
      
      // Broadcast to all clients in the room
      io.to(`room_${accessCode}`).emit('team_logos_updated', {
        logos: {
          teamA: room.currentState.matchData.teamA.logo,
          teamB: room.currentState.matchData.teamB.logo
        },
        timestamp: timestamp
      });
      
      logger.info(`Team logos updated for room ${accessCode}`);
      
    } catch (error) {
      logger.error('Error in team_logos_update:', error);
      socket.emit('team_logos_error', {
        error: 'Lỗi khi cập nhật logo đội',
        details: error.message
      });
    }
  });

  // Cập nhật thời gian trận đấu
  socket.on('match_time_update', (data) => {
    try {
      const { accessCode, time, timestamp = Date.now() } = data;
      
      if (!accessCode || !time) {
        throw new Error('Access code and time data are required');
      }
      
      const room = rooms.get(accessCode);
      if (!room) {
        throw new Error('Room not found');
      }
      
      // Verify user has permission (only admin can update match time)
      const userData = userSessions.get(socket.id);
      if (!userData || !room.adminClients.has(socket.id)) {
        throw new Error('Unauthorized: Only admin can update match time');
      }
      
      // Update match time data
      if (time.matchTime !== undefined) {
        room.currentState.matchData.matchTime = time.matchTime;
      }
      if (time.period !== undefined) {
        room.currentState.matchData.period = time.period;
      }
      if (time.status !== undefined) {
        room.currentState.matchData.status = time.status;
      }
      
      room.lastActivity = timestamp;
      
      // Broadcast to all clients in the room
      io.to(`room_${accessCode}`).emit('match_time_updated', {
        time: {
          matchTime: room.currentState.matchData.matchTime,
          period: room.currentState.matchData.period,
          status: room.currentState.matchData.status
        },
        timestamp: timestamp
      });
      
      logger.info(`Match time updated for room ${accessCode}`);
      
    } catch (error) {
      logger.error('Error in match_time_update:', error);
      socket.emit('match_time_error', {
        error: 'Lỗi khi cập nhật thời gian trận đấu',
        details: error.message
      });
    }
  });

  // Cập nhật thống kê trận đấu
  socket.on('match_stats_update', (data) => {
    try {
      const { accessCode, stats, timestamp = Date.now() } = data;
      
      if (!accessCode || !stats) {
        throw new Error('Access code and stats data are required');
      }
      
      const room = rooms.get(accessCode);
      if (!room) {
        throw new Error('Room not found');
      }
      
      // Verify user has permission (only admin can update match stats)
      const userData = userSessions.get(socket.id);
      if (!userData || !room.adminClients.has(socket.id)) {
        throw new Error('Unauthorized: Only admin can update match stats');
      }
      
      // Initialize stats in room state if not exists
      if (!room.currentState.matchStats) {
        room.currentState.matchStats = {
          possession: { team1: 50, team2: 50 },
          totalShots: { team1: 0, team2: 0 },
          shotsOnTarget: { team1: 0, team2: 0 },
          corners: { team1: 0, team2: 0 },
          yellowCards: { team1: 0, team2: 0 },
          fouls: { team1: 0, team2: 0 }
        };
      }
      
      // Update stats data
      Object.keys(stats).forEach(key => {
        if (stats[key] !== undefined) {
          room.currentState.matchStats[key] = stats[key];
        }
      });
      
      room.lastActivity = timestamp;
      
      // Broadcast to all clients in the room
      io.to(`room_${accessCode}`).emit('match_stats_updated', {
        stats: room.currentState.matchStats,
        timestamp: timestamp
      });
      
      logger.info(`Match stats updated for room ${accessCode}`);
      
    } catch (error) {
      logger.error('Error in match_stats_update:', error);
      socket.emit('match_stats_error', {
        error: 'Lỗi khi cập nhật thống kê trận đấu',
        details: error.message
      });
    }
  });
}

module.exports = { handleMatchData };

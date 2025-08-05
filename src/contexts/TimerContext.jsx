import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import socketService from '../services/socketService';
import { useAuth } from './AuthContext';

const TimerContext = createContext();

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer phải được sử dụng trong TimerProvider');
  }
  return context;
};

export const TimerProvider = ({ children }) => {
  const { matchCode, isAuthenticated } = useAuth();
  
  // State cho timer
  const [timerData, setTimerData] = useState({
    matchTime: "00:00",
    period: "Chưa bắt đầu",
    status: "waiting", // waiting, live, paused, ended
    serverTimestamp: null
  });

  const [timerInterval, setTimerInterval] = useState(null);
  const [startTime, setStartTime] = useState(null);

  // Setup timer listeners khi có matchCode và authenticated
  useEffect(() => {
    if (matchCode && isAuthenticated) {
      console.log('🕐 [TimerContext] Setting up timer listeners for:', matchCode);
      setupTimerListeners();
    }

    return () => {
      console.log('🕐 [TimerContext] Cleaning up timer context');
      // Cleanup timer interval
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      // KHÔNG cleanup socket listeners vì có thể conflict với MatchContext
    };
  }, [matchCode, isAuthenticated]);

  // Cleanup timer khi component unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Thiết lập listeners cho timer events
  const setupTimerListeners = useCallback(() => {
    console.log('🕐 [TimerContext] Setting up timer listeners');

    // Remove existing listeners để tránh duplicate
    socketService.removeAllListeners('timer_tick');
    socketService.removeAllListeners('timer_started');
    socketService.removeAllListeners('timer_paused');
    socketService.removeAllListeners('timer_resumed');
    socketService.removeAllListeners('timer_reset');
    socketService.removeAllListeners('match_time_updated');

    // Lắng nghe timer real-time updates từ server
    socketService.on('timer_tick', (data) => {
      console.log('🕐 [TimerContext] Received timer_tick:', data);
      setTimerData(prev => {
        const newTime = data.displayTime || data.currentTime;
        const newStatus = prev.status === 'paused' ? 'paused' : 'live';

        // Chỉ cập nhật nếu có thay đổi thực sự
        if (prev.matchTime === newTime && prev.status === newStatus) {
          return prev;
        }

        console.log('🕐 [TimerContext] Updating timer:', { newTime, newStatus });
        return {
          ...prev,
          matchTime: newTime,
          status: newStatus,
          serverTimestamp: data.timestamp || data.serverTimestamp
        };
      });
    });

    // Lắng nghe timer start từ server
    socketService.on('timer_started', (data) => {
      console.log('▶️ [TimerContext] Timer started from server:', data);
      setTimerData(prev => ({
        ...prev,
        matchTime: data.currentTime,
        period: data.period,
        status: 'live',
        serverTimestamp: data.serverTimestamp
      }));
    });

    // Lắng nghe timer pause từ server
    socketService.on('timer_paused', (data) => {
      console.log('⏸️ [TimerContext] Timer paused from server:', data);
      setTimerData(prev => ({
        ...prev,
        matchTime: data.currentTime,
        status: 'paused',
        serverTimestamp: data.serverTimestamp
      }));
    });

    // Lắng nghe timer resume từ server
    socketService.on('timer_resumed', (data) => {
      console.log('▶️ [TimerContext] Timer resumed from server:', data);
      setTimerData(prev => ({
        ...prev,
        matchTime: data.currentTime,
        status: 'live',
        serverTimestamp: data.serverTimestamp
      }));
    });

    // Lắng nghe timer reset từ server
    socketService.on('timer_reset', (data) => {
      console.log('🔄 [TimerContext] Timer reset from server:', data);
      setTimerData(prev => ({
        ...prev,
        matchTime: data.resetTime,
        period: data.period,
        status: 'waiting',
        serverTimestamp: data.serverTimestamp
      }));
    });

    // Lắng nghe cập nhật thời gian
    socketService.on('match_time_updated', (data) => {
      setTimerData(prev => ({
        ...prev,
        matchTime: data.time.matchTime,
        period: data.time.period,
        status: data.time.status
      }));
    });

    // Lắng nghe current_state_response để cập nhật timer data
    socketService.on('current_state_response', (data) => {
      console.log('🕐 [TimerContext] Received current_state_response:', data);
      if (data.matchData) {
        const { matchTime, period, status } = data.matchData;
        if (matchTime || period || status) {
          setTimerData(prev => ({
            ...prev,
            matchTime: matchTime || prev.matchTime,
            period: period || prev.period,
            status: status || prev.status
          }));
        }
      }
    });

    // Lắng nghe room_joined để cập nhật timer data
    socketService.onRoomStatus((eventType, data) => {
      if (eventType === 'room_joined' && data?.currentState?.matchData) {
        const { matchTime, period, status } = data.currentState.matchData;
        if (matchTime || period || status) {
          console.log('🕐 [TimerContext] Updating timer from room_joined:', { matchTime, period, status });
          setTimerData(prev => ({
            ...prev,
            matchTime: matchTime || prev.matchTime,
            period: period || prev.period,
            status: status || prev.status
          }));
        }
      }
    });

    // Lắng nghe socket connect để setup lại listeners
    socketService.on('connect', () => {
      console.log('🕐 [TimerContext] Socket connected, setting up timer listeners');
      // Không cần setup lại vì đã setup ở trên
    });

  }, []);

  // Cleanup timer listeners (không thực sự cleanup để tránh conflict)
  const cleanupTimerListeners = useCallback(() => {
    console.log('🕐 [TimerContext] Cleanup timer listeners called (but not actually cleaning up)');
    // KHÔNG cleanup để tránh conflict với MatchContext
    // socketService sẽ tự động cleanup khi disconnect
  }, []);

  // Timer control functions
  const updateMatchTime = useCallback((matchTime, period, status) => {
    console.log('🕐 [TimerContext] updateMatchTime called:', { matchTime, period, status });

    // Update local state
    setTimerData(prev => {
      console.log('🕐 [TimerContext] Updating local timerData from:', prev, 'to:', { matchTime, period, status });
      return { ...prev, matchTime, period, status };
    });

    // Emit to server if connected
    const connectionStatus = socketService.getConnectionStatus();
    console.log('🕐 [TimerContext] Socket connection status:', connectionStatus);

    if (connectionStatus.isConnected) {
      if (status === "live") {
        socketService.startServerTimer(matchTime, period, "live");
        console.log('▶️ [TimerContext] Started server timer:', { matchTime, period, status: "live" });
      } else if (status === "paused") {
        socketService.pauseServerTimer();
        console.log('⏸️ [TimerContext] Paused server timer');
      } else if (status === "waiting") {
        socketService.resetServerTimer(matchTime, period, "waiting");
        console.log('🔄 [TimerContext] Reset server timer:', { matchTime, period, status: "waiting" });
      }
    } else {
      console.log('❌ [TimerContext] Socket not connected, cannot emit timer update');
    }
  }, []);

  // Resume timer từ server
  const resumeTimer = useCallback(() => {
    if (socketService.getConnectionStatus().isConnected) {
      socketService.resumeServerTimer();
      console.log('▶️ [TimerContext] Resumed server timer');
    }
  }, []);

  // Update timer data from external source (như từ MatchContext khi nhận current_state_response)
  const updateTimerData = useCallback((newTimerData) => {
    setTimerData(prev => ({ ...prev, ...newTimerData }));
  }, []);

  const value = {
    // Timer state
    timerData,
    
    // Timer actions
    updateMatchTime,
    resumeTimer,
    updateTimerData
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

export default TimerContext;

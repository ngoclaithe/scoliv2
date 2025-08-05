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
    if (matchCode && isAuthenticated && socketService.getConnectionStatus().isConnected) {
      setupTimerListeners();
    }

    return () => {
      // Cleanup timer interval
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      cleanupTimerListeners();
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

    // Lắng nghe timer real-time updates từ server
    socketService.on('timer_tick', (data) => {
      setTimerData(prev => {
        const newTime = data.displayTime || data.currentTime;
        const newStatus = prev.status === 'paused' ? 'paused' : 'live';

        // Chỉ cập nhật nếu có thay đổi thực sự
        if (prev.matchTime === newTime && prev.status === newStatus) {
          return prev;
        }

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

  }, []);

  // Cleanup timer listeners
  const cleanupTimerListeners = useCallback(() => {
    console.log('🕐 [TimerContext] Cleaning up timer listeners');
    socketService.removeAllListeners('timer_tick');
    socketService.removeAllListeners('timer_started');
    socketService.removeAllListeners('timer_paused');
    socketService.removeAllListeners('timer_resumed');
    socketService.removeAllListeners('timer_reset');
    socketService.removeAllListeners('match_time_updated');
  }, []);

  // Timer control functions
  const updateMatchTime = useCallback((matchTime, period, status) => {
    // Update local state
    setTimerData(prev => ({ ...prev, matchTime, period, status }));

    // Emit to server if connected
    if (socketService.getConnectionStatus().isConnected) {
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

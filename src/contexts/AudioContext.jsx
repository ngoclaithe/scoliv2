import React, { createContext, useContext, useReducer, useRef, useEffect, useCallback } from 'react';
import socketService from '../services/socketService';

// Audio State - thêm hỗ trợ pause/resume
const initialState = {
  isPlaying: false,
  audioEnabled: true, // Global audio toggle
  volume: 0.7,
  isMuted: false,
  userInteracted: false,
  isRefereeVoicePlaying: false, // Voice trọng tài đang phát
  isPaused: false, // Audio đang bị pause (khác với dừng hoàn toàn)
  currentAudioFile: null, // File audio hiện tại
  pausedTime: 0, // Thời gian pause để resume sau
};

// Audio Actions - thêm pause/resume actions
const audioActions = {
  TOGGLE_AUDIO_ENABLED: 'TOGGLE_AUDIO_ENABLED',
  SET_AUDIO_ENABLED: 'SET_AUDIO_ENABLED',
  SET_VOLUME: 'SET_VOLUME',
  TOGGLE_MUTE: 'TOGGLE_MUTE',
  SET_PLAYING: 'SET_PLAYING',
  SET_USER_INTERACTED: 'SET_USER_INTERACTED',
  SET_REFEREE_VOICE_PLAYING: 'SET_REFEREE_VOICE_PLAYING',
  SET_PAUSED: 'SET_PAUSED',
  SET_CURRENT_AUDIO_FILE: 'SET_CURRENT_AUDIO_FILE',
  SET_PAUSED_TIME: 'SET_PAUSED_TIME',
};

// Audio Reducer - đơn giản hóa
const audioReducer = (state, action) => {
  switch (action.type) {
    case audioActions.TOGGLE_AUDIO_ENABLED:
      return {
        ...state,
        audioEnabled: !state.audioEnabled,
        isPlaying: state.audioEnabled ? false : state.isPlaying, // Dừng audio nếu tắt
      };
    case audioActions.SET_AUDIO_ENABLED:
      return {
        ...state,
        audioEnabled: action.payload,
        isPlaying: action.payload ? state.isPlaying : false, // Dừng audio nếu tắt
      };
    case audioActions.SET_VOLUME:
      return {
        ...state,
        volume: action.payload,
      };
    case audioActions.TOGGLE_MUTE:
      return {
        ...state,
        isMuted: !state.isMuted,
      };
    case audioActions.SET_PLAYING:
      return {
        ...state,
        isPlaying: action.payload,
      };
    case audioActions.SET_USER_INTERACTED:
      return {
        ...state,
        userInteracted: action.payload,
      };
    case audioActions.SET_REFEREE_VOICE_PLAYING:
      return {
        ...state,
        isRefereeVoicePlaying: action.payload,
      };
    case audioActions.SET_PAUSED:
      return {
        ...state,
        isPaused: action.payload,
      };
    case audioActions.SET_CURRENT_AUDIO_FILE:
      return {
        ...state,
        currentAudioFile: action.payload,
      };
    case audioActions.SET_PAUSED_TIME:
      return {
        ...state,
        pausedTime: action.payload,
      };
    default:
      return state;
  }
};

// Audio Context
const AudioContext = createContext();

// Audio Provider - đơn giản hóa
export const AudioProvider = ({ children }) => {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const audioRef = useRef(null);
  const refereeVoiceRef = useRef(null);

  // Static audio file mapping
  const audioFiles = {
    poster: '/audio/poster.mp3',
    rasan: '/audio/rasan.mp3',
    gialap: '/audio/gialap.mp3',
  };

  // Phát voice trọng tài
  const playRefereeVoice = useCallback((audioBlob) => {
    console.log('🎙️ [AudioContext] Playing referee voice');

    // Dừng tất cả audio khác trước
    stopCurrentAudio();

    try {
      // Tạo URL từ blob
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      refereeVoiceRef.current = audio;
      audio.volume = state.isMuted ? 0 : state.volume;

      dispatch({ type: audioActions.SET_REFEREE_VOICE_PLAYING, payload: true });

      audio.onended = () => {
        console.log('✅ Referee voice playback ended');
        dispatch({ type: audioActions.SET_REFEREE_VOICE_PLAYING, payload: false });
        URL.revokeObjectURL(audioUrl);
        refereeVoiceRef.current = null;
      };

      audio.onerror = (e) => {
        console.error('❌ Referee voice playback error:', e);
        dispatch({ type: audioActions.SET_REFEREE_VOICE_PLAYING, payload: false });
        URL.revokeObjectURL(audioUrl);
        refereeVoiceRef.current = null;
      };

      const playPromise = audio.play();
      if (playPromise) {
        playPromise
          .then(() => {
            console.log('✅ Referee voice started playing successfully');
          })
          .catch((error) => {
            console.error('❌ Failed to play referee voice:', error);
            dispatch({ type: audioActions.SET_REFEREE_VOICE_PLAYING, payload: false });
            URL.revokeObjectURL(audioUrl);
            refereeVoiceRef.current = null;
          });
      }

    } catch (error) {
      console.error('❌ Error creating referee voice audio:', error);
      dispatch({ type: audioActions.SET_REFEREE_VOICE_PLAYING, payload: false });
    }
  }, [state.isMuted, state.volume]);

  // Dừng voice trọng tài
  const stopRefereeVoice = useCallback(() => {
    console.log('🔇 [AudioContext] Stopping referee voice');

    if (refereeVoiceRef.current) {
      try {
        refereeVoiceRef.current.pause();
        refereeVoiceRef.current.currentTime = 0;
        if (refereeVoiceRef.current.src && refereeVoiceRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(refereeVoiceRef.current.src);
        }
      } catch (error) {
        console.warn('⚠️ Error stopping referee voice:', error);
      }
      refereeVoiceRef.current = null;
    }

    dispatch({ type: audioActions.SET_REFEREE_VOICE_PLAYING, payload: false });
  }, []);

  // Set up user interaction listeners
  useEffect(() => {
    const handleUserInteraction = () => {
      console.log('🎵 User interaction detected');
      dispatch({ type: audioActions.SET_USER_INTERACTED, payload: true });
      
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Pause audio hiện tại (lưu vị trí để resume sau)
  const pauseCurrentAudio = useCallback(() => {
    console.log('⏸️ [AudioContext] Pausing current audio');

    if (audioRef.current && !audioRef.current.paused) {
      try {
        const currentTime = audioRef.current.currentTime;
        audioRef.current.pause();

        dispatch({ type: audioActions.SET_PLAYING, payload: false });
        dispatch({ type: audioActions.SET_PAUSED, payload: true });
        dispatch({ type: audioActions.SET_PAUSED_TIME, payload: currentTime });

        console.log('⏸️ [AudioContext] Audio paused at time:', currentTime);
      } catch (error) {
        console.warn('⚠️ Error pausing audio:', error);
      }
    }
  }, []);

  // Resume audio từ vị trí đã pause
  const resumeCurrentAudio = useCallback(() => {
    console.log('▶️ [AudioContext] Resuming current audio');

    if (!state.audioEnabled) {
      console.log('🔇 Audio disabled globally');
      return;
    }

    if (!state.userInteracted) {
      console.log('⏳ User hasn\'t interacted yet, skipping audio resume');
      return;
    }

    if (state.isRefereeVoicePlaying) {
      console.log('🎙️ Referee voice is playing, skipping audio resume');
      return;
    }

    if (audioRef.current && state.isPaused) {
      try {
        audioRef.current.currentTime = state.pausedTime;
        audioRef.current.volume = state.isMuted ? 0 : state.volume;

        const playPromise = audioRef.current.play();
        if (playPromise) {
          playPromise
            .then(() => {
              console.log('▶️ Audio resumed successfully from time:', state.pausedTime);
              dispatch({ type: audioActions.SET_PLAYING, payload: true });
              dispatch({ type: audioActions.SET_PAUSED, payload: false });
            })
            .catch((error) => {
              console.error('❌ Failed to resume audio:', error);
              dispatch({ type: audioActions.SET_PLAYING, payload: false });
              dispatch({ type: audioActions.SET_PAUSED, payload: false });
            });
        }
      } catch (error) {
        console.error('❌ Error resuming audio:', error);
        dispatch({ type: audioActions.SET_PLAYING, payload: false });
        dispatch({ type: audioActions.SET_PAUSED, payload: false });
      }
    } else if (state.currentAudioFile && state.isPaused) {
      // Nếu audio element đã bị xóa, tạo lại và phát từ vị trí pause
      console.log('🔄 Recreating audio element and resuming from:', state.pausedTime);
      playAudioFromTime(state.currentAudioFile, state.pausedTime);
    }
  }, [state.audioEnabled, state.userInteracted, state.isMuted, state.volume, state.isRefereeVoicePlaying, state.isPaused, state.pausedTime, state.currentAudioFile]);

  // Dừng tất cả audio đang phát - dừng hoàn toàn
  const stopCurrentAudio = useCallback(() => {
    console.log('🔇 [AudioContext] Stopping all audio elements completely');

    // Dừng audio của AudioContext
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
      } catch (error) {
        console.warn('⚠️ Error stopping AudioContext audio:', error);
      }
      audioRef.current = null;
    }

    // Dừng voice trọng tài
    if (refereeVoiceRef.current) {
      try {
        refereeVoiceRef.current.pause();
        refereeVoiceRef.current.currentTime = 0;
        if (refereeVoiceRef.current.src && refereeVoiceRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(refereeVoiceRef.current.src);
        }
      } catch (error) {
        console.warn('⚠️ Error stopping referee voice:', error);
      }
      refereeVoiceRef.current = null;
    }

    // Dừng TẤT CẢ audio elements trên trang
    try {
      const allAudioElements = document.querySelectorAll('audio');
      console.log(`🔇 [AudioContext] Found ${allAudioElements.length} audio elements to stop`);

      allAudioElements.forEach((audio, index) => {
        try {
          if (!audio.paused) {
            console.log(`🔇 [AudioContext] Stopping audio element ${index + 1}`);
            audio.pause();
            audio.currentTime = 0;
            audio.src = '';
            // Xóa audio element khỏi DOM để tránh rò rỉ bộ nhớ
            if (audio.parentNode) {
              audio.parentNode.removeChild(audio);
            }
          }
        } catch (error) {
          console.warn(`⚠️ Error stopping audio element ${index + 1}:`, error);
        }
      });
    } catch (error) {
      console.warn('⚠️ Error finding/stopping page audio elements:', error);
    }

    dispatch({ type: audioActions.SET_PLAYING, payload: false });
    dispatch({ type: audioActions.SET_PAUSED, payload: false });
    dispatch({ type: audioActions.SET_CURRENT_AUDIO_FILE, payload: null });
    dispatch({ type: audioActions.SET_PAUSED_TIME, payload: 0 });
    dispatch({ type: audioActions.SET_REFEREE_VOICE_PLAYING, payload: false });
  }, []);

  // Play audio từ thời gian cụ thể
  const playAudioFromTime = useCallback((audioKey, startTime = 0) => {
    const audioFile = audioFiles[audioKey];
    if (!audioFile) {
      console.error('❌ Audio file not found:', audioKey);
      return;
    }

    // Stop current audio before playing new one
    stopCurrentAudio();

    try {
      console.log('🎵 Creating new audio element:', audioFile, 'starting from:', startTime);
      const audio = new Audio(audioFile);
      audioRef.current = audio;
      audio.volume = state.isMuted ? 0 : state.volume;
      audio.currentTime = startTime;

      dispatch({ type: audioActions.SET_PLAYING, payload: true });
      dispatch({ type: audioActions.SET_PAUSED, payload: false });
      dispatch({ type: audioActions.SET_CURRENT_AUDIO_FILE, payload: audioKey });
      dispatch({ type: audioActions.SET_PAUSED_TIME, payload: 0 });

      audio.onended = () => {
        console.log('✅ Audio playback ended');
        dispatch({ type: audioActions.SET_PLAYING, payload: false });
        dispatch({ type: audioActions.SET_PAUSED, payload: false });
        dispatch({ type: audioActions.SET_CURRENT_AUDIO_FILE, payload: null });
      };

      audio.onerror = (e) => {
        console.error('❌ Audio playback error:', e);
        dispatch({ type: audioActions.SET_PLAYING, payload: false });
        dispatch({ type: audioActions.SET_PAUSED, payload: false });
        dispatch({ type: audioActions.SET_CURRENT_AUDIO_FILE, payload: null });
      };

      const playPromise = audio.play();
      if (playPromise) {
        playPromise
          .then(() => {
            console.log('✅ Audio started playing successfully from time:', startTime);
          })
          .catch((error) => {
            console.error('❌ Failed to play audio:', error);
            dispatch({ type: audioActions.SET_PLAYING, payload: false });
            dispatch({ type: audioActions.SET_PAUSED, payload: false });
            dispatch({ type: audioActions.SET_CURRENT_AUDIO_FILE, payload: null });
          });
      }

    } catch (error) {
      console.error('❌ Error creating audio:', error);
      dispatch({ type: audioActions.SET_PLAYING, payload: false });
      dispatch({ type: audioActions.SET_PAUSED, payload: false });
      dispatch({ type: audioActions.SET_CURRENT_AUDIO_FILE, payload: null });
    }
  }, [state.isMuted, state.volume, stopCurrentAudio, audioFiles]);

  // Play audio - đơn giản hóa
  const playAudio = useCallback((audioKey) => {
    console.log('🎵 Play audio request:', { audioKey, audioEnabled: state.audioEnabled });

    if (!state.audioEnabled) {
      console.log('🔇 Audio disabled globally');
      return;
    }

    if (!state.userInteracted) {
      console.log('⏳ User hasn\'t interacted yet, skipping audio');
      return;
    }

    // Không phát audio khác nếu voice trọng tài đang phát
    if (state.isRefereeVoicePlaying) {
      console.log('🎙️ Referee voice is playing, skipping regular audio');
      return;
    }

    const audioFile = audioFiles[audioKey];
    if (!audioFile) {
      console.error('❌ Audio file not found:', audioKey);
      return;
    }

    // Sử dụng playAudioFromTime đ�� bắt đầu từ đ���u
    playAudioFromTime(audioKey, 0);
  }, [state.audioEnabled, state.userInteracted, state.isRefereeVoicePlaying, playAudioFromTime]);

  // Toggle audio toàn cục - CHỈ LOCAL, KHÔNG GỬI SOCKET
  const toggleAudioEnabled = useCallback(() => {
    const wasEnabled = state.audioEnabled;
    const newState = !wasEnabled;

    console.log('🎵 Toggling LOCAL audio:', { wasEnabled, newState });

    dispatch({ type: audioActions.TOGGLE_AUDIO_ENABLED });

    // KHÔNG GỬI SOCKET NỮA - CHỈ TÁC ĐỘNG LOCAL
    // Nếu đang từ enabled -> disabled, dừng phát audio hiện tại
    if (wasEnabled && audioRef.current) {
      stopCurrentAudio();
    }
  }, [state.audioEnabled, stopCurrentAudio]);

  // CHỈ XỬ LÝ REFEREE VOICE - ĐỢI SOCKET KẾT NỐI
  useEffect(() => {
    const handleAudioControl = (data) => {
      console.log('📡 [AudioContext] Received audio_control from server:', data);

      // CHỈ XỬ LÝ REFEREE VOICE
      if (data.command === 'PLAY_REFEREE_VOICE' && data.payload) {
        console.log('📡 [AudioContext] Server command: PLAY_REFEREE_VOICE');
        const { audioData, mimeType } = data.payload;

        try {
          // Chuyển audioData từ array về Uint8Array
          const uint8Array = new Uint8Array(audioData);
          const audioBlob = new Blob([uint8Array], { type: mimeType || 'audio/webm' });
          playRefereeVoice(audioBlob);
        } catch (error) {
          console.error('❌ [AudioContext] Error processing referee voice data:', error);
        }
      }
    };

    // Kiểm tra socket connection trước khi đăng ký listener
    const registerListener = () => {
      const connectionStatus = socketService.getConnectionStatus();

      if (connectionStatus.isConnected && socketService.socket) {
        console.log('📡 [AudioContext] Socket connected, registering audio control listener');
        socketService.onAudioControl(handleAudioControl);
        return true;
      } else {
        console.log('📡 [AudioContext] Socket not ready yet, will retry...');
        return false;
      }
    };

    // Thử đăng ký ngay lập tức
    if (!registerListener()) {
      // Nếu socket chưa sẵn sàng, đợi và thử lại
      const retryInterval = setInterval(() => {
        if (registerListener()) {
          clearInterval(retryInterval);
        }
      }, 100); // Kiểm tra mỗi 100ms

      // Cleanup interval nếu component unmount trước khi socket ready
      const timeoutId = setTimeout(() => {
        clearInterval(retryInterval);
        console.log('⚠️ [AudioContext] Timeout waiting for socket connection');
      }, 10000); // Timeout sau 10 giây

      return () => {
        clearInterval(retryInterval);
        clearTimeout(timeoutId);
        if (socketService.socket) {
          socketService.off('audio_control', handleAudioControl);
        }
      };
    }

    // Cleanup nếu đã đăng ký thành công ngay lập tức
    return () => {
      console.log('📡 [AudioContext] Unregistering audio control listener');
      if (socketService.socket) {
        socketService.off('audio_control', handleAudioControl);
      }
    };
  }, [playRefereeVoice]); // Thêm dependency để tránh stale closure

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up AudioProvider');
      
      // Cleanup audio
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.onended = null;
          audioRef.current.onerror = null;
        } catch (error) {
          console.warn('⚠️ Error cleaning up audio:', error);
        }
        audioRef.current = null;
      }

      // Cleanup referee voice
      if (refereeVoiceRef.current) {
        try {
          refereeVoiceRef.current.pause();
          refereeVoiceRef.current.onended = null;
          refereeVoiceRef.current.onerror = null;
          if (refereeVoiceRef.current.src && refereeVoiceRef.current.src.startsWith('blob:')) {
            URL.revokeObjectURL(refereeVoiceRef.current.src);
          }
        } catch (error) {
          console.warn('⚠️ Error cleaning up referee voice:', error);
        }
        refereeVoiceRef.current = null;
      }
    };
  }, []);

  // Update volume khi state thay đổi
  useEffect(() => {
    if (audioRef.current) {
      const newVolume = state.isMuted ? 0 : state.volume;
      console.log('🔊 Updating audio element volume:', newVolume);
      audioRef.current.volume = newVolume;
    }

    if (refereeVoiceRef.current) {
      const newVolume = state.isMuted ? 0 : state.volume;
      console.log('🔊 Updating referee voice volume:', newVolume);
      refereeVoiceRef.current.volume = newVolume;
    }
  }, [state.volume, state.isMuted]);

  const value = {
    // State
    ...state,

    // Audio functions
    playAudio,
    stopCurrentAudio,
    pauseCurrentAudio,
    resumeCurrentAudio,
    toggleAudioEnabled,
    playRefereeVoice,
    stopRefereeVoice,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

// Hook để sử dụng AudioContext
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

export default AudioContext;

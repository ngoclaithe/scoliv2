import React, { createContext, useContext, useReducer, useRef, useEffect, useCallback } from 'react';
import socketService from '../services/socketService';

// Audio State - đơn giản hóa
const initialState = {
  isPlaying: false,
  audioEnabled: true, // Global audio toggle
  volume: 0.7,
  isMuted: false,
  userInteracted: false,
};

// Audio Actions - rút gọn
const audioActions = {
  TOGGLE_AUDIO_ENABLED: 'TOGGLE_AUDIO_ENABLED',
  SET_AUDIO_ENABLED: 'SET_AUDIO_ENABLED',
  SET_VOLUME: 'SET_VOLUME',
  TOGGLE_MUTE: 'TOGGLE_MUTE',
  SET_PLAYING: 'SET_PLAYING',
  SET_USER_INTERACTED: 'SET_USER_INTERACTED',
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

  // Static audio file mapping
  const audioFiles = {
    poster: '/audio/poster.mp3',
    rasan: '/audio/rasan.mp3',
    gialap: '/audio/gialap.mp3',
  };

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

  // Dừng audio hiện tại - đơn giản hóa
  const stopCurrentAudio = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
      } catch (error) {
        console.warn('⚠️ Error stopping audio:', error);
      }
      audioRef.current = null;
    }
    dispatch({ type: audioActions.SET_PLAYING, payload: false });
  };

  // Play audio - đơn giản hóa
  const playAudio = (audioKey) => {
    console.log('🎵 Play audio request:', { audioKey, audioEnabled: state.audioEnabled });
    
    if (!state.audioEnabled) {
      console.log('🔇 Audio disabled globally');
      return;
    }

    if (!state.userInteracted) {
      console.log('⏳ User hasn\'t interacted yet, skipping audio');
      return;
    }

    const audioFile = audioFiles[audioKey];
    if (!audioFile) {
      console.error('❌ Audio file not found:', audioKey);
      return;
    }

    // Stop current audio before playing new one
    stopCurrentAudio();

    try {
      console.log('🎵 Creating new audio element:', audioFile);
      const audio = new Audio(audioFile);
      audioRef.current = audio;
      audio.volume = state.isMuted ? 0 : state.volume;

      dispatch({ type: audioActions.SET_PLAYING, payload: true });

      audio.onended = () => {
        console.log('✅ Audio playback ended');
        dispatch({ type: audioActions.SET_PLAYING, payload: false });
      };

      audio.onerror = (e) => {
        console.error('❌ Audio playback error:', e);
        dispatch({ type: audioActions.SET_PLAYING, payload: false });
      };

      const playPromise = audio.play();
      if (playPromise) {
        playPromise
          .then(() => {
            console.log('✅ Audio started playing successfully');
          })
          .catch((error) => {
            console.error('❌ Failed to play audio:', error);
            dispatch({ type: audioActions.SET_PLAYING, payload: false });
          });
      }

    } catch (error) {
      console.error('❌ Error creating audio:', error);
      dispatch({ type: audioActions.SET_PLAYING, payload: false });
    }
  };

  // Toggle audio toàn cục
  const toggleAudioEnabled = useCallback(() => {
    const wasEnabled = state.audioEnabled;
    const newState = !wasEnabled;
    
    console.log('🎵 Toggling global audio:', { wasEnabled, newState });

    dispatch({ type: audioActions.TOGGLE_AUDIO_ENABLED });

    // Gửi trạng thái mới lên server
    try {
      if (socketService.socket && socketService.socket.connected) {
        if (newState) {
          console.log('📡 Sending enable audio to display clients');
          socketService.enableAudioForDisplays();
        } else {
          console.log('📡 Sending disable audio to display clients');
          socketService.disableAudioForDisplays();
        }
      }
    } catch (error) {
      console.error('❌ Lỗi khi gửi trạng thái audio lên server:', error);
    }

    // Nếu đang từ enabled -> disabled, dừng phát audio hiện tại
    if (wasEnabled && audioRef.current) {
      stopCurrentAudio();
    }
  }, [state.audioEnabled]);

  // Lắng nghe thay đổi trạng thái audio từ server
  useEffect(() => {
    const handleAudioControl = (data) => {
      console.log('📡 Received audio_control from server:', data);

      if (data.command === 'ENABLE_AUDIO') {
        console.log('���� Server command: ENABLE_AUDIO');
        dispatch({ type: audioActions.TOGGLE_AUDIO_ENABLED });
      } else if (data.command === 'DISABLE_AUDIO') {
        console.log('📡 Server command: DISABLE_AUDIO');
        stopCurrentAudio();
        dispatch({ type: audioActions.TOGGLE_AUDIO_ENABLED });
      } else if (data.command === 'PLAY_AUDIO' && data.payload) {
        console.log('📡 Server command: PLAY_AUDIO', data.payload);
        const { audioFile } = data.payload;
        playAudio(audioFile);
      } else if (data.command === 'STOP_AUDIO') {
        console.log('📡 Server command: STOP_AUDIO');
        stopCurrentAudio();
      }
    };

    // Đăng ký lắng nghe sự kiện điều khiển audio một lần duy nhất
    console.log('📡 Registering audio control listener');
    socketService.onAudioControl(handleAudioControl);

    // Cleanup
    return () => {
      console.log('📡 Unregistering audio control listener');
      socketService.off('audio_control', handleAudioControl);
    };
  }, []); // Loại bỏ dependency để chỉ đăng ký một lần

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
    };
  }, []);

  // Update volume khi state thay đổi
  useEffect(() => {
    if (audioRef.current) {
      const newVolume = state.isMuted ? 0 : state.volume;
      console.log('🔊 Updating audio element volume:', newVolume);
      audioRef.current.volume = newVolume;
    }
  }, [state.volume, state.isMuted]);

  const value = {
    // State
    ...state,

    // Audio functions
    playAudio,
    stopCurrentAudio,
    toggleAudioEnabled,
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

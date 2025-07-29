import React, { createContext, useContext, useReducer, useRef, useEffect, useCallback } from 'react';
import socketService from '../services/socketService';

// Audio State
const initialState = {
  currentAudio: null, // Tên file audio đang phát
  isPlaying: false,
  isMuted: false,
  volume: 0.7,
  audioEnabled: true, // Global audio toggle
  recordingState: 'stopped', // 'recording', 'paused', 'stopped'
  recordedAudio: null,
  currentComponent: null, // Component nào đang phát audio
  userInteracted: false, // Track if user has interacted with the page
};

// Audio Actions
const audioActions = {
  PLAY_AUDIO: 'PLAY_AUDIO',
  STOP_AUDIO: 'STOP_AUDIO',
  SET_VOLUME: 'SET_VOLUME',
  TOGGLE_MUTE: 'TOGGLE_MUTE',
  TOGGLE_AUDIO_ENABLED: 'TOGGLE_AUDIO_ENABLED',
  SET_RECORDING_STATE: 'SET_RECORDING_STATE',
  SET_RECORDED_AUDIO: 'SET_RECORDED_AUDIO',
  SET_CURRENT_COMPONENT: 'SET_CURRENT_COMPONENT',
  SET_USER_INTERACTED: 'SET_USER_INTERACTED',
};

// Audio Reducer
const audioReducer = (state, action) => {
  switch (action.type) {
    case audioActions.PLAY_AUDIO:
      return {
        ...state,
        currentAudio: action.payload.audioFile,
        isPlaying: true,
        currentComponent: action.payload.component,
      };
    case audioActions.STOP_AUDIO:
      return {
        ...state,
        currentAudio: null,
        isPlaying: false,
        currentComponent: null,
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
    case audioActions.TOGGLE_AUDIO_ENABLED:
      return {
        ...state,
        audioEnabled: !state.audioEnabled,
        // Nếu tắt audio thì dừng phát
        ...(state.audioEnabled && { isPlaying: false, currentAudio: null, currentComponent: null }),
      };
    case audioActions.SET_RECORDING_STATE:
      return {
        ...state,
        recordingState: action.payload,
      };
    case audioActions.SET_RECORDED_AUDIO:
      return {
        ...state,
        recordedAudio: action.payload,
      };
    case audioActions.SET_CURRENT_COMPONENT:
      return {
        ...state,
        currentComponent: action.payload,
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

// Audio Provider
export const AudioProvider = ({ children }) => {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Static audio file mapping for different components
  const audioFiles = {
    poster: '/audio/poster.mp3',   // For Intro, HalfTime, Poster components
    rasan: '/audio/rasan.mp3',    // For ScoreboardBelow component
    gialap: '/audio/gialap.mp3',  // For ScoreboardAbove component
  };

  // Pending audio requests để tránh multiple triggers
  const pendingAudioRef = useRef(null);
  const lastAudioRequestRef = useRef(null);
  
  // Queue for pending audio requests when user hasn't interacted yet
  const pendingAudioQueue = useRef([]);

  // Set up user interaction listeners
  useEffect(() => {
    const handleUserInteraction = () => {
      console.log('🎵 User interaction detected - enabling audio autoplay');
      dispatch({ type: audioActions.SET_USER_INTERACTED, payload: true });
      
      // Process any queued audio requests
      if (pendingAudioQueue.current.length > 0) {
        console.log('🎵 Processing queued audio requests:', pendingAudioQueue.current.length);
        const queuedRequest = pendingAudioQueue.current[pendingAudioQueue.current.length - 1]; // Get latest request
        pendingAudioQueue.current = []; // Clear queue
        playAudio(queuedRequest.audioKey, queuedRequest.component);
      }
      
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

  // Dừng audio hiện tại
  const stopCurrentAudio = () => {
    console.log('🛑 Stopping current audio');
    
    // Cancel pending audio request nếu có
    if (pendingAudioRef.current) {
      clearTimeout(pendingAudioRef.current);
      pendingAudioRef.current = null;
    }

    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        // Xóa event listeners để tránh memory leak
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
      } catch (error) {
        console.warn('⚠️ Error stopping audio:', error);
      }
      audioRef.current = null;
    }
    dispatch({ type: audioActions.STOP_AUDIO });
  };

  // Play static audio for components
  const playAudio = (audioKey, component = null) => {
    console.log('🎵 Play audio request:', { audioKey, component, audioEnabled: state.audioEnabled, userInteracted: state.userInteracted });
    
    if (!state.audioEnabled) {
      console.log('🔇 Audio disabled globally');
      return;
    }

    const audioFile = audioFiles[audioKey];
    if (!audioFile) {
      console.error('❌ Audio file not found:', audioKey);
      return;
    }

    // Check if same audio is already playing for same component
    if (lastAudioRequestRef.current === `${audioKey}-${component}` &&
      state.currentAudio === audioKey &&
      state.currentComponent === component &&
      state.isPlaying) {
      console.log('⏭️ Same audio already playing, skipping duplicate request');
      return;
    }

    // If user hasn't interacted yet, queue the request
    if (!state.userInteracted) {
      console.log('⏳ User hasn\'t interacted yet, queuing audio request');
      pendingAudioQueue.current.push({ audioKey, component });
      return;
    }

    lastAudioRequestRef.current = `${audioKey}-${component}`;

    // Stop current audio before playing new one
    stopCurrentAudio();

    // Delay to ensure audio cleanup is complete
    pendingAudioRef.current = setTimeout(() => {
      if (pendingAudioRef.current === null) {
        console.log('⏹️ Audio request cancelled during delay');
        return;
      }

      try {
        console.log('🎵 Creating new audio element:', audioFile);
        const audio = new Audio(audioFile);
        audioRef.current = audio;
        audio.volume = state.isMuted ? 0 : state.volume;

        dispatch({
          type: audioActions.PLAY_AUDIO,
          payload: { audioFile: audioKey, component }
        });

        audio.onended = () => {
          console.log('✅ Audio playback ended');
          dispatch({ type: audioActions.STOP_AUDIO });
          lastAudioRequestRef.current = null;
        };

        audio.onerror = (e) => {
          console.error('❌ Audio playback error:', e);
          dispatch({ type: audioActions.STOP_AUDIO });
          lastAudioRequestRef.current = null;
        };

        const playPromise = audio.play();
        if (playPromise) {
          playPromise
            .then(() => {
              console.log('✅ Audio started playing successfully');
            })
            .catch((error) => {
              console.error('❌ Failed to play audio:', error);
              
              // If it's an autoplay error, queue for later
              if (error.name === 'NotAllowedError') {
                console.log('⏳ Autoplay blocked, queuing for user interaction');
                pendingAudioQueue.current.push({ audioKey, component });
                dispatch({ type: audioActions.SET_USER_INTERACTED, payload: false });
              }
              
              dispatch({ type: audioActions.STOP_AUDIO });
              lastAudioRequestRef.current = null;
            });
        }

      } catch (error) {
        console.error('❌ Error creating audio:', error);
        dispatch({ type: audioActions.STOP_AUDIO });
        lastAudioRequestRef.current = null;
      }

      pendingAudioRef.current = null;
    }, 50);
  };

  // Điều chỉnh volume
  const setVolume = (volume) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    console.log('🔊 Setting volume:', clampedVolume);
    dispatch({ type: audioActions.SET_VOLUME, payload: clampedVolume });
  };

  // Toggle mute
  const toggleMute = () => {
    console.log('🔇 Toggling mute, current state:', state.isMuted);
    dispatch({ type: audioActions.TOGGLE_MUTE });
  };

  // Toggle audio toàn cục
  const toggleAudioEnabled = useCallback(() => {
    // Kiểm tra trước khi dispatch để có state cũ
    const wasEnabled = state.audioEnabled;
    const newState = !wasEnabled;
    
    console.log('🎵 Toggling global audio:', { wasEnabled, newState });

    // Cập nhật state local
    dispatch({ type: audioActions.TOGGLE_AUDIO_ENABLED });

    // Gửi trạng thái mới lên server
    try {
      if (socketService.socket && socketService.socket.connected) {
        if (newState) {
          // Bật audio cho tất cả
          console.log('📡 Sending enable audio to server');
          socketService.enableAudioForAll();
        } else {
          // Tắt audio cho tất cả
          console.log('📡 Sending disable audio to server');
          socketService.disableAudioForAll();
        }

        // Đồng thời cập nhật volume nếu cần
        if (newState && state.volume !== 0.7) {
          console.log('📡 Sending volume update to server:', state.volume);
          socketService.setVolumeForAll(state.volume);
        }
      }
    } catch (error) {
      console.error('❌ Lỗi khi gửi trạng thái audio lên server:', error);
    }

    // Nếu đang từ enabled -> disabled, dừng phát audio hiện tại
    if (wasEnabled && audioRef.current) {
      stopCurrentAudio();
    }
  }, [state.audioEnabled, state.volume]);

  // Thu âm - Bắt đầu
  const startRecording = async () => {
    console.log('🎤 Starting recording');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        console.log('🎤 Recording stopped, blob size:', audioBlob.size);
        dispatch({ type: audioActions.SET_RECORDED_AUDIO, payload: audioBlob });
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      dispatch({ type: audioActions.SET_RECORDING_STATE, payload: 'recording' });

    } catch (error) {
      console.error('❌ Error starting recording:', error);
      alert('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
    }
  };

  // Thu âm - Dừng
  const stopRecording = () => {
    console.log('🛑 Stopping recording');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      dispatch({ type: audioActions.SET_RECORDING_STATE, payload: 'stopped' });
    }
  };

  // Thu âm - Tạm dừng
  const pauseRecording = () => {
    console.log('⏸️ Pausing recording');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      dispatch({ type: audioActions.SET_RECORDING_STATE, payload: 'paused' });
    }
  };

  // Thu âm - Tiếp tục
  const resumeRecording = () => {
    console.log('▶️ Resuming recording');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      dispatch({ type: audioActions.SET_RECORDING_STATE, payload: 'recording' });
    }
  };

  // Send recorded audio via socket
  const sendRecordedAudio = async (socketService, accessCode) => {
    if (!state.recordedAudio) {
      console.error('❌ No recorded audio to send');
      return;
    }

    try {
      console.log('📡 Sending recorded audio via socket');
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result;
        socketService.emit('voice-chunk', buffer);
      };
      reader.readAsArrayBuffer(state.recordedAudio);
    } catch (error) {
      console.error('❌ Error sending recorded audio:', error);
    }
  };

  // Lắng nghe thay đổi trạng thái audio từ server
  useEffect(() => {
    const handleAudioControl = (data) => {
      console.log('📡 Received audio_control from server:', data);
      
      if (data.command === 'ENABLE_AUDIO') {
        console.log('📡 Server command: ENABLE_AUDIO');
        if (!state.audioEnabled) {
          dispatch({ type: audioActions.TOGGLE_AUDIO_ENABLED });
        }
      } else if (data.command === 'DISABLE_AUDIO') {
        console.log('📡 Server command: DISABLE_AUDIO');
        if (state.audioEnabled) {
          dispatch({ type: audioActions.TOGGLE_AUDIO_ENABLED });
          stopCurrentAudio();
        }
      } else if (data.command === 'SET_VOLUME' && data.payload) {
        console.log('📡 Server command: SET_VOLUME', data.payload.volume);
        dispatch({ type: audioActions.SET_VOLUME, payload: data.payload.volume });
      } else if (data.command === 'MUTE') {
        console.log('📡 Server command: MUTE');
        if (!state.isMuted) {
          dispatch({ type: audioActions.TOGGLE_MUTE });
        }
      } else if (data.command === 'UNMUTE') {
        console.log('📡 Server command: UNMUTE');
        if (state.isMuted) {
          dispatch({ type: audioActions.TOGGLE_MUTE });
        }
      } else if (data.command === 'PLAY_AUDIO' && data.payload) {
        console.log('📡 Server command: PLAY_AUDIO', data.payload);
        const { audioFile, component } = data.payload;
        playAudio(audioFile, component);
      } else if (data.command === 'STOP_AUDIO') {
        console.log('📡 Server command: STOP_AUDIO');
        stopCurrentAudio();
      } else {
        console.log('📡 Unknown audio control command:', data.command);
      }
    };

    // Đăng ký lắng nghe sự kiện điều khiển audio
    console.log('📡 Registering audio control listener');
    socketService.onAudioControl(handleAudioControl);

    // Yêu cầu trạng thái hiện tại khi kết nối (thay thế requestAudioStatus)
    if (socketService.socket && socketService.socket.connected) {
      console.log('📡 Requesting current state from server');
      socketService.requestCurrentState();
    }

    // Cleanup
    return () => {
      console.log('📡 Unregistering audio control listener');
      socketService.off('audio_control', handleAudioControl);
    };
  }, [state.audioEnabled, state.isMuted]);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up AudioProvider');
      
      // Cancel pending audio requests
      if (pendingAudioRef.current) {
        clearTimeout(pendingAudioRef.current);
        pendingAudioRef.current = null;
      }

      // Clear pending queue
      pendingAudioQueue.current = [];

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

      // Cleanup media recorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (error) {
          console.warn('⚠️ Error stopping media recorder:', error);
        }
      }

      // Reset tracking refs
      lastAudioRequestRef.current = null;
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

    // Audio playback functions
    playAudio,
    stopCurrentAudio,
    setVolume,
    toggleMute,
    toggleAudioEnabled,

    // Recording functions
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    sendRecordedAudio,

    // Helper functions
    isComponentPlaying: (component) => state.currentComponent === component && state.isPlaying,
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
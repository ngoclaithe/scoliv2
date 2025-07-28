import React, { createContext, useContext, useReducer, useRef, useEffect } from 'react';

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

  // Audio file mapping
  const audioFiles = {
    poster: '/audio/poster.mp3',
    rasan: '/audio/rasan.mp3', 
    gialap: '/audio/gialap.mp3',
  };

  // Dừng audio hiện tại
  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    dispatch({ type: audioActions.STOP_AUDIO });
  };

  // Phát audio
  const playAudio = (audioKey, component = null) => {
    if (!state.audioEnabled) {
      console.log('Audio disabled globally');
      return;
    }

    const audioFile = audioFiles[audioKey];
    if (!audioFile) {
      console.error('Audio file not found:', audioKey);
      return;
    }

    // Dừng audio hiện tại trước khi phát audio mới
    stopCurrentAudio();

    // Tạo audio element mới
    const audio = new Audio(audioFile);
    audioRef.current = audio;

    // Thiết lập volume
    audio.volume = state.isMuted ? 0 : state.volume;

    // Cập nhật state
    dispatch({ 
      type: audioActions.PLAY_AUDIO, 
      payload: { audioFile: audioKey, component } 
    });

    // Sự kiện khi audio kết thúc
    audio.onended = () => {
      dispatch({ type: audioActions.STOP_AUDIO });
    };

    // Sự kiện lỗi
    audio.onerror = (e) => {
      console.error('Audio playback error:', e);
      dispatch({ type: audioActions.STOP_AUDIO });
    };

    // Phát audio
    audio.play().catch((error) => {
      console.error('Failed to play audio:', error);
      dispatch({ type: audioActions.STOP_AUDIO });
    });
  };

  // Điều chỉnh volume
  const setVolume = (volume) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    dispatch({ type: audioActions.SET_VOLUME, payload: clampedVolume });
    
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : clampedVolume;
    }
  };

  // Toggle mute
  const toggleMute = () => {
    dispatch({ type: audioActions.TOGGLE_MUTE });
    
    if (audioRef.current) {
      audioRef.current.volume = !state.isMuted ? 0 : state.volume;
    }
  };

  // Toggle audio toàn cục
  const toggleAudioEnabled = () => {
    dispatch({ type: audioActions.TOGGLE_AUDIO_ENABLED });
    
    // Nếu đang tắt audio, dừng phát
    if (state.audioEnabled && audioRef.current) {
      stopCurrentAudio();
    }
  };

  // Thu âm - Bắt đầu
  const startRecording = async () => {
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
        dispatch({ type: audioActions.SET_RECORDED_AUDIO, payload: audioBlob });
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      dispatch({ type: audioActions.SET_RECORDING_STATE, payload: 'recording' });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
    }
  };

  // Thu âm - Dừng
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      dispatch({ type: audioActions.SET_RECORDING_STATE, payload: 'stopped' });
    }
  };

  // Thu âm - Tạm dừng
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      dispatch({ type: audioActions.SET_RECORDING_STATE, payload: 'paused' });
    }
  };

  // Thu âm - Tiếp tục
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      dispatch({ type: audioActions.SET_RECORDING_STATE, payload: 'recording' });
    }
  };

  // Gửi audio qua socket
  const sendRecordedAudio = async (socketService, accessCode) => {
    if (!state.recordedAudio) {
      console.error('No recorded audio to send');
      return;
    }

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64Audio = reader.result.split(',')[1]; // Remove data:audio/webm;base64,
        
        // Emit via socket
        socketService.emit('commentary_audio', {
          accessCode,
          audioData: base64Audio,
          timestamp: Date.now(),
          mimeType: 'audio/webm;codecs=opus'
        });
      };
      reader.readAsDataURL(state.recordedAudio);
    } catch (error) {
      console.error('Error sending recorded audio:', error);
    }
  };

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Update volume khi state thay đổi
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : state.volume;
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

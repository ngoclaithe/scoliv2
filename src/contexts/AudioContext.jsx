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



  // Static audio file mapping for different components
  const audioFiles = {
    poster: '/audio/poster.mp3',   // For Intro, HalfTime, Poster components
    rasan: '/audio/rasan.mp3',    // For ScoreboardBelow component
    gialap: '/audio/gialap.mp3',  // For ScoreboardAbove component
  };

  // Pending audio requests để tránh multiple triggers
  const pendingAudioRef = useRef(null);
  const lastAudioRequestRef = useRef(null);

  // Dừng audio hiện tại
  const stopCurrentAudio = () => {
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
        console.warn('Error stopping audio:', error);
      }
      audioRef.current = null;
    }
    dispatch({ type: audioActions.STOP_AUDIO });
  };

  // Play static audio for components
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

    // Check if same audio is already playing for same component
    if (lastAudioRequestRef.current === `${audioKey}-${component}` &&
        state.currentAudio === audioKey &&
        state.currentComponent === component &&
        state.isPlaying) {
      console.log('Same audio already playing, skipping duplicate request');
      return;
    }

    lastAudioRequestRef.current = `${audioKey}-${component}`;

    // Stop current audio before playing new one
    stopCurrentAudio();

    // Delay to ensure audio cleanup is complete
    pendingAudioRef.current = setTimeout(() => {
      if (pendingAudioRef.current === null) {
        return;
      }

      try {
        const audio = new Audio(audioFile);
        audioRef.current = audio;
        audio.volume = state.isMuted ? 0 : state.volume;

        dispatch({
          type: audioActions.PLAY_AUDIO,
          payload: { audioFile: audioKey, component }
        });

        audio.onended = () => {
          dispatch({ type: audioActions.STOP_AUDIO });
          lastAudioRequestRef.current = null;
        };

        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          dispatch({ type: audioActions.STOP_AUDIO });
          lastAudioRequestRef.current = null;
        };

        const playPromise = audio.play();
        if (playPromise) {
          playPromise.catch((error) => {
            console.error('Failed to play audio:', error);
            dispatch({ type: audioActions.STOP_AUDIO });
            lastAudioRequestRef.current = null;
          });
        }

      } catch (error) {
        console.error('Error creating audio:', error);
        dispatch({ type: audioActions.STOP_AUDIO });
        lastAudioRequestRef.current = null;
      }

      pendingAudioRef.current = null;
    }, 50);
  };

  // Điều chỉnh volume
  const setVolume = (volume) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    dispatch({ type: audioActions.SET_VOLUME, payload: clampedVolume });

    // Volume sẽ được update trong useEffect thay vì tại đây để tránh stale state
  };

  // Toggle mute
  const toggleMute = () => {
    dispatch({ type: audioActions.TOGGLE_MUTE });

    // Volume sẽ được update trong useEffect thay vì tại đây để tránh stale state
  };

  // Toggle audio toàn cục
  const toggleAudioEnabled = () => {
    // Kiểm tra trước khi dispatch để có state cũ
    const wasEnabled = state.audioEnabled;

    dispatch({ type: audioActions.TOGGLE_AUDIO_ENABLED });

    // Nếu đang từ enabled -> disabled, dừng phát audio hiện tại
    if (wasEnabled && audioRef.current) {
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

  // Send recorded audio via socket using opus-media-recorder
  const sendRecordedAudio = async (socketService, accessCode) => {
    if (!state.recordedAudio) {
      console.error('No recorded audio to send');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result;
        socketService.emit('voice-chunk', buffer);
      };
      reader.readAsArrayBuffer(state.recordedAudio);
    } catch (error) {
      console.error('Error sending recorded audio:', error);
    }
  };



  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      // Cancel pending audio requests
      if (pendingAudioRef.current) {
        clearTimeout(pendingAudioRef.current);
        pendingAudioRef.current = null;
      }

      // Cleanup audio
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.onended = null;
          audioRef.current.onerror = null;
        } catch (error) {
          console.warn('Error cleaning up audio:', error);
        }
        audioRef.current = null;
      }

      // Cleanup media recorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (error) {
          console.warn('Error stopping media recorder:', error);
        }
      }



      // Reset tracking refs
      lastAudioRequestRef.current = null;
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

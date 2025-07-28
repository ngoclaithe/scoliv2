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

  // WebRTC Commentary State
  webrtcConnections: new Map(), // Map của peer connections
  isCommentator: false, // Có phải người bình luận không
  commentaryStream: null, // Local media stream
  incomingCommentaryStreams: new Map(), // Map của incoming streams
  webrtcState: 'disconnected', // 'connecting', 'connected', 'disconnected'
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

  // WebRTC Actions
  SET_WEBRTC_STATE: 'SET_WEBRTC_STATE',
  SET_COMMENTATOR: 'SET_COMMENTATOR',
  SET_COMMENTARY_STREAM: 'SET_COMMENTARY_STREAM',
  ADD_WEBRTC_CONNECTION: 'ADD_WEBRTC_CONNECTION',
  REMOVE_WEBRTC_CONNECTION: 'REMOVE_WEBRTC_CONNECTION',
  ADD_INCOMING_STREAM: 'ADD_INCOMING_STREAM',
  REMOVE_INCOMING_STREAM: 'REMOVE_INCOMING_STREAM',
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
    case audioActions.SET_WEBRTC_STATE:
      return {
        ...state,
        webrtcState: action.payload,
      };
    case audioActions.SET_COMMENTATOR:
      return {
        ...state,
        isCommentator: action.payload,
      };
    case audioActions.SET_COMMENTARY_STREAM:
      return {
        ...state,
        commentaryStream: action.payload,
      };
    case audioActions.ADD_WEBRTC_CONNECTION:
      const newConnections = new Map(state.webrtcConnections);
      newConnections.set(action.payload.id, action.payload.connection);
      return {
        ...state,
        webrtcConnections: newConnections,
      };
    case audioActions.REMOVE_WEBRTC_CONNECTION:
      const updatedConnections = new Map(state.webrtcConnections);
      updatedConnections.delete(action.payload);
      return {
        ...state,
        webrtcConnections: updatedConnections,
      };
    case audioActions.ADD_INCOMING_STREAM:
      const newStreams = new Map(state.incomingCommentaryStreams);
      newStreams.set(action.payload.id, action.payload.stream);
      return {
        ...state,
        incomingCommentaryStreams: newStreams,
      };
    case audioActions.REMOVE_INCOMING_STREAM:
      const updatedStreams = new Map(state.incomingCommentaryStreams);
      updatedStreams.delete(action.payload);
      return {
        ...state,
        incomingCommentaryStreams: updatedStreams,
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

  // WebRTC refs
  const localStreamRef = useRef(null);
  const webrtcConfigRef = useRef({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  });

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

    // Volume sẽ được update trong useEffect thay vì tại đây để tránh stale state
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

  // Gửi audio qua socket (deprecated - dùng cho fallback)
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

  // === WebRTC Commentary Functions ===

  // Bắt đầu commentary stream với WebRTC
  const startWebRTCCommentary = async (socketService, accessCode) => {
    try {
      dispatch({ type: audioActions.SET_WEBRTC_STATE, payload: 'connecting' });

      // Lấy audio stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1
        }
      });

      localStreamRef.current = stream;
      dispatch({ type: audioActions.SET_COMMENTARY_STREAM, payload: stream });
      dispatch({ type: audioActions.SET_COMMENTATOR, payload: true });

      // Thông báo server là commentator
      socketService.emit('webrtc_commentator_ready', {
        accessCode,
        timestamp: Date.now()
      });

      dispatch({ type: audioActions.SET_WEBRTC_STATE, payload: 'connected' });

      return stream;
    } catch (error) {
      console.error('Error starting WebRTC commentary:', error);
      dispatch({ type: audioActions.SET_WEBRTC_STATE, payload: 'disconnected' });
      throw error;
    }
  };

  // Dừng commentary stream
  const stopWebRTCCommentary = (socketService, accessCode) => {
    try {
      // Dừng local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }

      // Đóng tất cả peer connections
      state.webrtcConnections.forEach((connection, peerId) => {
        connection.close();
        dispatch({ type: audioActions.REMOVE_WEBRTC_CONNECTION, payload: peerId });
      });

      // Clear incoming streams
      state.incomingCommentaryStreams.forEach((stream, peerId) => {
        dispatch({ type: audioActions.REMOVE_INCOMING_STREAM, payload: peerId });
      });

      dispatch({ type: audioActions.SET_COMMENTARY_STREAM, payload: null });
      dispatch({ type: audioActions.SET_COMMENTATOR, payload: false });
      dispatch({ type: audioActions.SET_WEBRTC_STATE, payload: 'disconnected' });

      // Thông báo server
      socketService.emit('webrtc_commentator_stopped', {
        accessCode,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Error stopping WebRTC commentary:', error);
    }
  };

  // Tạo peer connection cho listener
  const createPeerConnection = async (socketService, accessCode, targetPeerId) => {
    try {
      const pc = new RTCPeerConnection(webrtcConfigRef.current);

      // Handle incoming stream
      pc.ontrack = (event) => {
        console.log('Received remote stream from:', targetPeerId);
        const [remoteStream] = event.streams;
        dispatch({
          type: audioActions.ADD_INCOMING_STREAM,
          payload: { id: targetPeerId, stream: remoteStream }
        });
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketService.emit('webrtc_ice_candidate', {
            accessCode,
            targetPeerId,
            candidate: event.candidate,
            timestamp: Date.now()
          });
        }
      };

      // Handle connection state change
      pc.onconnectionstatechange = () => {
        console.log('Connection state:', pc.connectionState, 'with peer:', targetPeerId);
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          dispatch({ type: audioActions.REMOVE_WEBRTC_CONNECTION, payload: targetPeerId });
          dispatch({ type: audioActions.REMOVE_INCOMING_STREAM, payload: targetPeerId });
        }
      };

      // Thêm local stream nếu là commentator
      if (state.isCommentator && localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      dispatch({
        type: audioActions.ADD_WEBRTC_CONNECTION,
        payload: { id: targetPeerId, connection: pc }
      });

      return pc;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      throw error;
    }
  };

  // Handle WebRTC offer (cho listeners)
  const handleWebRTCOffer = async (socketService, accessCode, fromPeerId, offer) => {
    try {
      const pc = await createPeerConnection(socketService, accessCode, fromPeerId);

      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socketService.emit('webrtc_answer', {
        accessCode,
        targetPeerId: fromPeerId,
        answer: answer,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Error handling WebRTC offer:', error);
    }
  };

  // Handle WebRTC answer (cho commentator)
  const handleWebRTCAnswer = async (fromPeerId, answer) => {
    try {
      const pc = state.webrtcConnections.get(fromPeerId);
      if (pc) {
        await pc.setRemoteDescription(answer);
      }
    } catch (error) {
      console.error('Error handling WebRTC answer:', error);
    }
  };

  // Handle ICE candidate
  const handleWebRTCIceCandidate = async (fromPeerId, candidate) => {
    try {
      const pc = state.webrtcConnections.get(fromPeerId);
      if (pc) {
        await pc.addIceCandidate(candidate);
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  // Join như listener
  const joinAsListener = (socketService, accessCode) => {
    dispatch({ type: audioActions.SET_COMMENTATOR, payload: false });
    socketService.emit('webrtc_listener_ready', {
      accessCode,
      timestamp: Date.now()
    });
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

    // WebRTC Commentary functions
    startWebRTCCommentary,
    stopWebRTCCommentary,
    createPeerConnection,
    handleWebRTCOffer,
    handleWebRTCAnswer,
    handleWebRTCIceCandidate,
    joinAsListener,

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

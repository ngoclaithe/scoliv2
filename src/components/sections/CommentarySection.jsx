import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Play, Pause } from "lucide-react";
import socketService from "../../services/socketService";

const CommentarySection = ({ isActive = true }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  const [continuousRecording, setContinuousRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const continuousTimeoutRef = useRef(null);
  const emitIntervalRef = useRef(null);

  // Check for browser support and codecs
  const isSupported = typeof navigator !== 'undefined' &&
                     navigator.mediaDevices &&
                     navigator.mediaDevices.getUserMedia &&
                     typeof MediaRecorder !== 'undefined';

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/wav'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log('🎙️ Using mime type:', type);
        return type;
      }
    }
    return null;
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (continuousTimeoutRef.current) {
        clearTimeout(continuousTimeoutRef.current);
      }
      if (realTimeIntervalRef.current) {
        clearInterval(realTimeIntervalRef.current);
      }
    };
  }, []);

  // Dừng ghi âm khi tab không active nữa
  useEffect(() => {
    if (!isActive) {
      console.log('🔇 [CommentarySection] Tab inactive, stopping recording');
      stopAllRecording();
    }
  }, [isActive]);

  const stopAllRecording = () => {
    // Dừng ghi âm hiện tại
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Dừng stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear timeout and interval
    if (continuousTimeoutRef.current) {
      clearTimeout(continuousTimeoutRef.current);
      continuousTimeoutRef.current = null;
    }

    if (realTimeIntervalRef.current) {
      clearInterval(realTimeIntervalRef.current);
      realTimeIntervalRef.current = null;
    }

    // Reset states
    setIsRecording(false);
    setContinuousRecording(false);
    setIsRealTimeTransmission(false);
    setIsProcessing(false);
  };

  const startRecording = async () => {
    if (!isSupported) {
      alert('Trình duyệt không hỗ trợ ghi âm');
      return;
    }

    const mimeType = getSupportedMimeType();
    if (!mimeType) {
      alert('Trình duyệt không hỗ trợ các codec audio cần thiết');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1,
          autoGainControl: true
        }
      });

      streamRef.current = stream;
      await createMediaRecorder(stream, mimeType);
      
      console.log('🎙️ Voice recording started with codec:', mimeType);
    } catch (error) {
      console.error('Lỗi khi bắt đầu ghi âm:', error);
      alert('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
    }
  };

  const createMediaRecorder = async (stream, mimeType) => {
    const options = { mimeType };
    if (mimeType.includes('opus') || mimeType.includes('webm')) {
      options.audioBitsPerSecond = 64000;
    }

    const mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);

        // Nếu là real-time transmission, gửi luôn chunk này
        if (isRealTimeTranmission && audioChunksRef.current.length > 0) {
          sendCurrentChunks();
        }
      }
    };

    mediaRecorder.onstop = () => {
      console.log('🎙️ MediaRecorder stopped, processing...');
      if (!isRealTimeTranmission) {
        processRecording();
      } else {
        // Gửi chunk cuối cùng và reset
        sendCurrentChunks();
        audioChunksRef.current = [];
        setIsProcessing(false);
        scheduleNextContinuousChunk();
      }
    };

    // Start recording với interval thích hợp
    if (isRealTimeTranmission) {
      // Real-time mode: thu thập data mỗi 200ms và gửi ngay
      mediaRecorder.start(200);
    } else {
      // Normal mode: thu thập data mỗi 100ms
      mediaRecorder.start(100);
    }

    setIsRecording(true);

    // Nếu là continuous mode, tự động stop sau 2 giây (giảm từ 3s để responsive hơn)
    if (isContinuousMode && continuousRecording) {
      continuousTimeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          console.log('🎙️ Auto-stopping continuous chunk');
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 2000); // Giảm xuống 2 giây cho real-time hơn
    }
  };

  const stopRecording = () => {
    if (continuousTimeoutRef.current) {
      clearTimeout(continuousTimeoutRef.current);
      continuousTimeoutRef.current = null;
    }

    if (realTimeIntervalRef.current) {
      clearInterval(realTimeIntervalRef.current);
      realTimeIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (!isRealTimeTranmission) {
        setIsProcessing(true);
      }
    }

    // Reset real-time mode khi stop (trừ khi là continuous mode)
    if (!continuousRecording) {
      setIsRealTimeTransmission(false);
    }
  };

  const processRecording = async () => {
    if (audioChunksRef.current.length === 0) {
      console.log('⚠️ No audio chunks to process');
      setIsProcessing(false);
      scheduleNextContinuousChunk();
      return;
    }

    const mimeType = mediaRecorderRef.current?.mimeType || getSupportedMimeType() || 'audio/webm';
    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

    console.log('🎙️ Voice recorded:', audioBlob.size, 'bytes');

    try {
      setIsProcessing(true);
      await sendVoiceToServer(audioBlob);
      console.log('✅ Voice sent to server successfully');
    } catch (error) {
      console.error('❌ Failed to send voice to server:', error);
      alert('Không thể gửi voice lên server');
    }

    // Reset audio chunks
    audioChunksRef.current = [];
    setIsProcessing(false);

    // Nếu đang trong continuous mode, schedule chunk tiếp theo
    scheduleNextContinuousChunk();
  };

  const scheduleNextContinuousChunk = () => {
    if (isContinuousMode && continuousRecording && streamRef.current) {
      console.log('🔄 Scheduling next continuous chunk');
      // Delay ngắn để tránh gap
      setTimeout(() => {
        if (continuousRecording && streamRef.current) {
          startNextContinuousChunk();
        }
      }, 100);
    }
  };

  const sendVoiceToServer = async (audioBlob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);

        if (socketService.socket && socketService.socket.connected) {
          const mimeType = mediaRecorderRef.current?.mimeType || getSupportedMimeType() || 'audio/webm';
          const success = socketService.sendRefereeVoice(
            Array.from(uint8Array),
            mimeType
          );

          if (success) {
            resolve();
          } else {
            reject(new Error('Failed to send voice through socket service'));
          }
        } else {
          reject(new Error('Socket not connected'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(audioBlob);
    });
  };

  // Hàm gửi current chunks ngay lập tức (cho real-time mode)
  const sendCurrentChunks = async () => {
    if (audioChunksRef.current.length === 0) {
      return;
    }

    const mimeType = mediaRecorderRef.current?.mimeType || getSupportedMimeType() || 'audio/webm';
    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

    console.log('🎙️ [Real-time] Sending voice chunk:', audioBlob.size, 'bytes');

    try {
      await sendVoiceToServer(audioBlob);
      console.log('✅ [Real-time] Voice chunk sent successfully');
    } catch (error) {
      console.error('❌ [Real-time] Failed to send voice chunk:', error);
    }

    // Clear chunks after sending
    audioChunksRef.current = [];
  };

  const startContinuousRecording = async () => {
    console.log('🎙️ Starting continuous recording mode');
    setContinuousRecording(true);
    setIsRealTimeTransmission(true); // Bật real-time transmission
    await startRecording();
  };

  const startNextContinuousChunk = async () => {
    if (!streamRef.current || !continuousRecording) {
      console.log('⚠️ Cannot start next chunk - no stream or not recording');
      return;
    }

    console.log('🎙️ Starting next continuous chunk');
    const mimeType = getSupportedMimeType();
    await createMediaRecorder(streamRef.current, mimeType);
  };

  const stopContinuousRecording = () => {
    console.log('🔇 Stopping continuous recording');
    setContinuousRecording(false);
    setIsRealTimeTransmission(false); // Tắt real-time transmission

    if (continuousTimeoutRef.current) {
      clearTimeout(continuousTimeoutRef.current);
      continuousTimeoutRef.current = null;
    }

    if (realTimeIntervalRef.current) {
      clearInterval(realTimeIntervalRef.current);
      realTimeIntervalRef.current = null;
    }

    // Dừng current recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    // Stop stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const toggleRealTimeRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setIsRealTimeTransmission(true);
      startRecording();
    }
  };

  const toggleContinuousMode = () => {
    if (continuousRecording) {
      stopContinuousRecording();
    } else {
      startContinuousRecording();
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Mode Toggle */}
      <div className="flex flex-col items-center space-y-2 mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              stopAllRecording();
              setIsContinuousMode(false);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !isContinuousMode
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ấn để nói
          </button>
          <button
            onClick={() => {
              stopAllRecording();
              setIsContinuousMode(true);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isContinuousMode
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Nói liên tục
          </button>
        </div>

        {/* Real-time toggle for push-to-talk mode */}
        {!isContinuousMode && (
          <div className="flex items-center space-x-2 mt-2">
            <label className="text-xs text-gray-600">
              Phát trực tiếp:
            </label>
            <button
              onClick={() => setIsRealTimeTransmission(!isRealTimeTranmission)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                isRealTimeTranmission
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {isRealTimeTranmission ? 'BẬT' : 'TẮT'}
            </button>
          </div>
        )}

        {/* Real-time indicator */}
        {isRealTimeTranmission && isRecording && (
          <div className="text-xs text-red-600 font-medium animate-pulse">
            🔴 PHÁT TRỰC TIẾP
          </div>
        )}
      </div>

      {/* Voice Recording Button */}
      <div className="flex justify-center">
        <button
          onClick={isContinuousMode ? toggleContinuousMode : (isRealTimeTranmission && !isRecording ? toggleRealTimeRecording : toggleRecording)}
          disabled={isProcessing || !isSupported}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform
            ${continuousRecording
              ? 'bg-green-500 hover:bg-green-600 animate-pulse scale-110'
              : isRecording && isRealTimeTranmission
                ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110 ring-4 ring-red-300'
                : isRecording
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110'
                  : isContinuousMode
                    ? 'bg-green-500 hover:bg-green-600'
                    : isRealTimeTranmission
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-blue-500 hover:bg-blue-600'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            text-white shadow-lg hover:shadow-xl
            ${!isSupported ? 'bg-gray-400 cursor-not-allowed' : ''}
          `}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          ) : isContinuousMode ? (
            continuousRecording ? <Pause size={32} /> : <Play size={32} />
          ) : isRecording ? (
            <MicOff size={32} />
          ) : (
            <Mic size={32} />
          )}
        </button>
      </div>

      {/* Status Text */}
      <div className="text-center">
        {isProcessing && (
          <p className="text-blue-600 font-medium">Đang xử lý & gửi...</p>
        )}
        {continuousRecording && !isProcessing && (
          <p className="text-green-600 font-medium animate-pulse">
            🟢 {isRecording ? 'Đang ghi...' : 'Đang chuẩn bị chunk tiếp...'}
          </p>
        )}
        {isRecording && !continuousRecording && !isProcessing && (
          <p className="text-red-600 font-medium animate-pulse">● Đang ghi âm...</p>
        )}
        {!isRecording && !isProcessing && !continuousRecording && (
          <p className="text-gray-600">
            {isContinuousMode ? 'Ấn Play để bắt đầu bình luận liên tục' : 'Ấn mic để bắt đầu bình luận'}
          </p>
        )}
        {!isSupported && (
          <p className="text-red-600">Trình duyệt không hỗ trợ ghi âm</p>
        )}

        {/* Mode Description */}
        <div className="mt-2 text-xs text-gray-500">
          {isContinuousMode ? (
            <p>Chế độ nói liên tục: Audio được gửi realtime mỗi 200ms</p>
          ) : isRealTimeTranmission ? (
            <p>Chế độ ấn để nói (REALTIME): Audio được gửi liên tục mỗi 200ms</p>
          ) : (
            <p>Chế độ ấn để nói: Ấn một lần để bắt đầu, ấn lại để dừng và gửi</p>
          )}
        </div>
      </div>

      {/* Debug Info (có thể bỏ trong production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 mt-4 p-2 bg-gray-100 rounded">
          <p>isContinuousMode: {isContinuousMode.toString()}</p>
          <p>continuousRecording: {continuousRecording.toString()}</p>
          <p>isRealTimeTranmission: {isRealTimeTranmission.toString()}</p>
          <p>isRecording: {isRecording.toString()}</p>
          <p>isProcessing: {isProcessing.toString()}</p>
        </div>
      )}
    </div>
  );
};

export default CommentarySection;

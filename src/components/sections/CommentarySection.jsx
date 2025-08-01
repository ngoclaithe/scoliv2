import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import socketService from "../../services/socketService";

const CommentarySection = ({ isActive = true }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const continuousTimeoutRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  // REF để track real-time state
  const isRecordingRef = useRef(false);

  // Sync ref với state
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

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

  // Test if browser can play the recorded format
  const canPlayFormat = (mimeType) => {
    const audio = document.createElement('audio');
    return audio.canPlayType(mimeType) !== '';
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopAllRecording();
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
    
    // Clear timeout
    if (continuousTimeoutRef.current) {
      clearTimeout(continuousTimeoutRef.current);
      continuousTimeoutRef.current = null;
    }
    
    // Reset states
    setIsRecording(false);
    setIsProcessing(false);
    audioChunksRef.current = [];
  };

  const sendAccumulatedChunks = () => {
    if (audioChunksRef.current.length === 0) {
      console.log('⚠️ No chunks to send');
      return;
    }

    const mimeType = mediaRecorderRef.current?.mimeType || getSupportedMimeType() || 'audio/webm';
    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

    console.log('📡 Sending accumulated chunks:', {
      chunksCount: audioChunksRef.current.length,
      totalSize: audioBlob.size,
      mimeType: mimeType
    });

    // Kiểm tra nếu blob quá nhỏ
    if (audioBlob.size < 1000) { // < 1KB
      console.warn('⚠️ Audio blob too small, might be invalid:', audioBlob.size, 'bytes');
      // Vẫn thử gửi, nhưng cảnh báo
    }

    // Reset chunks array ngay sau khi tạo blob
    audioChunksRef.current = [];
    
    // Gửi ngay lập tức
    sendVoiceToServer(audioBlob).then(() => {
      console.log('✅ Accumulated chunks sent successfully');
    }).catch(error => {
      console.error('❌ Failed to send accumulated chunks:', error);
    });
  };

  const createMediaRecorder = async (stream, mimeType) => {
    const options = { 
      mimeType,
      audioBitsPerSecond: 128000 // Tăng bitrate để đảm bảo chất lượng
    };

    const mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        console.log('📥 Data chunk received:', event.data.size, 'bytes');
        // Tích lũy chunks thay vì gửi ngay
        audioChunksRef.current.push(event.data);
        console.log('📦 Total chunks accumulated:', audioChunksRef.current.length);
      }
    };

    mediaRecorder.onstop = () => {
      console.log('🎙️ MediaRecorder stopped');
      
      // Gửi tất cả chunks đã tích lũy
      if (audioChunksRef.current.length > 0) {
        sendAccumulatedChunks();
      }
      
      if (isRecordingRef.current) {
        // Nếu vẫn đang trong chế độ recording, restart ngay lập tức
        scheduleNextChunk();
      }
    };

    mediaRecorder.onstart = () => {
      console.log('🎙️ MediaRecorder started');
      audioChunksRef.current = []; // Reset chunks khi bắt đầu
    };

    // Bắt đầu ghi với timeslice 500ms (tăng từ 100ms)
    console.log('🎙️ Starting MediaRecorder with 500ms chunks');
    mediaRecorder.start(500); // 500ms chunks để đảm bảo đủ data
    setIsRecording(true);

    // Tự động restart sau 2 giây
    continuousTimeoutRef.current = setTimeout(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        console.log('🔄 Auto-restarting recording (500ms -> send)');
        mediaRecorderRef.current.stop(); // Này sẽ trigger onstop -> gửi chunks
      }
    }, 2000);
  };

  const scheduleNextChunk = () => {
    if (!isRecordingRef.current) {
      console.log('⏹️ Recording stopped, not scheduling next chunk');
      return;
    }

    console.log('🔄 Scheduling next chunk');
    continuousTimeoutRef.current = setTimeout(() => {
      if (isRecordingRef.current && streamRef.current && streamRef.current.active) {
        startNextChunk();
      }
    }, 100); // Delay ngắn để tránh gap
  };

  const startNextChunk = async () => {
    if (!streamRef.current || !streamRef.current.active || !isRecordingRef.current) {
      console.log('⚠️ Cannot start next chunk - stream inactive or recording stopped');
      return;
    }

    console.log('🎙️ Starting next chunk');
    const mimeType = getSupportedMimeType();
    await createMediaRecorder(streamRef.current, mimeType);
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

    // Test if browser can play this format
    if (!canPlayFormat(mimeType)) {
      console.warn('⚠️ Browser may not be able to play recorded format:', mimeType);
    }

    try {
      setIsProcessing(true);
      
      // Tạo stream mới
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000, // Tăng sample rate
          channelCount: 1,
          autoGainControl: true
        }
      });
      streamRef.current = stream;

      await createMediaRecorder(stream, mimeType);
      
      setIsProcessing(false);
      console.log('🎙️ Continuous recording started with format:', mimeType);
    } catch (error) {
      console.error('Lỗi khi bắt đầu ghi âm:', error);
      alert('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    console.log('🔇 Stopping continuous recording');
    setIsRecording(false);
    
    if (continuousTimeoutRef.current) {
      clearTimeout(continuousTimeoutRef.current);
      continuousTimeoutRef.current = null;
    }

    // Dừng current recording và gửi chunks cuối cùng
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop(); // Này sẽ trigger gửi chunks cuối
    }

    // Dừng stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
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

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Voice Recording Button */}
      <div className="flex justify-center">
        <button
          onClick={toggleRecording}
          disabled={isProcessing || !isSupported}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform
            ${isRecording
              ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110'
              : 'bg-blue-500 hover:bg-blue-600'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            text-white shadow-lg hover:shadow-xl
            ${!isSupported ? 'bg-gray-400 cursor-not-allowed' : ''}
          `}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
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
          <p className="text-blue-600 font-medium">Đang khởi tạo...</p>
        )}
        {isRecording && !isProcessing && (
          <p className="text-red-600 font-medium animate-pulse">
            🔴 Đang thu âm
          </p>
        )}
        {!isRecording && !isProcessing && (
          <p className="text-gray-600">
            Ấn mic để bắt đầu bình luận liên tục
          </p>
        )}
        {!isSupported && (
          <p className="text-red-600">Trình duyệt không hỗ trợ ghi âm</p>
        )}
      </div>

    </div>
  );
};

export default CommentarySection;
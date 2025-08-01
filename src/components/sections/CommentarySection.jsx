import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import socketService from "../../services/socketService";

const CommentarySection = ({ isActive = true }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const isRecordingRef = useRef(false);

  // Sync ref với state
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Check browser support
  const isSupported = typeof navigator !== 'undefined' &&
                     navigator.mediaDevices &&
                     navigator.mediaDevices.getUserMedia &&
                     typeof MediaRecorder !== 'undefined';

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus', // Opus codec có latency thấp nhất
      'audio/ogg;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/wav'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return null;
  };

  useEffect(() => {
    return () => {
      stopAllRecording();
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      console.log('🔇 Tab inactive, stopping recording');
      stopAllRecording();
    }
  }, [isActive]);

  const stopAllRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsRecording(false);
    setIsProcessing(false);
  };

  const sendVoiceToServer = async (audioBlob) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        
        if (socketService.socket && socketService.socket.connected) {
          const mimeType = mediaRecorderRef.current?.mimeType || getSupportedMimeType() || 'audio/webm';
          
          console.log('📡 Sending audio data:', {
            size: arrayBuffer.byteLength,
            mimeType: mimeType
          });
          
          // ✅ GỬI TRỰC TIẾP ARRAYBUFFER - không convert sang Array
          socketService.sendRefereeVoice(arrayBuffer, mimeType);
        }
      };
      
      reader.onerror = () => {
        console.error('❌ FileReader error:', reader.error);
      };
      
      reader.readAsArrayBuffer(audioBlob);
      
    } catch (error) {
      console.error('❌ Error sending voice to server:', error);
    }
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
      setIsProcessing(true);
      
      // Tối ưu stream settings cho low latency
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000, // Giảm xuống 16kHz cho low latency
          channelCount: 1,
          // Thêm constraints cho low latency
          latency: 0.01, // 10ms target latency
          volume: 1.0
        }
      });
      
      streamRef.current = stream;

      // Tối ưu MediaRecorder settings
      const options = { 
        mimeType,
        audioBitsPerSecond: 64000 // Giảm bitrate để giảm data size
      };

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      // GỬI NGAY KHI CÓ DATA - không tích lũy
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('📡 Sending chunk immediately:', event.data.size, 'bytes');
          // Gửi ngay lập tức từng chunk riêng lẻ
          sendVoiceToServer(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('🎙️ MediaRecorder stopped');
      };

      mediaRecorder.onstart = () => {
        console.log('🎙️ MediaRecorder started with ultra-low latency mode');
      };

      // SIÊU QUAN TRỌNG: Giảm timeslice xuống tối đa
      // 100ms = delay tối đa 100ms thay vì 2000ms
      mediaRecorder.start(100); // 100ms chunks cho ultra-low latency
      
      setIsRecording(true);
      setIsProcessing(false);
      
      console.log('🚀 Ultra-low latency recording started:', mimeType);
      
    } catch (error) {
      console.error('Lỗi khi bắt đầu ghi âm:', error);
      alert('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    console.log('🔇 Stopping recording');
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

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
              : 'bg-green-500 hover:bg-green-600'
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
            🔴 LIVE - Delay chỉ ~100ms
          </p>
        )}
        {!isRecording && !isProcessing && (
          <p className="text-gray-600">
            Ấn mic để bắt đầu phát trực tiếp
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
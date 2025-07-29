import React, { useState, useEffect, useRef } from "react";

import audioUtils from '../../utils/audioUtils';
import { Mic, MicOff } from "lucide-react";
import socketService from "../../services/socketService";

const CommentarySection = ({ isActive = true }) => {
  // CommentarySection chỉ gửi audio, không cần lắng nghe audio_control
  // Audio_control listener đã được xử lý trong PublicMatchContext

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

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
    };
  }, []);

  // Dừng voice trọng tài khi tab không active nữa
  useEffect(() => {
    if (!isActive) {
      console.log('🔇 [CommentarySection] Tab inactive, stopping all audio');
      audioUtils.stopAllAudio();

      // Dừng ghi âm nếu đang ghi
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [isActive]);

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
      // Dừng tất cả audio đang phát trước khi bắt đầu ghi
      audioUtils.stopAllAudio();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100, // Standard sample rate for compatibility
          channelCount: 1, // Mono for voice
          autoGainControl: true
        }
      });

      streamRef.current = stream;

      const options = { mimeType };
      // Add bitrate if supported
      if (mimeType.includes('opus') || mimeType.includes('webm')) {
        options.audioBitsPerSecond = 64000;
      }

      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        processRecording();
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      console.log('🎙️ Voice recording started with codec:', mimeType);
    } catch (error) {
      console.error('Lỗi khi bắt đầu ghi âm:', error);
      alert('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processRecording = async () => {
    if (audioChunksRef.current.length > 0) {
      const mimeType = mediaRecorderRef.current?.mimeType || getSupportedMimeType() || 'audio/webm';
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mimeType
      });

      console.log('🎙️ Voice recorded:', audioBlob.size, 'bytes');

      try {
        // Gửi voice lên server qua socket
        await sendVoiceToServer(audioBlob);
        console.log('✅ Voice sent to server successfully');
      } catch (error) {
        console.error('��� Failed to send voice to server:', error);
        alert('Không thể gửi voice lên server');
      }

      setIsProcessing(false);
    } else {
      setIsProcessing(false);
    }
  };

  const sendVoiceToServer = async (audioBlob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);

        if (socketService.socket && socketService.socket.connected) {
          // Gửi voice data qua socketService
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
          <p className="text-blue-600 font-medium">Đang xử lý...</p>
        )}
        {isRecording && !isProcessing && (
          <p className="text-red-600 font-medium animate-pulse">● Đang ghi âm...</p>
        )}
        {!isRecording && !isProcessing && (
          <p className="text-gray-600">Ấn mic để bắt đầu bình luận</p>
        )}
        {!isSupported && (
          <p className="text-red-600">Trình duyệt không hỗ trợ ghi âm</p>
        )}
        {isRecording && (
          <p className="text-orange-600 text-sm mt-2">⚠️ Tất cả audio khác đã bị dừng để ghi voice</p>
        )}
      </div>
    </div>
  );
};

export default CommentarySection;

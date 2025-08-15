import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import socketService from "../../services/socketService";

const CommentarySection = ({ isActive = true }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioContextRef = useRef(null);
  const mediaStreamSourceRef = useRef(null);
  const scriptNodeRef = useRef(null);
  const streamRef = useRef(null);

  const isSupported =
    typeof navigator !== "undefined" &&
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    typeof AudioContext !== "undefined";

  useEffect(() => {
    return () => {
      stopAllStreaming();
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      console.log("🔇 [CommentarySection] Tab inactive, stopping streaming");
      stopAllStreaming();
    }
  }, [isActive]);

  const stopAllStreaming = () => {
    // Stop script processor
    if (scriptNodeRef.current) {
      scriptNodeRef.current.disconnect();
      scriptNodeRef.current = null;
    }

    // Disconnect media stream source
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsStreaming(false);
    setIsProcessing(false);
  };

  const setupAudioStream = async (stream) => {
    try {
      // Create audio context with low latency
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current.latencyHint = 'interactive';

      // Create media stream source
      mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

      console.log("🎙️ Audio stream setup completed");
      return true;
    } catch (error) {
      console.error("❌ Error setting up audio stream:", error);
      return false;
    }
  };

  const startStreaming = () => {
    if (!audioContextRef.current || !mediaStreamSourceRef.current) {
      console.error("❌ Audio context or media stream source not available");
      return;
    }

    try {
      const bufferSize = 2048;
      scriptNodeRef.current = audioContextRef.current.createScriptProcessor(bufferSize, 1, 1);

      scriptNodeRef.current.onaudioprocess = (audioProcessingEvent) => {
        if (!isStreaming) return;

        const inputBuffer = audioProcessingEvent.inputBuffer;
        const audioData = inputBuffer.getChannelData(0);

        // Send Float32Array directly to server
        if (socketService.socket && socketService.socket.connected) {
          socketService.sendRefereeVoiceRealtime(Array.from(audioData));
        }
      };

      // Connect nodes
      mediaStreamSourceRef.current.connect(scriptNodeRef.current);
      scriptNodeRef.current.connect(audioContextRef.current.destination);

      console.log("🎙️ Started real-time audio streaming");
      setIsStreaming(true);
    } catch (error) {
      console.error("❌ Error starting streaming:", error);
    }
  };

  const stopStreaming = () => {
    console.log("🔇 Stopping real-time streaming");

    if (scriptNodeRef.current) {
      scriptNodeRef.current.disconnect();
      scriptNodeRef.current = null;
    }

    setIsStreaming(false);
  };

  const startRecording = async () => {
    if (!isSupported) {
      alert("Trình duyệt không hỗ trợ ghi âm");
      return;
    }
    const mimeType = getSupportedMimeType();
    if (!mimeType) {
      alert("Trình duyệt không hỗ trợ các codec audio cần thiết");
      return;
    }
    if (!canPlayFormat(mimeType)) {
      console.warn("⚠️ Browser may not be able to play recorded format:", mimeType);
    }
    try {
      setIsProcessing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
          channelCount: 1,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      await createMediaRecorder(stream, mimeType);
      setIsProcessing(false);
      console.log("🎙️ Continuous recording started with format:", mimeType);
    } catch (error) {
      console.error("Lỗi khi bắt đầu ghi âm:", error);
      alert("Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.");
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    console.log("🔇 Stopping continuous recording");
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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
          const mimeType =
            mediaRecorderRef.current?.mimeType ||
            getSupportedMimeType() ||
            "audio/webm";
          const success = socketService.sendRefereeVoice(
            Array.from(uint8Array),
            mimeType
          );
          success ? resolve() : reject(new Error("Failed to send voice"));
        } else {
          reject(new Error("Socket not connected"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(audioBlob);
    });
  };

  const toggleRecording = () => {
    isRecording ? stopRecording() : startRecording();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-center">
        <button
          onClick={toggleRecording}
          disabled={isProcessing || !isSupported}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform
            ${isRecording
              ? "bg-red-500 hover:bg-red-600 animate-pulse scale-110"
              : "bg-blue-500 hover:bg-blue-600"}
            ${isProcessing ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
            text-white shadow-lg hover:shadow-xl
            ${!isSupported ? "bg-gray-400 cursor-not-allowed" : ""}
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
          <p className="text-gray-600">Ấn mic để bắt đầu bình luận liên tục</p>
        )}
        {!isSupported && (
          <p className="text-red-600">Trình duyệt không hỗ trợ ghi âm</p>
        )}
      </div>
    </div>
  );
};

export default CommentarySection;

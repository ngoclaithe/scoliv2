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
  const isStreamingRef = useRef(false); // Add ref to track streaming state

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

  // Update ref when state changes
  useEffect(() => {
    isStreamingRef.current = isStreaming;
  }, [isStreaming]);

  const stopAllStreaming = () => {
    console.log("🔇 [stopAllStreaming] Cleaning up all audio resources");
    
    // Stop script processor
    if (scriptNodeRef.current) {
      try {
        scriptNodeRef.current.disconnect();
        console.log("✅ Script node disconnected");
      } catch (e) {
        console.warn("⚠️ Error disconnecting script node:", e);
      }
      scriptNodeRef.current = null;
    }

    // Disconnect media stream source
    if (mediaStreamSourceRef.current) {
      try {
        mediaStreamSourceRef.current.disconnect();
        console.log("✅ Media stream source disconnected");
      } catch (e) {
        console.warn("⚠️ Error disconnecting media stream source:", e);
      }
      mediaStreamSourceRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
        console.log("✅ Audio context closed");
      } catch (e) {
        console.warn("⚠️ Error closing audio context:", e);
      }
      audioContextRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log("✅ Media track stopped");
      });
      streamRef.current = null;
    }

    setIsStreaming(false);
    setIsProcessing(false);
  };

  const setupAudioStream = async (stream) => {
    try {
      console.log("🎙️ [setupAudioStream] Setting up audio stream...");
      
      // Create audio context with low latency
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        latencyHint: 'interactive',
        sampleRate: 44100
      });

      // Resume context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log("🎙️ Audio context resumed");
      }

      // Create media stream source
      mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

      console.log("✅ Audio stream setup completed");
      console.log("📊 Audio context state:", audioContextRef.current.state);
      console.log("📊 Sample rate:", audioContextRef.current.sampleRate);
      
      return true;
    } catch (error) {
      console.error("❌ Error setting up audio stream:", error);
      return false;
    }
  };

  const startStreaming = () => {
    console.log("🎙️ [startStreaming] Starting audio streaming...");
    
    if (!audioContextRef.current || !mediaStreamSourceRef.current) {
      console.error("❌ Audio context or media stream source not available");
      console.log("🔍 Audio context:", audioContextRef.current);
      console.log("🔍 Media stream source:", mediaStreamSourceRef.current);
      return;
    }

    // Check socket connection before starting
    if (!socketService || !socketService.socket) {
      console.error("❌ SocketService or socket not available");
      console.log("🔍 SocketService:", socketService);
      return;
    }

    if (!socketService.socket.connected) {
      console.error("❌ Socket not connected");
      console.log("🔍 Socket state:", socketService.socket.connected);
      return;
    }

    try {
      const bufferSize = 2048;
      scriptNodeRef.current = audioContextRef.current.createScriptProcessor(bufferSize, 1, 1);
      console.log("✅ Script processor created with buffer size:", bufferSize);

      scriptNodeRef.current.onaudioprocess = (audioProcessingEvent) => {
        // Use ref instead of state to avoid stale closure
        if (!isStreamingRef.current) {
          console.log("⏹️ Not streaming, skipping audio data");
          return;
        }

        if (!scriptNodeRef.current) {
          console.log("⏹️ Script node is null, skipping audio data");
          return;
        }

        try {
          const inputBuffer = audioProcessingEvent.inputBuffer;
          const audioData = inputBuffer.getChannelData(0);
          
          // Check for non-zero audio data
          const hasSound = Array.from(audioData).some(sample => Math.abs(sample) > 0.001);
          if (hasSound) {
            console.log('🔊 Audio data captured with sound:', audioData.length, 'samples');
          }
          
          // Send Float32Array to server
          if (socketService.socket && socketService.socket.connected) {
            if (typeof socketService.sendRefereeVoiceRealtime === 'function') {
              socketService.sendRefereeVoiceRealtime(Array.from(audioData));
              if (hasSound) {
                console.log('📤 Audio data sent to server');
              }
            } else {
              console.error('❌ sendRefereeVoiceRealtime is not a function');
              console.log('🔍 Available methods:', Object.keys(socketService));
            }
          } else {
            console.log('❌ Socket not connected');
          }
        } catch (error) {
          console.error('❌ Error in audio processing:', error);
        }
      };

      // Connect nodes
      mediaStreamSourceRef.current.connect(scriptNodeRef.current);
      scriptNodeRef.current.connect(audioContextRef.current.destination);

      console.log("✅ Audio nodes connected successfully");
      console.log("📊 Audio context state:", audioContextRef.current.state);
      
      setIsStreaming(true);
      console.log("🎙️ Real-time audio streaming started");
      
    } catch (error) {
      console.error("❌ Error starting streaming:", error);
      // Clean up on error
      if (scriptNodeRef.current) {
        try {
          scriptNodeRef.current.disconnect();
        } catch (e) {
          console.warn("⚠️ Error cleaning up script node:", e);
        }
        scriptNodeRef.current = null;
      }
    }
  };

  const stopStreaming = () => {
    console.log("🔇 [stopStreaming] Stopping real-time streaming");

    if (scriptNodeRef.current) {
      try {
        scriptNodeRef.current.disconnect();
        console.log("✅ Script node disconnected");
      } catch (e) {
        console.warn("⚠️ Error disconnecting script node:", e);
      }
      scriptNodeRef.current = null;
    }

    setIsStreaming(false);
  };

  const startMicrophone = async () => {
    if (!isSupported) {
      alert("Trình duyệt không hỗ trợ Web Audio API");
      return;
    }

    try {
      setIsProcessing(true);
      console.log("🎙️ [startMicrophone] Requesting microphone access...");
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1,
          autoGainControl: true,
        },
      });

      console.log("✅ Microphone access granted");
      console.log("📊 Stream tracks:", stream.getTracks().length);
      
      streamRef.current = stream;
      const success = await setupAudioStream(stream);

      if (success) {
        // Small delay to ensure everything is set up
        setTimeout(() => {
          startStreaming();
          setIsProcessing(false);
          console.log("🎙️ Microphone and streaming initialized successfully");
        }, 100);
      } else {
        setIsProcessing(false);
        alert("Không thể khởi tạo audio context");
      }
    } catch (error) {
      console.error("❌ Error starting microphone:", error);
      alert("Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.");
      setIsProcessing(false);
    }
  };

  const stopMicrophone = () => {
    console.log("🔇 [stopMicrophone] Stopping microphone");
    stopStreaming();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log("✅ Media track stopped");
      });
      streamRef.current = null;
    }
  };

  const toggleMicrophone = () => {
    console.log("🔄 [toggleMicrophone] Current streaming state:", isStreaming);
    if (isStreaming) {
      stopMicrophone();
    } else {
      startMicrophone();
    }
  };

  // Debug info
  useEffect(() => {
    console.log("🔍 [Debug] Component state:");
    console.log("- isStreaming:", isStreaming);
    console.log("- isProcessing:", isProcessing);
    console.log("- isActive:", isActive);
    console.log("- socketService:", socketService);
    console.log("- socket connected:", socketService?.socket?.connected);
  }, [isStreaming, isProcessing, isActive]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-center">
        <button
          onClick={toggleMicrophone}
          disabled={isProcessing || !isSupported}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform
            ${isStreaming
              ? "bg-red-500 hover:bg-red-600 animate-pulse scale-110"
              : "bg-blue-500 hover:bg-blue-600"}
            ${isProcessing ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
            text-white shadow-lg hover:shadow-xl
            ${!isSupported ? "bg-gray-400 cursor-not-allowed" : ""}
          `}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          ) : isStreaming ? (
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
        {isStreaming && !isProcessing && (
          <p className="text-red-600 font-medium animate-pulse">
            🔴 Đang phát trực tiếp
          </p>
        )}
        {!isStreaming && !isProcessing && (
          <p className="text-gray-600">Ấn mic để bắt đầu phát trực tiếp</p>
        )}
        {!isSupported && (
          <p className="text-red-600">Trình duyệt không hỗ trợ Web Audio API</p>
        )}
      </div>
    </div>
  );
};

export default CommentarySection;
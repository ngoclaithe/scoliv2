import React, { useState, useEffect } from "react";
import { useAudio } from "../../contexts/AudioContext";
import { useMatch } from "../../contexts/MatchContext";
import socketService from "../../services/socketService";
import { toast } from 'react-toastify';

const CommentarySection = () => {
  const {
    recordingState,
    recordedAudio,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    sendRecordedAudio
  } = useAudio();

  const { matchData } = useMatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState(null);

  // Đếm thời gian thu âm
  useEffect(() => {
    if (recordingState === 'recording') {
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
    } else {
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
      if (recordingState === 'stopped') {
        setRecordingDuration(0);
      }
    }

    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [recordingState]);

  // Xử lý bắt đầu thu âm
  const handleStartRecording = async () => {
    try {
      await startRecording();
      toast.success('🎙️ Bắt đầu thu âm bình luận');
    } catch (error) {
      toast.error('❌ Không thể bắt đầu thu âm');
    }
  };

  // Xử lý dừng thu âm
  const handleStopRecording = () => {
    stopRecording();
    toast.info('⏹️ Đã dừng thu âm');
  };

  // Xử lý tạm dừng thu âm
  const handlePauseRecording = () => {
    pauseRecording();
    toast.info('⏸️ Đã tạm dừng thu âm');
  };

  // Xử lý tiếp tục thu âm
  const handleResumeRecording = () => {
    resumeRecording();
    toast.info('▶️ Đã tiếp tục thu âm');
  };

  // Gửi audio đã thu (fallback method)
  const handleSendAudio = async () => {
    if (!recordedAudio) {
      toast.warning('⚠️ Chưa có audio để gửi');
      return;
    }

    setIsProcessing(true);
    try {
      const accessCode = localStorage.getItem('currentAccessCode') || 'default';
      await sendRecordedAudio(socketService, accessCode);
      toast.success('📤 Đã gửi audio bình luận thành công');
    } catch (error) {
      toast.error('❌ Lỗi khi gửi audio');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format thời gian
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Lấy màu button dựa trên trạng thái
  const getButtonColor = () => {
    switch (recordingState) {
      case 'recording':
        return 'from-red-500 to-red-700 hover:from-red-600 hover:to-red-800';
      case 'paused':
        return 'from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700';
      default:
        return 'from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800';
    }
  };

  // Lấy icon dựa trên trạng thái
  const getButtonIcon = () => {
    switch (recordingState) {
      case 'recording':
        return (
          <div className="relative">
            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H6c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        );
      case 'paused':
        return (
          <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H6c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        );
    }
  };

  // Xử lý click button chính
  const handleMainButtonClick = () => {
    switch (recordingState) {
      case 'stopped':
        handleStartRecording();
        break;
      case 'recording':
        handlePauseRecording();
        break;
      case 'paused':
        handleResumeRecording();
        break;
    }
  };

  return (
    <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
      {/* Commentary Recording Section */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-3 sm:p-4 border border-red-200">
        <h3 className="text-center text-sm sm:text-base font-bold text-red-800 mb-4 flex items-center justify-center">
          <span className="mr-1">🎙️</span>
          THU ÂM BÌNH LUẬN
          <span className="ml-1">🎙️</span>
        </h3>

        {/* Recording Duration */}
        {recordingState !== 'stopped' && (
          <div className="text-center mb-3">
            <div className="inline-flex items-center bg-white rounded-lg px-3 py-1 border border-gray-300 shadow-sm">
              <span className="text-sm font-mono font-bold text-red-600">
                {formatDuration(recordingDuration)}
              </span>
            </div>
          </div>
        )}

        {/* Main Recording Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleMainButtonClick}
            className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${getButtonColor()} text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
          >
            {getButtonIcon()}
          </button>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-2 mb-4">
          {recordingState !== 'stopped' && (
            <button
              onClick={handleStopRecording}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md transition-all duration-200 flex items-center text-xs font-bold"
            >
              <span className="mr-1">⏹️</span>
              DỪNG
            </button>
          )}

          {recordedAudio && recordingState === 'stopped' && (
            <button
              onClick={handleSendAudio}
              disabled={isProcessing}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg shadow-md transition-all duration-200 flex items-center text-xs font-bold"
            >
              {isProcessing ? (
                <>
                  <span className="mr-1">⏳</span>
                  ĐANG GỬI...
                </>
              ) : (
                <>
                  <span className="mr-1">📤</span>
                  GỬI AUDIO
                </>
              )}
            </button>
          )}
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            {recordingState === 'recording' && 'Đang thu âm... Nhấn để tạm dừng'}
            {recordingState === 'paused' && 'Đã tạm dừng. Nhấn để tiếp tục'}
            {recordingState === 'stopped' && !recordedAudio && 'Nhấn vào micro để bắt đầu thu âm'}
            {recordingState === 'stopped' && recordedAudio && 'Thu âm hoàn tất. Có thể gửi hoặc thu lại'}
          </p>
        </div>

        {/* Audio Playback Preview */}
        {recordedAudio && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-300 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-2 text-center">
              📄 Xem trước audio đã thu
            </h4>
            <audio
              controls
              src={URL.createObjectURL(recordedAudio)}
              className="w-full"
              style={{ height: '40px' }}
            />
          </div>
        )}
        
        {/* Info */}
        <div className="mt-4 p-2 bg-blue-100 border border-blue-300 rounded text-xs text-blue-800 text-center">
          ℹ️ Sử dụng opus-media-recorder để gửi voice-chunk qua socket
        </div>
      </div>
    </div>
  );
};

export default CommentarySection;

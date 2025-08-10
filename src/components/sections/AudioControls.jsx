import React from 'react';
import Button from '../common/Button';

const AudioControls = ({
  isPlaying,
  isPaused,
  currentAudioFile,
  audioEnabled,
  timerData,
  onPauseAudio,
  onResumeAudio,
  onToggleAudio,
  onResumeTimer,
  onPauseTimer
}) => {
  return (
    <div className="flex justify-center items-center mt-2 space-x-2">
      {/* Audio Pause/Play Button */}
      <Button
        variant="primary"
        size="sm"
        className={`px-2 py-1 ${isPlaying
          ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          : isPaused
            ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
          } text-white font-bold text-xs rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200`}
        onClick={() => {
          if (isPlaying) {
            onPauseAudio();
          } else if (isPaused && currentAudioFile) {
            onResumeAudio();
          } else {
            onToggleAudio();
          }
        }}
        title={
          isPlaying
            ? "Tạm dừng audio đang phát"
            : isPaused && currentAudioFile
              ? "Tiếp tục phát audio"
              : audioEnabled
                ? "Tắt audio tĩnh"
                : "Bật audio tĩnh"
        }
      >
        <span className="mr-1">
          {isPlaying ? "🔊▶️" : isPaused && currentAudioFile ? "🔊▶️" : audioEnabled ? "🔊" : "🔇"}
        </span>
      </Button>

      <Button
        variant="primary"
        size="sm"
        className={`px-2 py-1 ${timerData.status === "paused"
          ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          } text-white font-bold text-xs rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200`}
        onClick={() => {
          if (timerData.status === "paused") {
            onResumeTimer();
          } else {
            onPauseTimer();
          }
        }}
      >
        <span className="mr-1">{timerData.status === "paused" ? "▶️" : "⏸️"}</span>
        <span className="hidden sm:inline">{timerData.status === "paused" ? "TIẾP TỤC" : "TẠM DỪNG"}</span>
        <span className="sm:hidden">{timerData.status === "paused" ? "TIẾP" : "DỪNG"}</span>
      </Button>
    </div>
  );
};

export default AudioControls;

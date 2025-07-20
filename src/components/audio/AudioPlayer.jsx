import React, { useState, useRef, useEffect } from "react";
import Button from "../common/Button";

const AudioPlayer = ({
  src,
  title = "Audio Track",
  autoPlay = false,
  loop = false,
  volume = 1,
  onPlay,
  onPause,
  onEnd,
  onTimeUpdate,
  showWaveform = false,
  className = "",
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(false);
    const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onPlayRef = useRef(onPlay);
  const onPauseRef = useRef(onPause);
  const onEndRef = useRef(onEnd);
  const onTimeUpdateRef = useRef(onTimeUpdate);

  onPlayRef.current = onPlay;
  onPauseRef.current = onPause;
  onEndRef.current = onEnd;
  onTimeUpdateRef.current = onTimeUpdate;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setLoading(true);
    const handleLoadedData = () => {
      setLoading(false);
      setDuration(audio.duration);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
            onTimeUpdateRef.current?.(audio.currentTime);
    };
    const handlePlay = () => {
      setIsPlaying(true);
            onPlayRef.current?.(audio.currentTime);
    };
    const handlePause = () => {
      setIsPlaying(false);
            onPauseRef.current?.(audio.currentTime);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
            onEndRef.current?.();
    };
    const handleError = () => {
      setLoading(false);
      setError("Không thể tải file âm thanh");
    };

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
    }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : currentVolume;
    }
  }, [currentVolume, isMuted]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setCurrentVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getProgressPercent = () => {
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  };

  const skip = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
  };

  if (error) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white rounded-lg shadow-md p-4">
        <audio
          ref={audioRef}
          src={src}
          loop={loop}
          autoPlay={autoPlay}
          preload="metadata"
        />

        {/* Title */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 truncate">{title}</h4>
          {loading && <p className="text-sm text-gray-500">Đang tải...</p>}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer relative overflow-hidden"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-200"
              style={{ width: `${getProgressPercent()}%` }}
            />

            {/* Hover indicator */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
              <div className="w-full h-full bg-primary-200 rounded-full" />
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Main Controls */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => skip(-10)}
              disabled={loading}
              className="w-8 h-8 p-0"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>

            <Button
              variant={isPlaying ? "warning" : "primary"}
              size="sm"
              onClick={togglePlayPause}
              disabled={loading}
              className="w-10 h-10 p-0"
            >
              {loading ? (
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : isPlaying ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => skip(10)}
              disabled={loading}
              className="w-8 h-8 p-0"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414zm6 0a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L14.586 10 10.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>

          {/* Volume Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isMuted || currentVolume === 0 ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.768 14.25H2a1 1 0 01-1-1V6.75a1 1 0 011-1h2.768l3.615-2.543a1 1 0 011.617.793zm4.025 3.146a1 1 0 011.414 0A6.977 6.977 0 0116 10a6.977 6.977 0 01-1.178 3.778 1 1 0 01-1.414-1.414A4.983 4.983 0 0014 10a4.983 4.983 0 00-.592-2.364 1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : currentVolume < 0.5 ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.768 14.25H2a1 1 0 01-1-1V6.75a1 1 0 011-1h2.768l3.615-2.543a1 1 0 011.617.793zm2.911 4.338a1 1 0 011.414 0 3 3 0 010 4.243 1 1 0 01-1.414-1.415 1 1 0 000-1.414 1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.768 14.25H2a1 1 0 01-1-1V6.75a1 1 0 011-1h2.768l3.615-2.543a1 1 0 011.617.793zm7.847 1.166a1 1 0 011.414 0 8.972 8.972 0 010 12.696 1 1 0 01-1.414-1.414 6.972 6.972 0 000-9.868 1 1 0 010-1.414zm-2.119 2.119a1 1 0 011.414 0 4.971 4.971 0 010 7.038 1 1 0 01-1.414-1.414 2.971 2.971 0 000-4.21 1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : currentVolume}
              onChange={handleVolumeChange}
              className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Waveform (placeholder) */}
        {showWaveform && (
          <div className="mt-4">
            <div className="flex items-end justify-center space-x-1 h-16 bg-gray-100 rounded">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-primary-400 rounded-t transition-all duration-200 ${
                    i < (getProgressPercent() / 100) * 50
                      ? "bg-primary-600"
                      : ""
                  }`}
                  style={{
                    height: `${Math.random() * 80 + 20}%`,
                    opacity: isPlaying ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;

import React, { useState, useEffect, useRef } from "react";
import Button from "../common/Button";

const Timer = ({
  initialTime = 0, // seconds
  maxTime = 90 * 60, // 90 minutes in seconds
  onTimeChange,
  autoStart = false,
  showControls = true,
  format = "mm:ss", // mm:ss or hh:mm:ss
  size = "lg",
  className = "",
}) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
    const [direction, setDirection] = useState("up"); // 'up' or 'down'
  const intervalRef = useRef(null);
  const onTimeChangeRef = useRef(onTimeChange);
  onTimeChangeRef.current = onTimeChange;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime =
            direction === "up"
              ? Math.min(prevTime + 1, maxTime)
              : Math.max(prevTime - 1, 0);

                    onTimeChangeRef.current?.(newTime);

          // Auto stop khi countdown về 0
          if (direction === "down" && newTime === 0) {
            setIsRunning(false);
          }

          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
    }, [isRunning, direction, maxTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (format === "hh:mm:ss") {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(initialTime);
    onTimeChange?.(initialTime);
  };

    const handleManualTimeChange = (newTime) => {
    setTime(newTime);
    onTimeChangeRef.current?.(newTime);
  };

  const adjustTime = (adjustment) => {
    const newTime = Math.max(0, Math.min(time + adjustment, maxTime));
    handleManualTimeChange(newTime);
  };

  const sizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl md:text-6xl",
    xl: "text-6xl md:text-8xl",
  };

  return (
    <div className={`text-center ${className}`}>
      {/* Timer Display */}
      <div className="mb-4">
        <div
          className={`
          font-mono font-bold ${sizes[size]} 
          ${isRunning ? "text-green-600" : "text-gray-700"}
          transition-colors duration-300
        `}
        >
          {formatTime(time)}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center mt-2 space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${isRunning ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
          />
          <span className="text-sm text-gray-600">
            {isRunning ? "Đang chạy" : "Tạm dừng"}
          </span>
          {direction === "down" && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
              Đếm ngược
            </span>
          )}
        </div>
      </div>

      {showControls && (
        <div className="space-y-4">
          {/* Main Controls */}
          <div className="flex justify-center space-x-3">
            <Button
              variant={isRunning ? "warning" : "success"}
              onClick={handlePlayPause}
              icon={
                isRunning ? (
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
                )
              }
            >
              {isRunning ? "Tạm dừng" : "Bắt đầu"}
            </Button>

            <Button
              variant="outline"
              onClick={handleReset}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              }
            >
              Đặt lại
            </Button>
          </div>

          {/* Direction Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                onClick={() => setDirection("up")}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  direction === "up"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Đếm lên
              </button>
              <button
                onClick={() => setDirection("down")}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  direction === "down"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Đếm ngược
              </button>
            </div>
          </div>

          {/* Time Adjustment */}
          <div className="flex justify-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => adjustTime(-60)}
              disabled={time === 0}
            >
              -1 phút
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => adjustTime(-1)}
              disabled={time === 0}
            >
              -1 giây
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => adjustTime(1)}
              disabled={time >= maxTime}
            >
              +1 giây
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => adjustTime(60)}
              disabled={time >= maxTime}
            >
              +1 phút
            </Button>
          </div>

          {/* Quick Time Presets */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "15 phút", value: 15 * 60 },
              { label: "30 phút", value: 30 * 60 },
              { label: "45 phút", value: 45 * 60 },
              { label: "90 phút", value: 90 * 60 },
            ].map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                onClick={() => handleManualTimeChange(preset.value)}
                className="text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;

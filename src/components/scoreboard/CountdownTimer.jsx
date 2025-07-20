import React, { useState, useEffect, useRef } from "react";
import Button from "../common/Button";

const CountdownTimer = ({
  targetDate,
  title = "Đếm ngược đến trận đấu",
  onComplete,
  showTitle = true,
  showLabels = true,
  size = "lg",
  className = "",
}) => {
    const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsCompleted(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!isCompleted) {
          setIsCompleted(true);
          onComplete?.();
        }
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate, isCompleted, onComplete]);

  const sizes = {
    sm: {
      number: "text-xl md:text-2xl",
      label: "text-xs",
      title: "text-base",
      container: "p-3",
      grid: "gap-2",
    },
    md: {
      number: "text-2xl md:text-3xl",
      label: "text-sm",
      title: "text-lg",
      container: "p-4",
      grid: "gap-3",
    },
    lg: {
      number: "text-3xl md:text-4xl",
      label: "text-base",
      title: "text-xl",
      container: "p-6",
      grid: "gap-4",
    },
  };

  const currentSize = sizes[size];

  const TimeUnit = ({ value, label, isLast = false }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-3 min-w-16 sm:min-w-20">
        <div
          className={`${currentSize.number} font-bold font-mono text-center`}
        >
          {value.toString().padStart(2, "0")}
        </div>
      </div>
      {showLabels && (
        <div
          className={`${currentSize.label} mt-2 text-center opacity-90 font-medium`}
        >
          {label}
        </div>
      )}
      {!isLast && (
        <div className={`${currentSize.number} font-bold mx-2 hidden sm:block`}>
          :
        </div>
      )}
    </div>
  );

  if (isCompleted) {
    return (
      <div className={`text-center ${currentSize.container} ${className}`}>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className={`${currentSize.title} font-bold mb-2`}>
            Trận đấu đã bắt đầu!
          </h3>
          <p className="text-white text-opacity-90">
            Thời gian đếm ngược đã k���t thúc
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${currentSize.container} ${className}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        {showTitle && (
          <h3 className={`${currentSize.title} font-bold text-center mb-6`}>
            {title}
          </h3>
        )}

        <div
          className={`flex justify-center items-center ${currentSize.grid} flex-wrap sm:flex-nowrap`}
        >
          {timeLeft.days > 0 && (
            <>
              <TimeUnit value={timeLeft.days} label="Ngày" />
              <div className={`${currentSize.number} font-bold mx-2`}>:</div>
            </>
          )}
          <TimeUnit value={timeLeft.hours} label="Giờ" />
          <div className={`${currentSize.number} font-bold mx-2`}>:</div>
          <TimeUnit value={timeLeft.minutes} label="Phút" />
          <div className={`${currentSize.number} font-bold mx-2`}>:</div>
          <TimeUnit value={timeLeft.seconds} label="Giây" isLast />
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="bg-white bg-opacity-20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-1000"
              style={{
                width: `${Math.max(
                  0,
                  100 -
                    ((timeLeft.days * 24 * 60 * 60 +
                      timeLeft.hours * 60 * 60 +
                      timeLeft.minutes * 60 +
                      timeLeft.seconds) /
                      (7 * 24 * 60 * 60)) *
                      100,
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center text-sm opacity-90">
          {targetDate && (
            <p>
              Trận đấu:{" "}
              {new Date(targetDate).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;

import React from "react";

const Loading = ({
  size = "md",
  color = "primary",
  text,
  overlay = false,
  className = "",
}) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const colors = {
    primary: "text-primary-600",
    white: "text-white",
    gray: "text-gray-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
  };

  const Spinner = () => (
    <svg
      className={`animate-spin ${sizes[size]} ${colors[color]} ${className}`}
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
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
          <Spinner />
          {text && <p className="text-gray-700 text-sm font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Spinner />
      {text && (
        <span className={`text-sm font-medium ${colors[color]}`}>{text}</span>
      )}
    </div>
  );
};

// Loading Skeleton component
export const LoadingSkeleton = ({
  width = "w-full",
  height = "h-4",
  className = "",
  count = 1,
}) => {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-300 rounded ${width} ${height} ${className}`}
        />
      ))}
    </div>
  );
};

// Loading Dots component
export const LoadingDots = ({ color = "primary", size = "md" }) => {
  const dotSizes = {
    sm: "h-1 w-1",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  };

  const dotColors = {
    primary: "bg-primary-600",
    gray: "bg-gray-600",
    white: "bg-white",
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${dotSizes[size]} ${dotColors[color]} rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

export default Loading;

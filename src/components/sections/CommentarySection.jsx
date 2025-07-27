import React from "react";

const CommentarySection = () => {
  return (
    <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
      {/* Microphone Section */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-3 sm:p-4 border border-red-200">
        <h3 className="text-center text-sm sm:text-base font-bold text-red-800 mb-4 flex items-center justify-center">
          <span className="mr-1">🎙️</span>
          THU ÂM BÌNH LUẬN
          <span className="ml-1">🎙️</span>
        </h3>

        <div className="flex justify-center">
          <button
            onClick={() => {
              // Logic thu âm sẽ được thêm sau
              console.log("Microphone clicked - logic will be added later");
            }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H6c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
        </div>

        <div className="text-center mt-3">
          <p className="text-xs sm:text-sm text-gray-600">
            Nhấn vào micro để bắt đầu thu âm bình luận
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentarySection;

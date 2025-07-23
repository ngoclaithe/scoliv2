import React from "react";

const CommentarySection = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Microphone Section */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-8 border border-red-200">
        <h3 className="text-center text-lg font-bold text-red-800 mb-8 flex items-center justify-center">
          <span className="mr-2">🎙️</span>
          THU ÂM BÌNH LUẬN
          <span className="ml-2">🎙️</span>
        </h3>

        <div className="flex justify-center">
          <button
            onClick={() => {
              // Logic thu âm sẽ được thêm sau
              console.log("Microphone clicked - logic will be added later");
            }}
            className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300"
          >
            <svg
              className="w-16 h-16"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H6c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Nhấn vào micro để bắt đầu thu âm bình luận
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentarySection;

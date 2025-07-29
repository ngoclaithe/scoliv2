import React, { useState } from "react";
import { useMatch } from "../../contexts/MatchContext";
import { toast } from 'react-toastify';

const CommentarySection = () => {
  const { matchData } = useMatch();
  const [isProcessing, setIsProcessing] = useState(false);

  // Simplified commentary section without recording features
  const handleCommentaryNote = () => {
    toast.info('📝 Chức năng bình luận đã được đơn giản hóa');
  };

  return (
    <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
      {/* Commentary Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 border border-blue-200">
        <h3 className="text-center text-sm sm:text-base font-bold text-blue-800 mb-4 flex items-center justify-center">
          <span className="mr-1">📝</span>
          BÌNH LUẬN TRẬN ĐẤU
          <span className="ml-1">📝</span>
        </h3>

        {/* Match Info Display */}
        <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
          <div className="text-center space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-red-600">{matchData.teamA?.name || "ĐỘI A"}</span>
              <div className="flex items-center space-x-2">
                <span className="bg-red-500 text-white px-3 py-1 rounded font-bold">
                  {matchData.teamA?.score || 0}
                </span>
                <span className="text-gray-500 font-bold">-</span>
                <span className="bg-gray-800 text-white px-3 py-1 rounded font-bold">
                  {matchData.teamB?.score || 0}
                </span>
              </div>
              <span className="font-bold text-gray-800">{matchData.teamB?.name || "ĐỘI B"}</span>
            </div>
            <div className="text-sm text-gray-600">
              {matchData.matchTime || "00:00"} - {matchData.period || "Chưa bắt đầu"}
            </div>
          </div>
        </div>

        {/* Simple Commentary Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleCommentaryNote}
            disabled={isProcessing}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center font-bold"
          >
            <span className="mr-2">📝</span>
            GHI CHÚ BÌNH LUẬN
          </button>
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Chức năng bình luận đã được đơn giản hóa để tối ưu hiệu năng
          </p>
        </div>
        
        {/* Info */}
        <div className="mt-4 p-2 bg-green-100 border border-green-300 rounded text-xs text-green-800 text-center">
          ✅ Phiên bản đơn giản hóa - Hiệu năng tối ưu
        </div>
      </div>
    </div>
  );
};

export default CommentarySection;

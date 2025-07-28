import React, { useState, useEffect, useCallback } from 'react';

// Component tối ưu hóa để hiển thị thời gian trận đấu
// Sử dụng React.memo để chỉ rerender khi có thay đổi thực sự cần thiết
const MatchTimeDisplay = React.memo(({ matchTime, period, status }) => {
  // State cho hiển thị trạng thái ổn định
  const [displayStatus, setDisplayStatus] = useState("TẠM DỪNG");
  const [statusChangeTimeout, setStatusChangeTimeout] = useState(null);

  // Quản lý hiển thị trạng thái với debounce để tránh nhảy liên tục
  useEffect(() => {
    // Clear timeout cũ nếu có
    if (statusChangeTimeout) {
      clearTimeout(statusChangeTimeout);
    }

    if (status === "live") {
      // Nếu status là live, hiển thị ngay lập tức "ĐANG DIỄN RA"
      setDisplayStatus("ĐANG DIỄN RA");
    } else {
      // Nếu status không phải live, đợi 500ms trước khi chuyển sang "TẠM DỪNG"
      // để tránh hiển thị nhảy khi backend emit liên tục
      const timeout = setTimeout(() => {
        setDisplayStatus("TẠM DỪNG");
      }, 500);

      setStatusChangeTimeout(timeout);
    }

    // Cleanup timeout khi component unmount hoặc dependency thay đổi
    return () => {
      if (statusChangeTimeout) {
        clearTimeout(statusChangeTimeout);
      }
    };
  }, [status]); // Chỉ phụ thuộc vào status

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (statusChangeTimeout) {
        clearTimeout(statusChangeTimeout);
      }
    };
  }, [statusChangeTimeout]);

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-2 mb-3 border-2 border-white shadow-lg">
      <div className="text-center">
        <div className="text-white font-bold text-lg sm:text-xl">
          ⚽ THỜI GIAN TRẬN ĐẤU: {matchTime}
        </div>
        <div className="text-green-100 text-sm">
          {period} • {displayStatus}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function để chỉ rerender khi có thay đổi thực sự cần thiết
  // Chỉ rerender khi matchTime, period hoặc status thực sự thay đổi
  return (
    prevProps.matchTime === nextProps.matchTime &&
    prevProps.period === nextProps.period &&
    prevProps.status === nextProps.status
  );
});

MatchTimeDisplay.displayName = 'MatchTimeDisplay';

export default MatchTimeDisplay;

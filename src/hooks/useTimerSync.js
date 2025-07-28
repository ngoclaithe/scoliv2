import { useEffect, useRef } from 'react';

// Custom hook để quản lý timer sync requests
// Giúp tránh gửi quá nhiều requests không cần thiết
const useTimerSync = (socketConnected, requestTimerSync) => {
  const lastSyncTimeRef = useRef(0);
  const syncIntervalRef = useRef(null);

  useEffect(() => {
    if (socketConnected) {
      // Request sync đầu tiên khi connect
      const now = Date.now();
      if (now - lastSyncTimeRef.current > 1000) { // Chỉ sync nếu đã qua 1s
        requestTimerSync();
        lastSyncTimeRef.current = now;
      }

      // Thiết lập interval để sync định kỳ (ít hơn - 5s một lần thay vì 1s)
      // Vì server đ�� emit timer_tick mỗi giây rồi, ta chỉ cần sync để đồng bộ khi cần
      syncIntervalRef.current = setInterval(() => {
        requestTimerSync();
        lastSyncTimeRef.current = Date.now();
      }, 5000); // 5 giây một lần

      // Cleanup khi socket disconnect
      return () => {
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current);
          syncIntervalRef.current = null;
        }
      };
    } else {
      // Clear interval khi socket không connected
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    }
  }, [socketConnected, requestTimerSync]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, []);
};

export default useTimerSync;

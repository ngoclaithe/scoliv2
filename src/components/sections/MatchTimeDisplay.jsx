import React, { useState, useEffect, useCallback } from 'react';

const MatchTimeDisplay = React.memo(({ matchTime, period, status }) => {
  const [displayStatus, setDisplayStatus] = useState("TẠM DỪNG");
  const [statusChangeTimeout, setStatusChangeTimeout] = useState(null);

  useEffect(() => {
    if (statusChangeTimeout) {
      clearTimeout(statusChangeTimeout);
    }

    if (status === "live") {
      setDisplayStatus("ĐANG DIỄN RA");
    } else {
      const timeout = setTimeout(() => {
        setDisplayStatus("TẠM DỪNG");
      }, 500);

      setStatusChangeTimeout(timeout);
    }

    return () => {
      if (statusChangeTimeout) {
        clearTimeout(statusChangeTimeout);
      }
    };
  }, [status]); 

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
          ⚽ {matchTime}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.matchTime === nextProps.matchTime &&
    prevProps.period === nextProps.period &&
    prevProps.status === nextProps.status
  );
});

MatchTimeDisplay.displayName = 'MatchTimeDisplay';

export default MatchTimeDisplay;

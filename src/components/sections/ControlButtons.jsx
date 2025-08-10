import React from 'react';

const ControlButtons = ({
  typeMatch,
  onShowPosterModal,
  onShowLineupModal,
  onShowPenaltyModal,
  onCountdownClick,
  onUpdateMatchTime,
  onUpdateView,
  onPlayAudio,
  quickCustomMinutes,
  setQuickCustomMinutes
}) => {
  const handleCustomTimeClick = () => {
    const minutes = parseInt(quickCustomMinutes) || 25;
    const timeString = `${minutes.toString().padStart(2, '0')}:00`;
    console.log('🎯 [ControlButtons] Clicked Custom Time - calling onUpdateMatchTime:', { timeString, period: "Hiệp 1", status: "live" });
    onUpdateMatchTime(timeString, "Hiệp 1", "live");
    onUpdateView('scoreboard');
    onPlayAudio('gialap');
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-2 sm:p-3 border border-indigo-200">
      <div className={`grid ${typeMatch === 'pickleball' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'} gap-1.5 sm:gap-2`}>
        {/* Poster */}
        <button
          onClick={() => {
            onPlayAudio('poster');
            onShowPosterModal(true);
          }}
          className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <span className="text-sm mr-1">🎨</span>
          <span className="text-xs font-bold text-center">POSTER</span>
        </button>

        {/* Danh sách */}
        {typeMatch !== 'pickleball' && (
          <button
            onClick={() => onShowLineupModal(true)}
            className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-sm mr-1">📋</span>
            <span className="text-xs font-bold text-center">DANH SÁCH</span>
          </button>
        )}

        {/* Penalty */}
        {typeMatch !== 'pickleball' && (
          <button
            onClick={() => onShowPenaltyModal(true)}
            className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-sm mr-1">⚽</span>
            <span className="text-xs font-bold text-center">PENALTY</span>
          </button>
        )}

        {/* Đếm 0 */}
        <button
          onClick={() => onCountdownClick("00:00")}
          className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <span className="text-sm mr-1">⏰</span>
          <span className="text-xs font-bold text-center">ĐẾM 0</span>
        </button>

        {/* Các nút đếm thời gian cho bóng đá/futsal */}
        {typeMatch !== 'pickleball' && (
          <>
            <button
              onClick={() => onCountdownClick("20:00")}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🕐</span>
              <span className="text-xs font-bold text-center">ĐẾM 20'</span>
            </button>

            <button
              onClick={() => onCountdownClick("30:00")}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🕑</span>
              <span className="text-xs font-bold text-center">ĐẾM 30'</span>
            </button>

            <button
              onClick={() => onCountdownClick("35:00")}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🕒</span>
              <span className="text-xs font-bold text-center">ĐẾM 35'</span>
            </button>

            <button
              onClick={() => onCountdownClick("40:00")}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🕓</span>
              <span className="text-xs font-bold text-center">ĐẾM 40'</span>
            </button>

            <button
              onClick={() => onCountdownClick("45:00")}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🕔</span>
              <span className="text-xs font-bold text-center">ĐẾM 45'</span>
            </button>
          </>
        )}

        {/* Giới thiệu */}
        <button
          onClick={() => {
            onUpdateView('intro');
            onPlayAudio('poster');
          }}
          className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <span className="text-xs font-bold text-center">GIỚI THIỆU</span>
        </button>

        {/* Tỉ số dưới */}
        {typeMatch !== 'pickleball' && (
          <button
            onClick={() => {
              onUpdateView('scoreboard_below');
              onPlayAudio('rasan');
            }}
            className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-xs font-bold text-center">TỈ SỐ DƯỚI</span>
          </button>
        )}

        {/* Nghỉ giữa hiệp */}
        <button
          onClick={() => {
            onUpdateView('halftime');
            onPlayAudio('poster');
          }}
          className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <span className="text-sm mr-1">🥤</span>
          <span className="text-xs font-bold text-center">NGHỈ GIỮA</span>
        </button>
      </div>

      {/* Đếm T - Input phút đơn giản */}
      <div className="mt-2 bg-white rounded-lg p-2 border border-teal-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const currentValue = parseInt(quickCustomMinutes) || 25;
              if (currentValue > 1) {
                setQuickCustomMinutes((currentValue - 1).toString());
              }
            }}
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded border text-sm font-bold"
          >
            -
          </button>

          <input
            id="custom-duration"
            name="custom-duration"
            type="number"
            min="1"
            max="120"
            value={quickCustomMinutes}
            onChange={(e) => setQuickCustomMinutes(e.target.value)}
            placeholder="25"
            className="w-16 text-sm border border-gray-300 rounded px-2 py-1 focus:border-teal-500 focus:outline-none text-center font-bold h-8"
          />

          <button
            onClick={() => {
              const currentValue = parseInt(quickCustomMinutes) || 25;
              if (currentValue < 120) {
                setQuickCustomMinutes((currentValue + 1).toString());
              }
            }}
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded border text-sm font-bold"
          >
            +
          </button>

          <button
            className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold h-8"
            onClick={handleCustomTimeClick}
          >
            ĐẾMTHỜI GIAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlButtons;

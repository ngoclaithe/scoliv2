import React from 'react';
import Button from '../common/Button';
import { getFullLogoUrl } from '../../utils/logoUtils';
import { toDateInputFormat } from '../../utils/helpers';

const MatchInfo = ({
  showMatchInfo,
  setShowMatchInfo,
  matchTitle,
  setMatchTitle,
  liveText,
  setLiveText,
  teamAInfo,
  setTeamAInfo,
  teamBInfo,
  setTeamBInfo,
  matchInfo,
  setMatchInfo,
  logoCodeA,
  setLogoCodeA,
  logoCodeB,
  setLogoCodeB,
  isSearchingLogoA,
  isSearchingLogoB,
  onSearchLogoA,
  onSearchLogoB,
  onApplyChanges
}) => {
  return (
    <>
      {showMatchInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg space-y-2 animate-in slide-in-from-top-3 duration-300 mt-1">
          {/* Tên trận đấu & Đơn vị live - 1 hàng */}
          <div className="grid grid-cols-2 gap-1">
            <input
              type="text"
              placeholder="Tên trận đấu"
              value={matchTitle}
              onChange={(e) => setMatchTitle(e.target.value)}
              className="w-full min-w-0 px-2 py-1 text-xs font-medium text-center text-blue-700 bg-white border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
              maxLength={50}
            />
            <input
              type="text"
              placeholder="Đơn vị live"
              value={liveText}
              onChange={(e) => setLiveText(e.target.value)}
              className="w-full min-w-0 px-2 py-1 text-xs font-medium text-center text-blue-700 bg-white border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
              maxLength={50}
            />
          </div>

          {/* Tên đội */}
          <div className="flex gap-1 items-center">
            <input
              type="text"
              placeholder="Đội A"
              value={teamAInfo.name}
              onChange={(e) => setTeamAInfo(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 min-w-0 px-2 py-1 text-xs font-medium text-center text-red-600 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-300"
              maxLength={20}
            />
            <span className="text-xs font-bold text-gray-500 px-1 flex-shrink-0">VS</span>
            <input
              type="text"
              placeholder="Đội B"
              value={teamBInfo.name}
              onChange={(e) => setTeamBInfo(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 min-w-0 px-2 py-1 text-xs font-medium text-center text-gray-800 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-300"
              maxLength={20}
            />
          </div>

          {/* Logo đội - compact */}
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs text-red-600 flex-shrink-0">A:</span>
              <input
                type="text"
                placeholder="Code"
                value={logoCodeA}
                onChange={(e) => setLogoCodeA(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && onSearchLogoA()}
                className="w-16 min-w-0 px-1 py-1 text-xs border border-gray-300 rounded focus:border-red-500 text-center bg-white flex-shrink-0"
              />
              <button
                onClick={onSearchLogoA}
                disabled={!logoCodeA.trim() || isSearchingLogoA}
                className="px-1 py-1 text-xs border border-red-500 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex-shrink-0"
              >
                {isSearchingLogoA ? '⏳' : '🔍'}
              </button>
              {teamAInfo.logo && (
                <div className="w-4 h-4 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
                  <img src={getFullLogoUrl(teamAInfo.logo)} alt="A" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs text-gray-800 flex-shrink-0">B:</span>
              <input
                type="text"
                placeholder="Code"
                value={logoCodeB}
                onChange={(e) => setLogoCodeB(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && onSearchLogoB()}
                className="w-16 min-w-0 px-1 py-1 text-xs border border-gray-300 rounded focus:border-gray-700 text-center bg-white flex-shrink-0"
              />
              <button
                onClick={onSearchLogoB}
                disabled={!logoCodeB.trim() || isSearchingLogoB}
                className="px-1 py-1 text-xs border border-gray-700 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:opacity-50 flex-shrink-0"
              >
                {isSearchingLogoB ? '⏳' : '🔍'}
              </button>
              {teamBInfo.logo && (
                <div className="w-4 h-4 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
                  <img src={getFullLogoUrl(teamBInfo.logo)} alt="B" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </div>

          {/* Màu áo & quần - 1 hàng compact */}
          <div className="grid grid-cols-2 gap-1">
            {/* Đội A */}
            <div className="flex items-center gap-1 min-w-0 flex-wrap">
              <span className="text-xs text-red-600 flex-shrink-0">A:</span>
              <input
                type="color"
                value={teamAInfo.teamAKitcolor || '#ff0000'}
                onChange={(e) =>
                  setTeamAInfo((prev) => ({
                    ...prev,
                    teamAKitcolor: e.target.value,
                  }))
                }
                className="w-5 h-5 border border-gray-300 rounded cursor-pointer flex-shrink-0"
                title="Áo A"
              />
              <span className="text-xs text-gray-500 flex-shrink-0">Áo</span>

              <input
                type="color"
                value={teamAInfo.teamA2Kitcolor || '#0000ff'}
                onChange={(e) =>
                  setTeamAInfo((prev) => ({
                    ...prev,
                    teamA2Kitcolor: e.target.value,
                  }))
                }
                className="w-5 h-5 border border-gray-300 rounded cursor-pointer flex-shrink-0 ml-2"
                title="Quần A"
              />
              <span className="text-xs text-gray-500 flex-shrink-0">Quần</span>
            </div>

            {/* Đội B */}
            <div className="flex items-center gap-1 min-w-0 flex-wrap">
              <span className="text-xs text-gray-800 flex-shrink-0">B:</span>
              <input
                type="color"
                value={teamBInfo.teamBKitcolor || '#000000'}
                onChange={(e) =>
                  setTeamBInfo((prev) => ({
                    ...prev,
                    teamBKitcolor: e.target.value,
                  }))
                }
                className="w-5 h-5 border border-gray-300 rounded cursor-pointer flex-shrink-0"
                title="Áo B"
              />
              <span className="text-xs text-gray-500 flex-shrink-0">Áo</span>

              <input
                type="color"
                value={teamBInfo.teamB2Kitcolor || '#00ff00'}
                onChange={(e) =>
                  setTeamBInfo((prev) => ({
                    ...prev,
                    teamB2Kitcolor: e.target.value,
                  }))
                }
                className="w-5 h-5 border border-gray-300 rounded cursor-pointer flex-shrink-0 ml-2"
                title="Quần B"
              />
              <span className="text-xs text-gray-500 flex-shrink-0">Quần</span>
            </div>
          </div>

          {/* Thời gian & Địa điểm */}
          <div className="grid grid-cols-3 gap-1">
            <input
              type="date"
              value={toDateInputFormat(matchInfo.matchDate) || new Date().toISOString().split('T')[0]}
              onChange={(e) => setMatchInfo(prev => ({ ...prev, matchDate: e.target.value }))}
              className="w-full min-w-0 px-1 py-1 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center bg-white"
            />
            <input
              type="time"
              value={matchInfo.startTime}
              onChange={(e) => setMatchInfo(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full min-w-0 px-1 py-1 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center bg-white"
            />
            <input
              type="text"
              placeholder="Sân..."
              value={matchInfo.location}
              onChange={(e) => setMatchInfo(prev => ({ ...prev, location: e.target.value }))}
              className="w-full min-w-0 px-1 py-1 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center bg-white"
              maxLength={20}
            />
          </div>

          {/* Nút áp dụng - compact */}
          <div className="flex justify-center pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={onApplyChanges}
              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs rounded shadow transform hover:scale-105 transition-all duration-200"
            >
              ÁP DỤNG
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MatchInfo;

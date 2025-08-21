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
  onApplyChanges,
  commentator,
  setCommentator
}) => {
  return (
    <>
      {showMatchInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg space-y-1 animate-in slide-in-from-top-3 duration-300 mt-1 p-1">
          
          {/* Hàng 1: Team A - Tên, Logo, Màu áo, Màu quần */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-red-600 font-bold min-w-0 flex-shrink-0">A:</span>
            <input
              type="text"
              placeholder="Tên team A"
              value={teamAInfo.name}
              onChange={(e) => setTeamAInfo(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 min-w-0 px-1 py-0.5 text-xs text-center text-red-600 bg-white border border-red-300 rounded focus:outline-none focus:ring-1 focus:ring-red-300"
              maxLength={20}
            />
            <input
              type="text"
              placeholder="Code"
              value={logoCodeA}
              onChange={(e) => setLogoCodeA(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && onSearchLogoA()}
              className="w-12 px-1 py-0.5 text-xs border border-gray-300 rounded focus:border-red-500 text-center bg-white"
            />
            <button
              onClick={onSearchLogoA}
              disabled={!logoCodeA.trim() || isSearchingLogoA}
              className="px-1 py-0.5 text-xs border border-red-500 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {isSearchingLogoA ? '⏳' : '🔍'}
            </button>
            {teamAInfo.logo && (
              <div className="w-4 h-4 bg-gray-100 rounded border overflow-hidden">
                <img src={getFullLogoUrl(teamAInfo.logo)} alt="A" className="w-full h-full object-contain" />
              </div>
            )}
            <input
              type="color"
              value={teamAInfo.teamAKitcolor || '#ff0000'}
              onChange={(e) => setTeamAInfo(prev => ({ ...prev, teamAKitcolor: e.target.value }))}
              className="w-4 h-4 border border-gray-300 rounded cursor-pointer"
              title="Áo A"
            />
            <span className="text-xs text-gray-500">Áo</span>
            <input
              type="color"
              value={teamAInfo.teamA2Kitcolor || '#0000ff'}
              onChange={(e) => setTeamAInfo(prev => ({ ...prev, teamA2Kitcolor: e.target.value }))}
              className="w-4 h-4 border border-gray-300 rounded cursor-pointer"
              title="Quần A"
            />
            <span className="text-xs text-gray-500">Quần</span>
          </div>

          {/* Hàng 2: Team B - Tên, Logo, Màu áo, Màu quần */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-800 font-bold min-w-0 flex-shrink-0">B:</span>
            <input
              type="text"
              placeholder="Tên team B"
              value={teamBInfo.name}
              onChange={(e) => setTeamBInfo(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 min-w-0 px-1 py-0.5 text-xs text-center text-gray-800 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-300"
              maxLength={20}
            />
            <input
              type="text"
              placeholder="Code"
              value={logoCodeB}
              onChange={(e) => setLogoCodeB(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && onSearchLogoB()}
              className="w-12 px-1 py-0.5 text-xs border border-gray-300 rounded focus:border-gray-700 text-center bg-white"
            />
            <button
              onClick={onSearchLogoB}
              disabled={!logoCodeB.trim() || isSearchingLogoB}
              className="px-1 py-0.5 text-xs border border-gray-700 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {isSearchingLogoB ? '⏳' : '🔍'}
            </button>
            {teamBInfo.logo && (
              <div className="w-4 h-4 bg-gray-100 rounded border overflow-hidden">
                <img src={getFullLogoUrl(teamBInfo.logo)} alt="B" className="w-full h-full object-contain" />
              </div>
            )}
            <input
              type="color"
              value={teamBInfo.teamBKitcolor || '#000000'}
              onChange={(e) => setTeamBInfo(prev => ({ ...prev, teamBKitcolor: e.target.value }))}
              className="w-4 h-4 border border-gray-300 rounded cursor-pointer"
              title="Áo B"
            />
            <span className="text-xs text-gray-500">Áo</span>
            <input
              type="color"
              value={teamBInfo.teamB2Kitcolor || '#00ff00'}
              onChange={(e) => setTeamBInfo(prev => ({ ...prev, teamB2Kitcolor: e.target.value }))}
              className="w-4 h-4 border border-gray-300 rounded cursor-pointer"
              title="Quần B"
            />
            <span className="text-xs text-gray-500">Quần</span>
          </div>

          {/* Hàng 3: Tên trận đấu, Đơn vị live */}
          <div className="flex gap-1">
            <input
              type="text"
              placeholder="Tên trận đấu"
              value={matchTitle}
              onChange={(e) => setMatchTitle(e.target.value)}
              className="flex-1 px-1 py-0.5 text-xs text-center text-blue-700 bg-white border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
              maxLength={50}
            />
            <input
              type="text"
              placeholder="Đơn vị live"
              value={liveText}
              onChange={(e) => setLiveText(e.target.value)}
              className="flex-1 px-1 py-0.5 text-xs text-center text-blue-700 bg-white border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
              maxLength={50}
            />
          </div>

          {/* Hàng 4: Thời gian (phút+giờ), Ngày, Địa điểm */}
          <div className="flex gap-1">
            <input
              type="time"
              value={matchInfo.startTime}
              onChange={(e) => setMatchInfo(prev => ({ ...prev, startTime: e.target.value }))}
              className="flex-1 px-1 py-0.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center bg-white"
            />
            <input
              type="date"
              value={toDateInputFormat(matchInfo.matchDate) || new Date().toISOString().split('T')[0]}
              onChange={(e) => setMatchInfo(prev => ({ ...prev, matchDate: e.target.value }))}
              className="flex-1 px-1 py-0.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center bg-white"
            />
            <input
              type="text"
              placeholder="Địa điểm"
              value={matchInfo.location}
              onChange={(e) => setMatchInfo(prev => ({ ...prev, location: e.target.value }))}
              className="flex-1 px-1 py-0.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center bg-white"
              maxLength={20}
            />
          </div>

          {/* Hàng 5: Bình luận viên */}
          <div className="flex gap-1">
            <input
              type="text"
              placeholder="Bình luận viên"
              value={commentator || ''}
              onChange={(e) => setCommentator(e.target.value)}
              className="w-full px-1 py-0.5 text-xs text-center text-purple-700 bg-white border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-300"
              maxLength={50}
            />
          </div>

          {/* Nút áp dụng */}
          <div className="flex justify-center pt-0.5">
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

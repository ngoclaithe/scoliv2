import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import { useMatch } from '../../contexts/MatchContext';
import DisplayLogo from '../common/DisplayLogo';

const Event = () => {
  const { matchData: publicMatchData } = usePublicMatch();
  const { matchData: adminMatchData, matchStats, socketConnected } = useMatch();
  
  // Sử dụng adminMatchData nếu có, fallback về publicMatchData
  const matchData = adminMatchData || publicMatchData || {};
  
  const [events, setEvents] = useState([]);

  // Tạo danh sách sự kiện từ matchData và matchStats
  useEffect(() => {
    const eventList = [];

    // Sự kiện ghi bàn đội A
    if (matchData.teamA?.teamAScorers) {
      matchData.teamA.teamAScorers.forEach(scorer => {
        scorer.times.forEach(time => {
          eventList.push({
            id: `goal-A-${scorer.player}-${time}`,
            type: 'goal',
            team: 'teamA',
            player: scorer.player,
            minute: time,
            icon: '⚽'
          });
        });
      });
    }

    // Sự kiện ghi bàn đội B
    if (matchData.teamB?.teamBScorers) {
      matchData.teamB.teamBScorers.forEach(scorer => {
        scorer.times.forEach(time => {
          eventList.push({
            id: `goal-B-${scorer.player}-${time}`,
            type: 'goal',
            team: 'teamB',
            player: scorer.player,
            minute: time,
            icon: '⚽'
          });
        });
      });
    }

    // Sắp xếp theo phút
    eventList.sort((a, b) => a.minute - b.minute);
    setEvents(eventList);
  }, [matchData]);

  const teamAData = {
    name: matchData.teamA?.name || "ĐỘI A",
    logo: matchData.teamA?.logo || "https://upload.wikimedia.org/wikipedia/vi/thumb/9/91/FC_Barcelona_logo.svg/1200px-FC_Barcelona_logo.svg.png",
    score: matchData.teamA?.score || 0,
    color: matchData.teamA?.teamAKitColor || "#FF0000"
  };

  const teamBData = {
    name: matchData.teamB?.name || "��ỘI B",
    logo: matchData.teamB?.logo || "https://upload.wikimedia.org/wikipedia/vi/thumb/9/91/FC_Barcelona_logo.svg/1200px-FC_Barcelona_logo.svg.png",
    score: matchData.teamB?.score || 0,
    color: matchData.teamB?.teamBKitColor || "#0000FF"
  };

  const EventItem = ({ event }) => {
    const isTeamA = event.team === 'teamA';
    const teamColor = isTeamA ? teamAData.color : teamBData.color;
    
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg bg-white/90 shadow-sm ${isTeamA ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="text-2xl">{event.icon}</div>
        <div className={`flex-1 ${isTeamA ? 'text-left' : 'text-right'}`}>
          <div className="font-semibold text-gray-900">{event.player}</div>
          <div className="text-sm text-gray-600">
            {isTeamA ? teamAData.name : teamBData.name}
          </div>
        </div>
        <div 
          className="px-3 py-1 rounded-full text-white font-bold text-sm"
          style={{ backgroundColor: teamColor }}
        >
          {event.minute}'
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: 'url(/images/basic/sanconhantao.jpg)' }}
    >
      {/* Overlay để làm nền tối hơn */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Logo ScoLiv */}
      <div className="absolute top-4 right-4 z-30">
        <img
          src="/images/basic/ScoLivLogo.png"
          alt="ScoLiv"
          className="w-16 h-16 object-contain opacity-80"
          onError={(e) => {
            e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="%23007acc"/><text x="32" y="38" text-anchor="middle" font-size="12" fill="white" font-weight="bold">ScoLiv</text></svg>`;
          }}
        />
      </div>

      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header Scoreboard */}
        <div className="w-full py-8">
          <div className="max-w-4xl mx-auto px-4">
            {/* Main Scoreboard */}
            <div className="bg-white/95 rounded-2xl shadow-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                {/* Team A */}
                <div className="flex items-center gap-4 flex-1">
                  <DisplayLogo
                    logos={[teamAData.logo]}
                    alt={teamAData.name}
                    className="w-16 h-16"
                    type_play="circle"
                    logoSize="w-16 h-16"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 truncate">{teamAData.name}</h2>
                    <div 
                      className="w-full h-2 rounded-full mt-1"
                      style={{ backgroundColor: teamAData.color }}
                    />
                  </div>
                </div>

                {/* Score */}
                <div className="mx-8">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-bold">{teamAData.score}</span>
                      <span className="text-2xl text-blue-200">:</span>
                      <span className="text-4xl font-bold">{teamBData.score}</span>
                    </div>
                  </div>
                </div>

                {/* Team B */}
                <div className="flex items-center gap-4 flex-1 flex-row-reverse">
                  <DisplayLogo
                    logos={[teamBData.logo]}
                    alt={teamBData.name}
                    className="w-16 h-16"
                    type_play="circle"
                    logoSize="w-16 h-16"
                  />
                  <div className="flex-1 text-right">
                    <h2 className="text-xl font-bold text-gray-900 truncate">{teamBData.name}</h2>
                    <div 
                      className="w-full h-2 rounded-full mt-1"
                      style={{ backgroundColor: teamBData.color }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/90 rounded-xl p-4 text-center shadow-lg">
                <div className="text-2xl font-bold text-red-600">{matchStats?.yellowCards?.team1 || 0}</div>
                <div className="text-sm text-gray-600">Thẻ vàng {teamAData.name}</div>
              </div>
              <div className="bg-white/90 rounded-xl p-4 text-center shadow-lg">
                <div className="text-xl font-semibold text-gray-800">SỰ KIỆN TRẬN ĐẤU</div>
                <div className="text-sm text-gray-600">Tổng cộng: {events.length}</div>
              </div>
              <div className="bg-white/90 rounded-xl p-4 text-center shadow-lg">
                <div className="text-2xl font-bold text-blue-600">{matchStats?.yellowCards?.team2 || 0}</div>
                <div className="text-sm text-gray-600">Thẻ vàng {teamBData.name}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Timeline */}
        <div className="flex-1 px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 rounded-2xl shadow-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🎯 Diễn biến trận đấu
              </h3>
              
              {events.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {events.map((event) => (
                    <EventItem key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚽</div>
                  <div className="text-xl text-gray-600 mb-2">Chưa có sự kiện nào</div>
                  <div className="text-sm text-gray-500">Các bàn thắng và thẻ phạt sẽ hiển thị tại đây</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full py-4">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white/80 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {socketConnected ? 'Trực tiếp' : 'Không kết nối'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  📺 Powered by ScoLiv
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;

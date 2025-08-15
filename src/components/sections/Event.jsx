import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import DisplayLogo from '../common/DisplayLogo';

const Event = () => {
  const { matchData } = usePublicMatch();
  
  const [events, setEvents] = useState([]);

  // Tạo danh sách sự kiện từ matchData
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

    // Sự kiện thẻ vàng đội A
    if (matchData.teamA?.teamAYellowCards) {
      matchData.teamA.teamAYellowCards.forEach(card => {
        card.times.forEach(time => {
          eventList.push({
            id: `yellow-A-${card.player}-${time}`,
            type: 'yellowCard',
            team: 'teamA',
            player: card.player,
            minute: time,
            icon: '🟨'
          });
        });
      });
    }

    // Sự kiện thẻ vàng đội B
    if (matchData.teamB?.teamBYellowCards) {
      matchData.teamB.teamBYellowCards.forEach(card => {
        card.times.forEach(time => {
          eventList.push({
            id: `yellow-B-${card.player}-${time}`,
            type: 'yellowCard',
            team: 'teamB',
            player: card.player,
            minute: time,
            icon: '🟨'
          });
        });
      });
    }

    // Sự kiện thẻ đỏ đội A
    if (matchData.teamA?.teamARedCards) {
      matchData.teamA.teamARedCards.forEach(card => {
        card.times.forEach(time => {
          eventList.push({
            id: `red-A-${card.player}-${time}`,
            type: 'redCard',
            team: 'teamA',
            player: card.player,
            minute: time,
            icon: '🟥'
          });
        });
      });
    }

    // Sự kiện thẻ đỏ đội B
    if (matchData.teamB?.teamBRedCards) {
      matchData.teamB.teamBRedCards.forEach(card => {
        card.times.forEach(time => {
          eventList.push({
            id: `red-B-${card.player}-${time}`,
            type: 'redCard',
            team: 'teamB',
            player: card.player,
            minute: time,
            icon: '🟥'
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
    logo: matchData.teamA?.logo || "/images/default-team.png",
    score: matchData.teamA?.score || 0,
    color: matchData.teamA?.teamAKitColor || "#FF6B6B",
    yellowCards: matchData.teamA?.teamAYellowCards?.reduce((total, card) => total + card.times.length, 0) || 0,
    redCards: matchData.teamA?.teamARedCards?.reduce((total, card) => total + card.times.length, 0) || 0
  };

  const teamBData = {
    name: matchData.teamB?.name || "ĐỘI B",
    logo: matchData.teamB?.logo || "/images/default-team.png",
    score: matchData.teamB?.score || 0,
    color: matchData.teamB?.teamBKitColor || "#4ECDC4",
    yellowCards: matchData.teamB?.teamBYellowCards?.reduce((total, card) => total + card.times.length, 0) || 0,
    redCards: matchData.teamB?.teamBRedCards?.reduce((total, card) => total + card.times.length, 0) || 0
  };

  const EventItem = ({ event }) => {
    const isTeamA = event.team === 'teamA';
    const teamColor = isTeamA ? teamAData.color : teamBData.color;
    
    const getEventTypeText = (type) => {
      switch(type) {
        case 'goal': return 'Bàn thắng';
        case 'yellowCard': return 'Thẻ vàng';
        case 'redCard': return 'Thẻ đỏ';
        default: return 'Sự kiện';
      }
    };
    
    return (
      <div className={`relative mb-4 ${isTeamA ? 'mr-8' : 'ml-8'}`}>
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full"></div>
        
        {/* Event card */}
        <div className={`flex items-center gap-4 ${isTeamA ? 'flex-row' : 'flex-row-reverse'} relative`}>
          {/* Timeline dot */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-indigo-500 rounded-full z-10 shadow-lg"></div>
          
          {/* Event content */}
          <div className={`flex-1 ${isTeamA ? 'pr-8' : 'pl-8'}`}>
            <div className={`bg-gradient-to-r ${isTeamA ? 'from-white to-gray-50' : 'from-gray-50 to-white'} p-4 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300`}>
              <div className={`flex items-center gap-3 ${isTeamA ? '' : 'flex-row-reverse'}`}>
                <div className="text-3xl">{event.icon}</div>
                <div className={`flex-1 ${isTeamA ? 'text-left' : 'text-right'}`}>
                  <div className="font-bold text-lg text-gray-900">{event.player}</div>
                  <div className="text-sm text-gray-600 font-medium">
                    {getEventTypeText(event.type)} • {isTeamA ? teamAData.name : teamBData.name}
                  </div>
                </div>
                <div 
                  className="px-4 py-2 rounded-full text-white font-bold text-lg shadow-md"
                  style={{ backgroundColor: teamColor }}
                >
                  {event.minute}'
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Logo ScoLiv */}
      <div className="absolute top-6 right-6 z-30">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30 shadow-xl">
          <img
            src="/images/basic/ScoLivLogo.png"
            alt="ScoLiv"
            className="w-12 h-12 object-contain"
            onError={(e) => {
              e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="%23007acc"/><text x="24" y="28" text-anchor="middle" font-size="10" fill="white" font-weight="bold">ScoLiv</text></svg>`;
            }}
          />
        </div>
      </div>

      <div className="relative z-20 min-h-screen">
        {/* Header Scoreboard */}
        <div className="pt-8 pb-6">
          <div className="max-w-6xl mx-auto px-6">
            {/* Main Scoreboard */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
              <div className="flex items-center justify-between">
                {/* Team A */}
                <div className="flex items-center gap-6 flex-1">
                  <div className="relative">
                    <DisplayLogo
                      logos={[teamAData.logo]}
                      alt={teamAData.name}
                      className="w-20 h-20"
                      type_play="circle"
                      logoSize="w-20 h-20"
                    />
                    <div 
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full"
                      style={{ backgroundColor: teamAData.color }}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 truncate mb-2">{teamAData.name}</h2>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">🟨</span>
                        <span className="font-semibold text-yellow-600">{teamAData.yellowCards}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-lg">🟥</span>
                        <span className="font-semibold text-red-600">{teamAData.redCards}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="mx-8">
                  <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-12 py-6 rounded-2xl shadow-2xl border-4 border-white/20">
                    <div className="flex items-center gap-6">
                      <span className="text-5xl font-black">{teamAData.score}</span>
                      <div className="flex flex-col items-center">
                        <span className="text-3xl text-white/80">VS</span>
                        <div className="w-8 h-0.5 bg-white/50 mt-1"></div>
                      </div>
                      <span className="text-5xl font-black">{teamBData.score}</span>
                    </div>
                  </div>
                </div>

                {/* Team B */}
                <div className="flex items-center gap-6 flex-1 flex-row-reverse">
                  <div className="relative">
                    <DisplayLogo
                      logos={[teamBData.logo]}
                      alt={teamBData.name}
                      className="w-20 h-20"
                      type_play="circle"
                      logoSize="w-20 h-20"
                    />
                    <div 
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full"
                      style={{ backgroundColor: teamBData.color }}
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <h2 className="text-2xl font-bold text-gray-900 truncate mb-2">{teamBData.name}</h2>
                    <div className="flex gap-4 justify-end">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-yellow-600">{teamBData.yellowCards}</span>
                        <span className="text-lg">🟨</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-red-600">{teamBData.redCards}</span>
                        <span className="text-lg">🟥</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-black">{teamAData.yellowCards + teamBData.yellowCards}</div>
                    <div className="text-yellow-100 font-medium">Tổng thẻ vàng</div>
                  </div>
                  <div className="text-4xl">🟨</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-black">{events.length}</div>
                    <div className="text-indigo-100 font-medium">Tổng sự kiện</div>
                  </div>
                  <div className="text-4xl">⚡</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-black">{teamAData.redCards + teamBData.redCards}</div>
                    <div className="text-red-100 font-medium">Tổng thẻ đỏ</div>
                  </div>
                  <div className="text-4xl">🟥</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Timeline */}
        <div className="flex-1 px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                  🎯 DIỄN BIẾN TRẬN ĐẤU
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
              </div>
              
              {events.length > 0 ? (
                <div className="relative max-h-96 overflow-y-auto pr-2">
                  <div className="space-y-2">
                    {events.map((event, index) => (
                      <div key={event.id} className="relative">
                        <EventItem event={event} />
                        {index < events.length - 1 && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-indigo-300 to-purple-300 -bottom-4 z-0"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6 animate-bounce">⚽</div>
                  <div className="text-2xl font-bold text-gray-700 mb-3">Chưa có sự kiện nào</div>
                  <div className="text-gray-500 text-lg">Các bàn thắng và thẻ phạt sẽ hiển thị tại đây</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full py-6">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-white font-semibold text-lg">
                    Trận đấu trực tiếp
                  </span>
                </div>
                <div className="text-white/80 font-medium">
                  <span className="text-2xl mr-2">📺</span>
                  Powered by ScoLiv
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
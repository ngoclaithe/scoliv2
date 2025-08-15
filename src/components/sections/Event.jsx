import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import DisplayLogo from '../common/DisplayLogo';

const Event = () => {
  const { matchData, matchStats } = usePublicMatch();

  const [teamAEvents, setTeamAEvents] = useState([]);
  const [teamBEvents, setTeamBEvents] = useState([]);

  // Tạo danh sách sự kiện từ matchData và matchStats
  useEffect(() => {
    const teamAEventsList = [];
    const teamBEventsList = [];

    // Helper function để tạo unique key cho event
    const createEventKey = (type, player, minute) => {
      return `${type}-${player}-${minute}`;
    };

    // Helper function để loại bỏ duplicate events
    const removeDuplicates = (events) => {
      const seen = new Set();
      return events.filter(event => {
        const key = createEventKey(event.type, event.player, event.minute);
        if (seen.has(key)) {
          console.log('🔄 Removing duplicate event:', key);
          return false;
        }
        seen.add(key);
        return true;
      });
    };

    // Sự kiện ghi bàn đội A
    if (matchData.teamA?.teamAScorers) {
      matchData.teamA.teamAScorers.forEach(scorer => {
        scorer.times.forEach(time => {
          teamAEventsList.push({
            type: 'goal',
            player: scorer.player,
            minute: time,
            icon: '⚽',
            uniqueKey: createEventKey('goal', scorer.player, time)
          });
        });
      });
    }

    // Sự kiện ghi bàn đội B
    if (matchData.teamB?.teamBScorers) {
      matchData.teamB.teamBScorers.forEach(scorer => {
        scorer.times.forEach(time => {
          teamBEventsList.push({
            type: 'goal',
            player: scorer.player,
            minute: time,
            icon: '⚽',
            uniqueKey: createEventKey('goal', scorer.player, time)
          });
        });
      });
    }

    // Thẻ vàng đội A (team1)
    if (Array.isArray(matchStats.yellowCards?.team1)) {
      matchStats.yellowCards.team1.forEach(card => {
        teamAEventsList.push({
          type: 'yellow_card',
          player: card.player,
          minute: card.minute,
          icon: '🟨',
          uniqueKey: createEventKey('yellow_card', card.player, card.minute)
        });
      });
    }

    // Thẻ vàng đội B (team2)
    if (Array.isArray(matchStats.yellowCards?.team2)) {
      matchStats.yellowCards.team2.forEach(card => {
        teamBEventsList.push({
          type: 'yellow_card',
          player: card.player,
          minute: card.minute,
          icon: '🟨',
          uniqueKey: createEventKey('yellow_card', card.player, card.minute)
        });
      });
    }

    // Thẻ đỏ đội A (team1)
    if (Array.isArray(matchStats.redCards?.team1)) {
      matchStats.redCards.team1.forEach(card => {
        teamAEventsList.push({
          type: 'red_card',
          player: card.player,
          minute: card.minute,
          icon: '🟥',
          uniqueKey: createEventKey('red_card', card.player, card.minute)
        });
      });
    }

    // Thẻ đỏ đội B (team2)
    if (Array.isArray(matchStats.redCards?.team2)) {
      matchStats.redCards.team2.forEach(card => {
        teamBEventsList.push({
          type: 'red_card',
          player: card.player,
          minute: card.minute,
          icon: '🟥',
          uniqueKey: createEventKey('red_card', card.player, card.minute)
        });
      });
    }

    // Loại bỏ duplicates trước khi sắp xếp
    const uniqueTeamAEvents = removeDuplicates(teamAEventsList);
    const uniqueTeamBEvents = removeDuplicates(teamBEventsList);

    // Debug log để kiểm tra
    console.log('🔍 Team A Events (before dedup):', teamAEventsList.length);
    console.log('🔍 Team A Events (after dedup):', uniqueTeamAEvents.length);
    console.log('🔍 Team B Events (before dedup):', teamBEventsList.length);
    console.log('🔍 Team B Events (after dedup):', uniqueTeamBEvents.length);

    // Sắp xếp theo phút
    uniqueTeamAEvents.sort((a, b) => a.minute - b.minute);
    uniqueTeamBEvents.sort((a, b) => a.minute - b.minute);

    setTeamAEvents(uniqueTeamAEvents);
    setTeamBEvents(uniqueTeamBEvents);
  }, [matchData, matchStats]);

  const teamAData = {
    name: matchData.teamA?.name || "ĐỘI A",
    logo: matchData.teamA?.logo || "/images/default-team.png",
    score: matchData.teamA?.score || 0,
    color: matchData.teamA?.teamAKitColor || "#FF6B6B"
  };

  const teamBData = {
    name: matchData.teamB?.name || "ĐỘI B",
    logo: matchData.teamB?.logo || "/images/default-team.png",
    score: matchData.teamB?.score || 0,
    color: matchData.teamB?.teamBKitColor || "#4ECDC4"
  };

  const EventItem = ({ event, isTeamA, teamColor }) => {
    const getEventColor = (eventType) => {
      switch (eventType) {
        case 'goal':
          return teamColor;
        case 'yellow_card':
          return '#FCD34D';
        case 'red_card':
          return '#EF4444';
        default:
          return teamColor;
      }
    };

    return (
      <div className={`flex items-center gap-2 p-2 mb-2 ${isTeamA ? 'text-left' : 'text-right flex-row-reverse'} ${window.innerWidth < 640 ? 'text-left flex-row' : ''}`}>
        <div className="text-lg sm:text-xl">{event.icon}</div>
        <div className={`flex-1 ${isTeamA ? 'text-left' : 'text-right'} ${window.innerWidth < 640 ? 'text-left' : ''}`}>
          <div className="font-bold text-xs sm:text-sm text-gray-900 truncate">{event.player}</div>
          {event.type !== 'goal' && (
            <div className="text-xs text-gray-600">
              {event.type === 'yellow_card' ? 'Thẻ vàng' : 'Thẻ đỏ'}
            </div>
          )}
        </div>
        <div
          className="px-2 py-1 rounded-full text-white font-bold text-xs min-w-[35px] sm:min-w-[40px] text-center"
          style={{ backgroundColor: getEventColor(event.type) }}
        >
          {event.minute}'
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/basic/sanconhantao.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-transparent to-blue-900/30"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
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

      <div className="relative z-20 h-full flex flex-col">
        {/* Modern Header */}
        <div className="relative flex-shrink-0 px-2 sm:px-6 pt-4 sm:pt-6">
          <div className="relative bg-white/98 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-white/30 overflow-hidden">
            {/* Background gradient bars */}
            <div className="absolute inset-0 flex">
              <div 
                className="w-1/3 h-full opacity-20"
                style={{ backgroundColor: teamAData.color }}
              ></div>
              <div className="w-1/3 h-full bg-gradient-to-r from-gray-100 to-gray-50"></div>
              <div 
                className="w-1/3 h-full opacity-20"
                style={{ backgroundColor: teamBData.color }}
              ></div>
            </div>
            
            {/* Header content */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-0 px-4 sm:px-8 lg:px-12 py-4 sm:py-6 lg:py-8">
              {/* Team A */}
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 flex-shrink-0 sm:flex-1">
                <div 
                  className="p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg border-2 border-white"
                  style={{ backgroundColor: teamAData.color + '20' }}
                >
                  <DisplayLogo
                    logos={[teamAData.logo]}
                    alt={teamAData.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
                    type_play="circle"
                    logoSize="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
                  />
                </div>
                <div className="hidden sm:block">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{teamAData.name}</h2>
                  <div 
                    className="w-16 sm:w-20 h-1 rounded-full mt-1"
                    style={{ backgroundColor: teamAData.color }}
                  ></div>
                </div>
              </div>

              {/* Mobile team names (above score) */}
              <div className="flex sm:hidden items-center gap-8 w-full justify-between px-4 order-first">
                <h2 className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{teamAData.name}</h2>
                <h2 className="text-sm font-bold text-gray-900 truncate max-w-[120px] text-right">{teamBData.name}</h2>
              </div>

              {/* Score in center */}
              <div className="flex items-center justify-center px-2 sm:px-4 lg:px-8 flex-shrink-0">
                <div className="relative">
                  <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white px-4 sm:px-6 lg:px-12 py-3 sm:py-4 lg:py-6 rounded-xl sm:rounded-2xl shadow-2xl border-2 sm:border-4 border-white/20">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-black">{teamAData.score}</span>
                      <div className="w-0.5 sm:w-1 h-6 sm:h-8 lg:h-12 bg-white/30 rounded-full"></div>
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-black">{teamBData.score}</span>
                    </div>
                  </div>
                  {/* Score glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl sm:rounded-2xl blur opacity-20"></div>
                </div>
              </div>

              {/* Team B */}
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 flex-shrink-0 sm:flex-1 sm:justify-end flex-row-reverse sm:flex-row">
                <div 
                  className="p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg border-2 border-white"
                  style={{ backgroundColor: teamBData.color + '20' }}
                >
                  <DisplayLogo
                    logos={[teamBData.logo]}
                    alt={teamBData.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
                    type_play="circle"
                    logoSize="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
                  />
                </div>
                <div className="hidden sm:block text-right">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{teamBData.name}</h2>
                  <div 
                    className="w-16 sm:w-20 h-1 rounded-full mt-1 ml-auto"
                    style={{ backgroundColor: teamBData.color }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Bottom decorative line */}
            <div className="h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
        </div>

        {/* Events Section - Takes remaining space */}
        <div className="flex-1 px-2 sm:px-6 pb-4 sm:pb-6 overflow-hidden">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl h-full border-2 border-white/30 ring-1 ring-green-500/20 p-3 sm:p-6">
            {(teamAEvents.length > 0 || teamBEvents.length > 0) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 h-full">
                {/* Team A Events */}
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div
                      className="h-1 rounded-full flex-1"
                      style={{ backgroundColor: teamAData.color }}
                    ></div>
                    <span className="text-xs sm:text-sm font-bold text-gray-600 sm:hidden">{teamAData.name}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-1 sm:pr-2">
                    {teamAEvents.map((event, index) => (
                      <EventItem
                        key={event.uniqueKey || `teamA-${event.type}-${event.player}-${event.minute}-${index}`}
                        event={event}
                        isTeamA={true}
                        teamColor={teamAData.color}
                      />
                    ))}
                  </div>
                </div>

                {/* Team B Events */}
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <span className="text-xs sm:text-sm font-bold text-gray-600 sm:hidden">{teamBData.name}</span>
                    <div
                      className="h-1 rounded-full flex-1"
                      style={{ backgroundColor: teamBData.color }}
                    ></div>
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-1 sm:pr-2">
                    {teamBEvents.map((event, index) => (
                      <EventItem
                        key={event.uniqueKey || `teamB-${event.type}-${event.player}-${event.minute}-${index}`}
                        event={event}
                        isTeamA={false}
                        teamColor={teamBData.color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-4xl sm:text-6xl mb-2 sm:mb-4 animate-bounce">⚽</div>
                <div className="text-lg sm:text-xl font-bold text-gray-700 mb-1 sm:mb-2">Chưa có sự kiện nào</div>
                <div className="text-gray-500 text-sm sm:text-base text-center px-4">Các sự kiện trận đấu sẽ hiển thị tại đây</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
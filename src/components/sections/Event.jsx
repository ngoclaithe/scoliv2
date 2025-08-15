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
      <div className={`flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-white/70 hover:bg-white/90 shadow-sm border border-gray-100 transition-all duration-200 ${isTeamA ? '' : 'flex-row-reverse'}`}>
        <div className="text-sm sm:text-base flex-shrink-0">{event.icon}</div>
        <div className={`flex-1 min-w-0 ${isTeamA ? 'text-left' : 'text-right'}`}>
          <div className="font-bold text-xs sm:text-sm text-gray-900 truncate leading-tight">{event.player}</div>
          {event.type !== 'goal' && (
            <div className="text-xs text-gray-500 leading-tight">
              {event.type === 'yellow_card' ? 'Thẻ vàng' : 'Thẻ đỏ'}
            </div>
          )}
        </div>
        <div
          className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-white font-bold text-xs min-w-[28px] sm:min-w-[32px] text-center flex-shrink-0 shadow-sm"
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
        {/* Layered Geometric Scoreboard Header */}
        <div className="relative flex-shrink-0 px-1 sm:px-3 lg:px-4 pt-3 sm:pt-4">
          <div className="relative h-16 sm:h-20 lg:h-24">

            {/* Layer 1 - Base geometric shape */}
            <div
              className="absolute inset-0 bg-slate-800"
              style={{
                clipPath: 'polygon(0 20%, 20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%)'
              }}
            ></div>

            {/* Layer 2 - Team A side geometric */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1/3 opacity-80"
              style={{
                background: `linear-gradient(135deg, ${teamAData.color}70, ${teamAData.color}40)`,
                clipPath: 'polygon(0 0, 85% 0, 70% 100%, 0 100%)'
              }}
            ></div>

            {/* Layer 3 - Team B side geometric */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1/3 opacity-80"
              style={{
                background: `linear-gradient(225deg, ${teamBData.color}70, ${teamBData.color}40)`,
                clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 30% 100%)'
              }}
            ></div>

            {/* Layer 4 - Center diamond shape */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 sm:w-32 lg:w-40 h-12 sm:h-16 lg:h-20">
              <div
                className="w-full h-full bg-gradient-to-br from-white via-gray-100 to-gray-200 shadow-2xl"
                style={{
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)'
                }}
              ></div>
            </div>

            {/* Layer 5 - Accent triangles */}
            <div
              className="absolute left-8 sm:left-12 top-2 w-6 h-6 opacity-60"
              style={{
                background: teamAData.color,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
              }}
            ></div>
            <div
              className="absolute right-8 sm:right-12 bottom-2 w-6 h-6 opacity-60"
              style={{
                background: teamBData.color,
                clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)'
              }}
            ></div>

            {/* Layer 6 - Corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-gray-600" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 30%, 30% 30%, 30% 100%, 0 100%)' }}></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-gray-600" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 70% 100%, 70% 30%, 0 30%)' }}></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-gray-600" style={{ clipPath: 'polygon(0 0, 30% 0, 30% 70%, 100% 70%, 100% 100%, 0 100%)' }}></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-gray-600" style={{ clipPath: 'polygon(70% 0, 100% 0, 100% 100%, 0 100%, 0 70%, 70% 70%)' }}></div>

            {/* Content overlay */}
            <div className="relative z-10 h-full flex items-center justify-between px-2 sm:px-4 lg:px-6">

              {/* Team A Section */}
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-1 min-w-0">
                {/* Team A Logo Container */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 p-1 sm:p-1.5 lg:p-2"
                    style={{
                      background: `linear-gradient(135deg, ${teamAData.color}20, rgba(255,255,255,0.3))`,
                      clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)'
                    }}
                  >
                    <DisplayLogo
                      logos={[teamAData.logo]}
                      alt={teamAData.name}
                      className="w-full h-full"
                      type_play="circle"
                      logoSize="w-full h-full"
                    />
                  </div>
                </div>

                {/* Team A Name */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xs sm:text-sm lg:text-lg xl:text-xl font-bold text-white truncate drop-shadow-lg">
                    {teamAData.name}
                  </h2>
                  <div
                    className="w-6 sm:w-8 lg:w-12 h-1 mt-0.5"
                    style={{
                      background: teamAData.color,
                      clipPath: 'polygon(0 0, 80% 0, 100% 100%, 20% 100%)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Central Score Display */}
              <div className="flex items-center justify-center flex-shrink-0">
                <div className="relative">
                  {/* Score background with diamond shape */}
                  <div
                    className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 bg-white text-gray-900 shadow-xl"
                    style={{
                      clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)'
                    }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                      <div
                        className="text-lg sm:text-2xl lg:text-4xl font-black tabular-nums"
                        style={{ color: teamAData.color }}
                      >
                        {teamAData.score}
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-px h-4 sm:h-6 lg:h-8 bg-gray-400"></div>
                        <div className="text-xs sm:text-sm font-bold text-gray-500">-</div>
                        <div className="w-px h-4 sm:h-6 lg:h-8 bg-gray-400"></div>
                      </div>

                      <div
                        className="text-lg sm:text-2xl lg:text-4xl font-black tabular-nums"
                        style={{ color: teamBData.color }}
                      >
                        {teamBData.score}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team B Section */}
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-1 min-w-0 justify-end">
                {/* Team B Name */}
                <div className="flex-1 min-w-0 text-right">
                  <h2 className="text-xs sm:text-sm lg:text-lg xl:text-xl font-bold text-white truncate drop-shadow-lg">
                    {teamBData.name}
                  </h2>
                  <div
                    className="w-6 sm:w-8 lg:w-12 h-1 mt-0.5 ml-auto"
                    style={{
                      background: teamBData.color,
                      clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0% 100%)'
                    }}
                  ></div>
                </div>

                {/* Team B Logo Container */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 p-1 sm:p-1.5 lg:p-2"
                    style={{
                      background: `linear-gradient(225deg, ${teamBData.color}20, rgba(255,255,255,0.3))`,
                      clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)'
                    }}
                  >
                    <DisplayLogo
                      logos={[teamBData.logo]}
                      alt={teamBData.name}
                      className="w-full h-full"
                      type_play="circle"
                      logoSize="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section - Takes remaining space */}
        <div className="flex-1 px-1 sm:px-3 lg:px-4 pb-3 sm:pb-4 overflow-hidden">
          <div className="bg-gradient-to-br from-white/98 via-white/95 to-white/92 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl h-full border border-white/40 ring-1 ring-blue-500/10 overflow-hidden">
            {(teamAEvents.length > 0 || teamBEvents.length > 0) ? (
              <div className="h-full flex flex-col">
                {/* Header with team names - Always horizontal */}
                <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-gray-100/30">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: teamAData.color }}
                    ></div>
                    <span className="text-xs sm:text-sm lg:text-base font-bold text-gray-800 truncate">
                      {teamAData.name}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">
                      {teamAEvents.length}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-bold text-gray-400 px-2">VS</div>

                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">
                      {teamBEvents.length}
                    </span>
                    <span className="text-xs sm:text-sm lg:text-base font-bold text-gray-800 truncate">
                      {teamBData.name}
                    </span>
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: teamBData.color }}
                    ></div>
                  </div>
                </div>

                {/* Events content - Always side by side */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Team A Events */}
                  <div className="flex-1 flex flex-col border-r border-gray-200/50">
                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: teamAData.color + '40' }}
                    ></div>
                    <div className="flex-1 overflow-y-auto p-2 sm:p-3">
                      <div className="space-y-1 sm:space-y-2">
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
                  </div>

                  {/* Team B Events */}
                  <div className="flex-1 flex flex-col">
                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: teamBData.color + '40' }}
                    ></div>
                    <div className="flex-1 overflow-y-auto p-2 sm:p-3">
                      <div className="space-y-1 sm:space-y-2">
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

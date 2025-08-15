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
        {/* Ultra Modern Scoreboard Header */}
        <div className="relative flex-shrink-0 px-1 sm:px-3 lg:px-4 pt-3 sm:pt-4">
          <div className="relative">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Futuristic container with complex geometry */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-slate-800 to-black shadow-2xl">
              {/* Hexagonal pattern overlay */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>

              {/* Dynamic light beams */}
              <div className="absolute inset-0">
                <div
                  className="absolute left-0 top-0 bottom-0 w-1/3 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, ${teamAData.color}30 0%, transparent 70%)`
                  }}
                ></div>
                <div
                  className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20"
                  style={{
                    background: `linear-gradient(225deg, ${teamBData.color}30 0%, transparent 70%)`
                  }}
                ></div>
              </div>

              {/* Glass morphism layer */}
              <div className="absolute inset-1 bg-gradient-to-br from-white/5 via-white/2 to-transparent rounded-2xl backdrop-blur-sm"></div>

              {/* Content container */}
              <div className="relative z-10">
                {/* Main scoreboard layout - ALWAYS horizontal */}
                <div className="flex items-center justify-between px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">

                  {/* Team A Section */}
                  <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-1 min-w-0">
                    {/* Team A Logo */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="absolute -inset-1 rounded-2xl blur opacity-60"
                        style={{ background: `linear-gradient(135deg, ${teamAData.color}60, transparent)` }}
                      ></div>
                      <div
                        className="relative p-1.5 sm:p-2 lg:p-3 rounded-xl border backdrop-blur-sm"
                        style={{
                          background: `linear-gradient(135deg, ${teamAData.color}15, rgba(255,255,255,0.1))`,
                          borderColor: `${teamAData.color}40`
                        }}
                      >
                        <DisplayLogo
                          logos={[teamAData.logo]}
                          alt={teamAData.name}
                          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                          type_play="circle"
                          logoSize="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                        />
                      </div>
                    </div>

                    {/* Team A Name - Always visible, responsive text */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xs sm:text-sm lg:text-xl xl:text-2xl font-bold text-white truncate">
                        {teamAData.name}
                      </h2>
                      <div
                        className="w-6 sm:w-8 lg:w-16 h-0.5 sm:h-1 rounded-full mt-0.5 sm:mt-1"
                        style={{ background: teamAData.color }}
                      ></div>
                    </div>
                  </div>

                  {/* Central Score Display */}
                  <div className="flex items-center justify-center px-1 sm:px-2 lg:px-4 flex-shrink-0">
                    <div className="relative">
                      {/* Score glow effect */}
                      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 via-blue-500/30 to-purple-500/20 rounded-2xl blur-lg"></div>

                      {/* Score panel */}
                      <div className="relative bg-gradient-to-br from-white/95 to-white/85 text-gray-900 px-2 sm:px-3 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-xl shadow-2xl border border-white/50 backdrop-blur-sm">
                        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                          <div
                            className="text-base sm:text-xl lg:text-3xl xl:text-4xl font-black tabular-nums"
                            style={{ color: teamAData.color }}
                          >
                            {teamAData.score}
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="w-px h-3 sm:h-4 lg:h-6 bg-gray-400"></div>
                            <div className="text-xs font-bold text-gray-500 mx-1">-</div>
                            <div className="w-px h-3 sm:h-4 lg:h-6 bg-gray-400"></div>
                          </div>

                          <div
                            className="text-base sm:text-xl lg:text-3xl xl:text-4xl font-black tabular-nums"
                            style={{ color: teamBData.color }}
                          >
                            {teamBData.score}
                          </div>
                        </div>
                      </div>

                      {/* Corner highlights */}
                      <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-l border-t border-cyan-400/60 rounded-tl"></div>
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 border-r border-t border-purple-400/60 rounded-tr"></div>
                      <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 border-l border-b border-cyan-400/60 rounded-bl"></div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-r border-b border-purple-400/60 rounded-br"></div>
                    </div>
                  </div>

                  {/* Team B Section */}
                  <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-1 min-w-0 justify-end">
                    {/* Team B Name - Always visible, responsive text */}
                    <div className="flex-1 min-w-0 text-right">
                      <h2 className="text-xs sm:text-sm lg:text-xl xl:text-2xl font-bold text-white truncate">
                        {teamBData.name}
                      </h2>
                      <div
                        className="w-6 sm:w-8 lg:w-16 h-0.5 sm:h-1 rounded-full mt-0.5 sm:mt-1 ml-auto"
                        style={{ background: teamBData.color }}
                      ></div>
                    </div>

                    {/* Team B Logo */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="absolute -inset-1 rounded-2xl blur opacity-60"
                        style={{ background: `linear-gradient(225deg, ${teamBData.color}60, transparent)` }}
                      ></div>
                      <div
                        className="relative p-1.5 sm:p-2 lg:p-3 rounded-xl border backdrop-blur-sm"
                        style={{
                          background: `linear-gradient(225deg, ${teamBData.color}15, rgba(255,255,255,0.1))`,
                          borderColor: `${teamBData.color}40`
                        }}
                      >
                        <DisplayLogo
                          logos={[teamBData.logo]}
                          alt={teamBData.name}
                          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                          type_play="circle"
                          logoSize="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Futuristic bottom accent */}
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 via-blue-500/80 via-purple-500/50 to-transparent"></div>
                <div className="h-2 bg-gradient-to-r from-cyan-500/10 via-blue-500/20 to-purple-500/10"></div>
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

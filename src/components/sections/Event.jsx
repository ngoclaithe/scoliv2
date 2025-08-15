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
      <div className={`flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-white/80 shadow-sm border border-gray-100 ${isTeamA ? '' : 'flex-row-reverse'}`}>
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
        {/* Complex Interlocking Geometric Scoreboard */}
        <div className="relative flex-shrink-0 px-1 sm:px-3 lg:px-4 pt-3 sm:pt-4 flex justify-center">
          <div className="relative h-20 sm:h-24 lg:h-28 w-full sm:w-full lg:w-[30%]">

            {/* Extra Layer 0 - Outer container with additional geometry */}
            <div
              className="absolute -inset-4 opacity-30"
              style={{
                background: `linear-gradient(45deg, ${teamAData.color}10, transparent, ${teamBData.color}10)`,
                clipPath: 'polygon(5% 15%, 15% 5%, 35% 8%, 50% 0%, 65% 8%, 85% 5%, 95% 15%, 100% 35%, 95% 50%, 100% 65%, 95% 85%, 85% 95%, 65% 92%, 50% 100%, 35% 92%, 15% 95%, 5% 85%, 0% 65%, 5% 50%, 0% 35%)'
              }}
            ></div>

            {/* Extra Layer 00 - Mid container */}
            <div
              className="absolute -inset-2 opacity-50 bg-slate-900"
              style={{
                clipPath: 'polygon(10% 20%, 20% 10%, 30% 15%, 45% 5%, 55% 5%, 70% 15%, 80% 10%, 90% 20%, 95% 40%, 90% 55%, 95% 70%, 90% 90%, 80% 95%, 70% 85%, 55% 95%, 45% 95%, 30% 85%, 20% 95%, 10% 90%, 5% 70%, 10% 55%, 5% 40%)'
              }}
            ></div>

            {/* Layer 1 - Base complex polygon */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800"
              style={{
                clipPath: 'polygon(0 25%, 8% 0%, 25% 10%, 40% 0%, 60% 0%, 75% 10%, 92% 0%, 100% 25%, 100% 75%, 92% 100%, 75% 90%, 60% 100%, 40% 100%, 25% 90%, 8% 100%, 0% 75%)'
              }}
            ></div>

            {/* Layer 2 - Team A geometric blocks */}
            <div
              className="absolute left-0 top-1/4 w-1/3 h-1/2 opacity-90"
              style={{
                background: `linear-gradient(135deg, ${teamAData.color}80, ${teamAData.color}50)`,
                clipPath: 'polygon(0 0, 80% 20%, 90% 80%, 20% 100%, 0 60%)'
              }}
            ></div>
            <div
              className="absolute left-4 top-0 w-16 h-8 opacity-70"
              style={{
                background: `linear-gradient(45deg, ${teamAData.color}60, ${teamAData.color}30)`,
                clipPath: 'polygon(0 40%, 20% 0%, 80% 0%, 100% 40%, 80% 100%, 20% 100%)'
              }}
            ></div>

            {/* Layer 3 - Team B geometric blocks */}
            <div
              className="absolute right-0 top-1/4 w-1/3 h-1/2 opacity-90"
              style={{
                background: `linear-gradient(225deg, ${teamBData.color}80, ${teamBData.color}50)`,
                clipPath: 'polygon(100% 0, 100% 60%, 80% 100%, 10% 80%, 20% 20%)'
              }}
            ></div>
            <div
              className="absolute right-4 bottom-0 w-16 h-8 opacity-70"
              style={{
                background: `linear-gradient(315deg, ${teamBData.color}60, ${teamBData.color}30)`,
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 60%, 80% 100%, 20% 100%, 0% 60%)'
              }}
            ></div>

            {/* Layer 4 - Center multi-part score area */}
            {/* Score left segment */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-40 lg:w-48 h-12 sm:h-14 lg:h-16">
              <div
                className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-br from-white to-gray-200 shadow-lg"
                style={{
                  clipPath: 'polygon(0 20%, 80% 0%, 100% 80%, 20% 100%)'
                }}
              ></div>

              {/* Score center segment */}
              <div
                className="absolute left-1/4 top-0 w-1/2 h-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg"
                style={{
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 30%, 100% 70%, 80% 100%, 20% 100%, 0% 70%, 0% 30%)'
                }}
              ></div>

              {/* Score right segment */}
              <div
                className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-br from-white to-gray-200 shadow-lg"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 20%, 80% 100%, 20% 80%)'
                }}
              ></div>
            </div>

            {/* Layer 5 - Interlocking accent shapes */}
            <div
              className="absolute left-6 sm:left-8 top-2 w-6 h-6 opacity-80"
              style={{
                background: `linear-gradient(45deg, ${teamAData.color}, ${teamAData.color}80)`,
                clipPath: 'polygon(30% 0%, 100% 0%, 70% 100%, 0% 100%)'
              }}
            ></div>
            <div
              className="absolute left-12 sm:left-16 top-6 w-4 h-8 opacity-60"
              style={{
                background: `linear-gradient(135deg, ${teamAData.color}70, ${teamAData.color}40)`,
                clipPath: 'polygon(0% 0%, 100% 25%, 100% 100%, 0% 75%)'
              }}
            ></div>

            <div
              className="absolute right-6 sm:right-8 bottom-2 w-6 h-6 opacity-80"
              style={{
                background: `linear-gradient(225deg, ${teamBData.color}, ${teamBData.color}80)`,
                clipPath: 'polygon(0% 0%, 70% 0%, 100% 100%, 30% 100%)'
              }}
            ></div>
            <div
              className="absolute right-12 sm:right-16 bottom-6 w-4 h-8 opacity-60"
              style={{
                background: `linear-gradient(315deg, ${teamBData.color}70, ${teamBData.color}40)`,
                clipPath: 'polygon(0% 25%, 100% 0%, 100% 75%, 0% 100%)'
              }}
            ></div>

            {/* Layer 6 - Corner interlocking pieces */}
            <div className="absolute top-0 left-0 w-10 h-6 bg-slate-600 opacity-80" style={{ clipPath: 'polygon(0 0, 80% 0, 100% 100%, 20% 100%)' }}></div>
            <div className="absolute top-0 right-0 w-10 h-6 bg-slate-600 opacity-80" style={{ clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0% 100%)' }}></div>
            <div className="absolute bottom-0 left-0 w-6 h-10 bg-slate-600 opacity-80" style={{ clipPath: 'polygon(0 0, 100% 20%, 100% 80%, 0 100%)' }}></div>
            <div className="absolute bottom-0 right-0 w-6 h-10 bg-slate-600 opacity-80" style={{ clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0% 80%)' }}></div>

            {/* Layer 7 - Zigzag dividers */}
            <div
              className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-slate-500 opacity-60"
              style={{
                clipPath: 'polygon(0 0, 100% 10%, 100% 20%, 0 10%, 0 30%, 100% 40%, 100% 50%, 0 40%, 0 60%, 100% 70%, 100% 80%, 0 70%, 0 90%, 100% 100%, 100% 90%, 0 100%)'
              }}
            ></div>
            <div
              className="absolute right-1/4 top-0 bottom-0 w-0.5 bg-slate-500 opacity-60"
              style={{
                clipPath: 'polygon(0 10%, 100% 0, 100% 10%, 0 20%, 0 40%, 100% 30%, 100% 40%, 0 50%, 0 70%, 100% 60%, 100% 70%, 0 80%, 0 100%, 100% 90%, 100% 100%, 0 90%)'
              }}
            ></div>

            {/* Content overlay with geometric containers */}
            <div className="relative z-10 h-full flex items-center justify-between px-2 sm:px-4 lg:px-6">

              {/* Team A Section - Multi-part container */}
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-1 min-w-0">
                {/* Team A Logo - Octagon */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 p-1.5 sm:p-2"
                    style={{
                      background: `linear-gradient(135deg, ${teamAData.color}25, rgba(255,255,255,0.4))`,
                      clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
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

                {/* Team A Name container - Chevron */}
                <div className="flex-1 min-w-0 relative">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `linear-gradient(90deg, ${teamAData.color}40, transparent)`,
                      clipPath: 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)'
                    }}
                  ></div>
                  <div className="relative z-10 py-1 px-2">
                    <h2 className="text-xs sm:text-sm lg:text-lg xl:text-xl font-bold text-white truncate drop-shadow-lg">
                      {teamAData.name}
                    </h2>
                    <div
                      className="w-8 sm:w-10 lg:w-16 h-1 mt-0.5"
                      style={{
                        background: `linear-gradient(90deg, ${teamAData.color}, ${teamAData.color}60)`,
                        clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Central Score Display - Complex multi-segment */}
              <div className="flex items-center justify-center flex-shrink-0">
                <div className="relative">
                  <div className="flex items-center">
                    {/* Team A Score segment */}
                    <div
                      className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 lg:py-4 bg-white text-gray-900 shadow-xl"
                      style={{
                        clipPath: 'polygon(0 15%, 85% 0%, 100% 50%, 85% 100%, 0 85%)'
                      }}
                    >
                      <div
                        className="text-lg sm:text-2xl lg:text-4xl font-black tabular-nums"
                        style={{ color: teamAData.color }}
                      >
                        {teamAData.score}
                      </div>
                    </div>

                    {/* Center divider - Diamond */}
                    <div
                      className="px-1 sm:px-2 py-2 sm:py-3 lg:py-4 bg-gradient-to-br from-gray-200 to-gray-300 shadow-lg"
                      style={{
                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)'
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-2 sm:h-3 lg:h-4 bg-gray-600"></div>
                        <div className="text-xs font-bold text-gray-600">VS</div>
                        <div className="w-0.5 h-2 sm:h-3 lg:h-4 bg-gray-600"></div>
                      </div>
                    </div>

                    {/* Team B Score segment */}
                    <div
                      className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 lg:py-4 bg-white text-gray-900 shadow-xl"
                      style={{
                        clipPath: 'polygon(15% 0%, 100% 15%, 100% 85%, 15% 100%, 0% 50%)'
                      }}
                    >
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

              {/* Team B Section - Multi-part container */}
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-1 min-w-0 justify-end">
                {/* Team B Name container - Reverse chevron */}
                <div className="flex-1 min-w-0 text-right relative">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `linear-gradient(270deg, ${teamBData.color}40, transparent)`,
                      clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0% 50%)'
                    }}
                  ></div>
                  <div className="relative z-10 py-1 px-2">
                    <h2 className="text-xs sm:text-sm lg:text-lg xl:text-xl font-bold text-white truncate drop-shadow-lg">
                      {teamBData.name}
                    </h2>
                    <div
                      className="w-8 sm:w-10 lg:w-16 h-1 mt-0.5 ml-auto"
                      style={{
                        background: `linear-gradient(270deg, ${teamBData.color}, ${teamBData.color}60)`,
                        clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 15% 100%, 0% 50%)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Team B Logo - Octagon */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 p-1.5 sm:p-2"
                    style={{
                      background: `linear-gradient(225deg, ${teamBData.color}25, rgba(255,255,255,0.4))`,
                      clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
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
        <div className="flex-1 px-1 sm:px-3 lg:px-4 pb-3 sm:pb-4 flex justify-center">
          <div className="bg-gradient-to-br from-white/98 via-white/95 to-white/92 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl h-full border border-white/40 ring-1 ring-blue-500/10 overflow-hidden w-full sm:w-full lg:w-[90%]">
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
                      {Math.min(teamAEvents.length, 20)}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-bold text-gray-400 px-2">VS</div>

                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">
                      {Math.min(teamBEvents.length, 20)}
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

                {/* Events content - Always side by side, NO SCROLL */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Team A Events - Limited to 20 events max */}
                  <div className="flex-1 flex flex-col border-r border-gray-200/50">
                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: teamAData.color + '40' }}
                    ></div>
                    <div className="flex-1 p-2 sm:p-3">
                      <div className="space-y-1 sm:space-y-2">
                        {teamAEvents.slice(0, 20).map((event, index) => (
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

                  {/* Team B Events - Limited to 20 events max */}
                  <div className="flex-1 flex flex-col">
                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: teamBData.color + '40' }}
                    ></div>
                    <div className="flex-1 p-2 sm:p-3">
                      <div className="space-y-1 sm:space-y-2">
                        {teamBEvents.slice(0, 20).map((event, index) => (
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
                <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">⚽</div>
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

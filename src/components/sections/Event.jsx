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
      <div className={`flex items-center gap-2 p-2 mb-2 ${isTeamA ? 'text-left' : 'text-right flex-row-reverse'}`}>
        <div className="text-xl">{event.icon}</div>
        <div className={`flex-1 ${isTeamA ? 'text-left' : 'text-right'}`}>
          <div className="font-bold text-sm text-gray-900 truncate">{event.player}</div>
          {event.type !== 'goal' && (
            <div className="text-xs text-gray-600">
              {event.type === 'yellow_card' ? 'Thẻ vàng' : 'Thẻ đỏ'}
            </div>
          )}
        </div>
        <div
          className="px-2 py-1 rounded-full text-white font-bold text-xs min-w-[40px] text-center"
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
        {/* Curved Ribbon Header */}
        <div className="relative flex-shrink-0">
          {/* Main curved ribbon */}
          <div className="relative">
            {/* Background ribbon shape */}
            <svg className="w-full h-32" viewBox="0 0 1200 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: teamAData.color, stopOpacity: 0.9}} />
                  <stop offset="50%" style={{stopColor: '#ffffff', stopOpacity: 0.95}} />
                  <stop offset="100%" style={{stopColor: teamBData.color, stopOpacity: 0.9}} />
                </linearGradient>
                <filter id="ribbonShadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
                </filter>
              </defs>
              <path 
                d="M0,60 Q150,20 300,50 T600,40 T900,50 Q1050,20 1200,60 L1200,140 Q1050,180 900,150 T600,160 T300,150 Q150,180 0,140 Z" 
                fill="url(#ribbonGradient)" 
                filter="url(#ribbonShadow)"
                className="drop-shadow-2xl"
              />
            </svg>

            {/* Content over the ribbon */}
            <div className="absolute inset-0 flex items-center justify-between px-16 py-8">
              {/* Team A */}
              <div className="flex items-center gap-4 flex-1">
                <DisplayLogo
                  logos={[teamAData.logo]}
                  alt={teamAData.name}
                  className="w-14 h-14"
                  type_play="circle"
                  logoSize="w-14 h-14"
                />
                <div className="text-right">
                  <h2 className="text-xl font-bold text-gray-900 drop-shadow-sm">{teamAData.name}</h2>
                </div>
              </div>

              {/* Score in center */}
              <div className="flex items-center justify-center px-8">
                <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white px-8 py-4 rounded-full shadow-2xl border-4 border-white/30 backdrop-blur-sm">
                  <span className="text-3xl font-black drop-shadow-lg">{teamAData.score}</span>
                  <span className="text-xl mx-3 text-white/90">-</span>
                  <span className="text-3xl font-black drop-shadow-lg">{teamBData.score}</span>
                </div>
              </div>

              {/* Team B */}
              <div className="flex items-center gap-4 flex-1 justify-end">
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900 drop-shadow-sm">{teamBData.name}</h2>
                </div>
                <DisplayLogo
                  logos={[teamBData.logo]}
                  alt={teamBData.name}
                  className="w-14 h-14"
                  type_play="circle"
                  logoSize="w-14 h-14"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Events Section - Takes remaining space */}
        <div className="flex-1 px-6 pb-6 overflow-hidden">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl h-full border-2 border-white/30 ring-1 ring-green-500/20 p-6">
            {(teamAEvents.length > 0 || teamBEvents.length > 0) ? (
              <div className="grid grid-cols-2 gap-8 h-full">
                {/* Team A Events */}
                <div className="flex flex-col h-full">
                  <div
                    className="h-1 rounded-full mb-4"
                    style={{ backgroundColor: teamAData.color }}
                  ></div>
                  <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
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
                  <div
                    className="h-1 rounded-full mb-4"
                    style={{ backgroundColor: teamBData.color }}
                  ></div>
                  <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
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
                <div className="text-6xl mb-4 animate-bounce">⚽</div>
                <div className="text-xl font-bold text-gray-700 mb-2">Chưa có sự kiện nào</div>
                <div className="text-gray-500">Các sự kiện trận đấu sẽ hiển thị tại đây</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
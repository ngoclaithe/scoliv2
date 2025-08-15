import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import DisplayLogo from '../common/DisplayLogo';

const Event = () => {
  const { matchData, matchStats } = usePublicMatch();

  const [teamAGoals, setTeamAGoals] = useState([]);
  const [teamBGoals, setTeamBGoals] = useState([]);

  // Tạo danh sách bàn thắng từ matchData
  useEffect(() => {
    const teamAGoalsList = [];
    const teamBGoalsList = [];

    // Sự kiện ghi bàn đội A
    if (matchData.teamA?.teamAScorers) {
      matchData.teamA.teamAScorers.forEach(scorer => {
        scorer.times.forEach(time => {
          teamAGoalsList.push({
            player: scorer.player,
            minute: time
          });
        });
      });
    }

    // Sự kiện ghi bàn đội B
    if (matchData.teamB?.teamBScorers) {
      matchData.teamB.teamBScorers.forEach(scorer => {
        scorer.times.forEach(time => {
          teamBGoalsList.push({
            player: scorer.player,
            minute: time
          });
        });
      });
    }

    // Sắp xếp theo phút
    teamAGoalsList.sort((a, b) => a.minute - b.minute);
    teamBGoalsList.sort((a, b) => a.minute - b.minute);

    setTeamAGoals(teamAGoalsList);
    setTeamBGoals(teamBGoalsList);
  }, [matchData]);

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

  const GoalItem = ({ player, minute, isTeamA, teamColor }) => (
    <div className={`flex items-center gap-3 p-3 mb-2 ${isTeamA ? 'text-left' : 'text-right flex-row-reverse'}`}>
      <div className="text-2xl">⚽</div>
      <div className={`flex-1 ${isTeamA ? 'text-left' : 'text-right'}`}>
        <div className="font-bold text-lg text-gray-900">{player}</div>
      </div>
      <div
        className="px-3 py-1 rounded-full text-white font-bold text-sm min-w-[50px] text-center"
        style={{ backgroundColor: teamColor }}
      >
        {minute}'
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/basic/sanconhantao.jpg)',
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Gradient overlay for more depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-transparent to-blue-900/30"></div>

      {/* Animated background elements for extra visual appeal */}
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

      <div className="relative z-20 min-h-screen flex items-center justify-center py-12">
        <div className="max-w-7xl mx-auto px-6 w-full">
          {/* Main Event Board */}
          <div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border-2 border-white/30 ring-1 ring-green-500/20">

            {/* Header with team names and score */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-8 mb-8">
                <div className="flex items-center gap-4">
                  <DisplayLogo
                    logos={[teamAData.logo]}
                    alt={teamAData.name}
                    className="w-16 h-16"
                    type_play="circle"
                    logoSize="w-16 h-16"
                  />
                  <h2 className="text-3xl font-bold text-gray-900">{teamAData.name}</h2>
                </div>

                <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white px-8 py-4 rounded-2xl shadow-xl border-2 border-green-500/30">
                  <span className="text-4xl font-black drop-shadow-lg">{teamAData.score}</span>
                  <span className="text-2xl mx-4 text-white/90">-</span>
                  <span className="text-4xl font-black drop-shadow-lg">{teamBData.score}</span>
                </div>

                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold text-gray-900">{teamBData.name}</h2>
                  <DisplayLogo
                    logos={[teamBData.logo]}
                    alt={teamBData.name}
                    className="w-16 h-16"
                    type_play="circle"
                    logoSize="w-16 h-16"
                  />
                </div>
              </div>
            </div>

            {/* Goals Section */}
            {(teamAGoals.length > 0 || teamBGoals.length > 0) ? (
              <div className="grid grid-cols-2 gap-12">
                {/* Team A Goals */}
                <div className="space-y-3">
                  <div
                    className="h-1 rounded-full mb-6"
                    style={{ backgroundColor: teamAData.color }}
                  ></div>
                  {teamAGoals.map((goal, index) => (
                    <GoalItem
                      key={`teamA-${index}`}
                      player={goal.player}
                      minute={goal.minute}
                      isTeamA={true}
                      teamColor={teamAData.color}
                    />
                  ))}
                </div>

                {/* Team B Goals */}
                <div className="space-y-3">
                  <div
                    className="h-1 rounded-full mb-6"
                    style={{ backgroundColor: teamBData.color }}
                  ></div>
                  {teamBGoals.map((goal, index) => (
                    <GoalItem
                      key={`teamB-${index}`}
                      player={goal.player}
                      minute={goal.minute}
                      isTeamA={false}
                      teamColor={teamBData.color}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-8xl mb-6 animate-bounce">⚽</div>
                <div className="text-2xl font-bold text-gray-700 mb-3">Chưa có bàn thắng nào</div>
                <div className="text-gray-500 text-lg">Các bàn thắng sẽ hiển thị tại đây</div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Event;

import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { useMatch } from "../../contexts/MatchContext";
import socketService from "../../services/socketService";

const SimplePenaltyModal = ({ isOpen, onClose }) => {
  const { penaltyData } = useMatch();
  
  // State for penalty table: 10 columns for rounds, 4 rows for teams
  const [penaltyTable, setPenaltyTable] = useState({
    teamA_goals: Array(10).fill(false),    // Team A goals
    teamA_misses: Array(10).fill(false),   // Team A misses  
    teamB_goals: Array(10).fill(false),    // Team B goals
    teamB_misses: Array(10).fill(false)    // Team B misses
  });

  // Load penalty data when modal opens
  useEffect(() => {
    if (isOpen && penaltyData) {
      const newTable = {
        teamA_goals: Array(10).fill(false),
        teamA_misses: Array(10).fill(false),
        teamB_goals: Array(10).fill(false),
        teamB_misses: Array(10).fill(false)
      };

      // Process shootHistory to populate table
      if (penaltyData.shootHistory && Array.isArray(penaltyData.shootHistory)) {
        penaltyData.shootHistory.forEach((shoot, index) => {
          if (index < 10) { // Only process first 10 rounds
            if (shoot.team === 'teamA' || shoot.team === 'home') {
              if (shoot.result === 'goal') {
                newTable.teamA_goals[index] = true;
              } else {
                newTable.teamA_misses[index] = true;
              }
            } else if (shoot.team === 'teamB' || shoot.team === 'away') {
              if (shoot.result === 'goal') {
                newTable.teamB_goals[index] = true;
              } else {
                newTable.teamB_misses[index] = true;
              }
            }
          }
        });
      }

      setPenaltyTable(newTable);
    }
  }, [isOpen, penaltyData]);

  // Handle checkbox click and emit socket update
  const handleCheckboxChange = (team, type, roundIndex) => {
    const newTable = { ...penaltyTable };

    // Toggle the clicked checkbox
    newTable[`${team}_${type}`][roundIndex] = !newTable[`${team}_${type}`][roundIndex];

    // If checking a goal, uncheck the corresponding miss and vice versa
    if (newTable[`${team}_${type}`][roundIndex]) {
      const oppositeType = type === 'goals' ? 'misses' : 'goals';
      newTable[`${team}_${oppositeType}`][roundIndex] = false;
    }

    setPenaltyTable(newTable);

    // Convert table back to shootHistory format for socket
    const shootHistory = [];
    for (let i = 0; i < 10; i++) {
      // Check team A
      if (newTable.teamA_goals[i]) {
        shootHistory.push({
          id: `teamA_${i}`,
          team: 'teamA',
          result: 'goal',
          round: i + 1,
          timestamp: new Date().toISOString()
        });
      } else if (newTable.teamA_misses[i]) {
        shootHistory.push({
          id: `teamA_${i}`,
          team: 'teamA',
          result: 'miss',
          round: i + 1,
          timestamp: new Date().toISOString()
        });
      }

      // Check team B
      if (newTable.teamB_goals[i]) {
        shootHistory.push({
          id: `teamB_${i}`,
          team: 'teamB',
          result: 'goal',
          round: i + 1,
          timestamp: new Date().toISOString()
        });
      } else if (newTable.teamB_misses[i]) {
        shootHistory.push({
          id: `teamB_${i}`,
          team: 'teamB',
          result: 'miss',
          round: i + 1,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Calculate scores
    const teamAGoals = newTable.teamA_goals.filter(Boolean).length;
    const teamBGoals = newTable.teamB_goals.filter(Boolean).length;

    // Emit penalty update
    const penaltyUpdate = {
      teamAGoals,
      teamBGoals,
      shootHistory,
      status: 'ongoing',
      lastUpdated: new Date().toISOString()
    };

    socketService.emit('penalty_update', {
      penaltyData: penaltyUpdate
    });

    // Emit view update to switch to penalty scoreboard
    socketService.emit('view_update', {
      currentView: 'penalty_scoreboard'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🥅 Penalty Shootout"
      size="lg"
    >
      <div className="overflow-x-auto max-w-full">
        <table className="w-full max-w-4xl mx-auto border-collapse border border-gray-300 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-1 py-1 text-xs font-bold w-12">ĐỘI</th>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <th key={num} className="border border-gray-300 px-1 py-1 text-xs font-bold w-8">
                  {num}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Team A - Goals */}
            <tr className="bg-blue-50">
              <td className="border border-gray-300 px-1 py-1 text-xs font-bold text-blue-700">
                A
              </td>
              {penaltyTable.teamA_goals.map((checked, index) => (
                <td key={index} className="border border-gray-300 px-1 py-1 text-center w-8 h-12">
                  <div className="flex flex-col items-center justify-center h-full">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxChange('teamA', 'goals', index)}
                      className="w-3 h-3 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-1"
                      title="Đá trúng"
                    />
                    <div className="text-xs text-green-600 mt-0.5 leading-none">✓</div>
                  </div>
                </td>
              ))}
            </tr>

            {/* Team A - Misses */}
            <tr className="bg-blue-25">
              <td className="border border-gray-300 px-1 py-1 text-xs font-bold text-blue-700">
                A
              </td>
              {penaltyTable.teamA_misses.map((checked, index) => (
                <td key={index} className="border border-gray-300 px-1 py-1 text-center w-8 h-12">
                  <div className="flex flex-col items-center justify-center h-full">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxChange('teamA', 'misses', index)}
                      className="w-3 h-3 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-1"
                      title="Đá trượt"
                    />
                    <div className="text-xs text-red-600 mt-0.5 leading-none">✗</div>
                  </div>
                </td>
              ))}
            </tr>

            {/* Team B - Goals */}
            <tr className="bg-red-50">
              <td className="border border-gray-300 px-1 py-1 text-xs font-bold text-red-700">
                B
              </td>
              {penaltyTable.teamB_goals.map((checked, index) => (
                <td key={index} className="border border-gray-300 px-1 py-1 text-center w-8 h-12">
                  <div className="flex flex-col items-center justify-center h-full">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxChange('teamB', 'goals', index)}
                      className="w-3 h-3 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-1"
                      title="Đá trúng"
                    />
                    <div className="text-xs text-green-600 mt-0.5 leading-none">✓</div>
                  </div>
                </td>
              ))}
            </tr>

            {/* Team B - Misses */}
            <tr className="bg-red-25">
              <td className="border border-gray-300 px-1 py-1 text-xs font-bold text-red-700">
                B
              </td>
              {penaltyTable.teamB_misses.map((checked, index) => (
                <td key={index} className="border border-gray-300 px-1 py-1 text-center w-8 h-12">
                  <div className="flex flex-col items-center justify-center h-full">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxChange('teamB', 'misses', index)}
                      className="w-3 h-3 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-1"
                      title="Đá trượt"
                    />
                    <div className="text-xs text-red-600 mt-0.5 leading-none">✗</div>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        
        {/* Score Summary */}
        <div className="mt-3 p-2 bg-gray-100 rounded">
          <div className="flex justify-center items-center space-x-4">
            <div className="text-center">
              <div className="text-xs font-bold text-blue-700">Đội A</div>
              <div className="text-xl font-bold text-blue-800">
                {penaltyTable.teamA_goals.filter(Boolean).length}
              </div>
            </div>
            <div className="text-lg font-bold text-gray-400">-</div>
            <div className="text-center">
              <div className="text-xs font-bold text-red-700">Đội B</div>
              <div className="text-xl font-bold text-red-800">
                {penaltyTable.teamB_goals.filter(Boolean).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SimplePenaltyModal;

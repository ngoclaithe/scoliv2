import React from 'react';
import ScoreboardBelow from './ScoreboardBelow';

const ScoreboardBelowDemo = () => {
  // Handlers for testing callbacks
  const handleTeamUpdate = (team, newName) => {
    console.log(`Team updated: ${team} = ${newName}`);
  };

  const handleScoreUpdate = (team, newScore) => {
    console.log(`Score updated: ${team} = ${newScore}`);
  };

  const handleLogoUpdate = (team, logoUrl) => {
    console.log(`Logo updated: ${team} = ${logoUrl}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-blue-900 to-purple-900">
      {/* Background cho demo */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Demo info */}
      <div className="fixed top-4 left-4 bg-white/90 p-4 rounded-lg shadow-lg text-black max-w-sm z-50">
        <h2 className="font-bold text-lg mb-2">🎮 ScoreboardBelow Demo</h2>
        <div className="text-sm space-y-1">
          <p>• Click <strong>"⚙️ Edit"</strong> để mở control panel</p>
          <p>• Click <strong>tên đội</strong> để edit nhanh</p>
          <p>• Click <strong>vùng logo</strong> để upload</p>
          <p>• Enable <strong>Penalty Mode</strong> để test hiệu ứng</p>
          <p>• Check console để xem callbacks</p>
        </div>
        
        <div className="mt-3 p-2 bg-blue-50 rounded border">
          <div className="text-xs font-medium text-blue-800">Test Features:</div>
          <div className="text-xs text-blue-600 mt-1">
            ✅ Responsive scaling<br/>
            ✅ Logo upload<br/>
            ✅ Penalty animations<br/>
            ✅ Team editing<br/>
            ✅ Score controls<br/>
            ✅ Marquee text<br/>
            ✅ Live stream info
          </div>
        </div>
      </div>

      {/* Component under test */}
      <ScoreboardBelow
        accessCode="DEMO123"
        onTeamUpdate={handleTeamUpdate}
        onScoreUpdate={handleScoreUpdate}
        onLogoUpdate={handleLogoUpdate}
      />

      {/* Demo instructions overlay */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center pointer-events-none z-10">
        <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl">
          <h1 className="text-4xl font-bold mb-4">⚽ LIVE MATCH ⚽</h1>
          <p className="text-xl mb-2">Scoreboard Below Demo</p>
          <p className="text-lg opacity-80">Click Edit button to start customizing!</p>
        </div>
      </div>

      {/* Sample sponsors for visual context */}
      <div className="fixed bottom-8 left-8 z-30 space-y-2">
        <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
          SPONSOR A
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
          SPONSOR B
        </div>
      </div>

      {/* Sample partner logo */}
      <div className="fixed bottom-8 right-8 z-30">
        <div className="bg-gray-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
          MEDIA PARTNER
        </div>
      </div>
    </div>
  );
};

export default ScoreboardBelowDemo;

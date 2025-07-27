import React, { useState } from 'react';
import ScoreboardBelow from './ScoreboardBelow';
import ScoreboardAbove from './ScoreboardAbove';
import TemplateSelector from './TemplateSelector';

const ScoreboardManager = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [showAbove, setShowAbove] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Handlers for scoreboard callbacks
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
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-blue-900 to-purple-900 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Template Selector */}
      {showTemplateSelector && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto">
          <div className="relative">
            <TemplateSelector 
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />
            <button
              onClick={() => setShowTemplateSelector(false)}
              className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors font-bold text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="fixed top-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg text-black max-w-sm z-40 pointer-events-auto">
        <h2 className="font-bold text-lg mb-3">🎮 Scoreboard Manager</h2>
        
        {/* Template Controls */}
        <div className="space-y-3">
          <button
            onClick={() => setShowTemplateSelector(!showTemplateSelector)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            🎨 Chọn Template ({selectedTemplate})
          </button>

          {/* Position Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowAbove(false)}
              className={`flex-1 px-3 py-2 rounded-lg transition-colors font-medium ${
                !showAbove 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📍 Dưới
            </button>
            <button
              onClick={() => setShowAbove(true)}
              className={`flex-1 px-3 py-2 rounded-lg transition-colors font-medium ${
                showAbove 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📍 Trên
            </button>
          </div>
        </div>

        {/* Current Template Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded border">
          <div className="text-xs font-medium text-blue-800">Template hiện tại:</div>
          <div className="text-sm text-blue-600 mt-1">
            {selectedTemplate === 1 && '🟦 Classic Navy - Xanh navy cổ điển'}
            {selectedTemplate === 2 && '🔵🔴 Blue Red - Xanh chuyển đỏ'}
            {selectedTemplate === 3 && '💎 Teal Modern - Xanh ngọc hiện đại'}
            {selectedTemplate === 4 && '🟠 Red Orange - Đỏ cam năng động'}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-xs text-gray-600">
          <div className="font-medium mb-1">Hướng dẫn:</div>
          <div className="space-y-1">
            <p>• Click <strong>"🎨 Chọn Template"</strong> để đổi style</p>
            <p>• Click <strong>"📍 Dưới/Trên"</strong> để đổi vị trí</p>
            <p>• Click <strong>"⚙️ Edit"</strong> để chỉnh sửa</p>
          </div>
        </div>
      </div>

      {/* Demo instructions overlay - chỉ hiện khi không có template selector */}
      {!showTemplateSelector && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center pointer-events-none z-10">
          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl">
            <h1 className="text-4xl font-bold mb-4">⚽ LIVE MATCH ⚽</h1>
            <p className="text-xl mb-2">
              {showAbove ? 'Scoreboard Above' : 'Scoreboard Below'} - Template {selectedTemplate}
            </p>
            <p className="text-lg opacity-80">Chọn template và vị trí scoreboard!</p>
          </div>
        </div>
      )}

      {/* Render appropriate scoreboard */}
      {showAbove ? (
        <ScoreboardAbove template={selectedTemplate} />
      ) : (
        <ScoreboardBelow
          accessCode="DEMO123"
          template={selectedTemplate}
          onTeamUpdate={handleTeamUpdate}
          onScoreUpdate={handleScoreUpdate}
          onLogoUpdate={handleLogoUpdate}
        />
      )}

      {/* Sample sponsors for visual context */}
      <div className="fixed bottom-8 right-8 z-30 space-y-2">
        <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
          SPONSOR A
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
          SPONSOR B
        </div>
      </div>
    </div>
  );
};

export default ScoreboardManager;

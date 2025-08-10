import React from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import { useParams, useLocation } from 'react-router-dom';

const PublicContextTest = () => {
  const params = useParams();
  const location = useLocation();
  
  const {
    canSendToSocket,
    hasUrlParams,
    socketConnected,
    currentAccessCode,
    updateMatchInfo,
    updateScore,
    updateTeamNames,
    updateView
  } = usePublicMatch();

  const testSendData = () => {
    console.log('🧪 [Test] Testing send functions...');
    
    // Test match info
    updateMatchInfo({
      matchTitle: 'Test Match',
      stadium: 'Test Stadium',
      liveText: 'Test Live'
    });
    
    // Test score
    updateScore(1, 2);
    
    // Test team names
    updateTeamNames('Test Team A', 'Test Team B');
    
    // Test view
    updateView('poster');
  };

  return (
    <div className="fixed top-4 right-4 bg-white p-4 shadow-lg rounded-lg text-sm max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 PublicMatchContext Debug</h3>
      
      <div className="space-y-2">
        <div><strong>Route:</strong> {location.pathname}</div>
        <div><strong>Access Code:</strong> {params.accessCode}</div>
        <div><strong>Has URL Params:</strong> {hasUrlParams ? '✅' : '❌'}</div>
        <div><strong>Can Send:</strong> {canSendToSocket ? '✅' : '❌'}</div>
        <div><strong>Socket Connected:</strong> {socketConnected ? '✅' : '❌'}</div>
        <div><strong>Current Access Code:</strong> {currentAccessCode}</div>
        
        <div className="mt-4">
          <h4 className="font-semibold">URL Params:</h4>
          <div className="text-xs bg-gray-100 p-2 rounded max-h-32 overflow-y-auto">
            {Object.entries(params).map(([key, value]) => (
              <div key={key}><strong>{key}:</strong> {value}</div>
            ))}
          </div>
        </div>
        
        <button
          onClick={testSendData}
          className="w-full bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
          disabled={!canSendToSocket || !socketConnected}
        >
          🧪 Test Send Functions
        </button>
      </div>
    </div>
  );
};

export default PublicContextTest;

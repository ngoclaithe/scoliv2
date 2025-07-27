import React, { useState } from 'react';
import { useMatch } from '../../contexts/MatchContext';
import Button from '../common/Button';

const TestControls = () => {
  const { updateView, socketConnected, updatePoster, updateTemplate } = useMatch();
  const [selectedView, setSelectedView] = useState('poster');

  const views = [
    { id: 'poster', name: 'Poster', icon: '🖼️', description: 'Hiển thị poster theo loại đã chọn' },
    { id: 'intro', name: 'Giới thiệu', icon: '🏆', description: 'Component giới thiệu trận đấu' },
    { id: 'halftime', name: 'Nghỉ giữa hiệp', icon: '🥤', description: 'Component nghỉ giữa hiệp' },
    { id: 'scoreboard', name: 'Bảng tỉ số', icon: '📊', description: 'Hiển thị scoreboard' }
  ];

  const posters = [
    { id: 'tretrung', name: 'Poster Tre Trung', icon: '🎭' },
    { id: 'haoquang', name: 'Poster Hao Quang', icon: '⚡' }
  ];

  const templates = [
    { id: 1, name: 'Template 1' },
    { id: 2, name: 'Template 2' },
    { id: 3, name: 'Template 3' },
    { id: 4, name: 'Template 4' },
    { id: 5, name: 'Template 5' }
  ];

  const handleViewChange = (viewType) => {
    setSelectedView(viewType);
    updateView(viewType);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🎮 Test Controls - Route Dynamic
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Socket Status:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            socketConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {socketConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
      </div>

      {/* View Controls */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          🎯 Điều khiển View (Client2)
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {views.map((view) => (
            <Button
              key={view.id}
              onClick={() => handleViewChange(view.id)}
              className={`flex flex-col items-center p-4 h-auto transition-all duration-200 ${
                selectedView === view.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl mb-2">{view.icon}</span>
              <span className="font-medium text-sm">{view.name}</span>
              <span className="text-xs opacity-75 mt-1 text-center">
                {view.description}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Poster Controls */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          🖼️ Chọn Poster (khi view = poster)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {posters.map((poster) => (
            <Button
              key={poster.id}
              onClick={() => {
                updatePoster(poster.id);
                updateView('poster');
                setSelectedView('poster');
              }}
              className="flex items-center justify-center p-3 bg-purple-100 text-purple-700 hover:bg-purple-200"
            >
              <span className="mr-2">{poster.icon}</span>
              <span className="font-medium">{poster.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Template Controls */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          🎨 Chọn Template
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {templates.map((template) => (
            <Button
              key={template.id}
              onClick={() => updateTemplate(template.id)}
              className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
            >
              {template.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          📖 Hướng dẫn sử dụng:
        </h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Mở route dynamic <code className="bg-blue-100 px-1 rounded">/:accessCode</code> ở tab/cửa sổ khác</li>
          <li>2. Click vào các button trên để thay đổi view trên Client2</li>
          <li>3. Xem thay đổi real-time thông qua Socket.IO</li>
          <li>4. Kiểm tra Console để xem logs</li>
        </ol>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={() => {
            handleViewChange('intro');
            setTimeout(() => handleViewChange('halftime'), 3000);
            setTimeout(() => handleViewChange('poster'), 6000);
          }}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          🚀 Demo Auto (Intro → Halftime → Poster)
        </Button>
        <Button
          onClick={() => window.open(`/${window.location.pathname.includes('DEMO') ? 'DEMO' : 'TEST'}`, '_blank')}
          className="bg-purple-600 text-white hover:bg-purple-700"
        >
          📺 Mở Client2 (Tab mới)
        </Button>
      </div>
    </div>
  );
};

export default TestControls;

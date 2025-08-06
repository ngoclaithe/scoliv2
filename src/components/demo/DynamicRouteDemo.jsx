import React, { useState } from 'react';
import { buildDynamicRoute } from '../../utils/dynamicRouteUtils';

const DynamicRouteDemo = () => {
  const [params, setParams] = useState({
    accessCode: 'DEMO123',
    location: 'Sân Mỹ Đình',
    matchTitle: 'V-League 2024',
    liveText: 'TRỰC TIẾP',
    teamALogoCode: 'HN',
    teamBLogoCode: 'TPHCM',
    teamAName: 'Hà Nội FC',
    teamBName: 'TP Hồ Chí Minh',
    teamAKitColor: '#FF0000',
    teamBKitColor: '#0000FF',
    teamAScore: 2,
    teamBScore: 1
  });

  const [generatedUrl, setGeneratedUrl] = useState('');

  const handleParamChange = (key, value) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateUrl = () => {
    const url = buildDynamicRoute(params);
    setGeneratedUrl(url);
  };

  const openInNewTab = () => {
    if (generatedUrl) {
      window.open(generatedUrl, '_blank');
    }
  };

  const copyToClipboard = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(window.location.origin + generatedUrl)
        .then(() => alert('URL đã được copy!'))
        .catch(() => alert('Không thể copy URL'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🌐 Dynamic Route Generator
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Input */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Thông tin trận đấu</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Access Code
            </label>
            <input
              type="text"
              value={params.accessCode}
              onChange={(e) => handleParamChange('accessCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="DEMO123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Địa điểm
            </label>
            <input
              type="text"
              value={params.location}
              onChange={(e) => handleParamChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Sân Mỹ Đình"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tiêu đề trận đấu
            </label>
            <input
              type="text"
              value={params.matchTitle}
              onChange={(e) => handleParamChange('matchTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="V-League 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Text Live
            </label>
            <input
              type="text"
              value={params.liveText}
              onChange={(e) => handleParamChange('liveText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="TRỰC TIẾP"
            />
          </div>
        </div>

        {/* Team Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Thông tin đội bóng</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tên đội A
              </label>
              <input
                type="text"
                value={params.teamAName}
                onChange={(e) => handleParamChange('teamAName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Hà Nội FC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tên đội B
              </label>
              <input
                type="text"
                value={params.teamBName}
                onChange={(e) => handleParamChange('teamBName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="TP Hồ Chí Minh"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Logo code A
              </label>
              <input
                type="text"
                value={params.teamALogoCode}
                onChange={(e) => handleParamChange('teamALogoCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="HN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Logo code B
              </label>
              <input
                type="text"
                value={params.teamBLogoCode}
                onChange={(e) => handleParamChange('teamBLogoCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="TPHCM"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Màu áo A
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={params.teamAKitColor}
                  onChange={(e) => handleParamChange('teamAKitColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={params.teamAKitColor}
                  onChange={(e) => handleParamChange('teamAKitColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#FF0000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Màu áo B
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={params.teamBKitColor}
                  onChange={(e) => handleParamChange('teamBKitColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={params.teamBKitColor}
                  onChange={(e) => handleParamChange('teamBKitColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#0000FF"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tỉ số A
              </label>
              <input
                type="number"
                value={params.teamAScore}
                onChange={(e) => handleParamChange('teamAScore', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tỉ số B
              </label>
              <input
                type="number"
                value={params.teamBScore}
                onChange={(e) => handleParamChange('teamBScore', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={generateUrl}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          🔗 Tạo Dynamic URL
        </button>
      </div>

      {/* Generated URL */}
      {generatedUrl && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold mb-2 text-gray-700">Generated URL:</h4>
          <div className="bg-white p-3 rounded border break-all font-mono text-sm">
            {window.location.origin}{generatedUrl}
          </div>
          <div className="mt-3 flex gap-3">
            <button
              onClick={openInNewTab}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-colors"
            >
              🚀 Mở trong tab mới
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded transition-colors"
            >
              📋 Copy URL
            </button>
          </div>
        </div>
      )}

      {/* Documentation */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-lg font-semibold mb-2 text-blue-800">📖 Hướng dẫn sử dụng</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Điền đầy đủ thông tin trận đấu và đội bóng</li>
          <li>• Logo codes phải tồn tại trong database để tìm được logo</li>
          <li>• Màu áo sử dụng định dạng hex (#FF0000)</li>
          <li>• Khoảng trắng trong text sẽ tự động được thay thế bằng dấu gạch dưới</li>
          <li>• URL sẽ tự động cập nhật dữ liệu lên backend khi truy cập</li>
        </ul>
      </div>
    </div>
  );
};

export default DynamicRouteDemo;

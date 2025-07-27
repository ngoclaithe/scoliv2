import React from 'react';

const TemplateSelector = ({ selectedTemplate, onTemplateChange }) => {
  const templates = [
    {
      id: 1,
      name: 'Template 1 - Classic Navy',
      preview: {
        backgroundColor: 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900',
        borderColor: 'border-yellow-400',
        scoreColor: 'bg-white text-blue-900',
        timerColor: 'bg-blue-900 text-white',
        description: 'Màu xanh navy cổ điển với viền vàng'
      }
    },
    {
      id: 2,
      name: 'Template 2 - Blue Red',
      preview: {
        backgroundColor: 'bg-gradient-to-r from-blue-600 via-blue-500 to-red-600',
        borderColor: 'border-yellow-500',
        scoreColor: 'bg-white text-blue-900',
        timerColor: 'bg-gray-700 text-white',
        description: 'Màu xanh chuyển sang đỏ'
      }
    },
    {
      id: 3,
      name: 'Template 3 - Teal Modern',
      preview: {
        backgroundColor: 'bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500',
        borderColor: 'border-white',
        scoreColor: 'bg-red-600 text-white',
        timerColor: 'bg-teal-600 text-white',
        description: 'Màu xanh ngọc hiện đại'
      }
    },
    {
      id: 4,
      name: 'Template 4 - Red Orange',
      preview: {
        backgroundColor: 'bg-gradient-to-r from-red-500 via-orange-500 to-red-500',
        borderColor: 'border-yellow-300',
        scoreColor: 'bg-blue-900 text-white',
        timerColor: 'bg-yellow-500 text-blue-900',
        description: 'Màu đỏ cam năng động'
      }
    }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg">
      <h3 className="font-bold text-lg mb-4 text-center text-gray-800">
        🎨 Chọn Template Scoreboard
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-300 ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
            onClick={() => onTemplateChange(template.id)}
          >
            {/* Preview thumbnail */}
            <div className={`h-12 rounded mb-2 ${template.preview.backgroundColor} ${template.preview.borderColor} border-2 flex items-center justify-center`}>
              <div className="flex items-center gap-1">
                <div className={`w-6 h-6 ${template.preview.scoreColor} rounded text-xs flex items-center justify-center font-bold`}>
                  0
                </div>
                <div className={`w-8 h-6 ${template.preview.timerColor} rounded text-xs flex items-center justify-center font-bold`}>
                  90'
                </div>
                <div className={`w-6 h-6 ${template.preview.scoreColor} rounded text-xs flex items-center justify-center font-bold`}>
                  0
                </div>
              </div>
            </div>
            
            <div className="text-sm font-medium text-gray-800 text-center">
              {template.name}
            </div>
            <div className="text-xs text-gray-600 text-center mt-1">
              {template.preview.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;

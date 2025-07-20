import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

const PenaltyModal = ({ isOpen, onClose, onSelectOption, selectedOption }) => {
  const [selectedPenalty, setSelectedPenalty] = useState(selectedOption || null);

  const penaltyOptions = [
    {
      id: "penalty-shootout",
      name: "Đá phạt đền",
      icon: "🥅",
      description: "Hiển thị bảng đá phạt đền",
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600"
    },
    {
      id: "penalty-score",
      name: "Tỷ số phạt đền",
      icon: "🎯",
      description: "Hiển thị tỷ số loạt đá phạt đền",
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600"
    },
    {
      id: "penalty-progress",
      name: "Tiến trình phạt đền",
      icon: "📊",
      description: "Hiển thị tiến trình từng lượt đá",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      id: "penalty-player",
      name: "Cầu thủ đá phạt",
      icon: "👤",
      description: "Hiển thị thông tin cầu thủ đá",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    },
    {
      id: "penalty-result",
      name: "Kết quả phạt đền",
      icon: "✅",
      description: "Hiển thị kết quả từng lượt đá",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600"
    },
    {
      id: "penalty-timer",
      name: "Đồng hồ phạt đền",
      icon: "⏱️",
      description: "Hiển thị thời gian cho lượt đá",
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600"
    }
  ];

  const handleSelect = (optionId) => {
    setSelectedPenalty(optionId);
  };

  const handleConfirm = () => {
    if (selectedPenalty && onSelectOption) {
      onSelectOption(selectedPenalty);
    }
    onClose();
  };

  const handleCancel = () => {
    setSelectedPenalty(selectedOption);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="🥅 Tùy chọn hiển thị Penalty"
      size="lg"
      footer={
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedPenalty}
            className="w-full sm:w-auto"
          >
            Xác nhận
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Chọn kiểu hiển thị penalty phù hợp với nhu cầu truyền hình của bạn:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {penaltyOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]
                ${selectedPenalty === option.id
                  ? "border-primary-500 bg-primary-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }
              `}
            >
              {/* Selection indicator */}
              {selectedPenalty === option.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <div className={`
                  w-10 h-10 rounded-lg ${option.color} ${option.hoverColor} 
                  flex items-center justify-center text-white text-lg flex-shrink-0
                  transition-colors duration-200
                `}>
                  {option.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                    {option.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview section for selected option */}
        {selectedPenalty && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Xem trước:</h4>
            <div className="text-center py-8 bg-white rounded border-2 border-dashed border-gray-300">
              <div className="text-2xl mb-2">
                {penaltyOptions.find(opt => opt.id === selectedPenalty)?.icon}
              </div>
              <p className="text-sm text-gray-600">
                {penaltyOptions.find(opt => opt.id === selectedPenalty)?.name}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Sẽ hiển thị trên màn hình livestream
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PenaltyModal;

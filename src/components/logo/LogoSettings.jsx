import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import Loading from "../common/Loading";

const LogoSettings = ({ isOpen, onClose, onLogoUpdate, matchData }) => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  // State cho multi-logo system
  const [logoPositions, setLogoPositions] = useState({
    "top-left": { logo: null, type: "sponsor" },
    "bottom-left": { logo: null, type: "media" },
    "bottom-right": { logo: null, type: "organizer" },
    "top-right": { logo: null, type: "tournament" },
  });

  // Dữ liệu mẫu logo
  const sampleLogos = [
    {
      id: "logo-1",
      name: "VFF - Liên đoàn bóng đá Việt Nam",
      url: null,
      category: "organizer",
    },
    {
      id: "logo-2",
      name: "VPF - Công ty CP bóng đá chuyên nghiệp Việt Nam",
      url: null,
      category: "organizer",
    },
    {
      id: "logo-3",
      name: "VTV - Đài Truyền hình Việt Nam",
      url: null,
      category: "media",
    },
    {
      id: "logo-4",
      name: "FPT Play - Nền tảng giải trí số",
      url: null,
      category: "media",
    },
    {
      id: "logo-5",
      name: "Bia Saigon - Nhà tài trợ chính",
      url: null,
      category: "sponsor",
    },
    {
      id: "logo-6",
      name: "Vingroup - Tập đoàn đa ngành",
      url: null,
      category: "sponsor",
    },
    {
      id: "logo-7",
      name: "VietinBank - Ngân hàng thương mại",
      url: null,
      category: "sponsor",
    },
    {
      id: "logo-8",
      name: "FPT - Tập đoàn công nghệ",
      url: null,
      category: "sponsor",
    },
    {
      id: "logo-9",
      name: "V-League 2024 - Giải đấu",
      url: null,
      category: "tournament",
    },
    {
      id: "logo-10",
      name: "AFF Cup - Giải vô địch",
      url: null,
      category: "tournament",
    },
  ];

  const positions = [
    { 
      id: "top-left", 
      name: "Góc Trái Trên", 
      icon: "↖️",
      description: "Vị trí góc trái trên poster" 
    },
    { 
      id: "top-right", 
      name: "Góc Phải Trên", 
      icon: "↗️",
      description: "Vị trí góc phải trên poster" 
    },
    { 
      id: "bottom-left", 
      name: "Góc Trái Dưới", 
      icon: "↙️",
      description: "Vị trí góc trái dưới poster" 
    },
    { 
      id: "bottom-right", 
      name: "Góc Phải Dưới", 
      icon: "↘️",
      description: "Vị trí góc phải dưới poster" 
    },
  ];

  const logoTypes = [
    {
      id: "sponsor",
      name: "Nhà Tài Trợ",
      icon: "💰",
      color: "bg-green-100 text-green-800",
      defaultPosition: "top-left"
    },
    {
      id: "media",
      name: "Đối Tác Truyền Thông",
      icon: "📺",
      color: "bg-purple-100 text-purple-800",
      defaultPosition: "bottom-left"
    },
    {
      id: "organizer",
      name: "Ban Tổ Chức",
      icon: "🏛️",
      color: "bg-blue-100 text-blue-800",
      defaultPosition: "bottom-right"
    },
    {
      id: "tournament",
      name: "Giải Đấu",
      icon: "🏆",
      color: "bg-yellow-100 text-yellow-800",
      defaultPosition: "top-right"
    },
  ];

  const tabs = [
    { id: "search", name: "Tìm Kiếm Logo", icon: "🔍" },
    { id: "position", name: "Quản Lý Vị Trí", icon: "📍" },
  ];

  const filteredLogos = sampleLogos.filter((logo) =>
    logo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogoSelect = (logo) => {
    setSelectedLogo(logo);
  };

  const handleAssignLogo = (position, logo) => {
    setLogoPositions(prev => ({
      ...prev,
      [position]: {
        ...prev[position],
        logo: logo
      }
    }));
  };

  const handleRemoveLogo = (position) => {
    setLogoPositions(prev => ({
      ...prev,
      [position]: {
        ...prev[position],
        logo: null
      }
    }));
  };

  const handleSave = () => {
    const logoData = {
      positions: logoPositions,
      selectedLogos: Object.values(logoPositions).filter(pos => pos.logo !== null)
    };

    onLogoUpdate?.(logoData);
    onClose();
  };

  const LogoCard = ({ logo, isSelected, onClick, isAssigned = false }) => (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "border-primary-500 bg-primary-50 shadow-md"
            : isAssigned
            ? "border-gray-400 bg-gray-100 opacity-60"
            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
        }
      `}
    >
      {/* Logo Display */}
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
        {logo.url ? (
          <img
            src={logo.url}
            alt={logo.name}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <div className="text-gray-400 text-2xl font-bold">
            {logo.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Logo Info */}
      <div>
        <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
          {logo.name}
        </h4>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            logoTypes.find((type) => type.id === logo.category)?.color
          }`}
        >
          {logoTypes.find((type) => type.id === logo.category)?.icon}
          <span className="ml-1">
            {logoTypes.find((type) => type.id === logo.category)?.name}
          </span>
        </span>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Assigned Indicator */}
      {isAssigned && (
        <div className="absolute top-2 left-2 bg-gray-500 text-white rounded-full p-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );

  const PositionCard = ({ position, positionData }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{position.icon}</span>
          <div>
            <h4 className="font-medium text-gray-900">{position.name}</h4>
            <p className="text-xs text-gray-500">{position.description}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            logoTypes.find(type => type.id === positionData.type)?.color
          }`}
        >
          {logoTypes.find(type => type.id === positionData.type)?.icon}
          {logoTypes.find(type => type.id === positionData.type)?.name}
        </span>
      </div>

      {positionData.logo ? (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
            {positionData.logo.url ? (
              <img
                src={positionData.logo.url}
                alt={positionData.logo.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-gray-500 font-bold">
                {positionData.logo.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-gray-900">
              {positionData.logo.name}
            </p>
          </div>
          <button
            onClick={() => handleRemoveLogo(position.id)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-gray-500 mb-2">Chưa có logo</p>
          {selectedLogo && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleAssignLogo(position.id, selectedLogo)}
              className="text-xs"
            >
              Gán logo đã chọn
            </Button>
          )}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "search":
        return (
          <div className="space-y-4">
            {/* Search Bar */}
            <Input
              label="Tìm kiếm logo"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập tên logo hoặc tổ chức..."
              icon={
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />

            {/* Selected Logo Info */}
            {selectedLogo && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                <p className="text-sm font-medium text-primary-800">
                  ✅ Đã chọn: {selectedLogo.name}
                </p>
                <p className="text-xs text-primary-600 mt-1">
                  Chuyển sang tab "Quản Lý Vị Trí" để gán logo này vào vị trí mong muốn
                </p>
              </div>
            )}

            {/* Logo Grid */}
            {loading ? (
              <Loading size="lg" text="Đang tải logo..." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-80 overflow-y-auto">
                {filteredLogos.map((logo) => {
                  const isAssigned = Object.values(logoPositions).some(pos => pos.logo?.id === logo.id);
                  return (
                    <LogoCard
                      key={logo.id}
                      logo={logo}
                      isSelected={selectedLogo?.id === logo.id}
                      isAssigned={isAssigned}
                      onClick={() => !isAssigned && handleLogoSelect(logo)}
                    />
                  );
                })}
              </div>
            )}

            {filteredLogos.length === 0 && !loading && (
              <div className="text-center py-8">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy logo
                </h3>
                <p className="text-gray-600">Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </div>
        );

      case "position":
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                📍 Hướng dẫn sử dụng
              </h4>
              <p className="text-sm text-blue-800">
                1. Chọn logo từ tab "Tìm Kiếm Logo"<br/>
                2. Quay lại tab này và nhấn "Gán logo đã chọn" ở vị trí mong muốn<br/>
                3. Mỗi vị trí có thể chứa một logo duy nhất
              </p>
            </div>

            {/* Position Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {positions.map((position) => (
                <PositionCard
                  key={position.id}
                  position={position}
                  positionData={logoPositions[position.id]}
                />
              ))}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Tổng quan logo đã gán</h4>
              <div className="space-y-2">
                {Object.entries(logoPositions).map(([positionId, data]) => {
                  const position = positions.find(p => p.id === positionId);
                  return (
                    <div key={positionId} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {position.icon} {position.name}:
                      </span>
                      <span className="font-medium">
                        {data.logo ? data.logo.name : "Chưa có logo"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cài Đặt Logo Đa Vị Trí"
      size="xl"
      footer={
        <>
          <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2 sm:mb-0 sm:flex-1">
            <span className="mr-2">Logo đã gán:</span>
            <span className="font-medium">
              {Object.values(logoPositions).filter(pos => pos.logo !== null).length}/4
            </span>
          </div>
          <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSave} className="flex-1 sm:flex-none">
              <span className="hidden sm:inline">Lưu Cài Đặt</span>
              <span className="sm:hidden">Lưu</span>
            </Button>
          </div>
        </>
      }
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-8 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <span className="mr-1 sm:mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-64 sm:min-h-96">{renderTabContent()}</div>
      </div>
    </Modal>
  );
};

export default LogoSettings;

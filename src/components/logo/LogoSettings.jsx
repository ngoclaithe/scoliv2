import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import Loading from "../common/Loading";

const LogoSettings = ({ isOpen, onClose, onLogoUpdate, matchData }) => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoSettings, setLogoSettings] = useState({
    position: "top-left", // top-left, bottom-left, bottom-right
    type: "sponsor", // sponsor, organizer, media
    textMarquee: "none", // none, continuous, every-2min
  });
  const [loading, setLoading] = useState(false);

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
  ];

  const positions = [
    { id: "top-left", name: "Góc Trái Trên", icon: "↖️" },
    { id: "bottom-left", name: "Góc Trái Dưới", icon: "↙️" },
    { id: "bottom-right", name: "Góc Phải Dưới", icon: "↘️" },
  ];

  const logoTypes = [
    {
      id: "sponsor",
      name: "Tài Trợ",
      icon: "💰",
      color: "bg-green-100 text-green-800",
    },
    {
      id: "organizer",
      name: "Tổ Chức",
      icon: "🏛️",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "media",
      name: "Truyền Thông",
      icon: "📺",
      color: "bg-purple-100 text-purple-800",
    },
  ];

  const marqueeOptions = [
    { id: "none", name: "Không", description: "Không hiển thị chữ chạy" },
    {
      id: "continuous",
      name: "Liên Tục",
      description: "Chữ chạy liên tục trong suốt trận đấu",
    },
    {
      id: "every-2min",
      name: "Mỗi 2 Phút",
      description: "Chữ chạy xuất hiện mỗi 2 phút một lần",
    },
  ];

  const tabs = [
    { id: "search", name: "Tìm Kiếm Logo", icon: "🔍" },
    { id: "position", name: "Vị Trí & Loại", icon: "📍" },
    { id: "marquee", name: "Chữ Chạy", icon: "📜" },
  ];

  const filteredLogos = sampleLogos.filter(
    (logo) =>
      logo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      logo.category === logoSettings.type,
  );

  const handleLogoSelect = (logo) => {
    setSelectedLogo(logo);
  };

  const handleSettingChange = (key, value) => {
    setLogoSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!selectedLogo) {
      alert("Vui lòng chọn một logo");
      return;
    }

    const logoData = {
      logo: selectedLogo,
      settings: logoSettings,
    };

    onLogoUpdate?.(logoData);
    onClose();
  };

  const LogoCard = ({ logo, isSelected, onClick }) => (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "border-primary-500 bg-primary-50 shadow-md"
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



            {/* Logo Grid */}
            {loading ? (
              <Loading size="lg" text="Đang tải logo..." />
            ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-80 overflow-y-auto">
                {filteredLogos.map((logo) => (
                  <LogoCard
                    key={logo.id}
                    logo={logo}
                    isSelected={selectedLogo?.id === logo.id}
                    onClick={() => handleLogoSelect(logo)}
                  />
                ))}
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
            {/* Position Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Chọn vị trí hiển thị logo
              </label>
              <div className="grid grid-cols-1 gap-3">
                {positions.map((position) => (
                  <label
                    key={position.id}
                    className={`
                      relative flex items-center p-4 rounded-lg border cursor-pointer transition-all
                      ${
                        logoSettings.position === position.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="position"
                      value={position.id}
                      checked={logoSettings.position === position.id}
                      onChange={(e) =>
                        handleSettingChange("position", e.target.value)
                      }
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{position.icon}</span>
                    <span className="font-medium text-gray-900">
                      {position.name}
                    </span>
                    {logoSettings.position === position.id && (
                      <div className="absolute top-2 right-2 text-primary-500">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Logo Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Chọn loại logo
              </label>
              <div className="grid grid-cols-1 gap-3">
                {logoTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`
                      relative flex items-center p-4 rounded-lg border cursor-pointer transition-all
                      ${
                        logoSettings.type === type.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="logoType"
                      value={type.id}
                      checked={logoSettings.type === type.id}
                      onChange={(e) =>
                        handleSettingChange("type", e.target.value)
                      }
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{type.icon}</span>
                    <div>
                      <span className="font-medium text-gray-900">
                        {type.name}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        {type.id === "sponsor" &&
                          "Logo của các nhà tài trợ, đối tác thương mại"}
                        {type.id === "organizer" &&
                          "Logo của ban tổ chức, liên đoàn bóng đá"}
                        {type.id === "media" &&
                          "Logo của đài truyền hình, báo chí"}
                      </p>
                    </div>
                    {logoSettings.type === type.id && (
                      <div className="absolute top-2 right-2 text-primary-500">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case "marquee":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Cài đặt chữ chạy
              </label>
              <div className="grid grid-cols-1 gap-3">
                {marqueeOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`
                      relative flex items-center p-4 rounded-lg border cursor-pointer transition-all
                      ${
                        logoSettings.textMarquee === option.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="textMarquee"
                      value={option.id}
                      checked={logoSettings.textMarquee === option.id}
                      onChange={(e) =>
                        handleSettingChange("textMarquee", e.target.value)
                      }
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {option.name}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        {option.description}
                      </p>
                    </div>
                    {logoSettings.textMarquee === option.id && (
                      <div className="absolute top-2 right-2 text-primary-500">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Marquee Preview */}
            {logoSettings.textMarquee !== "none" && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Xem trước chữ chạy
                </h4>
                <div className="bg-gray-800 text-white p-2 rounded overflow-hidden">
                  <div className="whitespace-nowrap animate-pulse">
                    <span className="inline-block">
                      🏆 {matchData?.league || "V-League 2024"} • ⚽{" "}
                      {matchData?.homeTeam?.name || "Đội nhà"} vs{" "}
                      {matchData?.awayTeam?.name || "Đội khách"} • 📍{" "}
                      {matchData?.stadium || "Sân vận động"} • 🕘{" "}
                      {matchData?.time || "19:00"} • 🌤️{" "}
                      {matchData?.weather || "Nắng"}{" "}
                      {matchData?.temperature || "28°C"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {logoSettings.textMarquee === "continuous"
                    ? "Chữ chạy sẽ hiển thị liên tục trong suốt trận đấu"
                    : "Chữ chạy sẽ xuất hiện mỗi 2 phút một lần, mỗi lần kéo dài 10 giây"}
                </p>
              </div>
            )}
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
      title="Cài Đặt Logo & Chữ Chạy"
      size="xl"
      footer={
        <>
          {selectedLogo && (
            <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2 sm:mb-0 sm:flex-1">
              <span className="mr-2">Đã chọn:</span>
              <span className="font-medium truncate">{selectedLogo.name}</span>
            </div>
          )}
          <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSave} className="flex-1 sm:flex-none">
              <span className="hidden sm:inline">Áp Dụng Cài Đặt</span>
              <span className="sm:hidden">Áp Dụng</span>
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

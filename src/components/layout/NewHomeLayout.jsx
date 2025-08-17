import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal";

// Import các section components
import UploadLogoSection from "../sections/UploadLogoSection";
import MatchManagementSection from "../sections/MatchManagementSection";
import CommentarySection from "../sections/CommentarySection";

const NewHomeLayout = () => {
  const { user, logout, authType, hasAccountAccess, codeOnly, matchCode, clearMatchCode } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("quan-ly-tran");
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);

  // Định nghĩa các tab theo yêu cầu
  const tabs = [
    {
      id: "upload-logo",
      name: "UPLOAD LOGO",
      icon: "🏆",
      color: "blue",
      description: "Quản lý logo đội bóng và nhà tài trợ"
    },
    {
      id: "quan-ly-tran",
      name: "QUẢN LÝ TRẬN",
      icon: "⚽",
      color: "purple",
      description: "Điều khiển trận đấu và giao diện hiển thị"
    },
    {
      id: "binh-luan",
      name: "BÌNH LUẬN",
      icon: "🎙️",
      color: "red",
      description: "Quản lý audio và bình luận trận đấu"
    },
  ];

  // Hàm chuyển tab
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Hàm mở trang display trong tab mới
  const handleOpenDisplayPage = () => {
    if (matchCode) {
      const displayUrl = `/${matchCode}`;
      window.open(displayUrl, '_blank');
    }
  };

  // Hàm quay về AccessCodeList
  const handleBackToAccessCodeList = () => {
    navigate('/access-code-list');
  };

  // Render nội dung tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "upload-logo":
        return <UploadLogoSection />;
      case "quan-ly-tran":
        return <MatchManagementSection isActive={activeTab === "quan-ly-tran"} />;
      case "binh-luan":
        return <CommentarySection isActive={activeTab === "binh-luan"} />;
      default:
        return <UploadLogoSection />;
    }
  };

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-50">
      {/* Header - Thanh điều hướng trên cùng */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 shadow-lg sticky top-0 z-40">
        <div className="mx-auto px-3">
          <div className="flex justify-between items-center h-10">
            {/* Left - Logo và thông tin */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚽</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold text-white">SCOLIV</h1>
                {/* <span className="text-xs text-gray-200">Livestream Control</span> */}
              </div>
            </div>

            {/* Center - Logo only */}
            <div></div>

            {/* Right - User Actions */}
            <div className="flex items-center space-x-2">
              {/* Nút quay về AccessCodeList nếu login bằng tài khoản */}
              {!codeOnly && (
                <button
                  onClick={handleBackToAccessCodeList}
                  className="flex items-center justify-center bg-white/10 rounded-full w-8 h-8 hover:bg-white/20 transition-colors"
                  title="Quay về danh sách mã truy cập"
                >
                  <span className="text-white text-sm">📋</span>
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center justify-center bg-white/10 rounded-full w-8 h-8 hover:bg-white/20 transition-colors"
                title="Đăng xuất"
              >
                <span className="text-white text-sm">🚪</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 py-1.5 px-2 text-center font-semibold text-xs border-b-2 transition-all duration-300 hover:bg-gray-50 ${activeTab === tab.id
                    ? `border-${tab.color}-500 text-${tab.color}-700 bg-${tab.color}-50`
                    : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                style={{
                  borderBottomColor: activeTab === tab.id
                    ? (tab.color === 'blue' ? '#3b82f6' :
                      tab.color === 'purple' ? '#8b5cf6' :
                        tab.color === 'red' ? '#ef4444' : '#3b82f6')
                    : 'transparent',
                  backgroundColor: activeTab === tab.id
                    ? (tab.color === 'blue' ? '#eff6ff' :
                      tab.color === 'purple' ? '#f3e8ff' :
                        tab.color === 'red' ? '#fef2f2' : '#eff6ff')
                    : 'transparent',
                  color: activeTab === tab.id
                    ? (tab.color === 'blue' ? '#1d4ed8' :
                      tab.color === 'purple' ? '#7c3aed' :
                        tab.color === 'red' ? '#dc2626' : '#1d4ed8')
                    : undefined
                }}
              >
                <div className="flex flex-col items-center space-y-0.5">
                  <span className="text-base">{tab.icon}</span>
                  <span className="text-[10px] leading-none">
                    {tab.id === "upload-logo" ? "LOGO" :
                      tab.id === "quan-ly-tran" ? "TRẬN" : "AUDIO"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="bg-white min-h-screen">
          <div className="p-0">
            {renderTabContent()}
          </div>
        </div>
      </main>

      {/* Footer với thông tin chi tiết */}
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3">
            {/* Mã truy cập */}
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-300 mb-1">Mã truy cập hiện tại:</div>
              <div className="text-xl font-mono font-bold text-blue-400">
                {matchCode || 'NO-CODE'}
              </div>
            </div>

            {/* Đường dẫn */}
            <div className="bg-blue-900/50 rounded-lg p-3">
              <div className="text-sm text-blue-200 mb-1">🌐 Đường dẫn hiển thị:</div>
              <div className="font-mono bg-blue-800 px-2 py-1 rounded text-blue-100 text-sm break-all">
                {window.location.origin}/{matchCode || 'your-access-code'}
              </div>
            </div>

            {/* Thời gian hết hạn */}
            {user?.expiredAt && (
              <div className="bg-orange-900/50 rounded-lg p-3">
                <div className="text-sm text-orange-200 mb-1">⏰ Thời gian hết hạn:</div>
                <div className="font-mono bg-orange-800 px-2 py-1 rounded text-orange-100 text-sm">
                  {new Date(user.expiredAt).toLocaleString('vi-VN')}
                </div>
              </div>
            )}

            {/* Nút mở trang hiển thị */}
            <div className="flex space-x-2">
              <button
                onClick={handleOpenDisplayPage}
                disabled={!matchCode}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center space-x-2 ${
                  matchCode
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                <span>🌐</span>
                <span className="text-sm">Mở Trang Hiển Thị</span>
              </button>

              {/* Nút gọi */}
              <a
                href="tel:0966335502"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                title="Hotline: 0966 335 502"
              >
                <span>📞</span>
                <span className="text-sm">0966 335 502</span>
              </a>
            </div>

            {/* Ghi chú */}
            <div className="text-xs text-gray-400 space-y-1">
              <div>Chia sẻ link trên với đội ngũ để họ có thể xem trực tiếp</div>
              <div className="bg-yellow-800/30 border border-yellow-600/50 rounded p-2 text-yellow-200">
                <div className="font-medium">⏰ Lưu ý quan trọng:</div>
                <div>Code sẽ tính giờ từ lần đầu tiên truy cập đường dẫn</div>
              </div>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
};

export default NewHomeLayout;

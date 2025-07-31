import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "../common/Modal";

// Import các section components
import UploadLogoSection from "../sections/UploadLogoSection";
import MatchManagementSection from "../sections/MatchManagementSection";
import CommentarySection from "../sections/CommentarySection";

const NewHomeLayout = () => {
  const { user, logout, authType, hasAccountAccess, codeOnly, matchCode, clearMatchCode } = useAuth();
  const [activeTab, setActiveTab] = useState("quan-ly-tran");
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

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

  // Lấy thông tin màu cho tab hiện tại
  const getCurrentTabColor = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    return currentTab?.color || 'blue';
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

            {/* Center - Access Code Info */}
            <button
              onClick={() => setShowAccessCodeModal(true)}
              className="flex items-center justify-center bg-white/10 rounded-full w-8 h-8 hover:bg-white/20 transition-colors"
              title="Xem mã truy cập"
            >
              <span className="text-white text-sm">🔑</span>
            </button>

            {/* Right - User Actions */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-white/10 rounded-full px-3 py-1">
                <span className="text-white text-xs mr-1">{codeOnly ? '🔑' : '👤'}</span>
                <span className="text-white text-xs font-medium">
                  {codeOnly ? 'CODE ACCESS' : (user?.name || 'User')}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center justify-center bg-white/10 rounded-full w-8 h-8 hover:bg-white/20 transition-colors"
                title="Đăng xuất"
              >
                <span className="text-white text-sm">🚪</span>
              </button>

              {/* Support Button */}
              <a
                href="tel:0923415678"
                className="flex items-center justify-center bg-white/10 rounded-full w-8 h-8 hover:bg-white/20 transition-colors"
                title="Hotline: 0923415678"
              >
                <span className="text-white text-sm">📞</span>
              </a>
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
        className={`flex-1 py-3 px-2 text-center font-semibold text-xs border-b-2 transition-all duration-300 hover:bg-gray-50 ${
          activeTab === tab.id
            ? `border-${tab.color}-500 text-${tab.color}-700 bg-${tab.color}-50`
            : "border-transparent text-gray-600 hover:text-gray-800"
        }`}
        style={{
          borderBottomColor: activeTab === tab.id ? (
            tab.color === 'blue' ? '#3b82f6' :
            tab.color === 'purple' ? '#8b5cf6' :
            tab.color === 'red' ? '#ef4444' : '#3b82f6'
          ) : 'transparent',
          backgroundColor: activeTab === tab.id ? (
            tab.color === 'blue' ? '#eff6ff' :
            tab.color === 'purple' ? '#f3e8ff' :
            tab.color === 'red' ? '#fef2f2' : '#eff6ff'
          ) : 'transparent',
          color: activeTab === tab.id ? (
            tab.color === 'blue' ? '#1d4ed8' :
            tab.color === 'purple' ? '#7c3aed' :
            tab.color === 'red' ? '#dc2626' : '#1d4ed8'
          ) : undefined
        }}
      >
        <div className="flex flex-col items-center space-y-1">
          <span className="text-lg">{tab.icon}</span>
          <span className="text-xs">
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
          <div className="p-4">
            {renderTabContent()}
          </div>
        </div>
      </main>

      {/* Footer với thông tin route dynamic */}
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-sm mb-2">
              <span className="font-semibold">Route Dynamic:</span>
              <span className="ml-2 font-mono bg-gray-700 px-2 py-1 rounded">
                /{matchCode || 'your-access-code'}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Client1 (Admin) ➜ Socket.IO ➜ Server ➜ Socket.IO ➜ Client2 (Display)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewHomeLayout;

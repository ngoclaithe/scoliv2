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
              <button
                onClick={() => setShowUserModal(true)}
                className="flex items-center justify-center bg-white/10 rounded-full w-8 h-8 hover:bg-white/20 transition-colors"
                title="Thông tin người dùng"
              >
                <span className="text-white text-sm">{codeOnly ? '🔑' : '👤'}</span>
              </button>

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

      {/* Footer với thông tin route dynamic */}
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="max-w-7xl mx-auto">
          {/* <div className="text-center">
            <div className="text-sm mb-2">
              <span className="font-semibold">Route Dynamic:</span>
              <span className="ml-2 font-mono bg-gray-700 px-2 py-1 rounded">
                /{matchCode || 'your-access-code'}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Client1 (Admin) ➜ Socket.IO ➜ Server ➜ Socket.IO ➜ Client2 (Display)
            </div>
          </div> */}
        </div>
      </footer>

      {/* Access Code Modal */}
      <Modal
        isOpen={showAccessCodeModal}
        onClose={() => setShowAccessCodeModal(false)}
        title="🔑 Mã Truy Cập"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600 mb-2">Mã truy cập hiện tại:</div>
              <div className="text-2xl font-mono font-bold text-blue-600">
                {matchCode || 'NO-CODE'}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="text-sm text-blue-800">
                <div className="font-semibold mb-1">🌐 Route Dynamic:</div>
                <div className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-900">
                  /{matchCode || 'your-access-code'}
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Chia sẻ link này với đội ngũ để họ có thể xem trực tiếp
            </div>
          </div>
        </div>
      </Modal>

      {/* User Info Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="👤 Thông Tin Người Dùng"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">{codeOnly ? '🔑' : '👤'}</span>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="text-sm text-gray-600">Loại truy cập:</div>
                <div className="font-semibold text-gray-800">
                  {codeOnly ? 'Truy cập bằng mã' : 'Tài khoản người dùng'}
                </div>
              </div>

              {!codeOnly && (
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Tên người dùng:</div>
                  <div className="font-semibold text-gray-800">
                    {user?.name || 'Chưa có tên'}
                  </div>
                </div>
              )}

              {user?.email && (
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Email:</div>
                  <div className="font-semibold text-gray-800">
                    {user.email}
                  </div>
                </div>
              )}

              <div className="bg-gray-100 rounded-lg p-3">
                <div className="text-sm text-gray-600">Quyền hạn:</div>
                <div className="font-semibold text-gray-800">
                  {hasAccountAccess ? 'Quản trị viên' : 'Người dùng cơ bản'}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={logout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>🚪</span>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NewHomeLayout;

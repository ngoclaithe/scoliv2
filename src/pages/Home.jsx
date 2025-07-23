import React, { useState } from "react";
import Modal from "../components/common/Modal";
import { useAuth } from "../contexts/AuthContext";
import UploadLogoSection from "../components/sections/UploadLogoSection";
import MatchManagementSection from "../components/sections/MatchManagementSection";
import CommentarySection from "../components/sections/CommentarySection";

const Home = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("upload-logo");
  const [codeInfo] = useState({
    code: "DEMO",
    generatedAt: "16:13:11 19/7/2025",
    status: "active",
    expiryDate: "16:13:11 3/8/2025"
  });

  // State cho modals
  const [showCodeInfoModal, setShowCodeInfoModal] = useState(false);

  const tabs = [
    { id: "upload-logo", name: "UP LOGO", requireAuth: true },
    { id: "quan-ly-tran", name: "QUẢN LÝ TRẬN", requireAuth: true },
    { id: "binh-luan", name: "BÌNH LUẬN", requireAuth: true },
  ];

  // Hàm chuyển tab - đã đăng nhập rồi nên không cần check
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "upload-logo":
        return <UploadLogoSection />;
      case "quan-ly-tran":
        return <MatchManagementSection />;
      case "binh-luan":
        return <CommentarySection />;
      default:
        return <UploadLogoSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - tối ưu mobile */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 shadow-lg">
        <div className="mx-auto px-3">
          <div className="flex justify-between items-center h-10">
            {/* Left - Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">⚽</span>
              </div>
              <h1 className="text-xs font-bold text-white">scoliv</h1>
            </div>

            {/* Right - User Actions */}
            <div className="flex items-center space-x-1">
              <div className="flex items-center bg-white/10 rounded-full px-2 py-1">
                <span className="text-white text-xs mr-1">👤</span>
                <span className="text-white text-xs font-medium">{user?.name || 'User'}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center justify-center bg-white/10 rounded-full w-6 h-6 hover:bg-white/20"
                title="Đăng xuất"
              >
                <span className="text-white text-xs">🚪</span>
              </button>
              <button
                onClick={() => setShowCodeInfoModal(true)}
                className="flex items-center justify-center bg-white/10 rounded-full w-6 h-6 hover:bg-white/20"
                title="Xem mã truy cập"
              >
                <span className="text-white text-xs">🔑</span>
              </button>
              <a
                href="tel:0923415678"
                className="flex items-center justify-center bg-white/10 rounded-full w-6 h-6 hover:bg-white/20"
                title="Hotline: 0923415678"
              >
                <span className="text-white text-xs">📞</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto">
        {/* Tabs - tối ưu mobile */}
        <div className="flex bg-gray-100 border-b border-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-2 px-1 text-center font-bold text-xs border-b-2 transition-all ${
                activeTab === tab.id
                  ? tab.id === "upload-logo"
                    ? "border-blue-500 text-blue-700 bg-blue-50"
                    : tab.id === "quan-ly-tran"
                    ? "border-purple-500 text-purple-700 bg-purple-50"
                    : "border-red-500 text-red-700 bg-red-50"
                  : "border-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center justify-center">
                {tab.id === "upload-logo" ? (
                  <>
                    <span className="mr-1">🏆</span>
                    <span>LOGO</span>
                  </>
                ) : tab.id === "quan-ly-tran" ? (
                  <>
                    <span className="mr-1">⚽</span>
                    <span>TRẬN</span>
                  </>
                ) : (
                  <>
                    <span className="mr-1">🎙️</span>
                    <span>AUDIO</span>
                  </>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white min-h-screen">
          {renderTabContent()}
        </div>
      </main>

      {/* Code Info Modal - tối ưu mobile */}
      <Modal
        isOpen={showCodeInfoModal}
        onClose={() => setShowCodeInfoModal(false)}
        title=""
        size="sm"
      >
        {codeInfo && (
          <div className="p-3">
            <div className="text-center mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-lg">🔑</span>
              </div>
              <h4 className="text-sm font-bold text-blue-800">MÃ TRUY CẬP</h4>
            </div>

            <div className="space-y-2">
              <div className="bg-white rounded p-2 border">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs">Mã:</span>
                  <span className="font-mono font-bold text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {codeInfo.code}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="bg-white rounded p-2 border">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xs">Trạng thái:</span>
                    <span className="px-1 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      🟢 Hoạt động
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded p-2 border">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xs">Tạo lúc:</span>
                    <span className="font-medium text-xs">{codeInfo.generatedAt}</span>
                  </div>
                </div>

                <div className="bg-white rounded p-2 border">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-xs">Hết hạn:</span>
                    <span className="font-medium text-xs text-orange-600">
                      {codeInfo.expiryDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <div className="text-xs text-yellow-800">
                  <strong>⚠️ Lưu ý:</strong> Không chia sẻ mã này
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-3">
              <button
                onClick={() => setShowCodeInfoModal(false)}
                className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;

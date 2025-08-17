import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "../common/Modal";
import AccessCodeAPI from "../../API/apiAccessCode";
import { toast } from "react-toastify";

// Import các section components
import UploadLogoSection from "../sections/UploadLogoSection";
import MatchManagementSection from "../sections/MatchManagementSection";
import CommentarySection from "../sections/CommentarySection";

const NewHomeLayout = () => {
  const { user, logout, authType, hasAccountAccess, codeOnly, matchCode, clearMatchCode } = useAuth();
  const [activeTab, setActiveTab] = useState("quan-ly-tran");
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [codeInfo, setCodeInfo] = useState(null);
  const [loadingCodeInfo, setLoadingCodeInfo] = useState(false);

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

      // Hiển thị toast thông báo mã đã được sử dụng và hết hạn sau 2 tiếng
      toast.info('Mã đã được sử dụng và hết hạn sau 2 tiếng từ bây giờ', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  // Hàm lấy thông tin mã truy cập
  const loadCodeInfo = async () => {
    if (!matchCode) return;

    try {
      setLoadingCodeInfo(true);
      const response = await AccessCodeAPI.verifyCodeForLogin(matchCode);
      setCodeInfo(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin mã:', error);
      toast.error('Không thể lấy thông tin mã truy cập');
    } finally {
      setLoadingCodeInfo(false);
    }
  };

  // Load thông tin mã khi mở modal
  useEffect(() => {
    if (showAccessCodeModal && matchCode) {
      loadCodeInfo();
    }
  }, [showAccessCodeModal, matchCode]);

  // Hàm format ngày giờ
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Còn hạn';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
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
              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center justify-center bg-white/10 rounded-full w-8 h-8 hover:bg-white/20 transition-colors"
                title="Đăng xuất"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
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

      {/* Footer với thông tin liên hệ */}
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.16 10.928a11.021 11.021 0 005.931 5.931l1.541-3.064a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm font-medium text-green-400">Hỗ trợ:</span>
              <a href="tel:0966335502" className="text-sm font-mono text-white hover:text-green-400 transition-colors">
                0966 335 502
              </a>
            </div>
          </div>
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
                <div className="font-semibold mb-1">🔗 URL:</div>
                <div className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-900 break-all">
                  {window.location.origin}/{matchCode || 'your-access-code'}
                </div>
              </div>
            </div>

            {/* Nút truy cập trang display */}
            <div className="mb-4">
              <button
                onClick={handleOpenDisplayPage}
                disabled={!matchCode}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center space-x-2 ${
                  matchCode 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <span>🔗</span>
                <span>Mở Link</span>
              </button>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div>Chia sẻ link này với đội ngũ để họ có thể xem trực tiếp</div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-yellow-700">
                <div className="font-medium">⏰ Thời gian hết hạn:</div>
                {loadingCodeInfo ? (
                  <div className="text-sm mt-1">Đang tải...</div>
                ) : (
                  <div className="text-sm mt-1">
                    {codeInfo?.expiredAt ? formatDateTime(codeInfo.expiredAt) : 'Còn hạn'}
                  </div>
                )}
              </div>
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
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={logout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
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

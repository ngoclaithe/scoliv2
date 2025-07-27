import React, { useState } from "react";
import "./App.css";
// Import auth context
import { useAuth } from "./contexts/AuthContext";

// Import pages
import NewHomeLayout from "./components/layout/NewHomeLayout";
import LoginPage from "./components/auth/LoginPage";
import ManageAccessCode from "./components/auth/ManageAccessCode";
import ProfilePage from "./routes/ProfilePage";
import Loading from "./components/common/Loading";

function AppContent() {
  const {
    isAuthenticated,
    loading,
    user,
    logout,
    authType,
    hasAccountAccess,
    hasMatchAccess,
    canAccessProfile
  } = useAuth();
  const [currentPage, setCurrentPage] = useState("manage-access-code");

  // Cập nhật currentPage khi authType thay đổi
  React.useEffect(() => {
    if (authType === 'account') {
      setCurrentPage("manage-access-code"); // User account bắt đầu từ quản lý mã
    } else if (authType === 'full') {
      setCurrentPage("home"); // Khi đã nhập code thì chuyển sang home
    }
  }, [authType]);



  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-blue-800">
        <Loading size="lg" color="white" />
      </div>
    );
  }

  // Logic điều hướng dựa trên trạng thái đăng nhập
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Đăng nhập chỉ bằng code -> vào thẳng NewHomeLayout
  if (authType === 'code') {
    return <NewHomeLayout />;
  }







  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <NewHomeLayout />;

      case "manage-access-code":
        return <ManageAccessCode onNavigate={setCurrentPage} />;

      case "profile":
        if (canAccessProfile) {
          return <ProfilePage />;
        } else {
          setCurrentPage("home");
          return <NewHomeLayout />;
        }

      default:
        return <NewHomeLayout />;
    }
  };

  return renderCurrentPage();
}

function App() {
  return <AppContent />;
}

export default App;

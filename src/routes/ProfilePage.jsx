import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from '../components/auth/UserProfile';
import MainLayout from '../layouts/MainLayout';

const ProfilePage = () => {
  const { isAuthenticated } = useAuth();

  // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Tài khoản của tôi</h1>
          <UserProfile />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;

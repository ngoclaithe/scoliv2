import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { MatchProvider } from '../contexts/MatchContext';
import { PublicMatchProvider } from '../contexts/PublicMatchContext';

import 'react-toastify/dist/ReactToastify.css';
import App from '../App';
import DisplayController from '../components/display/DisplayController';
import ScoreboardBelow from '../components/scoreboard_preview/ScoreboardBelowNew';
import PosterPreviewPage from '../pages/PosterPreviewPage';
import AdminApp from '../components/admin/AdminApp';

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Authenticated routes */}
        <Route path="/" element={
          <AuthProvider>
            <MatchProvider>
              <App />
            </MatchProvider>
          </AuthProvider>
        } />

        {/* Public dynamic routes for access codes - cần AuthProvider để tránh lỗi useAuth */}
        <Route path="/:accessCode" element={
          <AuthProvider>
            <PublicMatchProvider>
              <DisplayController />
            </PublicMatchProvider>
          </AuthProvider>
        } />

        {/* Preview route for posters */}
        <Route path="/:accessCode/preview" element={
          <PublicMatchProvider>
            <PosterPreviewPage />
          </PublicMatchProvider>
        } />

        <Route path="/demotest" element={
              <ScoreboardBelow />
        } />
      </Routes>

      {/* Toast Container - để ở đây để có thể dùng cho tất cả routes */}
      {/* <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      /> */}
    </>
  );
};

export default AppRoutes;

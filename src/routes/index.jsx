import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { MatchProvider } from '../contexts/MatchContext';
import { PublicMatchProvider } from '../contexts/PublicMatchContext';
import { AudioProvider } from '../contexts/AudioContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from '../App';
import DisplayController from '../components/display/DisplayController';
import ScoreboardTest from '../pages/ScoreboardTest';

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Authenticated routes */}
        <Route path="/" element={
          <AuthProvider>
            <AudioProvider>
              <MatchProvider>
                <App />
              </MatchProvider>
            </AudioProvider>
          </AuthProvider>
        } />

        {/* Test page for scoreboard templates */}
        <Route path="/test-scoreboard" element={
          <PublicMatchProvider>
            <ScoreboardTest />
          </PublicMatchProvider>
        } />

        {/* Public dynamic routes for access codes - không cần authentication */}
        <Route path="/:accessCode" element={
          <PublicMatchProvider>
            <DisplayController />
          </PublicMatchProvider>
        } />
      </Routes>

      {/* Toast Container - để ở đây để có thể dùng cho tất cả routes */}
      <ToastContainer
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
      />
    </>
  );
};

export default AppRoutes;

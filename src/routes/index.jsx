import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { MatchProvider } from '../contexts/MatchContext';
import { PublicMatchProvider } from '../contexts/PublicMatchContext';

import 'react-toastify/dist/ReactToastify.css';
import App from '../App';
import DisplayController from '../components/display/DisplayController';
import ScoreboardBelow from '../components/scoreboard_preview/ScoreboardBelowNew';
const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Authenticated routes */}
        <Route path="/" element={
          <AuthProvider>
            <MatchProvider>
              <App />
            </MatchProvider>
          </AuthProvider>
        } />

        {/* Public dynamic routes for access codes - không cần authentication */}
        <Route path="/:accessCode" element={
          <PublicMatchProvider>
            <DisplayController />
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

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { MatchProvider } from '../contexts/MatchContext';
import { TimerProvider } from '../contexts/TimerContext';
import { PublicMatchProvider } from '../contexts/PublicMatchContext';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import App from '../App';
import UnifiedDisplayController from '../components/display/UnifiedDisplayController';
import PosterPreviewPage from '../pages/PosterPreviewPage';
import AdminApp from '../components/admin/AdminApp';

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Test route */}
        <Route path="/test-url" element={<UrlTestComponent />} />

        {/* Authenticated routes */}
        <Route path="/" element={
          <AuthProvider>
            <TimerProvider>
              <MatchProvider>
                <App />
              </MatchProvider>
            </TimerProvider>
          </AuthProvider>
        } />

        <Route path="/:accessCode/:location/:matchTitle/:liveText/:teamALogoCode/:teamBLogoCode/:teamAName/:teamBName/:teamAKitColor/:teamBKitColor/:teamAScore/:teamBScore/:view/:matchTime" element={
          <AuthProvider>
            <PublicMatchProvider>
              <UnifiedDisplayController />
            </PublicMatchProvider>
          </AuthProvider>
        } />

        <Route path="/:accessCode/preview" element={
          <AuthProvider>
            <PublicMatchProvider>
              <PosterPreviewPage />
            </PublicMatchProvider>
          </AuthProvider>
        } />

        <Route path="/:accessCode" element={
          <AuthProvider>
            <PublicMatchProvider>
              <UnifiedDisplayController />
            </PublicMatchProvider>
          </AuthProvider>
        } />
      </Routes>

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

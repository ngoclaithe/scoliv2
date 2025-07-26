import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { MatchProvider } from '../contexts/MatchContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from '../App';
import PosterDisplay from '../components/display/PosterDisplay';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <MatchProvider>
        <Routes>
          <Route path="/" element={<App />} />

          {/* Dynamic route for access codes */}
          <Route path="/:accessCode" element={<PosterDisplay />} />
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
      </MatchProvider>
    </AuthProvider>
  );
};

export default AppRoutes;

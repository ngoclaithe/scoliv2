import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from '../App';
import PosterTreTrung from '../pages/Poster-tretrung';
import PosterDisplay from '../components/display/PosterDisplay';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />

      {/* Dynamic route for access codes */}
      <Route path="/:accessCode" element={<PosterDisplay />} />
    </Routes>
  );
};

export default AppRoutes;

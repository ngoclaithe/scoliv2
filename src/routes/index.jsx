import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from '../App';
import PosterTreTrung from '../pages/Poster-tretrung';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/ffff" element={<PosterTreTrung />} />
    </Routes>
  );
};

export default AppRoutes;

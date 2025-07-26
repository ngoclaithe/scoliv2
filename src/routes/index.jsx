import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from '../App';
import Poster1 from '../pages/Poster1';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/ffff" element={<Poster1 />} />
    </Routes>
  );
};

export default AppRoutes;

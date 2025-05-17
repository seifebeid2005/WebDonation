import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/public/Home/Home";
import UserProfile from '../pages/user/UserProfile/UserProfile';
// Example guest pages

const GuestRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  </Router>
);

export default GuestRouter;

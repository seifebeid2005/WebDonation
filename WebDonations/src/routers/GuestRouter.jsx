import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/public/Home/Home";

// Example guest pages

const GuestRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  </Router>
);

export default GuestRouter;

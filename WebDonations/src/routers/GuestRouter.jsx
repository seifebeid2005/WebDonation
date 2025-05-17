import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/public/Home/Home";
import AdminLogin from "../pages/admin/AdminLogin/AdminLogin";

// Example guest pages

const GuestRouter = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    
    {/* Allow access to admin login page */}
    <Route path="/admin/login" element={<AdminLogin />} />
    
    {/* Catch-all route */}
    <Route path="*" element={<HomePage />} />
  </Routes>
);

export default GuestRouter;

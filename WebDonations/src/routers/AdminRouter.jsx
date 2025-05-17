import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers/AdminUsers";
import AdminCauses from "../pages/admin/AdminCauses/AdminCauses";
import AdminReport from "../pages/admin/AdminReport/AdminReport";

const AdminRouter = () => {
  // Check if admin is logged in (session check would be here in a real app)
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected routes */}
      <Route path="/admin/dashboard" element={
        isLoggedIn ? <AdminDashboard /> : <Navigate to="/admin/login" />
      } />
      <Route path="/admin/users" element={
        isLoggedIn ? <AdminUsers /> : <Navigate to="/admin/login" />
      } />
      <Route path="/admin/causes" element={
        isLoggedIn ? <AdminCauses /> : <Navigate to="/admin/login" />
      } />
      <Route path="/admin/report" element={
        isLoggedIn ? <AdminReport /> : <Navigate to="/admin/login" />
      } />
      
      {/* Default redirect */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
      <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
  );
};

export default AdminRouter;

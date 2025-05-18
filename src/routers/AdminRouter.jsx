import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminCauses from "../pages/admin/AdminCauses/AdminCauses";
import AdminDashboard from "../pages/admin/AdminDashboard/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers/AdminUsers";
import AdminLogin from "../pages/admin/AdminLogin/AdminLogin";
import AdminDonationRequests from "../pages/admin/AdminDonationRequests/AdminDonationRequests";
import AdminRequests from '../pages/admin/AdminRequests/AdminRequests';

const AdminRouter = () => (
  <Router>
    <Routes>
      <Route path="/admin-causes" element={<AdminCauses />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/donation-requests" element={<AdminDonationRequests />} />
      <Route path="/admin-requests" element={<AdminRequests />} />
    </Routes>
  </Router>
);

export default AdminRouter; 
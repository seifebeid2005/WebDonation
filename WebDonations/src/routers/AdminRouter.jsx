import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminCauses from "../pages/admin/AdminCauses/AdminCauses";
import AdminDashboard from "../pages/admin/AdminDashboard/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers/AdminUsers";
import AdminLogin from "../pages/admin/AdminLogin/AdminLogin";
import AdminRequests from "../pages/admin/AdminRequests/AdminRequests";
import AdminReport from "../pages/admin/AdminReport/AdminReport";

// import AdminDonations from "../pages/admin/AdminDonations";

// Example admin pages

const AdminRouter = () => (
  <Router>
    <Routes>
      <Route path="/admin-causes" element={<AdminCauses />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/admin-requests" element={<AdminRequests />} />
      <Route path="/admin-report" element={<AdminReport />} />
      
      {/* <Route path="/admin/donations" element={<AdminDonations />} /> */}
    </Routes>
  </Router>
);

export default AdminRouter;

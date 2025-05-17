import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AdminDashboard from "../pages/admin/AdminDashboard";
// import AdminUsers from "../pages/admin/AdminUsers";
// import AdminDonations from "../pages/admin/AdminDonations";

// Example admin pages

const AdminRouter = () => (
  <Router>
    <Routes>
      {/* <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/donations" element={<AdminDonations />} />
      Add more admin routes as needed */}
    </Routes>
  </Router>
);

export default AdminRouter;

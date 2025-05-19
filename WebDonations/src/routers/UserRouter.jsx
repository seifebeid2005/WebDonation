import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/public/Home/Home";
import AboutPage from "../pages/public/About/About";
import ContactPro from "../pages/public/Contact/Contact";
import FeaturedCauses from "../pages/user/CausesPage/CausesPage";
import UserProfile from "../pages/user/UserProfile/UserProfile";
import CausesDetailsPage from "../pages/user/causesdetails/causesdetails";
import RequestAddingCause from "../pages/user/RequestCause/RequestCause";
import NotFound from "../pages/shared/NotFound/notfound";
import AdminCauses from "../pages/admin/AdminCauses/AdminCauses";
import AdminDashboard from "../pages/admin/AdminDashboard/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers/AdminUsers";
import AdminLogin from "../pages/admin/AdminLogin/AdminLogin";
import AdminRequests from "../pages/admin/AdminRequests/AdminRequests";
const UserRouter = ({ user }) => (
  <Router>
    <Routes>
      <Route path="/admin-causes" element={<AdminCauses />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/admin-requests" element={<AdminRequests />} />

      {/* public pages */}
      <Route path="/" element={<HomePage user={user} />} />
      <Route path="/about-us" element={<AboutPage user={user} />} />
      <Route path="/causes" element={<FeaturedCauses user={user} />} />
      <Route path="/contact" element={<ContactPro user={user} />} />
      <Route
        path="/causesdetails"
        element={<CausesDetailsPage user={user} />}
      />
      {/* user pages */}
      <Route path="/profile" element={<UserProfile user={user} />} />
      <Route
        path="/RequestAddingCause"
        element={<RequestAddingCause user={user} />}
      />
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default UserRouter;

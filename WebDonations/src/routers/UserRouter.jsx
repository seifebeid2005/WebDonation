import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/public/Home/Home";
import AboutPage from "../pages/public/About/About";
import ContactPro from "../pages/public/Contact/Contact";
import FeaturedCauses from "../pages/user/CausesPage/CausesPage";
import UserProfile from "../pages/user/UserProfile/UserProfile";
import RequestAddingCause from "../pages/user/RequestCause/RequestCause";
const UserRouter = () => (
  <Router>
    <Routes>
      {/* public pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<HomePage />} />
      <Route path="/about-us" element={<AboutPage />} />
      <Route path="/causes" element={<FeaturedCauses />} />
      <Route path="/contact" element={<ContactPro />} />

      {/* user pages */}
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/RequestAddingCause" element={<RequestAddingCause />} />
    </Routes>
  </Router>
);

export default UserRouter;

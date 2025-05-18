import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/public/Home/Home";
import AboutPage from "../pages/public/About/About";
import ContactPro from "../pages/public/Contact/Contact";

// import UserList from '../components/UserList';
// import UserProfile from '../components/UserProfile';
// import UserEdit from '../components/UserEdit';

// Example user-related components

const UserRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPro />} />
    </Routes>
  </Router>
);

export default UserRouter;

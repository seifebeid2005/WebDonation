import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/public/Home/Home";
import AboutPage from "../pages/public/About/About";
import ContactPro from "../pages/public/Contact/Contact";
import FeaturedCauses from "../pages/user/CausesPage/CausesPage";
import UserProfile from "../pages/user/UserProfile/UserProfile";
import CausesDetailsPage from "../pages/user/causesdetails/causesdetails";
import RequestAddingCause from "../pages/user/RequestCause/RequestCause";
import Notifications from "../pages/user/Notifications/Notifications";
import NotFound from "../pages/shared/NotFound/notfound";
import ThankYouPage from "../pages/shared/thankspage/thanks";
const UserRouter = ({ user }) => (
  <Router>
    <Routes>
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
      <Route path="/thanku" element={<ThankYouPage />} />
      {/* Notifications */}
      <Route path="/notifications" element={<Notifications />} />
      {/* Redirect to home if no match 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default UserRouter;

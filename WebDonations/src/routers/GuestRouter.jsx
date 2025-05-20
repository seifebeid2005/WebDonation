import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/public/Home/Home";
import AboutPage from "../pages/public/About/About";
import Userlogin from "../pages/user/auth/login/login";
import UserRegister from "../pages/user/auth/register/register";
import AdminSignIn from "../pages/admin/AdminLogin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers/AdminUsers";
import FeaturedCauses from "../pages/user/CausesPage/CausesPage";
import RequestAddingCause from "../pages/user/RequestCause/RequestCause";
import ContactUs from "../pages/public/Contact/Contact";
import AdminCauses from "../pages/admin/AdminCauses/AdminCauses";
import AdminLogin from "../pages/admin/AdminLogin/AdminLogin";
import AdminRequests from "../pages/admin/AdminRequests/AdminRequests";
import AdminReport from "../pages/admin/AdminReport/AdminReport";
import DonationReport from "../pages/admin/DonationReport/DonationReport";
import ChangePassword from "../pages/admin/ChangePassword/ChangePassword";
// Example guest pages

const GuestRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Auth pages */}
      <Route path="/login" element={<Userlogin />} />
      <Route path="/register" element={<UserRegister />} />
      {/* Admin auth Pages */}
      <Route path="/admin-signin" element={<AdminSignIn />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-users" element={<AdminUsers />} />
      <Route path="/admin-causes" element={<AdminCauses />} />
      <Route path="/admin-requests" element={<AdminRequests />} />
      <Route path="/admin-report" element={<AdminReport />} />
      <Route path="/donations-report" element={<DonationReport />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* Public pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about-us" element={<AboutPage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/causes" element={<FeaturedCauses />} />
    </Routes>
  </BrowserRouter>
);

export default GuestRouter;

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
import CausesDetailsPage from "../pages/user/causesdetails/causesdetails";
import NotFound from "../pages/shared/NotFound/notfound";
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
      {/* Public pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about-us" element={<AboutPage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/causes" element={<FeaturedCauses />} />
      <Route path="/causesdetails" element={<CausesDetailsPage />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default GuestRouter;

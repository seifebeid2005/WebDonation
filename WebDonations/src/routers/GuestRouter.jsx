import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/public/Home/Home";
import AboutPage from "../pages/public/About/About";
import Userlogin from "../pages/user/auth/login/login";
import UserRegister from "../pages/user/auth/register/register";
import AdminSignIn from "../pages/admin/AdminLogin/AdminLogin";
import FeaturedCauses from "../pages/user/CausesPage/CausesPage";
import ContactUs from "../pages/public/Contact/Contact";

// Example guest pages

const GuestRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Auth pages */}
      <Route path="/login" element={<Userlogin />} />
      <Route path="*" element={<Userlogin />} />
      <Route path="/register" element={<UserRegister />} />
      {/* Admin auth Pages */}
      <Route path="/admin-signin" element={<AdminSignIn />} />

      {/* Public pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about-us" element={<AboutPage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/causes" element={<FeaturedCauses />} />
    </Routes>
  </BrowserRouter>
);

export default GuestRouter;

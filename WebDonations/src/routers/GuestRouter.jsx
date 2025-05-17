import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/public/Home/Home";
import AboutPage from "../pages/public/About/About";
import Userlogin from "../pages/user/AuthRedirect/AuthRedirect";
import AdminSignIn from "../pages/admin/AdminLogin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers/AdminUsers";
import FeaturedCauses from "../pages/user/CausesPage/CausesPage";
import RequestAddingCause from "../pages/user/RequestCause/RequestCause";
import ContactUs from "../pages/public/Contact/Contact";
// Example guest pages

const GuestRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about-us" element={<AboutPage />} />
      <Route path="/auth" element={<Userlogin />} />
      <Route path="/admin-signin" element={<AdminSignIn />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-users" element={<AdminUsers />} />
      <Route path="/causes" element={<FeaturedCauses />} />
      <Route path="/RequestAddingCause" element={<RequestAddingCause />} />
      <Route path="/contact" element={<ContactUs />} />
      {/* Add more guest routes here */}
    </Routes>
  </BrowserRouter>
);

export default GuestRouter;

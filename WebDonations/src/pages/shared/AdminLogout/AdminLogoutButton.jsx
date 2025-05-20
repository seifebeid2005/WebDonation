import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      // Call backend logout endpoint (adjust URL if needed)
      await axios.get("http://localhost/WebDonation/Backend/admin/admin_logout.php", {
        withCredentials: true,
      });
    } catch (err) {
      // Ignore error, continue with redirect
    }
    // Redirect to admin-signin
    navigate("/admin-signin");
  };

  return (
    <a href="/admin-logout" className="logout-btn" onClick={handleLogout}>
      <i className="fas fa-sign-out-alt"></i> Logout
    </a>
  );
};

export default AdminLogoutButton;
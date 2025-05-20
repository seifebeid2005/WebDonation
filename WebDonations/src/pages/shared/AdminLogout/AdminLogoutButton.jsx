import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import APIURL from "../../../functions/baseurl.js";

const AdminLogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.get(`${APIURL}admin/admin_logout.php`, {
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
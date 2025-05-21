import React from "react";
import "../AdminDashboard.css";
import { logout } from "../../../../functions/user/auth";

export default function Sidebar({ admin, activePage }) {
  
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      window.location.replace("/"); // Use replace to prevent back navigation
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="sidebar">
      <div className="admin-profile">
        <div className="profile-icon">
          <i className="fas fa-user-shield"></i>
        </div>
        <h3>{admin?.username || "adminuser"}</h3>
        <p>
          {admin?.role === "super_admin" || admin?.role === "superAdmin"
            ? "Super Admin"
            : "Admin"}
        </p>
      </div>
      <nav className="admin-nav">
        <ul>
          <li className={activePage === "dashboard" ? "active" : ""}>
            <a href="/admin-dashboard">
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </a>
          </li>
          <li className={activePage === "requests" ? "active" : ""}>
            <a href="/admin-requests">
              <i className="fas fa-hand-holding-heart"></i> Donation Requests
            </a>
          </li>
          <li className={activePage === "users" ? "active" : ""}>
            <a href="/admin-users">
              <i className="fas fa-users-cog"></i> Admin Users
            </a>
          </li>
          <li className={activePage === "report" ? "active" : ""}>
            <a href="/donations-report">
              <i className="fas fa-chart-bar"></i> Donations Report
            </a>
          </li>
        </ul>
      </nav>
      <div className="logout-section" onClick={handleLogout}>
        <a href="/admin-logout" className="logout-btn">
          <i className="fas fa-sign-out-alt"></i> Logout
        </a>
      </div>
    </div>
  );
}

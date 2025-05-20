import React from "react";
import "../AdminDashboard.css";

export default function Sidebar({ admin, activePage }) {
  return (
    <div className="sidebar">
      <div className="admin-profile">
        <div className="profile-icon">
          <i className="fas fa-user-shield"></i>
        </div>
        <h3>{admin?.username || "adminuser"}</h3>
        <p>{admin?.role === "super_admin" || admin?.role === "superAdmin" ? "Super Admin" : "Admin"}</p>
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
          <li className={activePage === "password" ? "active" : ""}>
            <a href="/change-password">
              <i className="fas fa-key"></i> Change Password
            </a>
          </li>
        </ul>
      </nav>
      <div className="logout-section">
        <a href="/admin-logout" className="logout-btn">
          <i className="fas fa-sign-out-alt"></i> Logout
        </a>
      </div>
    </div>
  );
} 
import React from "react";
import Sidebar from "./AdminDashboard/components/Sidebar";
import "./AdminDashboard/AdminDashboard.css";

export default function AdminLayout({ children, admin, activePage }) {
  return (
    <div className="admin-container">
      <Sidebar admin={admin} activePage={activePage} />
      <div className="main-content">{children}</div>
    </div>
  );
} 
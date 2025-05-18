import React, { useState } from "react";
import "./AdminLogin.css"; // Reuse styles if you want
import { useNavigate } from "react-router-dom";

const AdminSignIn = () => {
  const [admin, setAdmin] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // TODO: Implement admin login logic
    // On successful login, redirect to admin dashboard
    navigate("/admin-dashboard");
  };

  return (
    <div className="auth-container">
      <form className="auth-form admin-form" onSubmit={handleAdminLogin}>
        <h2>Admin Sign In</h2>
        <input
          type="text"
          placeholder="Admin Username"
          value={admin.username}
          onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={admin.password}
          onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default AdminSignIn;

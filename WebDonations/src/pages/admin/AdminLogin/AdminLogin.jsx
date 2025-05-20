import React, { useState } from "react";
import axios from "axios";
import "./AdminLogin.css";
import { useNavigate } from "react-router-dom";
import APIURL from "../../../functions/baseurl.js";

const AdminSignin = () => {
  const [fields, setFields] = useState({ username: "", password: "" });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });
    if (!fields.username || !fields.password) {
      setAlert({ type: "error", message: "Username and password required." });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${APIURL}admin/login.php`,
        fields,
        { withCredentials: true }
      );
      if (response.data.success) {
        setAlert({ type: "success", message: "Login successful! Redirecting..." });
        setTimeout(() => navigate("/admin-dashboard"), 1000);
      } else {
        setAlert({ type: "error", message: response.data.message });
      }
    } catch (err) {
      setAlert({ type: "error", message: "Server error. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div className="admin-signin-bg">
      <form className="admin-signin-form" onSubmit={handleSubmit}>
        <h2>
          <i className="fas fa-user-shield"></i> Admin Sign In
        </h2>
        {alert.message && (
          <div className={`alert alert-${alert.type}`}>{alert.message}</div>
        )}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            autoFocus
            type="text"
            id="username"
            name="username"
            value={fields.username}
            onChange={handleChange}
            disabled={loading}
            autoComplete="username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={fields.password}
            onChange={handleChange}
            disabled={loading}
            autoComplete="current-password"
            required
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default AdminSignin;
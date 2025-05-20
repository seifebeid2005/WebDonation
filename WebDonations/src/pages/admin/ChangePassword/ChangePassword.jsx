import React, { useState } from "react";
import axios from "axios";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [fields, setFields] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!fields.current_password || !fields.new_password || !fields.confirm_password) {
      setAlert({ type: "error", message: "All fields are required." });
      return;
    }
    if (fields.new_password.length < 6) {
      setAlert({ type: "error", message: "Password must be at least 6 characters." });
      return;
    }
    if (fields.new_password !== fields.confirm_password) {
      setAlert({ type: "error", message: "New passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost/WebDonation/Backend/admin/change_password.php",
        fields,
        { withCredentials: true }
      );
      setAlert({
        type: response.data.success ? "success" : "error",
        message: response.data.message
      });
      if (response.data.success) setFields({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
    } catch (err) {
      setAlert({ type: "error", message: "Network error. Try again." });
    }
    setLoading(false);
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <div className="admin-profile">
          <div className="profile-icon">
            <i className="fas fa-user-shield"></i>
          </div>
          <h3>adminuser</h3>
          <p>Super Admin</p>
        </div>
        <nav className="admin-nav">
          <ul>
            <li>
              <a href="/admin-dashboard">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li>
              <a href="/admin-requests">
                <i className="fas fa-hand-holding-heart"></i> Donation Requests
              </a>
            </li>
            <li>
              <a href="/admin-users">
                <i className="fas fa-users-cog"></i> Admin Users
              </a>
            </li>
            <li>
              <a href="/donations-report">
                <i className="fas fa-chart-bar"></i> Donations Report
              </a>
            </li>
            <li className="active">
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
      <div className="main-content">
        <div className="header">
          <h1>
            <i className="fas fa-key"></i> Change Password
          </h1>
        </div>
        <div className="content-section">
          {alert.message && (
            <div className={`alert alert-${alert.type}`}>{alert.message}</div>
          )}
          <form className="change-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="current_password">Current Password</label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                value={fields.current_password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="new_password">New Password</label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={fields.new_password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm_password">Confirm New Password</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={fields.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
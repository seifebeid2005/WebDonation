import React, { useState } from "react";
import "./login.css";
import { login } from "../../../../functions/user/auth"; // Adjust the import path as necessary
import Loader from "../../../shared/Loader/Loader";
import Header from "../../../shared/Header/Header";
import Footer from "../../../shared/Footer/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const response = await login(email, password);
      if (response.success) {
        console.log("Login successful:", response);
        window.location.href = "/"; // Redirect to home page
      } else {
        console.error("Login failed:", response.message);

        setError(response.message);
        console.error("Login failed:", response);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <h2>Login</h2>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit">Login</button>
          <div className="switch-link">
            Don't have an account? <a href="/register">Register</a>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

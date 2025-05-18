import React, { useState } from "react";
import "./register.css";
import { register } from "../../../../functions/user/auth"; // Adjust the import path as necessary

export default function RegisterPage({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    register({ name, email, password })
      .then((user) => {
        setSuccess("Registration successful!");
        setName("");
        setEmail("");
        setPassword("");
        if (onRegister) onRegister(user);
      })
      .catch((err) => {
        setError(err.message || "Registration failed.");
      });
  };

  return (
    <div className="register-container">
      <form
        className="register-form"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2>Register</h2>
        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
        <button type="submit">Register</button>
        <div className="switch-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
}

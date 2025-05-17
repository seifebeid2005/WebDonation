import React, { useState } from "react";
import "./UserLogin.css"; // Paste your CSS here or import as a file
import { useNavigate } from "react-router-dom";
import Header from "../../shared/Header/Header";
import Footer from "../../shared/Footer/Footer";

const initialLogin = { email: "", password: "" };
const initialRegister = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function getPasswordStrength(password) {
  let strength = 0;
  if (password.match(/[a-z]+/)) strength += 1;
  if (password.match(/[A-Z]+/)) strength += 1;
  if (password.match(/[0-9]+/)) strength += 1;
  if (password.match(/[!@#$%^&*()]+/)) strength += 1;
  return strength;
}

export default function AuthPage() {
  const [rightPanel, setRightPanel] = useState(false);
  const [login, setLogin] = useState(initialLogin);
  const [register, setRegister] = useState(initialRegister);
  const [regErrors, setRegErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  const navigate = useNavigate();

  // Validation for register form
  const validateRegister = () => {
    const errors = {};
    if (!register.name.trim()) errors.name = "Please enter your full name";
    if (!register.email.match(/^[^@]+@[^@]+\.[^@]+$/))
      errors.email = "Please enter a valid email address";
    if (register.password.length < 8)
      errors.password = "Password must be at least 8 characters";
    if (register.password !== register.confirmPassword)
      errors.confirm = "Passwords do not match";
    return errors;
  };

  // Login form submit
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    if (!login.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setLoginError("Please enter a valid email address");
      return;
    }
    if (!login.password) {
      setLoginError("Please enter your password");
      return;
    }
    // TODO: Add real login logic
    alert("Logged in as " + login.email);
  };

  // Register form submit
  const handleRegister = (e) => {
    e.preventDefault();
    const errors = validateRegister();
    setRegErrors(errors);
    if (Object.keys(errors).length > 0) return;
    // TODO: Add real registration logic
    alert("Registered as " + register.email);
  };

  // Password strength color
  const strength = getPasswordStrength(register.password);
  const strengthColors = ["", "#fc8181", "#f6ad55", "#68d391", "#48bb78"];
  const strengthWidth = ["0%", "25%", "50%", "75%", "100%"];

  return (
    <>
      <Header />
      <div className="main-wrapper">
        <div
          className={`containerlogin${rightPanel ? " right-panel-active" : ""}`}
          id="container"
        >
          {/* Register */}
          <div className="form-container sign-up-container">
            <form autoComplete="off" onSubmit={handleRegister}>
              <h2>Create Account</h2>
              <span>or use your email for registration</span>
              <div className="input-group">
                <input
                  type="text"
                  name="register-name"
                  placeholder="Full Name"
                  value={register.name}
                  onChange={(e) =>
                    setRegister({ ...register, name: e.target.value })
                  }
                  required
                />
                <i className="fas fa-user"></i>
                <div
                  className="error-message"
                  style={{ display: regErrors.name ? "block" : "none" }}
                >
                  {regErrors.name}
                </div>
              </div>
              <div className="input-group">
                <input
                  type="email"
                  name="register-email"
                  placeholder="Email"
                  value={register.email}
                  onChange={(e) =>
                    setRegister({ ...register, email: e.target.value })
                  }
                  required
                />
                <i className="fas fa-envelope"></i>
                <div
                  className="error-message"
                  style={{ display: regErrors.email ? "block" : "none" }}
                >
                  {regErrors.email}
                </div>
              </div>
              <div className="input-group" style={{ position: "relative" }}>
                <input
                  type={showRegPassword ? "text" : "password"}
                  name="register-password"
                  id="password"
                  placeholder="Password"
                  value={register.password}
                  onChange={(e) =>
                    setRegister({ ...register, password: e.target.value })
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <i className="fas fa-lock"></i>
                <span
                  style={{
                    position: "absolute",
                    right: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#b5b5b5",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowRegPassword((s) => !s)}
                >
                  <i
                    className={`fas ${
                      showRegPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </span>
                <div
                  className="password-strength"
                  id="password-strength"
                  style={{
                    backgroundColor: strengthColors[strength],
                    width: strengthWidth[strength],
                  }}
                />
                <div
                  className="error-message"
                  style={{ display: regErrors.password ? "block" : "none" }}
                >
                  {regErrors.password}
                </div>
              </div>
              <div className="input-group" style={{ position: "relative" }}>
                <input
                  type={showRegConfirm ? "text" : "password"}
                  name="register-confirm"
                  id="confirm-password"
                  placeholder="Confirm Password"
                  value={register.confirmPassword}
                  onChange={(e) =>
                    setRegister({
                      ...register,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  autoComplete="new-password"
                />
                <i className="fas fa-check-circle"></i>
                <span
                  style={{
                    position: "absolute",
                    right: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#b5b5b5",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowRegConfirm((s) => !s)}
                >
                  <i
                    className={`fas ${
                      showRegConfirm ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </span>
                <div
                  className="error-message"
                  style={{ display: regErrors.confirm ? "block" : "none" }}
                >
                  {regErrors.confirm}
                </div>
              </div>
              <button type="submit">Create Account</button>
              <div className="form-toggle mobile-only">
                Already have an account?{" "}
                <a
                  href="#"
                  id="mobile-signin"
                  onClick={(e) => {
                    e.preventDefault();
                    setRightPanel(false);
                  }}
                >
                  Sign In
                </a>
              </div>
            </form>
          </div>

          {/* Login */}
          <div className="form-container sign-in-container">
            <form autoComplete="off" onSubmit={handleLogin}>
              <h2>Welcome Back</h2>
              <span>or sign in with your account</span>
              <div className="input-group">
                <input
                  type="email"
                  name="login-email"
                  placeholder="Email"
                  value={login.email}
                  onChange={(e) =>
                    setLogin({ ...login, email: e.target.value })
                  }
                  required
                />
                <i className="fas fa-envelope"></i>
              </div>
              <div className="input-group" style={{ position: "relative" }}>
                <input
                  type={showLoginPassword ? "text" : "password"}
                  name="login-password"
                  placeholder="Password"
                  value={login.password}
                  onChange={(e) =>
                    setLogin({ ...login, password: e.target.value })
                  }
                  required
                  autoComplete="current-password"
                />
                <i className="fas fa-lock"></i>
                <span
                  style={{
                    position: "absolute",
                    right: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#b5b5b5",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowLoginPassword((s) => !s)}
                >
                  <i
                    className={`fas ${
                      showLoginPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </span>
              </div>
              <a href="#" className="forgot-password">
                Forgot your password?
              </a>
              {loginError && (
                <div
                  className="error-message"
                  style={{ display: "block", marginBottom: 12 }}
                >
                  {loginError}
                </div>
              )}
              <button type="submit">Sign In</button>
              <div className="form-toggle mobile-only">
                Don't have an account?{" "}
                <a
                  href="#"
                  id="mobile-signup"
                  onClick={(e) => {
                    e.preventDefault();
                    setRightPanel(true);
                  }}
                >
                  Register
                </a>
              </div>
            </form>
          </div>

          {/* Overlay */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <div className="logo">
                  <i className="fas fa-hand-holding-heart"></i> DonateNow
                </div>
                <h1>Welcome Back!</h1>
                <p>
                  To continue your journey with us, please sign in with your
                  personal details
                </p>
                <button
                  className="ghost"
                  id="signIn"
                  type="button"
                  onClick={() => setRightPanel(false)}
                >
                  Sign In
                </button>
                <button
                  className="ghost"
                  style={{
                    marginTop: 18,
                    background: "#e53e3e",
                    color: "#fff",
                    border: "none",
                  }}
                  type="button"
                  onClick={() => navigate("/admin-signin")}
                >
                  <i className="fas fa-user-shield"></i> Admin Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <div className="logo">
                  <i className="fas fa-hand-holding-heart"></i> DonateNow
                </div>
                <h1>Hello, Friend!</h1>
                <p>
                  Enter your personal details and start your journey with us
                  today
                </p>
                <button
                  className="ghost"
                  id="signUp"
                  type="button"
                  onClick={() => setRightPanel(true)}
                >
                  Create Account
                </button>
                <button
                  className="ghost"
                  style={{
                    marginTop: 18,
                    background: "#e53e3e",
                    color: "#fff",
                    border: "none",
                  }}
                  type="button"
                  onClick={() => navigate("/admin-signin")}
                >
                  <i className="fas fa-user-shield"></i> Admin Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

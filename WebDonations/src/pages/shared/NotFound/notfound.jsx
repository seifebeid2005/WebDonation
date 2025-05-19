import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Start countdown and redirect
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    // Redirect after 5 seconds
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 5000);

    // Cleanup timers
    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-animation">
          <div className="planet"></div>
          <div className="astronaut">
            <div className="astronaut-helmet"></div>
            <div className="astronaut-body"></div>
            <div className="astronaut-pack"></div>
          </div>
          <div className="stars"></div>
        </div>

        <h1 className="not-found-title">
          <span>4</span>
          <span className="zero">0</span>
          <span>4</span>
        </h1>

        <h2 className="not-found-subtitle">Page Not Found</h2>

        <p className="not-found-description">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="not-found-redirect-message">
          Redirecting to homepage in{" "}
          <span className="countdown">{countdown}</span> seconds...
        </div>

        <div className="not-found-actions">
          <Link to="/" className="home-button">
            <span>Go Home Now</span>
            <svg width="13px" height="10px" viewBox="0 0 13 10">
              <path d="M1,5 L11,5"></path>
              <polyline points="8 1 12 5 8 9"></polyline>
            </svg>
          </Link>

          <Link to="/contact" className="help-button">
            Need Help?
          </Link>
        </div>
      </div>

      <div className="not-found-footer">
        <p>© {new Date().getFullYear()} HeartBridge. All rights reserved.</p>
      </div>
    </div>
  );
};

export default NotFound;

import React, { useState } from "react";
import "./Footer.css";

// Font Awesome CDN is loaded in index.html, but you can use react-icons for better React integration

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subMsg, setSubMsg] = useState("");

  const currentYear = new Date().getFullYear();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubMsg(""); // reset message
    if (!email) return setSubMsg("Please enter your email.");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setSubMsg("Thank you for subscribing!");
        setEmail("");
      } else {
        setSubMsg("Subscription failed. Please try again.");
      }
    } catch (e) {
      setSubMsg("An error occurred. Please try again later.");
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-wrapper">
        {/* Top section with logo and mission */}
        <div className="footer-top">
          <div className="footer-logo">
            <a href="/">
              <h4>Heart Bridge</h4>
            </a>
            <h3 className="footer-tagline">Making a difference together</h3>
          </div>
          <div className="footer-mission">
            <h4>Our Mission</h4>
            <p>
              We're dedicated to creating sustainable change through the power
              of collective giving. Every donation, no matter the size,
              contributes to our vision of a better world.
            </p>
          </div>
        </div>

        {/* Main footer content area */}
        <div className="footer-content">
          <div className="footer-column">
            <h4>Ways to Give</h4>
            <ul>
              <li>
                <a href="/donate">One-time Donation</a>
              </li>
              <li>
                <a href="/monthly-giving">Monthly Giving</a>
              </li>
              <li>
                <a href="/corporate">Corporate Partnerships</a>
              </li>
              <li>
                <a href="/planned-giving">Planned Giving</a>
              </li>
              <li>
                <a href="/fundraise">Start a Fundraiser</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>About Us</h4>
            <ul>
              <li>
                <a href="/our-story">Our Story</a>
              </li>
              <li>
                <a href="/impact">Our Impact</a>
              </li>
              <li>
                <a href="/team">Our Team</a>
              </li>
              <li>
                <a href="/financials">Financial Reports</a>
              </li>
              <li>
                <a href="/careers">Careers</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li>
                <a href="/blog">Blog</a>
              </li>
              <li>
                <a href="/faq">FAQ</a>
              </li>
              <li>
                <a href="/success-stories">Success Stories</a>
              </li>
              <li>
                <a href="/press">Press Room</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
            </ul>
          </div>

          <div className="footer-column footer-newsletter">
            <h4>Stay Connected</h4>
            <p>
              Subscribe to our newsletter for updates on our initiatives and
              impact stories.
            </p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Subscribe</button>
            </form>
            {subMsg && (
              <div className="newsletter-msg" style={{ marginTop: 6 }}>
                {subMsg}
              </div>
            )}
            <div className="social-icons">
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Impact counter section */}
        <div className="impact-counter">
          <div className="counter-item">
            <span className="counter-number">183648+</span>
            <span className="counter-label">Donors</span>
          </div>
          <div className="counter-item">
            <span className="counter-number">250+</span>
            <span className="counter-label">Projects</span>
          </div>
          <div className="counter-item">
            <span className="counter-number">43</span>
            <span className="counter-label">Countries</span>
          </div>
          <div className="counter-item">
            <span className="counter-number">5M+</span>
            <span className="counter-label">Raised</span>
          </div>
        </div>

        {/* Trust badges and certifications (optional) */}

        {/* Bottom section with copyright and legal links */}
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} Your Organization Name. All rights reserved.
          </p>
          <div className="legal-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/accessibility">Accessibility</a>
            <a href="/sitemap">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

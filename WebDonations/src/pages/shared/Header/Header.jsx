import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.css";
import DarkModeButton from "../darkmodebutton/darkmodebutton";

const Header = ({ activePage, user = null }) => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY) {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div id="header" className={!showHeader ? "hidden" : ""}>
      <div id="wrapper">
        <div id="header-content">
          <Link id="logo" to="/">
            Heart<span className="brand-highlight">Bridge</span>
          </Link>

          {/* Add the dark mode toggle here */}
          <div style={{ marginLeft: "auto", marginRight: "20px" }}>
            <DarkModeButton />
          </div>

          <div id="navigation">
            <ul id="main-menu">
              <li>
                <Link to="/" className={activePage === "home" ? "active" : ""}>Home</Link>
              </li>
              <li>
                <Link to="/about-us" className={activePage === "about" ? "active" : ""}>About</Link>
              </li>
              <li>
                <Link to="/causes" className={activePage === "donate" ? "active" : ""}>Donate</Link>
              </li>
              <li>
                <Link to="/contact" className={activePage === "contact" ? "active" : ""}>Contact</Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link to="/RequestAddingCause" className={activePage === "request" ? "active" : ""}>Request Adding</Link>
                  </li>
                  <li>
                    <Link to="/profile" className={activePage === "profile" ? "active" : ""}>Profile</Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className={activePage === "login" ? "active" : ""}>Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

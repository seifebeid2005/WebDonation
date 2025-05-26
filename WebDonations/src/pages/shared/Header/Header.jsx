import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "./Header.css";
import DarkModeButton from "../darkmodebutton/darkmodebutton";
import { getUserData, logout } from "../../../functions/user/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faHandHoldingHeart,
  faEnvelope,
  faUser,
  faPlusCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const Header = ({ activePage }) => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userData, setUser] = useState(null);

  // Hide header on scroll down
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

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const res = await getUserData();
      setUser(res?.success ? res.user : null);
    };
    fetchUserData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = async (e) => {
    e.preventDefault();
    const response = await logout();
    if (response) {
      window.location.href = "/";
    }
  };

  return (
    <>
      <div id="header" className={!showHeader ? "hidden" : ""}>
        <div id="wrapper">
          <div id="header-content">
            <Link id="logo" to="/">
              Heart<span className="brand-highlight">Bridge</span>
            </Link>

            <div style={{ marginLeft: "auto", marginRight: "20px" }}>
              <DarkModeButton />
            </div>

            <div id="navigation">
              <ul id="main-menu">
                <li>
                  <Link
                    to="/"
                    className={activePage === "home" ? "active" : ""}
                  >
                    <FontAwesomeIcon icon={faHome} className="nav-icon" /> Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about-us"
                    className={activePage === "about" ? "active" : ""}
                  >
                    <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />{" "}
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/causes"
                    className={
                      activePage === "donate" || activePage === "causes"
                        ? "active"
                        : ""
                    }
                  >
                    <FontAwesomeIcon
                      icon={faHandHoldingHeart}
                      className="nav-icon"
                    />{" "}
                    Donate
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className={activePage === "contact" ? "active" : ""}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="nav-icon" />{" "}
                    Contact
                  </Link>
                </li>

                {userData ? (
                  <li className="user-profile-container" ref={dropdownRef}>
                    <button
                      className={`user-profile-icon ${
                        dropdownOpen ? "active" : ""
                      }`}
                      onClick={toggleDropdown}
                      aria-haspopup="true"
                      aria-expanded={dropdownOpen}
                    >
                      {userData.avatar ? (
                        <img src={userData.avatar} alt="User avatar" />
                      ) : (
                        <div className="user-initial">
                          {userData.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>
                    {dropdownOpen && (
                      <div className="dropdown-menu">
                        <div className="dropdown-header">
                          <div className="dropdown-user-info">
                            <p className="dropdown-user-name">
                              {userData.name || "User"}
                            </p>
                            <p className="dropdown-user-email">
                              {userData.email || ""}
                            </p>
                          </div>
                        </div>
                        <ul>
                          <li>
                            <Link
                              to="/profile"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <FontAwesomeIcon icon={faUser} /> Profile
                            </Link>
                          </li>
                          {/* <li>
                            <Link
                              to="/my-donations"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <FontAwesomeIcon icon={faHeart} /> My Donations
                            </Link>
                          </li> */}
                          <li>
                            <Link
                              to="/RequestAddingCause"
                              className={
                                activePage === "request" ? "active" : ""
                              }
                              onClick={() => setDropdownOpen(false)}
                            >
                              <FontAwesomeIcon icon={faPlusCircle} /> Request
                              Adding
                            </Link>
                          </li>
                          {/* <li>
                            <Link
                              to="/settings"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <FontAwesomeIcon icon={faCog} /> Settings
                            </Link>
                          </li> */}
                          <li className="dropdown-divider"></li>
                          <li>
                            <a
                              href="/logout"
                              className="logout-link"
                              onClick={handleLogout}
                            >
                              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      className={activePage === "login" ? "active" : ""}
                    >
                      <span className="login-button">
                        <FontAwesomeIcon icon={faUser} /> Login
                      </span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="header-spacer"></div>
    </>
  );
};

export default Header;

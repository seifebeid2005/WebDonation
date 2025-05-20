import { Link } from "react-router-dom";
import { useEffect, useState, useRef, use } from "react";
import "./Header.css";
import DarkModeButton from "../darkmodebutton/darkmodebutton";
import { getUserData } from "../../../functions/user/auth";
// Import Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faHandHoldingHeart,
  faEnvelope,
  faUser,
  faHeart,
  faPlusCircle,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const Header = ({ activePage }) => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userData, setUser] = useState({
    id: "",
    name: "",
    email: "",
    status: "",
    created_at: "",
    updated_at: "",
  });
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

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      if (userData.success) {
        setUser(userData.user);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <>
      <div id="header" className={!showHeader ? "hidden" : ""}>
        <div id="wrapper">
          <div id="header-content">
            <Link id="logo" to="/">
              Heart<span className="brand-highlight">Bridge</span>
            </Link>

            {/* Dark Mode Toggle */}
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
                  <>
                    <li className="user-profile-container" ref={dropdownRef}>
                      <div
                        className={`user-profile-icon ${
                          dropdownOpen ? "active" : ""
                        }`}
                        onClick={toggleDropdown}
                      >
                        {userData.avatar ? (
                          <img src={userData.avatar} alt="User avatar" />
                        ) : (
                          <div className="user-initial">
                            {userData.name
                              ? userData.name.charAt(0).toUpperCase()
                              : ""}
                          </div>
                        )}
                      </div>
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
                              <Link to="/profile">
                                <FontAwesomeIcon icon={faUser} /> Profile
                              </Link>
                            </li>
                            <li>
                              <Link to="/my-donations">
                                <FontAwesomeIcon icon={faHeart} /> My Donations
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/RequestAddingCause"
                                className={
                                  activePage === "request" ? "active" : ""
                                }
                              >
                                <FontAwesomeIcon icon={faPlusCircle} /> Request
                                Adding
                              </Link>
                            </li>
                            <li>
                              <Link to="/settings">
                                <FontAwesomeIcon icon={faCog} /> Settings
                              </Link>
                            </li>
                            <li className="dropdown-divider"></li>
                            <li>
                              <Link to="/logout" className="logout-link">
                                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                              </Link>
                            </li>
                          </ul>
                        </div>
                      )}
                    </li>
                  </>
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
      <br />
      <br />
    </>
  );
};

export default Header;

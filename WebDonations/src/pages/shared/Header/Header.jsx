import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div id="header">
      <div id="wrapper">
        <div id="header-content">
          <Link id="logo" to="/">
            Heart<span className="brand-highlight">Bridge</span>
          </Link>
          <div id="navigation">
            <ul id="main-menu">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about-us">About</Link>
              </li>
              <li>
                <Link to="/causes">Donate</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <>
                <li>
                  <Link to="/RequestAddingCause">Request Adding</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
              </>

              <li>
                <Link to="/auth">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

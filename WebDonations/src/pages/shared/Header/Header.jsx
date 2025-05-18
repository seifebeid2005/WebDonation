import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Header.css";
import { getUserId } from "../../../functions/user/auth";
import Loader from "../Loader/Loader";

const Header = () => {
  const [user, setUser] = useState(null);
  const [isloading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await getUserId();
        if (response.status) {
          setUser(response.user_id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

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
              {user ? (
                <>
                  <li>
                    <Link to="/RequestAddingCause">Request Adding</Link>
                  </li>
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/auth">Login</Link>
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

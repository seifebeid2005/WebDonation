import React, { useState, useEffect } from "react";
import { getProfile } from "../../../functions/user/profile";
import { logout } from "../../../functions/user/auth";
import "./UserProfile.css";
import Header from "../../shared/Header/Header";
import Footer from "../../shared/Footer/Footer";
import Loader from "../../shared/Loader/Loader";
import styled from "styled-components";

// Logout Button Component
const LogoutButton = ({ onClick }) => {
  return (
    <StyledLogoutWrapper>
      <button className="Btn" onClick={onClick}>
        <div className="sign">
          <svg viewBox="0 0 512 512">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
          </svg>
        </div>
        <div className="text">Logout</div>
      </button>
    </StyledLogoutWrapper>
  );
};

const StyledLogoutWrapper = styled.div`
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
    background-color: #ff4141;
  }

  .sign {
    width: 100%;
    transition-duration: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign svg {
    width: 17px;
  }

  .sign svg path {
    fill: white;
  }

  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 1.2em;
    font-weight: 600;
    transition-duration: 0.3s;
  }

  .Btn:hover {
    width: 125px;
    border-radius: 40px;
  }

  .Btn:hover .sign {
    width: 30%;
    padding-left: 20px;
  }

  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    padding-right: 10px;
  }

  .Btn:active {
    transform: translate(2px, 2px);
  }
`;

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    status: "",
    created_at: "",
    updated_at: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getProfile();
        const data = response.data || response;
        setProfile(data.user || data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  if (isLoading && !profile.name && !profile.email) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <>
      <Header user={profile} />
      <div className="profile-container">
        <h2>User Profile</h2>
        <div className="profile-view">
          <div className="profile-field">
            <label>Name:</label>
            <span>{profile.name}</span>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>
          <div className="profile-field">
            <label>Account Status:</label>
            <span>{profile.status}</span>
          </div>
          <div className="profile-field">
            <label>Member Since:</label>
            <span>
              {profile.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : ""}
            </span>
          </div>
          <div className="profile-field">
            <label>Last Updated:</label>
            <span>
              {profile.updated_at
                ? new Date(profile.updated_at).toLocaleDateString()
                : ""}
            </span>
          </div>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <LogoutButton onClick={handleLogout} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;

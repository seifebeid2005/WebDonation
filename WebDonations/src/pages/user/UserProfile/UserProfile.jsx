import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../../../functions/user/profile";
import "./UserProfile.css";
import Header from "../../shared/Header/Header";
import Footer from "../../shared/Footer/Footer";

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

  // Fetch user profile on mount
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

  if (isLoading && !profile.name && !profile.email) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <>
      <Header />
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
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;

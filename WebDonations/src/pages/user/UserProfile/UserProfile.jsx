// src/components/UserProfile/UserProfile.jsx
import { useState, useEffect } from "react";
import {
  getProfile,
  updateProfile,
  deactivateAccount,
} from "../../../functions/user/profile/";
import "./UserProfile.css"; // We'll create this next

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    status: "",
    created_at: "",
    updated_at: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getProfile();
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
        });
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await updateProfile(formData);
      setProfile(response.data);
      setEditMode(false);
      setSuccessMessage("Profile updated successfully!");
      setError(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (
      window.confirm(
        "Are you sure you want to deactivate your account? This action cannot be undone."
      )
    ) {
      try {
        setIsLoading(true);
        await deactivateAccount();
        // Redirect to login or home page after deactivation
        window.location.href = "/login";
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }
  };

  if (isLoading && !profile.id) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {error && <div className="error-message">{error}</div>}

      {!editMode ? (
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
            <span>{new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
          <div className="profile-field">
            <label>Last Updated:</label>
            <span>{new Date(profile.updated_at).toLocaleDateString()}</span>
          </div>

          <div className="profile-actions">
            <button onClick={() => setEditMode(true)} className="edit-button">
              Edit Profile
            </button>
            <button onClick={handleDeactivate} className="deactivate-button">
              Deactivate Account
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isLoading} className="save-button">
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setFormData({
                  name: profile.name,
                  email: profile.email,
                });
              }}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;

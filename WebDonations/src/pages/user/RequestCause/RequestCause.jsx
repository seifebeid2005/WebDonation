import React, { useState, useEffect } from "react";
import "./RequestCause.css";
import Footer from "../../shared/Footer/Footer";
import Header from "../../shared/Header/Header";
import {
  createCauseRequest,
  getAllCauseRequests,
} from "../../../functions/user/RegquestCauses";

export default function RequestAddingCause({ userId = "" }) {
  const [form, setForm] = useState({
    user_id: userId,
    title: "",
    description: "",
    image_url: "",
    requested_amount: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // For showing previous requests
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [errorRequests, setErrorRequests] = useState("");

  // Fetch all my requests on mount and after new submission
  const loadRequests = async () => {
    setLoadingRequests(true);
    setErrorRequests("");
    try {
      const response = await getAllCauseRequests();
      // The API returns { success, message, causes }
      const data = response.causes || [];
      setMyRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorRequests(
        err?.message?.message || err?.message || "Failed to load your requests."
      );
    }
    setLoadingRequests(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Handle input/text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // Handle image file upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setForm((prev) => ({ ...prev, image_url: ev.target.result }));
    reader.readAsDataURL(file);
    setError("");
  };

  // Submit the cause request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!form.title || !form.description || !form.requested_amount) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      await createCauseRequest({
        title: form.title,
        description: form.description,
        image_url: form.image_url,
        requested_amount: form.requested_amount,
      });
      setSubmitted(true);
      setForm({
        user_id: userId,
        title: "",
        description: "",
        image_url: "",
        requested_amount: "",
      });
      loadRequests(); // Refresh requests after submission
    } catch (err) {
      setError(
        err?.message?.message ||
          err?.message ||
          "Failed to submit request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="request-cause-container">
        <div className="request-cause-card">
          <h2 className="request-cause-title">
            <i className="fas fa-plus-circle"></i> Request a New Cause
          </h2>
          {submitted ? (
            <div className="request-cause-success">
              <i className="fas fa-check-circle"></i>
              <h3>Thank you!</h3>
              <p>Your cause request has been submitted for review.</p>
              <button
                className="btn-submit"
                onClick={() => setSubmitted(false)}
                style={{ marginTop: "1rem" }}
              >
                Add Another Request
              </button>
            </div>
          ) : (
            <form
              className="request-cause-form"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <input type="hidden" name="user_id" value={form.user_id} />
              <div className="form-group">
                <label htmlFor="title">
                  <i className="fas fa-heading"></i> Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter cause title"
                  maxLength={80}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">
                  <i className="fas fa-align-left"></i> Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe your cause..."
                  rows={4}
                  maxLength={800}
                />
              </div>
              <div className="form-group">
                <label htmlFor="image_url">
                  <i className="fas fa-image"></i> Image
                </label>
                <input
                  type="file"
                  id="image_url"
                  name="image_url"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {form.image_url && (
                  <div className="preview-img-wrap">
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="preview-img"
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="requested_amount">
                  <i className="fas fa-dollar-sign"></i> Requested Amount (USD)
                </label>
                <input
                  type="number"
                  name="requested_amount"
                  id="requested_amount"
                  value={form.requested_amount}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="form-actions">
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="request-cause-card" style={{ marginTop: "2rem" }}>
          <h2 className="request-cause-title">
            <i className="fas fa-list"></i> My Previous Requests
          </h2>
          {loadingRequests ? (
            <div>Loading your requests...</div>
          ) : errorRequests ? (
            <div className="error-message">{errorRequests}</div>
          ) : myRequests.length === 0 ? (
            <div>No requests found.</div>
          ) : (
            <ul className="request-list">
              {myRequests.map((req) => (
                <li key={req.id} className="request-list-item">
                  <div className="request-list-header">
                    <strong>{req.title}</strong> -{" "}
                    <span
                      className={`status status-${req.status?.toLowerCase()}`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <div>{req.description}</div>
                  <div>
                    Requested: <b>${req.requested_amount}</b>
                  </div>
                  {req.image_url && (
                    <div className="preview-img-wrap">
                      <img
                        src={req.image_url}
                        alt={req.title}
                        className="preview-img"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

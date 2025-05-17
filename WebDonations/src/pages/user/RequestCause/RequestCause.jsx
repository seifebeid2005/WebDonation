import React, { useState } from "react";
import "./RequestCause.css";
import Footer from "../../shared/Footer/Footer";
import Header from "../../shared/Header/Header";

export default function RequestAddingCause({ userId = "" }) {
  const [form, setForm] = useState({
    user_id: userId,
    title: "",
    description: "",
    image_url: "",
    requested_amount: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setForm((prev) => ({ ...prev, image_url: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you would submit the form to your backend
    setSubmitted(true);
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
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  <i className="fas fa-paper-plane"></i> Submit Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

import React, { useState, useRef } from "react";
import "./AdminDashboard.css";

// Dummy data for demonstration
const admin = {
  username: "adminuser",
  role: "super_admin",
};
const initialCauses = [
  {
    id: 1,
    title: "Clean Water for All",
    category: "environment",
    goalAmount: 10000,
    raisedAmount: 3500,
    currency: "USD",
    isActive: true,
    isFeatured: true,
    createdAt: new Date("2024-05-01 10:00"),
    imageUrl: "",
    progressPercentage: 35,
    shortDescription: "Bring clean water to remote villages.",
    description: "Full project details.",
    startDate: "2024-05-01",
    endDate: "2024-07-01",
  },
  {
    id: 2,
    title: "School Supplies Drive",
    category: "education",
    goalAmount: 5000,
    raisedAmount: 5000,
    currency: "USD",
    isActive: true,
    isFeatured: false,
    createdAt: new Date("2024-04-10 15:30"),
    imageUrl: "",
    progressPercentage: 100,
    shortDescription: "Help provide school supplies.",
    description: "Full project details.",
    startDate: "2024-04-10",
    endDate: "",
  },
];

// Helper for formatting date
const formatDate = (date) => {
  if (!date) return "";
  if (typeof date === "string") date = new Date(date);
  return date.toISOString().slice(0, 16).replace("T", " ");
};

// Helper for formatting currency
const formatCurrency = (amount, currency = "USD") => {
  return (
    currency +
    " " +
    Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

function AdminDashboard() {
  // Dashboard state
  const [causes, setCauses] = useState(initialCauses);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editingCause, setEditingCause] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [form, setForm] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const formRef = useRef();

  // Stats
  const totalRaised = causes.reduce((sum, c) => sum + c.raisedAmount, 0);
  const donorCount = 12 + causes.length * 5;

  // Modal open/close
  const openAddCauseModal = () => {
    setModalMode("add");
    setForm({});
    setEditingCause(null);
    setImagePreview(null);
    setShowModal(true);
  };
  const openEditCauseModal = (cause) => {
    setModalMode("edit");
    setEditingCause(cause);
    setForm({ ...cause });
    setImagePreview(cause.imageUrl || null);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  // Form change
  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      if (files && files[0]) {
        setForm((f) => ({ ...f, image: files[0] }));
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(files[0]);
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // Add/Edit submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Demo validation
    if (!form.title || !form.shortDescription || !form.goalAmount) {
      setAlert({ type: "error", message: "Please fill required fields." });
      return;
    }
    if (modalMode === "add") {
      setCauses((prev) => [
        ...prev,
        {
          ...form,
          id: prev.length ? Math.max(...prev.map((c) => c.id)) + 1 : 1,
          raisedAmount: 0,
          createdAt: new Date(),
          progressPercentage: 0,
          imageUrl: imagePreview,
        },
      ]);
      setAlert({ type: "success", message: "Cause added successfully!" });
    } else {
      setCauses((prev) =>
        prev.map((c) =>
          c.id === editingCause.id
            ? { ...c, ...form, imageUrl: imagePreview }
            : c
        )
      );
      setAlert({ type: "success", message: "Cause updated successfully!" });
    }
    setShowModal(false);
  };

  // Delete cause
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const handleDelete = () => {
    setCauses((prev) => prev.filter((c) => c.id !== deleteId));
    setShowDeleteModal(false);
    setAlert({ type: "success", message: "Cause deleted successfully!" });
  };

  // Remove image preview
  const removeImagePreview = () => {
    setImagePreview(null);
    setForm((f) => ({ ...f, image: null, imageUrl: "" }));
    if (formRef.current) formRef.current.reset();
  };

  // Progress percent helper
  const getProgress = (cause) =>
    cause.goalAmount
      ? Math.min(100, (cause.raisedAmount / cause.goalAmount) * 100)
      : 0;

  // Modal overlay click
  const handleOverlayClick = (e) => {
    if (e.target.className === "modal") {
      setShowModal(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="admin-profile">
          <div className="profile-icon">
            <i className="fas fa-user-shield"></i>
          </div>
          <h3>{admin.username}</h3>
          <p>{admin.role === "super_admin" ? "Super Admin" : "Admin"}</p>
        </div>
        <nav className="admin-nav">
          <ul>
            <li className="active">
              <a href="/admin-dashboard">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li>
              <a href="/admin-users">
                <i className="fas fa-users-cog"></i> Admin Users
              </a>
            </li>
            <li>
              <a href="/donations-report">
                <i className="fas fa-chart-bar"></i> Donations Report
              </a>
            </li>
            <li>
              <a href="/change-password">
                <i className="fas fa-key"></i> Change Password
              </a>
            </li>
          </ul>
        </nav>
        <div className="logout-section">
          <a href="/admin-logout" className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>
            <i className="fas fa-tachometer-alt"></i> Dashboard Overview
          </h1>
          <div className="stats-summary">
            <div className="stat-card">
              <i className="fas fa-hand-holding-heart"></i>
              <div>
                <h3>{causes.length}</h3>
                <p>Active Causes</p>
              </div>
            </div>
            <div className="stat-card">
              <i className="fas fa-dollar-sign"></i>
              <div>
                <h3>{formatCurrency(totalRaised)}</h3>
                <p>Total Raised</p>
              </div>
            </div>
            <div className="stat-card">
              <i className="fas fa-users"></i>
              <div>
                <h3>{donorCount}</h3>
                <p>Donors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alert.message && (
          <div className={`alert alert-${alert.type}`}>
            <i
              className={
                alert.type === "success"
                  ? "fas fa-check-circle"
                  : "fas fa-exclamation-circle"
              }
            />{" "}
            {alert.message}
            <span
              className="close-btn"
              onClick={() => setAlert({ type: "", message: "" })}
            >
              &times;
            </span>
          </div>
        )}

        <div className="content-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-hand-holding-heart"></i> Current Causes
            </h2>
            <button className="btn btn-primary" onClick={openAddCauseModal}>
              <i className="fas fa-plus"></i> Add New Cause
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Goal Amount</th>
                  <th>Raised</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {causes.length ? (
                  causes.map((cause) => (
                    <tr key={cause.id}>
                      <td>{cause.id}</td>
                      <td>
                        <div className="cause-title">
                          {cause.imageUrl ? (
                            <img
                              src={cause.imageUrl}
                              alt={cause.title}
                              className="cause-thumbnail"
                            />
                          ) : (
                            <div className="cause-thumbnail placeholder">
                              <i className="fas fa-image"></i>
                            </div>
                          )}
                          <span>{cause.title}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-category">
                          {cause.category}
                        </span>
                      </td>
                      <td>
                        {formatCurrency(cause.goalAmount, cause.currency)}
                      </td>
                      <td>
                        {formatCurrency(cause.raisedAmount, cause.currency)}
                      </td>
                      <td>
                        <div className="progress-container">
                          <div
                            className="progress-bar"
                            style={{ width: `${getProgress(cause)}%` }}
                          ></div>
                          <span className="progress-text">
                            {getProgress(cause).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={
                            "badge " +
                            (cause.isActive ? "badge-success" : "badge-warning")
                          }
                        >
                          {cause.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {cause.isFeatured ? (
                          <i className="fas fa-star featured-icon"></i>
                        ) : (
                          <i className="far fa-star"></i>
                        )}
                      </td>
                      <td>{formatDate(cause.createdAt)}</td>
                      <td className="actions">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => openEditCauseModal(cause)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => confirmDelete(cause.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="no-data">
                      <i className="fas fa-info-circle"></i> No causes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Cause Modal */}
      {showModal && (
        <div className="modal" onClick={handleOverlayClick}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 id="modalTitle">
                <i
                  className={
                    modalMode === "add" ? "fas fa-plus-circle" : "fas fa-edit"
                  }
                ></i>{" "}
                {modalMode === "add" ? "Add New Cause" : "Edit Cause"}
              </h3>
              <span className="close-btn" onClick={closeModal}>
                &times;
              </span>
            </div>
            <div className="modal-body">
              <form
                ref={formRef}
                className="form-grid"
                onSubmit={handleFormSubmit}
                encType="multipart/form-data"
              >
                <div className="form-group">
                  <label htmlFor="title">
                    <i className="fas fa-heading"></i> Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    placeholder="Enter cause title"
                    value={form.title || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="shortDescription">
                    <i className="fas fa-align-left"></i> Short Description
                  </label>
                  <input
                    type="text"
                    id="shortDescription"
                    name="shortDescription"
                    required
                    maxLength={100}
                    placeholder="Brief description (max 100 chars)"
                    value={form.shortDescription || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="description">
                    <i className="fas fa-align-left"></i> Full Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    placeholder="Detailed description of the cause"
                    value={form.description || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="goalAmount">
                    <i className="fas fa-bullseye"></i> Goal Amount
                  </label>
                  <input
                    type="number"
                    id="goalAmount"
                    name="goalAmount"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    value={form.goalAmount || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="currency">
                    <i className="fas fa-money-bill-wave"></i> Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    required
                    value={form.currency || "USD"}
                    onChange={handleFormChange}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="EGP">EGP (E£)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="category">
                    <i className="fas fa-tag"></i> Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={form.category || "education"}
                    onChange={handleFormChange}
                  >
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="environment">Environment</option>
                    <option value="animals">Animals</option>
                    <option value="poverty">Poverty Alleviation</option>
                    <option value="disaster">Disaster Relief</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group" id="imageUploadGroup">
                  <label htmlFor="image">
                    <i className="fas fa-image"></i> Cause Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={handleFormChange}
                  />
                  {imagePreview && (
                    <div
                      id="imagePreviewContainer"
                      style={{ display: "block", marginTop: 10 }}
                    >
                      <img
                        id="imagePreview"
                        src={imagePreview}
                        alt="Image Preview"
                        style={{ maxWidth: "200px", maxHeight: "150px" }}
                      />
                      <button
                        type="button"
                        className="btn btn-small btn-secondary"
                        onClick={removeImagePreview}
                        style={{ marginTop: 5 }}
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="startDate">
                    <i className="fas fa-calendar-alt"></i> Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    value={form.startDate || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endDate">
                    <i className="fas fa-calendar-alt"></i> End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={form.endDate || ""}
                    onChange={handleFormChange}
                  />
                  <small className="form-text">
                    Leave empty for ongoing causes
                  </small>
                </div>
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="featured"
                    name="isFeatured"
                    checked={!!form.isFeatured}
                    onChange={handleFormChange}
                  />
                  <label htmlFor="featured">
                    <i className="fas fa-star"></i> Featured Cause
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={form.isActive !== false}
                    onChange={handleFormChange}
                  />
                  <label htmlFor="isActive">
                    <i className="fas fa-power-off"></i> Active
                  </label>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    id="submitBtn"
                  >
                    {modalMode === "add" ? "Add Cause" : "Update Cause"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <div className="modal" onClick={handleOverlayClick}>
          <div className="modal-content" style={{ maxWidth: "500px" }}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-exclamation-triangle"></i> Confirm Deletion
              </h3>
              <span
                className="close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                &times;
              </span>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete this cause? This action cannot
                be undone.
              </p>
              <p>
                All associated donations will be preserved but marked as for a
                deleted cause.
              </p>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete Cause
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

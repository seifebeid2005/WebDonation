import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const API_BASE_URL =
  "http://localhost/WebDonation/Backend/admin/causes.php";

// Dummy data for demonstration
const admin = {
  username: "adminuser",
  role: "super_admin",
};

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
  const [causes, setCauses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editingCause, setEditingCause] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [form, setForm] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const formRef = useRef();

  // Fetch causes on component mount
  useEffect(() => {
    fetchCauses();
  }, []);

  const fetchCauses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL, { withCredentials: true });
      let responseData = response.data;
      if (typeof responseData === "string") {
        responseData = responseData.replace(/^\uFEFF/, "");
        responseData = JSON.parse(responseData);
      }
      if (responseData.success === false) {
        throw new Error(responseData.message || "Failed to fetch causes");
      }
      // Store backend field names directly
      setCauses(responseData.data || []);
      setAlert({ type: "", message: "" });
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to fetch causes. Please try again.",
      });
      setCauses([]);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const totalRaised = causes.reduce((sum, c) => sum + c.raisedAmount, 0);
  const donorCount = 12 + causes.length * 5;

  // Modal open/close
  const openAddCauseModal = () => {
    setModalMode("add");
    setForm({
      title: "",
      description: "",
      short_description: "",
      image_url: "",
      goalAmount: "",
      raisedAmount: "",
      currency: "USD",
      category: "",
      startDate: "",
      endDate: "",
      isFeatured: 0,
      isActive: 1,
      status: "pending",
    });
    setEditingCause(null);
    setShowModal(true);
  };

  const openEditCauseModal = (cause) => {
    setModalMode("edit");
    setEditingCause(cause);
    setForm({
      title: cause.title || "",
      description: cause.description || "",
      short_description: cause.short_description || "",
      image_url: cause.image_url || "",
      goal_amount: cause.goal_amount !== undefined ? cause.goal_amount : "",
      raised_amount:
        cause.raised_amount !== undefined ? cause.raised_amount : "",
      currency: cause.currency || "USD",
      category: cause.category || "",
      start_date: cause.start_date || "",
      end_date: cause.end_date || "",
      is_featured: cause.is_featured !== undefined ? cause.is_featured : 0,
      is_active: cause.is_active !== undefined ? cause.is_active : 1,
      status: ["pending", "active", "closed"].includes(cause.status)
        ? cause.status
        : "pending",
      created_at: cause.created_at ? formatDate(cause.created_at) : "",
      updated_at: cause.updated_at ? formatDate(cause.updated_at) : "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // Form change
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked ? 1 : 0 }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // Add/Edit submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.goal_amount) {
      setAlert({
        type: "error",
        message: "Please fill required fields (title, goal amount).",
      });
      return;
    }
    try {
      const causeData = {
        action: modalMode === "add" ? "add" : "edit",
        title: form.title,
        description: form.description,
        short_description: form.short_description,
        image_url: form.image_url,
        goal_amount: parseFloat(form.goal_amount),
        raised_amount: parseFloat(form.raised_amount) || 0,
        currency: form.currency,
        category: form.category,
        start_date: form.startDate || null,
        end_date: form.endDate || null,
        is_featured: form.isFeatured ? 1 : 0,
        is_active: form.isActive ? 1 : 0,
        status: form.status,
      };
      if (modalMode === "edit") {
        causeData.id = editingCause.id;
        causeData.created_at = form.createdAt;
        causeData.updated_at = form.updatedAt;
      }
      const response = await axios.post(API_BASE_URL, causeData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      let responseData = response.data;
      if (typeof responseData === "string") {
        responseData = responseData.replace(/^\uFEFF/, "");
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          throw new Error("Server returned invalid response");
        }
      }
      if (responseData.success) {
        setAlert({
          type: "success",
          message:
            responseData.message ||
            (modalMode === "add"
              ? "Cause added successfully!"
              : "Cause updated successfully!"),
        });
        setShowModal(false);
        fetchCauses();
      } else {
        throw new Error(
          responseData.message || "Operation failed. Please try again."
        );
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to save cause. Please try again.",
      });
    }
  };

  // Delete cause
  const confirmDelete = (id) => {
    if (!id) return;
    console.log("Confirming delete for ID:", id);
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    const idToDelete = deleteId;
    if (!idToDelete) {
      console.log("No delete ID set");
      return;
    }

    try {
      const response = await axios.post(
        API_BASE_URL,
        {
          action: "delete",
          id: idToDelete,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let responseData = response.data;
      if (typeof responseData === "string") {
        responseData = responseData.replace(/^\uFEFF/, "");
        responseData = JSON.parse(responseData);
      }

      if (responseData.success) {
        // Update the causes list immediately
        setCauses((prevCauses) =>
          prevCauses.filter((cause) => cause.id !== idToDelete)
        );

        // Show success message
        setAlert({
          type: "success",
          message: responseData.message || "Cause deleted successfully!",
        });

        // Close modal and reset state
        setShowDeleteModal(false);
        setDeleteId(null);

        // Refresh the causes list from the server
        await fetchCauses();
      } else {
        throw new Error(
          responseData.message || "Failed to delete cause. Please try again."
        );
      }
    } catch (error) {
      console.error("Error deleting cause:", error);
      setAlert({
        type: "error",
        message: error.message || "Failed to delete cause. Please try again.",
      });
      // Reset delete state on error
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  // Update the delete button in the table
  const renderDeleteButton = (causeId) => (
    <button
      className="btn-action btn-delete"
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        confirmDelete(causeId);
      }}
    >
      <i className="fas fa-trash"></i> Delete
    </button>
  );

  // Remove image preview
  const removeImagePreview = () => {
    setImagePreview(null);
    setForm((f) => ({ ...f, image: null, imageUrl: "" }));
    if (formRef.current) formRef.current.reset();
  };

  // Progress percent helper
  const getProgress = (cause) =>
    cause.goal_amount
      ? Math.min(100, (cause.raised_amount / cause.goal_amount) * 100)
      : 0;

  // Modal overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading causes...</p>
      </div>
    );
  }

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
              <a href="/admin-requests">
                <i className="fas fa-hand-holding-heart"></i> Donation Requests
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
                        {formatCurrency(cause.goal_amount, cause.currency)}
                      </td>
                      <td>
                        {formatCurrency(cause.raised_amount, cause.currency)}
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
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            openEditCauseModal(cause);
                          }}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        {renderDeleteButton(cause.id)}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
              >
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={form.title || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    value={form.description || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="short_description">Short Description</label>
                  <input
                    type="text"
                    id="short_description"
                    name="short_description"
                    value={form.short_description || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="image_url">Image URL</label>
                  <input
                    type="text"
                    id="image_url"
                    name="image_url"
                    value={form.image_url || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="goal_amount">Goal Amount</label>
                  <input
                    type="number"
                    id="goal_amount"
                    name="goal_amount"
                    step="0.01"
                    min="0"
                    required
                    value={form.goal_amount || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="raised_amount">Raised Amount</label>
                  <input
                    type="number"
                    id="raised_amount"
                    name="raised_amount"
                    step="0.01"
                    min="0"
                    value={form.raised_amount || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="currency">Currency</label>
                  <input
                    type="text"
                    id="currency"
                    name="currency"
                    value={form.currency || "USD"}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={form.category || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={form.startDate || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={form.endDate || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="isFeatured">Is Featured</label>
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={!!form.isFeatured}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="isActive">Is Active</label>
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={!!form.isActive}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={form.status || "pending"}
                    onChange={handleFormChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                {modalMode === "edit" && (
                  <>
                    <div className="form-group">
                      <label htmlFor="createdAt">Created At</label>
                      <input
                        type="text"
                        id="createdAt"
                        name="createdAt"
                        value={form.createdAt || ""}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="updatedAt">Updated At</label>
                      <input
                        type="text"
                        id="updatedAt"
                        name="updatedAt"
                        value={form.updatedAt || ""}
                        readOnly
                      />
                    </div>
                  </>
                )}
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
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px" }}
          >
            <div className="modal-header">
              <h3>
                <i className="fas fa-exclamation-triangle"></i> Confirm Deletion
              </h3>
              <span className="close-btn" onClick={closeModal}>
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
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                <i className="fas fa-trash"></i> Delete Cause
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

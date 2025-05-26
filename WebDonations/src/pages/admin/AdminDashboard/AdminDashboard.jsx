import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import APIURL from "../../../functions/baseurl.js";
import Sidebar from "./components/Sidebar";
import AdminLayout from "../AdminLayout";

const admin = {
  username: "adminuser",
  role: "super_admin",
};

const DASHBOARD_STATS_URL = `${APIURL}admin/dashboard_stats.php`;
const API_BASE_URL = `${APIURL}admin/causes.php`;

const formatDate = (date) => {
  if (!date) return "";
  if (typeof date === "string") date = new Date(date);
  return date.toISOString().slice(0, 16).replace("T", " ");
};

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
  const [causes, setCauses] = useState([]);
  const [stats, setStats] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingCause, setEditingCause] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [form, setForm] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const formRef = useRef();

  useEffect(() => {
    fetchCauses();
    fetchStats();
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

  const fetchStats = async () => {
    try {
      const response = await axios.get(DASHBOARD_STATS_URL, {
        withCredentials: true,
      });
      setStats(response.data);
    } catch (error) {
      setStats({});
    }
  };

  // Modal open/close
  const openAddCauseModal = () => {
    setModalMode("add");
    setForm({
      title: "",
      description: "",
      short_description: "",
      image_url: "",
      goal_amount: "",
      raised_amount: "",
      currency: "USD",
      category: "",
      start_date: "",
      end_date: "",
      is_featured: 0,
      is_active: 1,
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
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
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
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        is_featured: form.is_featured ? 1 : 0,
        is_active: form.is_active ? 1 : 0,
        status: form.status,
      };
      if (modalMode === "edit") {
        causeData.id = editingCause.id;
        causeData.created_at = form.created_at;
        causeData.updated_at = form.updated_at;
      }
      const response = await axios.post(API_BASE_URL, causeData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
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
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    const idToDelete = deleteId;
    if (!idToDelete) return;
    try {
      const response = await axios.post(
        API_BASE_URL,
        { action: "delete", id: idToDelete },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      let responseData = response.data;
      if (typeof responseData === "string") {
        responseData = responseData.replace(/^\uFEFF/, "");
        responseData = JSON.parse(responseData);
      }
      if (responseData.success) {
        setCauses((prevCauses) =>
          prevCauses.filter((cause) => cause.id !== idToDelete)
        );
        setAlert({
          type: "success",
          message: responseData.message || "Cause deleted successfully!",
        });
        setShowDeleteModal(false);
        setDeleteId(null);
        await fetchCauses();
      } else {
        throw new Error(
          responseData.message || "Failed to delete cause. Please try again."
        );
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to delete cause. Please try again.",
      });
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  // Remove image preview
  const removeImagePreview = () => {
    setImagePreview(null);
    setForm((f) => ({ ...f, image: null, image_url: "" }));
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
      <div className="pro-loading-container">
        <div className="pro-spinner"></div>
        <p>Loading causes...</p>
      </div>
    );
  }

  return (
    <AdminLayout admin={admin} activePage="dashboard">
      {/* Header */}
      <div className="pro-header">
        <h1>
          <i className="fas fa-tachometer-alt"></i> Dashboard Overview
        </h1>
        <div className="pro-stats-row">
          <div className="pro-stat-card">
            <i className="fas fa-hand-holding-heart"></i>
            <div>
              <h3>{stats.activeCauses}</h3>
              <p>Active Causes</p>
            </div>
          </div>
          <div className="pro-stat-card">
            <i className="fas fa-dollar-sign"></i>
            <div>
              <h3>{formatCurrency(stats.totalRaised)}</h3>
              <p>Total Raised</p>
            </div>
          </div>
          <div className="pro-stat-card">
            <i className="fas fa-users"></i>
            <div>
              <h3>{stats.totalDonors}</h3>
              <p>Donors</p>
            </div>
          </div>
        </div>
      </div>
      {/* Alerts */}
      {alert.message && (
        <div className={`pro-alert pro-alert-${alert.type}`}>
          <i
            className={
              alert.type === "success"
                ? "fas fa-check-circle"
                : "fas fa-exclamation-circle"
            }
          />{" "}
          {alert.message}
          <span
            className="pro-alert-close"
            onClick={() => setAlert({ type: "", message: "" })}
          >
            &times;
          </span>
        </div>
      )}
      {/* Content Section */}
      <div className="pro-content">
        <div className="pro-content-header">
          <h2>
            <i className="fas fa-hand-holding-heart"></i> Current Causes
          </h2>
          <button
            className="pro-btn pro-btn-primary"
            onClick={openAddCauseModal}
          >
            <i className="fas fa-plus"></i> Add Cause
          </button>
        </div>
        <div className="pro-table-wrapper">
          <table className="pro-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Category</th>
                <th>Goal</th>
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
                causes.map((cause, idx) => (
                  <tr key={cause.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="pro-cause-title">
                        {cause.image_url ? (
                          <img
                            src={cause.image_url}
                            alt={cause.title}
                            className="pro-cause-thumb"
                          />
                        ) : (
                          <div className="pro-cause-thumb pro-thumb-placeholder">
                            <i className="fas fa-image"></i>
                          </div>
                        )}
                        <span>{cause.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className="pro-badge pro-badge-category">
                        {cause.category}
                      </span>
                    </td>
                    <td>{formatCurrency(cause.goal_amount, cause.currency)}</td>
                    <td>
                      {formatCurrency(cause.raised_amount, cause.currency)}
                    </td>
                    <td>
                      <div className="pro-progress-bar-bg">
                        <div
                          className="pro-progress-bar"
                          style={{ width: `${getProgress(cause)}%` }}
                        ></div>
                        <span className="pro-progress-text">
                          {getProgress(cause).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`pro-badge ${
                          cause.is_active
                            ? "pro-badge-success"
                            : "pro-badge-warning"
                        }`}
                      >
                        {cause.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {cause.is_featured ? (
                        <i className="fas fa-star pro-featured-icon"></i>
                      ) : (
                        <i className="far fa-star"></i>
                      )}
                    </td>
                    <td>{formatDate(cause.created_at)}</td>
                    <td className="pro-actions">
                      <button
                        className="pro-table-btn pro-table-btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditCauseModal(cause);
                        }}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        className="pro-table-btn pro-table-btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(cause.id);
                        }}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="pro-no-data">
                    <i className="fas fa-info-circle"></i> No causes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Add/Edit Cause Modal */}
      {showModal && (
        <div className="pro-modal" onClick={handleOverlayClick}>
          <div
            className="pro-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pro-modal-header">
              <h3 id="modalTitle">
                <i
                  className={
                    modalMode === "add" ? "fas fa-plus-circle" : "fas fa-edit"
                  }
                ></i>{" "}
                {modalMode === "add" ? "Add New Cause" : "Edit Cause"}
              </h3>
              <span className="pro-modal-close" onClick={closeModal}>
                &times;
              </span>
            </div>
            <div className="pro-modal-body">
              <form
                ref={formRef}
                className="pro-form"
                onSubmit={handleFormSubmit}
              >
                <div className="pro-form-group">
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
                <div className="pro-form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    value={form.description || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="pro-form-group">
                  <label htmlFor="short_description">Short Description</label>
                  <input
                    type="text"
                    id="short_description"
                    name="short_description"
                    value={form.short_description || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="pro-form-group">
                  <label htmlFor="image_url">Image URL</label>
                  <input
                    type="text"
                    id="image_url"
                    name="image_url"
                    value={form.image_url || ""}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="pro-form-row">
                  <div className="pro-form-group">
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
                  <div className="pro-form-group">
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
                </div>
                <div className="pro-form-row">
                  <div className="pro-form-group">
                    <label htmlFor="currency">Currency</label>
                    <input
                      type="text"
                      id="currency"
                      name="currency"
                      value={form.currency || "USD"}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="pro-form-group">
                    <label htmlFor="category">Category</label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={form.category || ""}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div className="pro-form-row">
                  <div className="pro-form-group">
                    <label htmlFor="start_date">Start Date</label>
                    <input
                      type="date"
                      id="start_date"
                      name="start_date"
                      value={form.start_date || ""}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="pro-form-group">
                    <label htmlFor="end_date">End Date</label>
                    <input
                      type="date"
                      id="end_date"
                      name="end_date"
                      value={form.end_date || ""}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div className="pro-form-row">
                  <div className="pro-form-group pro-checkbox-group">
                    <label htmlFor="is_featured">Is Featured</label>
                    <input
                      type="checkbox"
                      id="is_featured"
                      name="is_featured"
                      checked={!!form.is_featured}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="pro-form-group pro-checkbox-group">
                    <label htmlFor="is_active">Is Active</label>
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={!!form.is_active}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div className="pro-form-group">
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
                  <div className="pro-form-row">
                    <div className="pro-form-group">
                      <label htmlFor="created_at">Created At</label>
                      <input
                        type="text"
                        id="created_at"
                        name="created_at"
                        value={form.created_at || ""}
                        readOnly
                      />
                    </div>
                    <div className="pro-form-group">
                      <label htmlFor="updated_at">Updated At</label>
                      <input
                        type="text"
                        id="updated_at"
                        name="updated_at"
                        value={form.updated_at || ""}
                        readOnly
                      />
                    </div>
                  </div>
                )}
                <div className="pro-form-actions">
                  <button
                    type="button"
                    className="pro-btn pro-btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="pro-btn pro-btn-primary"
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
        <div className="pro-modal" onClick={handleOverlayClick}>
          <div
            className="pro-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px" }}
          >
            <div className="pro-modal-header">
              <h3>
                <i className="fas fa-exclamation-triangle"></i> Confirm Deletion
              </h3>
              <span className="pro-modal-close" onClick={closeModal}>
                &times;
              </span>
            </div>
            <div className="pro-modal-body">
              <p>
                Are you sure you want to delete this cause? This action cannot
                be undone.
              </p>
              <p>
                All associated donations will be preserved but marked as for a
                deleted cause.
              </p>
            </div>
            <div className="pro-form-actions">
              <button
                type="button"
                className="pro-btn pro-btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="pro-btn pro-btn-danger"
                onClick={handleDelete}
              >
                <i className="fas fa-trash"></i> Delete Cause
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;

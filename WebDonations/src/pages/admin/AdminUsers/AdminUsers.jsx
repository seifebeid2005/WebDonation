import React, { useState, useRef } from "react";
import "../AdminDashboard/AdminDashboard.css"; // Reuse styles if you want
import AdminLayout from "../AdminLayout";

// Dummy admin and admin users data for demonstration
const currentAdmin = {
  id: 1,
  username: "superadmin",
  role: "superAdmin", // or "admin"
};

const initialAdmins = [
  {
    id: 1,
    username: "superadmin",
    role: "superAdmin",
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: 2,
    username: "admin2",
    role: "admin",
    lastLogin: new Date(Date.now() - 86400000),
    isActive: true,
  },
  {
    id: 3,
    username: "johnadmin",
    role: "admin",
    lastLogin: null,
    isActive: false,
  },
];

function formatDate(date) {
  if (!date) return "Never";
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function AdminUsers() {
  // State
  const [admins, setAdmins] = useState(initialAdmins);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "admin",
    isActive: true,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState({ id: null, username: "" });
  const formRef = useRef();

  // Modal functions
  const openAddAdminModal = () => {
    setModalMode("add");
    setForm({
      username: "",
      password: "",
      confirmPassword: "",
      role: "admin",
      isActive: true,
    });
    setShowModal(true);
    setEditingAdmin(null);
  };

  const openEditAdminModal = (user) => {
    setModalMode("edit");
    setEditingAdmin(user);
    setForm({
      username: user.username,
      password: "",
      confirmPassword: "",
      role: user.role,
      isActive: user.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // Delete modal functions
  const confirmDelete = (adminId, username) => {
    setDeleteData({ id: adminId, username });
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => setShowDeleteModal(false);

  // Form change
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit add/edit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Password match validation
    if (modalMode === "add" || (form.password && form.confirmPassword)) {
      if (form.password !== form.confirmPassword) {
        setAlert({ type: "error", message: "Passwords do not match" });
        return;
      }
    }
    if (modalMode === "add") {
      if (!form.username || !form.password || !form.confirmPassword) {
        setAlert({ type: "error", message: "Please fill all fields" });
        return;
      }
      const newAdmin = {
        id: admins.length ? Math.max(...admins.map((a) => a.id)) + 1 : 1,
        username: form.username,
        role: form.role,
        lastLogin: null,
        isActive: form.isActive,
      };
      setAdmins((prev) => [...prev, newAdmin]);
      setAlert({ type: "success", message: "Admin added successfully!" });
    } else {
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === editingAdmin.id
            ? {
                ...a,
                username: form.username,
                role: form.role,
                isActive: form.isActive,
              }
            : a
        )
      );
      setAlert({ type: "success", message: "Admin updated successfully!" });
    }
    setShowModal(false);
  };

  // Delete admin
  const handleDelete = () => {
    setAdmins((prev) => prev.filter((a) => a.id !== deleteData.id));
    setShowDeleteModal(false);
    setAlert({ type: "success", message: "Admin deleted successfully!" });
  };

  // Modal overlay click
  const handleOverlayClick = (e) => {
    if (e.target.className === "modal") {
      setShowModal(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <AdminLayout admin={currentAdmin} activePage="users">
      <div className="header">
        <h1>
          <i className="fas fa-tachometer-alt"></i> Admin Accounts Overview
        </h1>
        <div className="stats-summary">
          <div className="stat-card">
            <i className="fas fa-hand-holding-heart"></i>
            <div className="card-center">
              <h3>{admins.length}</h3>
              <p>Active Accounts</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-users"></i>
            <div className="card-center">
              <h3>{admins.filter(a => a.role === 'superAdmin').length}</h3>
              <p>Super Admin</p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-section">
        <div className="section-header">
          <h2>
            <i className="fas fa-users-cog"></i> Admin Users Management
          </h2>
          {currentAdmin.role === "superAdmin" && (
            <button className="btn btn-primary" onClick={openAddAdminModal}>
              <i className="fas fa-plus"></i> Add New Admin
            </button>
          )}
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.id}</td>
                  <td>{admin.username}</td>
                  <td>
                    <span className={`badge ${admin.role === 'superAdmin' ? 'badge-superadmin' : 'badge-admin'}`}>
                      {admin.role === 'superAdmin' ? 'SUPER ADMIN' : 'ADMIN'}
                    </span>
                  </td>
                  <td>{formatDate(admin.lastLogin)}</td>
                  <td>
                    <span className={`badge ${admin.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action btn-edit" onClick={() => openEditAdminModal(admin)}>
                      Edit
                    </button>
                    <button className="btn-action btn-delete" onClick={() => confirmDelete(admin.id, admin.username)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal" onClick={handleOverlayClick}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 id="modalTitle">
                <i
                  className={
                    modalMode === "add"
                      ? "fas fa-user-plus"
                      : "fas fa-user-edit"
                  }
                ></i>{" "}
                {modalMode === "add" ? "Add New Admin" : "Edit Admin"}
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
                autoComplete="off"
              >
                <div className="form-group">
                  <label htmlFor="username">
                    <i className="fas fa-lock"></i> Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    placeholder="Enter username"
                    value={form.username}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">
                    <i className="fas fa-lock"></i> Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleFormChange}
                    required={modalMode === "add"}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <i className="fas fa-user"></i> Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleFormChange}
                    required={modalMode === "add"}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">
                    <i className="fas fa-user-tag"></i> Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={form.role}
                    onChange={handleFormChange}
                  >
                    <option value="admin">Admin</option>
                    <option value="superAdmin">Super Admin</option>
                  </select>
                </div>
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={form.isActive}
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
                    {modalMode === "add" ? "Add Admin" : "Update Admin"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal" onClick={handleOverlayClick}>
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-exclamation-triangle"></i> Confirm Deletion
              </h3>
              <span className="close-btn" onClick={closeDeleteModal}>
                &times;
              </span>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete admin{" "}
                <strong id="deleteAdminName">{deleteData.username}</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

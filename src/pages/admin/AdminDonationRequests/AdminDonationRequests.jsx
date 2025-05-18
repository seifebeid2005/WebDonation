import React, { useState, useEffect } from "react";
import axios from "axios";
import "../AdminDashboard/AdminDashboard.css";

const API_BASE_URL = 'http://localhost:8888/WebDonation/Backend/admin/donation_requests.php';

function AdminDonationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL, { withCredentials: true });
      let responseData = response.data;
      if (typeof responseData === 'string') {
        responseData = responseData.replace(/^\uFEFF/, '');
        responseData = JSON.parse(responseData);
      }
      if (responseData.success === false) {
        throw new Error(responseData.message || 'Failed to fetch donation requests');
      }
      setRequests(responseData.data || []);
      setAlert({ type: "", message: "" });
    } catch (error) {
      setAlert({ type: "error", message: error.message || "Failed to fetch donation requests. Please try again." });
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const response = await axios.post(
        API_BASE_URL,
        { request_id: requestId, status: newStatus },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setAlert({ type: "success", message: "Request status updated successfully" });
        fetchRequests(); // Refresh the list
      } else {
        throw new Error(response.data.message || 'Failed to update request status');
      }
    } catch (error) {
      setAlert({ type: "error", message: error.message || "Failed to update request status" });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'badge-warning';
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading donation requests...</p>
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
          <h3>Admin</h3>
          <p>Administrator</p>
        </div>
        <nav className="admin-nav">
          <ul>
            <li>
              <a href="/admin-dashboard">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li>
              <a href="/admin-users">
                <i className="fas fa-users-cog"></i> Admin Users
              </a>
            </li>
            <li className="active">
              <a href="/donation-requests">
                <i className="fas fa-hand-holding-heart"></i> Donation Requests
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
            <i className="fas fa-hand-holding-heart"></i> Donation Requests
          </h1>
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
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cause</th>
                  <th>Donor Name</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length ? (
                  requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.cause_title || 'N/A'}</td>
                      <td>{request.donor_name}</td>
                      <td>${request.amount}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td>{formatDate(request.created_at)}</td>
                      <td className="actions">
                        {request.status === 'pending' && (
                          <>
                            <button
                              className="btn-action btn-success"
                              onClick={() => handleStatusUpdate(request.id, 'approved')}
                            >
                              <i className="fas fa-check"></i> Approve
                            </button>
                            <button
                              className="btn-action btn-danger"
                              onClick={() => handleStatusUpdate(request.id, 'rejected')}
                            >
                              <i className="fas fa-times"></i> Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      <i className="fas fa-info-circle"></i> No donation requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDonationRequests; 
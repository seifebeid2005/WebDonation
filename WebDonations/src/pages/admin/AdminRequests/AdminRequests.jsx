import React, { useState, useEffect } from "react";
import axios from "axios";
import "../AdminDashboard/AdminDashboard.css";
import "./AdminRequests.css";
import APIURL from "../../../functions/baseurl.js";
import AdminLayout from "../AdminLayout";

const API_BASE_URL = `${APIURL}admin/cause_requests.php`;

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL, { withCredentials: true });
      setRequests(response.data.data || []);
      setAlert({ type: "", message: "" });
    } catch (error) {
      setAlert({ type: "error", message: "Failed to fetch requests." });
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, action) => {
    setProcessingId(id);
    // Optimistically update UI
    const prevRequests = [...requests];
    setRequests(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: action === "accept" ? "accepted" : "declined" } : r
      )
    );
    try {
      await axios.post(
        API_BASE_URL,
        { id, action },
        { withCredentials: true }
      );
      setAlert({ type: "success", message: `Request ${action}ed` });
      fetchRequests(); // Ensure data is in sync
    } catch {
      setAlert({ type: "error", message: "Failed to update status." });
      setRequests(prevRequests); // Revert UI if error
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending": return "badge badge-warning";
      case "accepted": return "badge badge-success";
      case "declined": return "badge badge-danger";
      default: return "badge badge-secondary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <AdminLayout admin={{username: 'Admin', role: 'super_admin'}} activePage="requests">
      {/* Main Content */}
      <div className="admin-container">
        <div className="main-content">
          <div className="header">
            <h1>Cause Requests</h1>
          </div>
          {alert.message && (
            <div className={`alert alert-${alert.type}`}>{alert.message}</div>
          )}
          <div className="content-section">
            {loading ? (
              <div className="loading-spinner" />
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User ID</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Requested Amount</th>
                      <th>Status</th>
                      <th>Submitted At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length ? (
                      requests.map((r) => (
                        <tr key={r.id}>
                          <td>{r.id}</td>
                          <td>{r.user_id}</td>
                          <td>{r.title}</td>
                          <td>{r.description}</td>
                          <td>{r.requested_amount}</td>
                          <td>
                            <span className={getStatusBadgeClass(r.status)}>
                              {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                            </span>
                          </td>
                          <td>{formatDate(r.submitted_at)}</td>
                          <td>
                            {r.status === "pending" && (
                              <>
                                <button
                                  className="btn-action btn-success"
                                  disabled={processingId === r.id}
                                  onClick={() => handleStatus(r.id, "accept")}
                                >
                                  {processingId === r.id ? <i className="fas fa-spinner fa-spin"></i> : "Accept"}
                                </button>
                                <button
                                  className="btn-action btn-danger"
                                  disabled={processingId === r.id}
                                  onClick={() => handleStatus(r.id, "decline")}
                                >
                                  {processingId === r.id ? <i className="fas fa-spinner fa-spin"></i> : "Decline"}
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8">No requests found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

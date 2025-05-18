import React, { useState, useEffect } from "react";
import axios from "axios";
import "../AdminDashboard/AdminDashboard.css";
import "./AdminRequests.css";

const API_BASE_URL = 'http://localhost:8888/WebDonation/Backend/admin/cause_requests.php';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL, { withCredentials: true });
      setRequests(response.data.data || []);
      setAlert({ type: '', message: '' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to fetch requests.' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, action) => {
    try {
      await axios.post(
        API_BASE_URL,
        { id, action },
        { withCredentials: true }
      );
      setAlert({ type: 'success', message: `Request ${action}ed` });
      fetchRequests();
    } catch {
      setAlert({ type: 'error', message: 'Failed to update status.' });
    }
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <div className="admin-profile">
          <div className="profile-icon"><i className="fas fa-user-shield"></i></div>
          <h3>Admin</h3>
          <p>Super Admin</p>
        </div>
        <nav className="admin-nav">
          <ul>
            <li><a href="/admin-dashboard">Dashboard</a></li>
            <li><a href="/admin-users">Admin Users</a></li>
            <li className="active"><a href="/admin-requests">Cause Requests</a></li>
            <li><a href="/donations-report">Donations Report</a></li>
            <li><a href="/change-password">Change Password</a></li>
          </ul>
        </nav>
        <div className="logout-section">
          <a href="/admin-logout" className="logout-btn">Logout</a>
        </div>
      </div>
      <div className="main-content">
        <div className="header"><h1>Cause Requests</h1></div>
        {alert.message && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
        <div className="content-section">
          {loading ? <div className="loading-spinner" /> : (
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
                {requests.length ? requests.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.user_id}</td>
                    <td>{r.title}</td>
                    <td>{r.description}</td>
                    <td>{r.requested_amount}</td>
                    <td>{r.status}</td>
                    <td>{r.submitted_at}</td>
                    <td>
                      {r.status === 'pending' && <>
                        <button className="btn-action btn-success" onClick={() => handleStatus(r.id, 'accept')}>Accept</button>
                        <button className="btn-action btn-danger" onClick={() => handleStatus(r.id, 'decline')}>Decline</button>
                      </>}
                    </td>
                  </tr>
                )) : <tr><td colSpan="8">No requests found</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminRequests; 
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../../../config/api';
import Header from '../Header';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    activeCauses: 0,
    registeredUsers: 0,
    recentDonations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { response, data } = await apiCall('/api/admin/dashboard_stats.php');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <Header />
        <div className="dashboard-container">
          <h2>Dashboard</h2>
          <div className="loading">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <Header />
        <div className="dashboard-container">
          <h2>Dashboard</h2>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Header />
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Donations</h3>
            <p className="stat-value">{stats.totalDonations}</p>
            <Link to="/admin/donations" className="stat-link">View All</Link>
          </div>
          
          <div className="stat-card">
            <h3>Total Amount</h3>
            <p className="stat-value">${stats.totalAmount.toLocaleString()}</p>
            <Link to="/admin/donations" className="stat-link">View Details</Link>
          </div>
          
          <div className="stat-card">
            <h3>Active Causes</h3>
            <p className="stat-value">{stats.activeCauses}</p>
            <Link to="/admin/causes" className="stat-link">Manage Causes</Link>
          </div>
          
          <div className="stat-card">
            <h3>Registered Users</h3>
            <p className="stat-value">{stats.registeredUsers}</p>
            <Link to="/admin/users" className="stat-link">Manage Users</Link>
          </div>
        </div>
        
        <div className="recent-activity">
          <h3>Recent Donations</h3>
          {stats.recentDonations.length > 0 ? (
            <table className="recent-donations-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Cause</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentDonations.map((donation) => (
                  <tr key={donation.id}>
                    <td>{donation.userName}</td>
                    <td>{donation.causeName}</td>
                    <td>${donation.amount}</td>
                    <td>{new Date(donation.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No recent donations</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

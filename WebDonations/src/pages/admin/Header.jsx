import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost/WebDonation/Backend/api/admin/logout.php', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Remove admin logged in status
        localStorage.removeItem('adminLoggedIn');
        // Redirect to login page
        navigate('/admin/login');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="admin-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/admin/dashboard">WebDonation Admin</Link>
        </div>
        
        <nav className="main-nav">
          <ul>
            <li className={isActive('/admin/dashboard')}>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className={isActive('/admin/users')}>
              <Link to="/admin/users">Users</Link>
            </li>
            <li className={isActive('/admin/causes')}>
              <Link to="/admin/causes">Causes</Link>
            </li>
            <li className={isActive('/admin/donations')}>
              <Link to="/admin/donations">Donations</Link>
            </li>
            <li className={isActive('/admin/report')}>
              <Link to="/admin/report">Reports</Link>
            </li>
          </ul>
        </nav>
        
        <div className="user-menu">
          <button 
            className="profile-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="admin-name">Admin</span>
            <span className="dropdown-icon">▼</span>
          </button>
          
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/admin/profile" className="dropdown-item">Profile</Link>
              <Link to="/admin/settings" className="dropdown-item">Settings</Link>
              <button onClick={handleLogout} className="dropdown-item logout">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 
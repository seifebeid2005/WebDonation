import { useState, useEffect } from 'react';
import { apiCall } from '../../../config/api';
import Header from '../Header';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'edit' or 'delete'

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { response, data } = await apiCall('/admin/users.php');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setActionType('edit');
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setActionType('delete');
    setShowModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    
    try {
      const { response } = await apiCall('/admin/users.php', {
        method: 'PUT',
        body: JSON.stringify(selectedUser)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      ));
      
      setShowModal(false);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const { response } = await apiCall(`/admin/users.php?id=${selectedUser.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      // Remove the user from the local state
      setUsers(users.filter(user => user.id !== selectedUser.id));
      
      setShowModal(false);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-users">
      <Header />
      <div className="users-container">
        <div className="users-header">
          <h2>User Management</h2>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${user.status === 'active' ? 'active' : 'inactive'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(user)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-results">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showModal && actionType === 'edit' && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit User</h3>
            <form onSubmit={handleSaveUser}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select 
                  id="status" 
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showModal && actionType === 'delete' && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete User</h3>
            <p>Are you sure you want to delete user {selectedUser.name}?</p>
            <p className="warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="button" className="delete-btn" onClick={handleDeleteConfirm}>
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

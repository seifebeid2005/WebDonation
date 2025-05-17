import { useState, useEffect } from 'react';
import Header from '../Header';
import './AdminCauses.css';

const AdminCauses = () => {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'add', 'edit', or 'delete'
  const [selectedCause, setSelectedCause] = useState({
    id: '',
    title: '',
    description: '',
    goal_amount: '',
    current_amount: '',
    image_url: '',
    status: 'active'
  });

  useEffect(() => {
    fetchCauses();
  }, []);

  const fetchCauses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/WebDonation/Backend/api/admin/causes.php', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch causes');
      }
      
      const data = await response.json();
      setCauses(data);
    } catch (err) {
      console.error('Error fetching causes:', err);
      setError('Failed to load causes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCause = () => {
    setSelectedCause({
      id: '',
      title: '',
      description: '',
      goal_amount: '',
      current_amount: '0',
      image_url: '',
      status: 'active'
    });
    setActionType('add');
    setShowModal(true);
  };

  const handleEditCause = (cause) => {
    setSelectedCause(cause);
    setActionType('edit');
    setShowModal(true);
  };

  const handleDeleteCause = (cause) => {
    setSelectedCause(cause);
    setActionType('delete');
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCause({
      ...selectedCause,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let url = 'http://localhost/WebDonation/Backend/api/admin/causes.php';
      let method = actionType === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedCause),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${actionType} cause`);
      }
      
      // Refresh causes list
      await fetchCauses();
      
      setShowModal(false);
    } catch (err) {
      console.error(`Error ${actionType}ing cause:`, err);
      setError(`Failed to ${actionType} cause`);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost/WebDonation/Backend/api/admin/causes.php?id=${selectedCause.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete cause');
      }
      
      // Refresh causes list
      await fetchCauses();
      
      setShowModal(false);
    } catch (err) {
      console.error('Error deleting cause:', err);
      setError('Failed to delete cause');
    }
  };

  return (
    <div className="admin-causes">
      <Header />
      <div className="causes-container">
        <div className="causes-header">
          <h2>Causes Management</h2>
          <button className="add-cause-btn" onClick={handleAddCause}>
            Add New Cause
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading causes...</div>
        ) : (
          <div className="causes-grid">
            {causes.length > 0 ? (
              causes.map(cause => (
                <div key={cause.id} className="cause-card">
                  <div className="cause-image">
                    <img src={cause.image_url || 'https://via.placeholder.com/300x200'} alt={cause.title} />
                    <span className={`status-badge ${cause.status}`}>{cause.status}</span>
                  </div>
                  <div className="cause-content">
                    <h3>{cause.title}</h3>
                    <p className="cause-description">{cause.description}</p>
                    <div className="cause-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${Math.min((cause.current_amount / cause.goal_amount) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="progress-stats">
                        <span>${cause.current_amount} raised</span>
                        <span>Goal: ${cause.goal_amount}</span>
                      </div>
                    </div>
                    <div className="cause-actions">
                      <button className="edit-btn" onClick={() => handleEditCause(cause)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteCause(cause)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-causes">No causes found. Add a new cause to get started.</div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Cause Modal */}
      {showModal && (actionType === 'add' || actionType === 'edit') && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{actionType === 'add' ? 'Add New Cause' : 'Edit Cause'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title"
                  value={selectedCause.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  name="description"
                  value={selectedCause.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="goal_amount">Goal Amount ($)</label>
                  <input 
                    type="number" 
                    id="goal_amount" 
                    name="goal_amount"
                    value={selectedCause.goal_amount}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
                {actionType === 'edit' && (
                  <div className="form-group">
                    <label htmlFor="current_amount">Current Amount ($)</label>
                    <input 
                      type="number" 
                      id="current_amount" 
                      name="current_amount"
                      value={selectedCause.current_amount}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="image_url">Image URL</label>
                <input 
                  type="text" 
                  id="image_url" 
                  name="image_url"
                  value={selectedCause.image_url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select 
                  id="status" 
                  name="status"
                  value={selectedCause.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {actionType === 'add' ? 'Add Cause' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Cause Modal */}
      {showModal && actionType === 'delete' && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Cause</h3>
            <p>Are you sure you want to delete the cause "{selectedCause.title}"?</p>
            <p className="warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="button" className="delete-btn" onClick={handleDeleteConfirm}>
                Delete Cause
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCauses;

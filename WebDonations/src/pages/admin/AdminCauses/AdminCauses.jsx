import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';

const API_BASE_URL = 'http://localhost/WebDonation/Backend/admin/causes.php';

const AdminCauses = () => {
  const [causes, setCauses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newCause, setNewCause] = useState({
    title: '',
    description: '',
    goal_amount: '',
    created_by: 1,
  });

  const fetchCauses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL, {
        withCredentials: true,
      });
      
      // Handle string response (remove BOM if present)
      let causesData = response.data;
      if (typeof causesData === 'string') {
        causesData = causesData.replace(/^\uFEFF/, '');
        causesData = JSON.parse(causesData);
      }
      
      // Ensure we have an array
      const causesArray = Array.isArray(causesData) ? causesData : [];
      setCauses(causesArray);
      setError(null);
    } catch (error) {
      console.error('Error fetching causes:', error);
      setError('Failed to fetch causes. Please make sure the backend server is running.');
      setCauses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  const handleAddCause = async () => {
    // Validate form fields
    if (!newCause.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!newCause.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!newCause.goal_amount || newCause.goal_amount <= 0) {
      setError('Goal amount must be greater than 0');
      return;
    }

    try {
      const causeData = {
        action: 'add',
        title: newCause.title.trim(),
        description: newCause.description.trim(),
        goal_amount: parseFloat(newCause.goal_amount),
        created_by: newCause.created_by,
      };

      const response = await axios.post(
        API_BASE_URL,
        causeData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      // Parse the response data if it's a string
      let responseData = response.data;
      if (typeof responseData === 'string') {
        responseData = responseData.replace(/^\uFEFF/, '');
        responseData = JSON.parse(responseData);
      }

      if (responseData.success) {
        setOpenDialog(false);
        setNewCause({
          title: '',
          description: '',
          goal_amount: '',
          created_by: 1,
        });
        // Add a small delay before fetching causes to ensure the database has updated
        setTimeout(() => {
          fetchCauses();
        }, 100);
        setError(null);
      } else {
        setError(responseData.message || 'Failed to add cause');
      }
    } catch (error) {
      console.error('Error adding cause:', error);
      let errorMessage = 'Failed to add cause. ';
      
      if (error.response) {
        errorMessage += `Server responded with ${error.response.status}: `;
        if (typeof error.response.data === 'string') {
          try {
            const cleanData = error.response.data.replace(/^\uFEFF/, '');
            const parsedError = JSON.parse(cleanData);
            errorMessage += parsedError.message || error.response.data;
          } catch (e) {
            errorMessage += error.response.data;
          }
        } else {
          errorMessage += JSON.stringify(error.response.data);
        }
      } else if (error.request) {
        errorMessage += 'No response received from server.';
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleAcceptCause = async (id) => {
    try {
      const response = await axios.post(
        API_BASE_URL,
        {
          action: 'accept',
          id,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      let responseData = response.data;
      if (typeof responseData === 'string') {
        responseData = responseData.replace(/^\uFEFF/, '');
        responseData = JSON.parse(responseData);
      }

      if (responseData.success) {
        fetchCauses();
        setError(null);
      } else {
        setError(responseData.message || 'Failed to accept cause');
      }
    } catch (error) {
      console.error('Error accepting cause:', error);
      setError('Failed to accept cause. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewCause({
      title: '',
      description: '',
      goal_amount: '',
      created_by: 1,
    });
    setError(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Manage Causes</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Add New Cause
        </Button>
      </Box>

      {causes.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          No causes found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {causes.map((cause) => (
            <Grid item xs={12} md={6} lg={4} key={cause.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {cause.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {cause.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      Goal Amount: ${cause.goal_amount}
                    </Typography>
                    <Typography variant="body2">
                      Current Amount: ${cause.current_amount}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={cause.status}
                      color={getStatusColor(cause.status)}
                      size="small"
                    />
                    {cause.status === 'pending' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleAcceptCause(cause.id)}
                      >
                        Accept
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        aria-labelledby="add-cause-dialog-title"
        keepMounted={false}
        disablePortal={false}
        container={document.body}
      >
        <DialogTitle id="add-cause-dialog-title">Add New Cause</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            required
            value={newCause.title}
            onChange={(e) => setNewCause({ ...newCause, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            required
            multiline
            rows={4}
            value={newCause.description}
            onChange={(e) => setNewCause({ ...newCause, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Goal Amount"
            type="number"
            required
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
            value={newCause.goal_amount}
            onChange={(e) => setNewCause({ ...newCause, goal_amount: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddCause} variant="contained" color="primary">
            Add Cause
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminCauses;

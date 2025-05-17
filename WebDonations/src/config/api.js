// API Configuration
export const API_BASE_URL = 'http://localhost:8888/WebDonation/Backend';

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default options with credentials included
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    // Handle JSON parsing
    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = await response.json();
      return { response, data };
    }
    
    return { response };
  } catch (error) {
    console.error(`API call error to ${endpoint}:`, error);
    throw error;
  }
}; 
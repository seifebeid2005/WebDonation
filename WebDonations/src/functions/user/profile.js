const API_BASE_URL = 'http://localhost/webdonation/backend/user/profile.php';

export const getProfile = async() => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'GET',
            credentials: 'include', // Crucial for sessions
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

/**
 * Updates the user's profile
 * @param {Object} profileData - The updated profile data
 * @param {string} profileData.name - User's name
 * @param {string} profileData.email - User's email
 * @returns {Promise<Object>} Updated user profile
 */
export const updateProfile = async({ name, email }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

/**
 * Deactivates the user's account
 * @returns {Promise<Object>} Success message
 */
export const deactivateAccount = async() => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to deactivate account');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deactivating account:', error);
        throw error;
    }
};

/**
 * Gets a user's profile by ID (admin function)
 * @param {number} userId - The ID of the user to fetch
 * @returns {Promise<Object>} User profile data
 */
export const getProfileById = async(userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch profile by ID');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching profile by ID:', error);
        throw error;
    }
};

export default {
    getProfile,
    updateProfile,
    deactivateAccount,
    getProfileById,
};
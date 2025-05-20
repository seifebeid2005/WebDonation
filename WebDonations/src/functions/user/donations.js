// src/api/donation.js

/**
 * Fetches the donations for the currently logged-in user.
 * @returns {Promise<Object[]>} An array of donation objects or an error object.
 */
import API_URL from '../baseurl.js';
export async function fetchUserDonations() {
    try {
        const response = await fetch('http://localhost/webdonation/Backend/user/donations.php', {
            method: 'GET',
            credentials: 'include', // Send cookies for session authentication
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to fetch user donations.');
        }

        // data.data contains the donations array
        return data.data;
    } catch (error) {
        return { error: error.message || 'Unknown error' };
    }
}
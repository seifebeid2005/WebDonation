// src/api/reports.js

/**
 * Fetches the admin statistics report from the backend.
 * @returns {Promise<Object>} The statistics data or error object.
 */
import APIURL from '../baseurl.js';

export async function fetchAdminReport() {
    try {
        const response = await fetch(`${APIURL}admin/report.php`, {
            method: 'GET',
            credentials: 'include', // Important for session cookie
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to fetch report data.');
        }

        // data.data contains the report fields
        return data.data;
    } catch (error) {
        // You can handle/log errors as appropriate for your app
        return { error: error.message || 'Unknown error' };
    }
}
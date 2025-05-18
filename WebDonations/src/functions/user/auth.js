import APIURL from "../baseurl.js";

const API_URL_LOGIN = `${APIURL}user/login.php`;
const API_URL_REGISTER = `${APIURL}user/register.php`;
const API_URL_LOGOUT = `${APIURL}user/logout.php`;
const API_GET_USER_ID = `${APIURL}auth/check_session.php`;

// Helper for POST requests with credentials
async function apiRequest(url, body) {
  try {
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Non-JSON response:", text);
      throw new Error("Server returned non-JSON response");
    }

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "API Error");
    }

    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    return { success: false, message1: "Error: " + err.message };
  }
}

// Login function
export async function login(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }
  return apiRequest(API_URL_LOGIN, { email, password });
}

// Register function
export async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required.");
  }
  return apiRequest(API_URL_REGISTER, { name, email, password });
}

// Logout function
export async function logout() {
  return apiRequest(API_URL_LOGOUT, {});
}
 // Check if user is logged in
export async function getUserId() {
  return apiRequest(API_GET_USER_ID, {});
}

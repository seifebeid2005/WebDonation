// Base API URL
const API_URL = "http://localhost/webDonation/Backend/user/request_cause.php";
// Helper function to handle fetch with credentials & JSON
async function apiRequest(body) {
    console.log("API Request Body:", body); // Debugging line
  const res = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  console.log("API Response Status:", res.status); // Debugging line
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data);
  }
  return data;
}

// 1. Get all cause requests for the logged-in user
export async function getAllCauseRequests() {
  return apiRequest({ action: "getAll" });
}

// 2. Get a single cause request by ID (must belong to user)
export async function getCauseRequestById(id) {
  if (!id) throw new Error("Missing id");
  return apiRequest({ action: "getById", id });
}

// 3. Create a new cause request
export async function createCauseRequest({
  title,
  description,
  image_url,
  requested_amount,
  status,
}) {
  if (!title || !description || !requested_amount) {
    throw new Error(
      "Missing required fields: title, description, requested_amount"
    );
  }
  return apiRequest({
    action: "create",
    title,
    description,
    image_url,
    requested_amount,
    status, // status is optional; default handled by API
  });
}

// 4. Update an existing cause request (must belong to user)
export async function updateCauseRequest({
  id,
  title,
  description,
  image_url,
  requested_amount,
  status,
}) {
  if (!id || !title || !description || !requested_amount) {
    throw new Error(
      "Missing required fields: id, title, description, requested_amount"
    );
  }
  return apiRequest({
    action: "update",
    id,
    title,
    description,
    image_url,
    requested_amount,
    status,
  });
}

// 5. Delete a cause request by ID (must belong to user)
export async function deleteCauseRequest(id) {
  if (!id) throw new Error("Missing id");
  return apiRequest({ action: "delete", id });
}

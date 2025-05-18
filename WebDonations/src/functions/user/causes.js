import APIURL from "../baseurl.js";
const API_URL = `${APIURL}user/causes.php`;

// Get all causes (GET request)
export async function getAllCauses() {
  const res = await fetch(API_URL, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Failed to fetch causes");
  }
  return data.data; // Returns array of causes
}

// Get one cause by id (GET request, client side filter)
export async function getCauseById(id) {
  if (!id) throw new Error("No cause id provided");
  const allCauses = await getAllCauses();
  return allCauses.find((cause) => String(cause.id) === String(id)) || null;
}

import APIURL from "../baseurl.js";
const API_BASE_URL = `${APIURL}user/profile.php`;


const request = async (method, body = null, action = null) => {
  const url = API_BASE_URL;
  const payload = body ? { ...body, action } : { action };

  const options = {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...(method !== "GET" && { body: JSON.stringify(payload) }),
  };

  const res = await fetch(url, options);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const getProfile = () => request("POST", null, "getUserData");
export const updateProfile = (payload) =>
  request("POST", payload, "changePassword");

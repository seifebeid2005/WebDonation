const API_URL = "http://localhost/backend/donation.php";

// 1. donate
export async function donate({ user_id, cause_id, amount, merchent_order_id }) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "donate",
      user_id,
      cause_id,
      amount,
      merchent_order_id,
    }),
  });
  return await res.json();
}

// 2. update status
export async function updateDonationStatus({
  donation_id,
  status,
  user_id,
  message,
}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "update",
      donation_id,
      status,
      user_id,
      message,
    }),
  });
  return await res.json();
}

// 3. send notification only
export async function sendNotification(user_id, message) {
  return await updateDonationStatus({
    donation_id: 0,
    status: "pending",
    user_id,
    message,
  });
}

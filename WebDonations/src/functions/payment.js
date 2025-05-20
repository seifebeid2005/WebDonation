// paymobIntegration.js
// Utility functions for Paymob payment integration (for use with React frontend)

const INTENTION_URL = "https://accept.paymob.com/v1/intention/";
const CHECKOUT_BASE_URL = "https://accept.paymob.com/unifiedcheckout/";
const TOKEN_URL = "https://accept.paymob.com/api/auth/tokens";
const INQUIRY_URL =
  "https://accept.paymob.com/api/ecommerce/orders/transaction_inquiry";

const INTEGRATION_ID = 5066163;
const PUBLIC_KEY = "egy_pk_test_MsRDNSByLIHjEhMrcE1D5Jcx2HmYRTmS";
const SECRET =
  "egy_sk_test_8129125bc363e62de91eea2fd5b86f6e50c0094a44381f701fe8ac918e698ad5";
const API_KEY =
  "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBek9UY3hNU3dpYm1GdFpTSTZJbWx1YVhScFlXd2lmUS5fYlhnZVNjM0hXU3ZSczNqUmRCcDNybnNLbjRqRjA1TlZ3Z0J1MzJHYjRWY0hkUy14aXZmanRUT3F3RkNEY0pqeEJvQTA5T2dMZjNKUVJVSVB3OEtTUQ==";

let authToken = null;
let authTokenExpiry = 0;

// Helper: POST with JSON, return JSON
async function postJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { status: res.status, data };
}

// Function: Create Payment Intention (standard donation)
export async function createPaymentIntention({
  user,
  totalAmount,
  donation,
  merchantOrderId,
}) {
  const [firstName, lastName] = (user.name || "Anonymous User")
    .split(" ")
    .concat([""]);
  const phone = user.phone || "+201146955543";
  const email = user.email || "seif.amr.ebeid@gmail.com";
  console.log("user", user);
  console.log("totalAmount!", totalAmount);
  // Prepare items
  const items = [
    {
      name: donation.message || "Donation",
      amount: Math.round(totalAmount * 100),
      description: "Donation",
      quantity: 1,
    },
  ];

  // Prepare billing data
  const billingData = {
    first_name: firstName,
    last_name: lastName,
    phone_number: phone,
    email: email,
  };

  // Prepare payment methods
  const paymentMethods = ["card", INTEGRATION_ID];

  // Prepare request body
  const requestBody = {
    amount: Math.round(totalAmount * 100),
    currency: "EGP",
    expiration: 600,
    payment_methods: paymentMethods,
    items,
    billing_data: billingData,
    special_reference: merchantOrderId,
    redirection_url: `http://localhost/DonationPlatform/donationresult?type=standard&merchantOrderId=${merchantOrderId}`,
  };

  // Send request
  const { status, data } = await postJson(INTENTION_URL, requestBody, {
    Authorization: `Token ${SECRET}`,
  });

  if (status < 400) {
    return {
      success: true,
      redirectUrl: `${CHECKOUT_BASE_URL}?publicKey=${PUBLIC_KEY}&clientSecret=${data.client_secret}`,
    };
  } else {
    return {
      success: false,
      error: data,
    };
  }
}

// Function: Create Payment Intention (random donation)
export async function createRandomPaymentIntention({
  user,
  totalAmount,
  donation,
  merchantOrderId,
}) {
  const [firstName, lastName] = (user.name || "Anonymous User")
    .split(" ")
    .concat([""]);
  const phone = user.phone || "+201146955543";
  const email = user.email || "seif.amr.ebeid@gmail.com";

  const items = [
    {
      name: donation.id,
      amount: Math.round(totalAmount * 100),
      description: donation.message,
      quantity: 1,
    },
  ];

  const billingData = {
    first_name: firstName,
    last_name: lastName,
    phone_number: phone,
    email: email,
  };

  const paymentMethods = ["card", INTEGRATION_ID];

  const requestBody = {
    amount: Math.round(totalAmount * 100),
    currency: "EGP",
    expiration: 600,
    payment_methods: paymentMethods,
    items,
    billing_data: billingData,
    special_reference: merchantOrderId,
    redirection_url: `http://localhost:5173/thanku?type=random&merchant_order_id=${merchantOrderId}`,
  };

  const { status, data } = await postJson(INTENTION_URL, requestBody, {
    Authorization: `Token ${SECRET}`,
  });

  if (status < 400) {
    // Redirect to the Paymob checkout page if successful
    window.location.href = `${CHECKOUT_BASE_URL}?publicKey=${PUBLIC_KEY}&clientSecret=${data.client_secret}`;
    return {
      success: true,
      redirectUrl: `${CHECKOUT_BASE_URL}?publicKey=${PUBLIC_KEY}&clientSecret=${data.client_secret}`,
    };
  } else {
    return {
      success: false,
      error: data,
    };
  }
}

// Function: Get Paymob Auth Token (auto-cached)
export async function getPaymobToken() {
  const now = Date.now();
  if (authToken && authTokenExpiry > now) {
    return { token: authToken, success: true };
  }

  const body = { api_key: API_KEY };
  const { status, data } = await postJson(TOKEN_URL, body);

  if (status < 400) {
    authToken = data.token;
    authTokenExpiry = now + 40 * 60 * 1000;
    return { token: authToken, success: true };
  } else {
    return { token: null, success: false, error: data };
  }
}

// Function: Check Payment Status (by merchantOrderId)
export async function checkPaymentStatus(merchantOrderId) {
  if (!merchantOrderId) return false;

  const tokenResult = await getPaymobToken();
  if (!tokenResult.success) return false;

  const body = {
    merchant_order_id: merchantOrderId,
    auth_token: tokenResult.token,
  };

  const data = await postJson(INQUIRY_URL, body);

  return data.data.success;
}

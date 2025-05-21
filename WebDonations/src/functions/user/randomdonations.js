import APIURL from "../baseurl.js";
import { v4 as uuidv4 } from "uuid";
import {
  createRandomPaymentIntention,
  checkPaymentStatus,
} from "../payment.js";
import { sendDonationConfirmationEmail } from "../email.js";

const API_URL = `${APIURL}user/CRUDrandomdonation.php`;

export async function handleRandomDonation(user, amount, message = "") {
  if (!amount || amount <= 0) {
    console.error("Missing or invalid amount:", amount);
    throw new Error("Valid amount is required for random donation");
  }

  // Generate a unique merchant order ID
  const merchantOrderId = uuidv4();

  try {
    // 1. Create random donation record in database
    const donationData = {
      operation: "insert",
      amount: parseFloat(amount), // Ensure amount is a number
      merchent_order_id: merchantOrderId,
      email: user.email,
    };
    console.log("User data:", user);

    const donationResult = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donationData),
    });

    const donationResponse = await donationResult.json();
    console.log("Random donation API response:", donationResponse);

    if (!donationResult.ok || !donationResponse.success) {
      const errorMsg =
        donationResponse.message || "Failed to create random donation record";
      console.error("Random donation API error:", donationResponse);
      throw new Error(errorMsg);
    }

    // 2. Initialize payment with Paymob
    const paymentResult = await createRandomPaymentIntention({
      user,
      totalAmount: parseFloat(amount),
      donation: {
        id: donationResponse.donation.id || 0,
        message: message || "Random Donation",
      },
      merchantOrderId,
    });

    // Return donation info and payment redirect URL
    if (!paymentResult || !paymentResult.redirectUrl) {
      console.error("Payment initialization failed:", paymentResult);
      throw new Error("Failed to initialize payment");
    }
    return {
      success: true,
      donation: donationResponse.donation,
      paymentUrl: paymentResult.redirectUrl,
      merchantOrderId,
    };
  } catch (error) {
    console.error("Random donation process failed:", error);
    throw error;
  }
}

export async function updateRandomDonationStatus(updateData) {
  if (!updateData.merchent_order_id || !updateData.status) {
    throw new Error("Merchant order ID and status are required");
  }

  updateData.operation = "update";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    const data = await res.json();
    console.log("Update random donation status response:", data);
    if (!res.ok || data.success === false) {
      throw new Error(
        data.message || "Failed to update random donation status"
      );
    }

    return data.donation;
  } catch (error) {
    console.error("Status update failed:", error);
    throw error;
  }
}

export async function verifyRandomPaymentAndUpdate(merchantOrderId) {
  if (!merchantOrderId) {
    throw new Error("Merchant order ID is required");
  }

  try {
    // Check payment status with Paymob
    const paymentStatus = await checkPaymentStatus(merchantOrderId);
    console.log("Payment status:", paymentStatus);

    // Update donation status based on payment result
    const status = paymentStatus ? "completed" : "failed";

    // Fetch donation data from database
    const getData = {
      operation: "get",
      merchent_order_id: merchantOrderId,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getData),
    });

    const donationData = await res.json();

    if (!donationData.success || !donationData.donation) {
      throw new Error("Failed to retrieve donation data");
    }

    // Update donation status
    const updatedDonation = await updateRandomDonationStatus({
      merchent_order_id: merchantOrderId,
      status: status,
    });

    // Send confirmation email if payment was successful
    if (status === "completed") {
      try {
        // Fixed: Use the proper parameters for email sending
        console.log("Sending confirmation email...");
        console.log("Donation data:", donationData.donation.email);
        await sendDonationConfirmationEmail(
          donationData.donation.email,
          parseFloat(donationData.donation.amount)
        );
        console.log("Donation confirmation email sent successfully");
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't throw error here - we still want to return the updated donation
      }
    }

    return updatedDonation;
  } catch (error) {
    console.error("Payment verification failed:", error);
    throw error;
  }
}

export async function getDonationByMerchantOrderId(merchantOrderId) {
  if (!merchantOrderId) {
    throw new Error("Merchant order ID is required");
  }

  try {
    const getData = {
      operation: "get",
      merchent_order_id: merchantOrderId,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getData),
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Failed to retrieve donation");
    }

    return data.donation;
  } catch (error) {
    console.error("Error retrieving donation:", error);
    throw error;
  }
}

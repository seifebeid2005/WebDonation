import APIURL from "../baseurl.js";
import { v4 as uuidv4 } from "uuid";
import {
  createPaymentIntention,
  checkPaymentStatus,
} from "../../functions/payment.js";
import { sendDonationConfirmationEmail } from "../email.js";

const API_URL = `${APIURL}user/CRUDdonation.php`;

export async function handleCauseDonation(user, causeId, amount, message = "") {
  if (!amount || amount <= 0) {
    console.error("Missing or invalid amount:", amount);
    throw new Error("Valid amount is required for cause donation");
  }
  if (!causeId) {
    throw new Error("Cause ID is required for cause donation");
  }

  // Generate a unique merchant order ID
  const merchantOrderId = uuidv4();

  try {
    // 1. Create donation record in database
    const donationData = {
      operation: "insert",
      user_id: user.id,
      cause_id: causeId,
      amount: parseFloat(amount), // Ensure amount is a number
      merchent_order_id: merchantOrderId,
      email: user.email,
    };

    const donationResult = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donationData),
    });

    const donationResponse = await donationResult.json();
    if (!donationResult.ok || !donationResponse.success) {
      const errorMsg =
        donationResponse.message || "Failed to create donation record";
      console.error("Donation API error:", donationResponse);
      throw new Error(errorMsg);
    }
    console.log("Donation record created:", donationResponse);

    // 2. Initialize payment with Paymob (or your payment gateway)
    const paymentResult = await createPaymentIntention({
      user,
      totalAmount: parseFloat(amount),
      donation: {
        id: donationResponse.donation.id || 0,
        cause_id: causeId,
        message: message || "Donation to cause",
      },
      merchantOrderId,
    });

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
    console.error("Cause donation process failed:", error);
    throw error;
  }
}

export async function updateDonationStatus(updateData) {
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
    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Failed to update donation status");
    }
    return data.donation;
  } catch (error) {
    console.error("Donation status update failed:", error);
    throw error;
  }
}

export async function verifyCausePaymentAndUpdate(merchantOrderId) {
  if (!merchantOrderId) {
    throw new Error("Merchant order ID is required");
  }

  try {
    // Check payment status with Paymob or your gateway
    const paymentStatus = await checkPaymentStatus(merchantOrderId);
    const newStatus = paymentStatus ? "confirmed" : "failed";

    // Fetch donation data from database
    const donationData = await getDonationByMerchantOrderId(merchantOrderId);
    if (!donationData) {
      throw new Error("Failed to retrieve donation data");
    }

    // If the donation is already confirmed, do NOTHING (no update, no raised_amount update)
    if (donationData.status === "confirmed") {
      return donationData;
    }

    // If not already confirmed, update status and raised_amount if payment succeeded
    let updatedDonation = donationData;
    if (newStatus === "confirmed") {
      // Update donation status
      updatedDonation = await updateDonationStatus({
        merchent_order_id: merchantOrderId,
        status: "confirmed",
      });

      // Update cause raised amount (only once, since donation was not confirmed before)
      await updateCauseRaisedAmount(donationData.cause_id, donationData.amount);

      // Send confirmation email
      try {
        await sendDonationConfirmationEmail(
          donationData.email,
          parseFloat(donationData.amount)
        );
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    } else if (donationData.status !== "failed") {
      // If failed and not already failed, update to failed
      updatedDonation = await updateDonationStatus({
        merchent_order_id: merchantOrderId,
        status: "failed",
      });
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

export async function updateCauseRaisedAmount(causeId, amount) {
  if (!causeId || !amount || amount <= 0) {
    throw new Error(
      "Cause ID and a positive amount are required to update raised amount."
    );
  }

  const payload = {
    operation: "update_cause_raised",
    cause_id: causeId,
    amount: parseFloat(amount),
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Failed to update cause raised amount");
    }
    return data;
  } catch (error) {
    console.error("Error updating cause raised amount:", error);
    throw error;
  }
}

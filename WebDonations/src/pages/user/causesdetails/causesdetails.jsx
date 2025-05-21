import React, { use, useEffect, useState } from "react";
import { getCauseById } from "../../../functions/user/causes";
import {
  handleCauseDonation,
  verifyCausePaymentAndUpdate,
} from "../../../functions/user/donations"; // Import your new function!
import "./causesdetails.css";
import SuccessModal from "../../shared/SuccessModal/SuccessModal";

import { getUserData } from "../../../functions/user/auth";
import Footer from "../../shared/Footer/Footer";
import Header from "../../shared/Header/Header";
import Loader from "../../shared/Loader/Loader";
// import AuthContext from ...  // If you are using context for user data

// Helper to get query param value
function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

export default function CauseDetailsPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [cause, setCause] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [user, setuser] = useState(null); // Placeholder for user state
  const merchantOrderIdFromUrl = getQueryParam("merchant_order_id");

  useEffect(() => {
    if (!merchantOrderIdFromUrl) return;

    let isMounted = true;

    const verifyPayment = async () => {
      try {
        const result = await verifyCausePaymentAndUpdate(
          merchantOrderIdFromUrl
        );
        if (!isMounted) return;
        console.log("Payment verification result:", result);
        if (result.status == "confirmed") {
          setSuccessMessage(
            "Your donation was successful and the cause total has been updated!"
          );
          setShowSuccessModal(true);
          // Optionally, refresh cause data to reflect new raised amount
          setLoading(true);
          const causeId = getQueryParam("causeId");
          if (causeId) {
            getCauseById(causeId)
              .then((c) => {
                setCause(c);
                setLoading(false);
              })
              .catch(() => setLoading(false));
          }
        } else {
          setSuccessMessage("Payment verification failed.");
          setShowSuccessModal(true);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error verifying payment:", error);
        setSuccessMessage("Error verifying payment. Please try again.");
        setShowSuccessModal(true);
      }
    };

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [merchantOrderIdFromUrl]);
  // i want after geting the url this refresh the page
  useEffect(() => {
    const fetchCause = () => {
      const causeId = getQueryParam("causeId");
      if (!causeId) {
        setError("No cause ID provided in the URL.");
        setLoading(false);
        return;
      }
      setLoading(true);
      getCauseById(causeId)
        .then((c) => {
          if (!c) setError("Cause not found.");
          setCause(c);
          setLoading(false);
        })
        .catch((e) => {
          setError(e.message || "Failed to load cause details.");
          setLoading(false);
        });
    };
    fetchCause();
  }, []);

  useEffect(() => {
    // Simulate fetching user data
    const fetchUser = async () => {
      const data = await getUserData();
      if (data) {
        setuser(data.user);
        console.log("User data:", data.user);
      } else {
        setuser(null);
      }
    };
    fetchUser();
  }, []);

  const handleDonate = async () => {
    const amount = parseFloat(donationAmount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }
    if (!user) {
      alert("You must be logged in to donate.");
      return;
    }

    setProcessing(true);
    setError("");
    try {
      // Create donation record and get payment URL

      const donationResult = await handleCauseDonation(user, cause.id, amount);
      console.log("Donation Result:", donationResult);
      if (donationResult.success && donationResult.paymentUrl) {
        // Redirect to payment
        window.location.href = donationResult.paymentUrl;
      } else {
        setError(
          donationResult.message ||
            "Failed to process payment. Please try again."
        );
      }
    } catch (error) {
      setError(
        error?.message || "Failed to process donation. Please try again later."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    );
  if (!cause) return null;

  // Calculate progress percentage
  const progressPercentage =
    cause.goal_amount > 0
      ? Math.min(
          Math.round((cause.raised_amount / cause.goal_amount) * 100),
          100
        )
      : 0;

  return (
    <>
      <Header />
      <div className="container">
        <div className="cause-detail">
          <img
            className="detail-image"
            src={
              cause.image_url ||
              "https://via.placeholder.com/800x400?text=No+Image"
            }
            alt={cause.title}
          />
          <div className="detail-content">
            <h1 className="detail-title">{cause.title}</h1>
            {cause.short_description && (
              <div className="detail-short-desc">{cause.short_description}</div>
            )}

            <div className="detail-stats">
              <div className="stat-item">
                <div className="stat-label">Goal</div>
                <div className="stat-value">
                  {cause.goal_amount} {cause.currency || "EGP"}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Raised</div>
                <div className="stat-value raised">
                  {cause.raised_amount} {cause.currency || "EGP"}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Status</div>
                <div className="stat-value">{cause.status || "Active"}</div>
              </div>
            </div>

            <div className="cause-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: "0.9rem",
                  marginTop: "0.3rem",
                }}
              >
                {progressPercentage}% Complete
              </div>
            </div>

            <div className="detail-description">
              {cause.description ||
                "No detailed description available for this cause."}
            </div>

            <div className="donation-form">
              <h3 className="form-header">Make a Donation</h3>
              <div className="input-group">
                <span className="currency-symbol">{cause.currency || "$"}</span>
                <input
                  type="number"
                  min="1"
                  className="detail-input"
                  placeholder="Enter donation amount"
                  value={donationAmount}
                  onChange={(e) =>
                    setDonationAmount(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  disabled={processing}
                />
              </div>
              <button
                onClick={handleDonate}
                className="detail-button"
                disabled={processing}
              >
                {processing ? "Processing..." : "Donate Now"}
              </button>
            </div>

            {(cause.start_date || cause.end_date) && (
              <div className="detail-dates">
                {cause.start_date && `Campaign starts: ${cause.start_date}`}
                {cause.start_date && cause.end_date && " | "}
                {cause.end_date && `Ends: ${cause.end_date}`}
              </div>
            )}
          </div>
        </div>
      </div>
      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
      <Footer />
    </>
  );
}

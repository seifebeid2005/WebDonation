import React, { useEffect, useState } from "react";
import { getCauseById } from "../../../functions/user/causes";
import "./causesdetails.css";
import Footer from "../../shared/Footer/Footer";
import Header from "../../shared/Header/Header";
import Loader from "../../shared/Loader/Loader";
import { createPaymentIntention } from "../../../functions/payment";
import UUID from "react-uuid";
// Helper to get query param value

function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

export default function CauseDetailsPage() {
  const [cause, setCause] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, []);

  const handleDonate = async () => {
    const amount = parseFloat(donationAmount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    try {
      // Show loading indicator or disable button here
      const merchantOrderId = UUID();

      // Get user data from context/state/props or use default values
      const user = {
        name: "John Doe", // Replace with actual user name from your auth context
        phone: "01012345678", // Replace with actual user phone
        email: "john.doe@example.com", // Replace with actual user email
      };

      console.log("Creating payment intent...");
      const paymentIntent = await createPaymentIntention({
        user,
        totalAmount: amount, // Note the parameter name change from amount to totalAmount
        donation: {
          id: cause.id,
          message: cause.title || "Donation to cause",
        },
        merchantOrderId,
      });

      if (paymentIntent.success) {
        console.log("Payment Intent Created:", paymentIntent);
        // Redirect to the payment page
        window.location.href = paymentIntent.redirectUrl;
      } else {
        console.error("Error details:", paymentIntent.error);
        alert("Failed to process payment. Please try again.");
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      alert("Failed to process donation. Please try again later.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

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
                />
              </div>
              <button onClick={handleDonate} className="detail-button">
                Donate Now
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
      <Footer />
    </>
  );
}

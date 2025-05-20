import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyRandomPaymentAndUpdate } from "../../../functions/user/donations";
import { format } from "date-fns";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaHome,
  FaHeart,
  FaRedo,
  FaSearch,
} from "react-icons/fa";
import "./thanks.css"; // We'll define this CSS below
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function ThankYouPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get params from URL
  const merchantOrderId = searchParams.get("merchant_order_id") || "";
  const donationType = searchParams.get("type") || "standard"; // 'standard' or 'random'

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donorName, setDonorName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonationData = async () => {
      if (!merchantOrderId) {
        setLoading(false);
        return;
      }

      try {
        // Call different verification based on donation type

        const result = await verifyRandomPaymentAndUpdate(merchantOrderId);

        setDonation(result);

        // If we have user info stored locally, use it for donor name
        const storedName = localStorage.getItem("user_name");
        if (storedName) {
          setDonorName(storedName);
        }
      } catch (err) {
        console.error("Error verifying donation:", err);
        setError(err.message || "Failed to verify donation status");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationData();

    // Setup auto-refresh for pending donations
    let refreshTimer;
    if (donation?.status === "pending") {
      refreshTimer = setTimeout(() => {
        window.location.reload();
      }, 30000); // 30 seconds
    }

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  }, [merchantOrderId, donationType, donation?.status]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMMM d, yyyy, h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  // Helper function to format amount
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Determine status-based styles and content
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle />;
      case "pending":
        return <FaClock />;
      default:
        return <FaTimesCircle />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#4CAF50"; // Green
      case "pending":
        return "#ff9800"; // Orange
      default:
        return "#f44336"; // Red
    }
  };

  const getStatusTitle = (status) => {
    switch (status) {
      case "completed":
        return "Thank You for Your Donation!";
      case "pending":
        return "Processing Your Donation";
      default:
        return "Donation Unsuccessful";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "completed":
        return "Your generosity makes a real difference. We've received your donation and are grateful for your support.";
      case "pending":
        return "We're currently processing your donation. Please check back later for confirmation.";
      default:
        return "We encountered an issue with your donation. Please check the details below or try again.";
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container">
        <div className="thank-you-card">
          <div className="not-found">
            <div className="card-icon" style={{ color: "#ff9800" }}>
              <FaClock size={60} />
            </div>
            <h2>Verifying Donation</h2>
            <p>Please wait while we verify your donation details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show donation not found
  if (!donation && !loading) {
    return (
      <div className="container">
        <div className="thank-you-card">
          <div className="not-found">
            <div className="card-icon" style={{ color: "#ff9800" }}>
              <FaSearch size={60} />
            </div>
            <h2>Donation Not Found</h2>
            <p>
              We couldn't find any donation with the provided reference ID.
              Please check the ID and try again.
            </p>
            <div className="actions">
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/")}
              >
                <FaHome /> Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="thank-you-card">
          {donation && (
            <>
              <div
                className="card-header"
                style={{ backgroundColor: getStatusColor(donation.status) }}
              >
                <div className="card-icon">
                  {getStatusIcon(donation.status)}
                </div>
                <h1>{getStatusTitle(donation.status)}</h1>
                <p>{getStatusMessage(donation.status)}</p>
              </div>

              <div className="card-body">
                <div className="donation-info">
                  <h2>Donation Details</h2>

                  <div className="info-group">
                    <div className="info-label">Status:</div>
                    <div className="info-value">
                      <span
                        className={`status-badge status-${donation.status}`}
                      >
                        {donation.status.charAt(0).toUpperCase() +
                          donation.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="info-group">
                    <div className="info-label">Amount:</div>
                    <div className="info-value">
                      EGP {formatAmount(donation.amount)}
                    </div>
                  </div>

                  {donorName && (
                    <div className="info-group">
                      <div className="info-label">Donor:</div>
                      <div className="info-value">{donorName}</div>
                    </div>
                  )}

                  <div className="info-group">
                    <div className="info-label">Date:</div>
                    <div className="info-value">
                      {formatDate(donation.donated_at)}
                    </div>
                  </div>

                  <div className="info-group">
                    <div className="info-label">Reference ID:</div>
                    <div className="info-value">
                      <span className="receipt-number">
                        {donation.merchent_order_id}
                      </span>
                    </div>
                  </div>

                  <div className="info-group">
                    <div className="info-label">Donation Type:</div>
                    <div className="info-value">
                      {donationType === "random"
                        ? "Random Donation"
                        : "Cause Donation"}
                    </div>
                  </div>
                </div>

                {donation.status === "completed" && (
                  <div className="message-box">
                    <h3>What happens next?</h3>
                    <p>
                      Your donation will be put to work immediately. We'll send
                      a confirmation email with the details of your
                      contribution.
                    </p>
                    <p>
                      If you have any questions about your donation, please
                      contact our support team with your reference ID.
                    </p>
                  </div>
                )}

                {donation.status === "pending" && (
                  <div className="message-box warning">
                    <h3>Payment in Process</h3>
                    <p>
                      Your donation is being processed by our payment provider.
                      This usually takes only a few minutes, but can
                      occasionally take longer.
                    </p>
                    <p>
                      You can refresh this page to check for updates or check
                      your email for a confirmation message.
                    </p>
                  </div>
                )}

                {donation.status === "failed" && (
                  <div className="message-box error">
                    <h3>Payment Issues</h3>
                    <p>
                      Your donation couldn't be processed successfully. This
                      might be due to:
                    </p>
                    <ul>
                      <li>Insufficient funds</li>
                      <li>Payment authorization failure</li>
                      <li>Connection issues during payment</li>
                    </ul>
                    <p>
                      Please try again or contact your bank if the issue
                      persists.
                    </p>
                  </div>
                )}

                <div className="actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/")}
                  >
                    <FaHome /> Return to Home
                  </button>

                  {donation.status === "completed" ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/causes")}
                    >
                      <FaHeart /> Support Another Cause
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(
                          donationType === "random"
                            ? "/donate/random"
                            : "/causes"
                        )
                      }
                    >
                      <FaRedo /> Try Again
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

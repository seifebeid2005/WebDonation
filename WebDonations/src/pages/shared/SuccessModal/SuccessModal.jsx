import React from "react";
import "./SuccessModal.css";

export default function SuccessModal({ open, onClose, message }) {
  if (!open) return null;

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div
        className="success-modal-content animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="success-message">
          {message || "Donation successful!"}
        </div>
        <button className="success-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

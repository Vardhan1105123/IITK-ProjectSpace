"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./confirmPopUp.css";

// Props for confirm popup component
type ConfirmPopUpProps = {
  heading: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
};

// Confirmation modal component
const ConfirmPopUp = ({
  heading,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmPopUpProps) => {

  // Prevents background scrolling while modal is open
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Render modal using React portal
  return createPortal(
    <div className="confirm-backdrop">
      <div className="confirm-card">
        <h2 className="confirm-heading">{heading}</h2>
        <p className="confirm-message">{message}</p>

        {/* Action buttons */}
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn--cancel" onClick={onCancel}>
            {cancelLabel}
          </button>

          <button
            className={`confirm-btn ${isDestructive ? "confirm-btn--destructive" : "confirm-btn--primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default ConfirmPopUp;
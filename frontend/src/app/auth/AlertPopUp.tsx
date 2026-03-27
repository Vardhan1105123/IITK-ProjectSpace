"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./AlertPopUp.css";

// Props for AlertPopUp component
type AlertPopUpProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

// Modal alert popup component
const AlertPopUp = ({ message, type, onClose }: AlertPopUpProps) => {
  // Prevents background scrolling when popup is open
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Renders popup using React portal
  return createPortal(
    <div className="alert-backdrop">
      <div className={`alert-card ${type}`}>
        <h2 className="alert-heading">
          {type === "success" ? "Success!" : "Wait a minute..."}
        </h2>
        <p className="alert-message">{message}</p>
        <button className="primary-btn" onClick={onClose}>
          Okay
        </button>
      </div>
    </div>,
    document.body
  );
};

export default AlertPopUp;
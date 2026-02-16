"use client";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./otpPopUp.css";

type OtpModalProps = {
  message: string;
  onVerify: (otp: string) => void;
  onClose: () => void;
};

const OtpModal = ({ message, onVerify, onClose }: OtpModalProps) => {
  const [otp, setOtp] = useState("");

  const handleVerifyClick = () => {
    if(otp.length !== 6) return;
    onVerify(otp);
  }
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="otp-backdrop">
      <div className="otp-card">
        <h2 className="otp-heading">OTP Verification</h2>
        <p className="otp-message">{message}</p>

        <label>Enter OTP</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit OTP"
        />

        <button className="primary-btn" onClick={handleVerifyClick}>
          Verify
        </button>
      </div>
    </div>,
    document.body
  );
};

export default OtpModal;

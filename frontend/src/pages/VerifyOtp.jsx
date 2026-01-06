import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // userId passed from Login.jsx
  const userId = location.state?.userId;

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await authAPI.verifyOtp({
        userId,
        otp,
      });

      // ✅ SAVE TOKEN
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      // ✅ REDIRECT
      if (!response.data.profileCompleted) {
        navigate("/complete-profile", { replace: true });
      } else {
        navigate("/student/events", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Verify OTP</h2>
        <p className="login-subtitle">
          Enter the OTP sent to your email
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            className="login-input"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            type="submit"
            className={`login-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;

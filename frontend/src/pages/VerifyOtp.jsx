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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Verify OTP
        </h2>
        <p className="text-center text-gray-500 mt-1 mb-6">
          Enter the OTP sent to your email
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 py-2 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;

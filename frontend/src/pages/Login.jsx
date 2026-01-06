import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import "./Login.css";

const Login = () => {
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirectUser = useCallback(
    (user) => {
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "staff") {
        navigate("/staff/dashboard", { replace: true });
      } else if (user.role === "student") {
        if (!user.profileCompleted) {
          navigate("/complete-profile", { replace: true });
        } else {
          navigate("/student/events", { replace: true });
        }
      } else {
        navigate("/events", { replace: true });
      }
    },
    [navigate]
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });

      // 👇 STUDENT OTP FLOW
      if (response.data.otpRequired) {
        navigate("/verify-otp", {
          state: { userId: response.data.userId },
        });
        return;
      }

      // 👇 ADMIN / STAFF
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      redirectUser(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid login credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Welcome</h2>
        <p className="login-subtitle">Sign in to your account</p>

        <div className="role-tabs">
          <button
            type="button"
            className={`role-tab ${userType === "student" ? "active" : ""}`}
            onClick={() => setUserType("student")}
          >
            Student
          </button>
          <button
            type="button"
            className={`role-tab ${userType === "staff" ? "active" : ""}`}
            onClick={() => setUserType("staff")}
          >
            Faculty
          </button>
          <button
            type="button"
            className={`role-tab ${userType === "admin" ? "active" : ""}`}
            onClick={() => setUserType("admin")}
          >
            Admin
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="login-input"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="login-input"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password
          </Link>

          <button
            type="submit"
            className={`login-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="create-account-section">
          <p>Don't have an account?</p>
          <button
            type="button"
            className="create-account-btn"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

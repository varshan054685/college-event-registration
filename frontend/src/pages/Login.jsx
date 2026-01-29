import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";

const Login = () => {
  const [userType, setUserType] = useState("student"); // UI only
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔁 Redirect based on role
  const redirectUser = useCallback(
    (user) => {
      if (!user || !user.role) {
        navigate("/login", { replace: true });
        return;
      }

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
    [navigate],
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

      // OTP flow (future)
      if (response.data.otpRequired) {
        navigate("/verify-otp", {
          state: { userId: response.data.userId },
        });
        return;
      }

      // ✅ Save token & user
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          profileCompleted: response.data.profileCompleted,
        }),
      );

      redirectUser({
        role: response.data.role,
        profileCompleted: response.data.profileCompleted,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid login credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 text-gray-600">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Welcome
        </h2>
        <p className="text-sm text-center mb-6">Sign in to your account</p>

        {/* ROLE TABS (UI ONLY) */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg mb-6">
          {["student", "staff", "admin"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setUserType(role)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                userType === role
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              {role === "staff"
                ? "Faculty"
                : role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-full px-4 py-2 mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border rounded-full px-4 py-2 mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Link
            to="/forgot-password"
            className="block text-right text-sm text-blue-600 underline mb-4"
          >
            Forgot Password
          </Link>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-full py-2 text-white ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t">
          <p className="text-sm mb-2">Don't have an account?</p>
          <button
            onClick={() => navigate("/register")}
            className="w-full rounded-full py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

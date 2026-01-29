import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Register = () => {
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: userType,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      const user = response.data;
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "staff") navigate("/staff/dashboard");
      else if (user.role === "student") {
        if (!user.profileCompleted) navigate("/complete-profile");
        else navigate("/student/events");
      } else navigate("/events");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Sign up to get started
        </p>

        {/* Role Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          {["student", "staff"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setUserType(role)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition
                ${
                  userType === role
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {role === "student" ? "Student" : "Faculty"}
            </button>
          ))}
        </div>

        {/* Admin Note */}
        <div className="bg-blue-50 text-blue-800 text-xs rounded-lg px-4 py-3 mb-4 text-center">
          <strong>Note:</strong> Admin accounts are created by existing
          administrators.
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-full py-2 text-white font-medium transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t">
          <p className="text-sm text-gray-500 mb-2">
            Already have an account?
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-full py-2 border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-600 hover:text-white transition"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;

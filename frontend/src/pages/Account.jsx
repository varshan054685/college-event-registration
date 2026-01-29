import React, { useState, useEffect } from "react";
import { authAPI } from "../services/api";

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAPI.getMe();
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user info.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await authAPI.changePassword(password);
      setSuccess("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    }
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading...</p>;

  if (error && !user)
    return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="mx-auto mt-8 max-w-xl rounded-lg bg-gray-50 p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">Account</h2>

      {user && (
        <div className="mb-6 space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Name:</span> {user.name}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
        </div>
      )}

      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Change Password
        </h3>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-md bg-green-100 px-4 py-2 text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Account;

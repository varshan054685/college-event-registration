import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Register = () => {
  const [userType, setUserType] = useState("student"); // student, staff (admin cannot register)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: userType, // Pass selected role
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      // Redirect based on role and profile completion
      const user = response.data;
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "staff") {
        navigate("/staff/dashboard");
      } else if (user.role === "student") {
        if (!user.profileCompleted) {
          navigate("/complete-profile");
        } else {
          navigate("/student/events");
        }
      } else {
        navigate("/events");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      backgroundColor: "#f3f4f6"
    }}>
      <div style={{
        backgroundColor: "white",
        color: "#6b7280",
        maxWidth: "420px",
        margin: "0 16px",
        padding: "32px",
        textAlign: "left",
        fontSize: "14px",
        borderRadius: "12px",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: "600",
          marginBottom: "8px",
          textAlign: "center",
          color: "#1f2937"
        }}>
          Create Account
        </h2>
        
        <p style={{
          fontSize: "14px",
          textAlign: "center",
          color: "#6b7280",
          marginBottom: "24px"
        }}>
          Sign up to get started
        </p>

        {/* Role Selection Tabs */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          backgroundColor: "#f3f4f6",
          padding: "4px",
          borderRadius: "8px"
        }}>
          <button
            type="button"
            onClick={() => setUserType("student")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: userType === "student" ? "#6366f1" : "transparent",
              color: userType === "student" ? "white" : "#6b7280",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s"
            }}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setUserType("staff")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: userType === "staff" ? "#6366f1" : "transparent",
              color: userType === "staff" ? "white" : "#6b7280",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s"
            }}
          >
            Faculty
          </button>
        </div>

        <div style={{
          padding: "10px",
          marginBottom: "16px",
          backgroundColor: "#eff6ff",
          color: "#1e40af",
          borderRadius: "8px",
          fontSize: "12px",
          textAlign: "center"
        }}>
          <strong>Note:</strong> Admin accounts are created by existing administrators. Please contact your admin for access.
        </div>

        {error && (
          <div style={{
            padding: "12px",
            marginBottom: "16px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "1px solid rgba(107, 114, 128, 0.3)",
              outline: "none",
              borderRadius: "9999px",
              padding: "10px 16px",
              marginBottom: "12px",
              fontSize: "14px"
            }}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "1px solid rgba(107, 114, 128, 0.3)",
              outline: "none",
              borderRadius: "9999px",
              padding: "10px 16px",
              marginBottom: "12px",
              fontSize: "14px"
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "1px solid rgba(107, 114, 128, 0.3)",
              outline: "none",
              borderRadius: "9999px",
              padding: "10px 16px",
              marginBottom: "12px",
              fontSize: "14px"
            }}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "1px solid rgba(107, 114, 128, 0.3)",
              outline: "none",
              borderRadius: "9999px",
              padding: "10px 16px",
              marginBottom: "12px",
              fontSize: "14px"
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginBottom: "12px",
              backgroundColor: loading ? "#9ca3af" : "#6366f1",
              padding: "10px",
              borderRadius: "9999px",
              color: "white",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "500"
            }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div style={{
          textAlign: "center",
          marginTop: "24px",
          paddingTop: "24px",
          borderTop: "1px solid #e5e7eb"
        }}>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "8px" }}>
            Already have an account?
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "9999px",
              backgroundColor: "transparent",
              border: "1px solid #6366f1",
              color: "#6366f1",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#6366f1";
              e.target.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#6366f1";
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;


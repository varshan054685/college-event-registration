import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentAPI, authAPI } from "../services/api";
import "./Profile.css";

const departments = [
  "Computer Science and Engineering",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
];

const Profile = () => {
  const [formData, setFormData] = useState({
    rollNumber: "",
    registrationNumber: "",
    contactNumber: "",
    department: "",
    classTeacherId: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAPI.getMe();
        if (response.data.profileCompleted) {
          navigate("/student/events");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await studentAPI.completeProfile(formData);

      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        user.profileCompleted = true;
        localStorage.setItem("user", JSON.stringify(user));
      }

      navigate("/student/events");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Complete Your Profile</h2>
        <p className="profile-subtitle">
          Please complete your profile to access events
        </p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Roll Number *</label>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Registration Number *</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Number *</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Department *</label>
            <input
              type="text"
              name="department"
              list="departmentList"
              placeholder="Type your department"
              value={formData.department}
              onChange={handleChange}
              required
            />
            <datalist id="departmentList">
              {departments.map((dept, index) => (
                <option key={index} value={dept} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label>Class Teacher *</label>
            <input
              type="text"
              name="classTeacherId"
              placeholder="Enter Class Teacher ID"
              value={formData.classTeacherId}
              onChange={handleChange}
              required
            />
            <small className="helper-text">
              Ask your class teacher for their ID
            </small>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

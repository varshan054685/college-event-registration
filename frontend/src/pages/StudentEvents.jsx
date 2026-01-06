import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { studentAPI, authAPI } from "../services/api";
import EventCard from "../components/EventCard";

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Using useCallback to avoid useEffect dependency warnings
  const checkProfile = useCallback(async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
      if (!response.data.profileCompleted) {
        navigate("/complete-profile");
      }
    } catch (err) {
      console.error("Error checking profile:", err);
      setError("Failed to verify profile");
      setLoading(false);
    }
  }, [navigate]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await studentAPI.getAvailableEvents();
      setEvents(response.data);
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/complete-profile");
      } else {
        setError("Failed to load events");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkProfile();
    fetchEvents();
  }, [checkProfile, fetchEvents]);

  if (loading) {
    return (
      <div className="container">
        <p style={{ textAlign: "center" }}>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: "2rem" }}>Available Events</h2>

      {/* Optional: Show logged-in user info */}
      {user && (
        <p>
          Welcome, <strong>{user.name}</strong>!
        </p>
      )}

      {events.length === 0 ? (
        <p style={{ textAlign: "center" }}>No events available at the moment.</p>
      ) : (
        <div>
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentEvents;



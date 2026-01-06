import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studentAPI, authAPI } from "../services/api";

const StudentEventRegister = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Wrap in useCallback to avoid missing dependency warning
  const checkProfile = useCallback(async () => {
    try {
      const response = await authAPI.getMe();
      if (!response.data.profileCompleted) {
        navigate("/complete-profile");
      }
    } catch (err) {
      console.error("Error checking profile:", err);
      setError("Failed to verify profile");
      setLoading(false);
    }
  }, [navigate]);

  const fetchEvent = useCallback(async () => {
    try {
      const events = await studentAPI.getAvailableEvents();
      const foundEvent = events.data.find((e) => e._id === eventId);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        setError("Event not found or not available for you");
      }
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/complete-profile");
      } else {
        setError("Failed to load event details");
      }
    } finally {
      setLoading(false);
    }
  }, [eventId, navigate]);

  useEffect(() => {
    checkProfile();
    fetchEvent();
  }, [checkProfile, fetchEvent]);

  const handleRegister = async () => {
    try {
      await studentAPI.registerForEvent(eventId);
      setSuccess("Successfully registered for the event!");
      setTimeout(() => {
        navigate("/student/events");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container">
        <div className="alert alert-error">{error || "Event not found"}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "1rem" }}>{event.title}</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="event-card">
          <p>
            <strong>Description:</strong> {event.description}
          </p>
          <p>
            <strong>Date:</strong> {formatDate(event.date)}
          </p>
          <p>
            <strong>Time:</strong> {event.time}
          </p>
          <p>
            <strong>Venue:</strong> {event.venue}
          </p>
          <p>
            <strong>Category:</strong> {event.category}
          </p>
          <p>
            <strong>Participants:</strong> {event.currentParticipants} / {event.maxParticipants}
          </p>
          <p>
            <strong>Status:</strong> {event.status}
          </p>

          {event.currentParticipants < event.maxParticipants ? (
            <button
              onClick={handleRegister}
              className="btn btn-success"
              style={{ marginTop: "1rem" }}
            >
              Register for this Event
            </button>
          ) : (
            <p style={{ color: "red", marginTop: "1rem" }}>Event is full</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEventRegister;



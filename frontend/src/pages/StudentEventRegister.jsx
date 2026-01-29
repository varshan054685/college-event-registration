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

  // ✅ Check profile completion
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
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">
          {error || "Event not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {event.title}
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <div className="bg-white border rounded-lg p-6 shadow-sm space-y-2">
        <p>
          <span className="font-semibold">Description:</span>{" "}
          {event.description}
        </p>
        <p>
          <span className="font-semibold">Date:</span>{" "}
          {formatDate(event.date)}
        </p>
        <p>
          <span className="font-semibold">Time:</span> {event.time}
        </p>
        <p>
          <span className="font-semibold">Venue:</span> {event.venue}
        </p>
        <p>
          <span className="font-semibold">Category:</span> {event.category}
        </p>
        <p>
          <span className="font-semibold">Participants:</span>{" "}
          {event.currentParticipants} / {event.maxParticipants}
        </p>
        <p>
          <span className="font-semibold">Status:</span> {event.status}
        </p>

        {event.currentParticipants < event.maxParticipants ? (
          <button
            onClick={handleRegister}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
          >
            Register for this Event
          </button>
        ) : (
          <p className="text-red-600 mt-4 font-medium">
            Event is full
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentEventRegister;

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

  // ✅ Check profile completion
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Available Events
      </h2>

      {/* Optional: Logged-in user info */}
      {user && (
        <p className="mb-4 text-gray-700">
          Welcome, <span className="font-semibold">{user.name}</span>!
        </p>
      )}

      {events.length === 0 ? (
        <p className="text-center text-gray-500">
          No events available at the moment.
        </p>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentEvents;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventAPI } from "../services/api";

const EventRegister = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await eventAPI.getEvent(id);
      setEvent(response.data);
    } catch (err) {
      setError("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await eventAPI.registerForEvent(id);
      setSuccess("Successfully registered for the event!");
      setTimeout(() => {
        navigate("/events");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
          Event not found
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">{event.title}</h2>

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-100 text-green-700 px-4 py-2 rounded">
          {success}
        </div>
      )}

      <div className="bg-white shadow rounded p-6 space-y-3">
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
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Register for this Event
          </button>
        ) : (
          <p className="mt-4 text-red-600 font-semibold">Event is full</p>
        )}
      </div>
    </div>
  );
};

export default EventRegister;

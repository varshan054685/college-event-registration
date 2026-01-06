import React, { useState, useEffect } from "react";
import { staffAPI } from "../services/api";

const StaffDashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await staffAPI.getEvents();
      setEvents(response.data);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async (eventId) => {
    try {
      const response = await staffAPI.getEventRegistrations(eventId);
      setRegistrations(response.data.registrations);
      setSelectedEvent(response.data.event);
    } catch (err) {
      setError("Failed to load registrations");
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: "2rem" }}>Staff Dashboard</h2>
      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div>
          <h3>Available Events</h3>
          {events.length === 0 ? (
            <p>No events available</p>
          ) : (
            <div>
              {events.map((event) => (
                <div
                  key={event._id}
                  className="event-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => fetchRegistrations(event._id)}
                >
                  <h4>{event.title}</h4>
                  <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                  <p>Venue: {event.venue}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {selectedEvent ? (
            <div>
              <h3>Registrations for {selectedEvent.title}</h3>
              <p>
                <strong>Total: {registrations.length}</strong>
              </p>
              {registrations.length === 0 ? (
                <p>No registrations yet</p>
              ) : (
                <div>
                  {registrations.map((reg) => (
                    <div key={reg._id} className="event-card">
                      <p>
                        <strong>Name:</strong> {reg.studentId.name}
                      </p>
                      <p>
                        <strong>Roll Number:</strong> {reg.studentId.rollNumber}
                      </p>
                      <p>
                        <strong>Registration Number:</strong>{" "}
                        {reg.studentId.registrationNumber}
                      </p>
                      <p>
                        <strong>Contact:</strong> {reg.studentId.contactNumber}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3>Select an event to view registrations</h3>
              <p style={{ color: "#666" }}>
                Click on an event from the left to see your class students who
                registered
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;






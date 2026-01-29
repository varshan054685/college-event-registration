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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Staff Dashboard
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* EVENTS LIST */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Available Events
          </h3>

          {events.length === 0 ? (
            <p className="text-gray-500">No events available</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event._id}
                  onClick={() => fetchRegistrations(event._id)}
                  className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition"
                >
                  <h4 className="font-semibold text-gray-800">
                    {event.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Date:{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Venue: {event.venue}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* REGISTRATIONS */}
        <div>
          {selectedEvent ? (
            <>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Registrations for {selectedEvent.title}
              </h3>

              <p className="text-sm font-medium mb-4">
                Total: {registrations.length}
              </p>

              {registrations.length === 0 ? (
                <p className="text-gray-500">No registrations yet</p>
              ) : (
                <div className="space-y-4">
                  {registrations.map((reg) => (
                    <div
                      key={reg._id}
                      className="rounded-lg border bg-white p-4 shadow-sm"
                    >
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {reg.studentId.name}
                      </p>
                      <p>
                        <span className="font-semibold">
                          Roll Number:
                        </span>{" "}
                        {reg.studentId.rollNumber}
                      </p>
                      <p>
                        <span className="font-semibold">
                          Registration Number:
                        </span>{" "}
                        {reg.studentId.registrationNumber}
                      </p>
                      <p>
                        <span className="font-semibold">Contact:</span>{" "}
                        {reg.studentId.contactNumber}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 border">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Select an event
              </h3>
              <p className="text-gray-500 text-sm">
                Click an event on the left to see registered students
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

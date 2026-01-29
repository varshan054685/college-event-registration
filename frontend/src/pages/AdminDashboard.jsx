import React, { useState, useEffect } from "react";
import { adminAPI } from "../services/api";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    maxParticipants: "",
    category: "",
    allowedDepartments: [],
    allowedClasses: [],
    brochure: null,
  });

  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    password: "",
    staffId: "",
    staffDepartment: "",
    className: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, staffRes] = await Promise.all([
        adminAPI.getAllEvents(),
        adminAPI.getAllStaff(),
      ]);
      setEvents(eventsRes.data);
      setStaff(staffRes.data);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await adminAPI.createEvent({
        ...eventForm,
        allowedDepartments: eventForm.allowedDepartments.filter(Boolean),
        allowedClasses: eventForm.allowedClasses.filter(Boolean),
      });

      setSuccess("Event created successfully!");
      setShowCreateEvent(false);
      setEventForm({
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        maxParticipants: "",
        category: "",
        allowedDepartments: [],
        allowedClasses: [],
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    }
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await adminAPI.createStaff(staffForm);
      setSuccess("Staff created successfully!");
      setShowCreateStaff(false);
      setStaffForm({
        name: "",
        email: "",
        password: "",
        staffId: "",
        staffDepartment: "",
        className: "",
        phone: "",
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create staff");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {error && (
        <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-2">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded bg-green-100 text-green-700 px-4 py-2">
          {success}
        </div>
      )}

      <div className="flex gap-4 mb-8">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            setShowCreateEvent(true);
            setShowCreateStaff(false);
          }}
        >
          Create Event
        </button>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => {
            setShowCreateStaff(true);
            setShowCreateEvent(false);
          }}
        >
          Create Staff Account
        </button>
      </div>

      {showCreateEvent && (
        <div className="bg-white shadow rounded p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Create New Event</h3>

          <form onSubmit={handleEventSubmit} className="space-y-4">
            <input
              className="input"
              placeholder="Title"
              value={eventForm.title}
              onChange={(e) =>
                setEventForm({ ...eventForm, title: e.target.value })
              }
              required
            />

            <textarea
              className="input"
              placeholder="Description"
              value={eventForm.description}
              onChange={(e) =>
                setEventForm({ ...eventForm, description: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="input"
                value={eventForm.date}
                onChange={(e) =>
                  setEventForm({ ...eventForm, date: e.target.value })
                }
                required
              />
              <input
                type="time"
                className="input"
                value={eventForm.time}
                onChange={(e) =>
                  setEventForm({ ...eventForm, time: e.target.value })
                }
                required
              />
            </div>

            <input
              className="input"
              placeholder="Venue"
              value={eventForm.venue}
              onChange={(e) =>
                setEventForm({ ...eventForm, venue: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                className="input"
                placeholder="Max Participants"
                value={eventForm.maxParticipants}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    maxParticipants: e.target.value,
                  })
                }
                required
              />
              <input
                className="input"
                placeholder="Category"
                value={eventForm.category}
                onChange={(e) =>
                  setEventForm({ ...eventForm, category: e.target.value })
                }
                required
              />
            </div>

            <input
              className="input"
              placeholder="Allowed Departments (CSE, ECE)"
              value={eventForm.allowedDepartments.join(", ")}
              onChange={(e) =>
                setEventForm({
                  ...eventForm,
                  allowedDepartments: e.target.value
                    .split(",")
                    .map((d) => d.trim()),
                })
              }
            />

            <input
              className="input"
              placeholder="Allowed Classes (CSE-2A)"
              value={eventForm.allowedClasses.join(", ")}
              onChange={(e) =>
                setEventForm({
                  ...eventForm,
                  allowedClasses: e.target.value
                    .split(",")
                    .map((c) => c.trim()),
                })
              }
            />

            <div className="flex gap-4">
              <button className="btn-primary" type="submit">
                Create Event
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowCreateEvent(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Events ({events.length})
          </h3>
          {events.map((event) => (
            <div key={event._id} className="card">
              <h4 className="font-semibold">{event.title}</h4>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Venue: {event.venue}</p>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">
            Staff Accounts ({staff.length})
          </h3>
          {staff.map((s) => (
            <div key={s._id} className="card">
              <h4 className="font-semibold">{s.name}</h4>
              <p>Email: {s.email}</p>
              <p>Department: {s.staffDepartment}</p>
              <p>Class: {s.className}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

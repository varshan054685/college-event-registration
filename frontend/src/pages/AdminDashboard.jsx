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
    brochure: null, // ✅ NEW (file)
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
    } catch (err) {
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
        allowedDepartments: eventForm.allowedDepartments.filter((d) => d),
        allowedClasses: eventForm.allowedClasses.filter((c) => c),
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
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: "2rem" }}>Admin Dashboard</h2>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowCreateEvent(true);
            setShowCreateStaff(false);
          }}
        >
          Create Event
        </button>
        <button
          className="btn btn-success"
          onClick={() => {
            setShowCreateStaff(true);
            setShowCreateEvent(false);
          }}
        >
          Create Staff Account
        </button>
      </div>

      {showCreateEvent && (
        <div className="event-card" style={{ marginBottom: "2rem" }}>
          <h3>Create New Event</h3>
          <form onSubmit={handleEventSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm({ ...eventForm, title: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
                required
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, time: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Venue *</label>
              <input
                type="text"
                value={eventForm.venue}
                onChange={(e) =>
                  setEventForm({ ...eventForm, venue: e.target.value })
                }
                required
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label>Max Participants *</label>
                <input
                  type="number"
                  value={eventForm.maxParticipants}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      maxParticipants: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  value={eventForm.category}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, category: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Allowed Departments (comma separated)</label>
              <input
                type="text"
                placeholder="CSE, ECE, EEE"
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
            </div>
            <div className="form-group">
              <label>Allowed Classes (comma separated)</label>
              <input
                type="text"
                placeholder="CSE-2A, CSE-2B"
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
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="btn btn-primary">
                Create Event
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setShowCreateEvent(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showCreateStaff && (
        <div className="event-card" style={{ marginBottom: "2rem" }}>
          <h3>Create Staff Account</h3>
          <form onSubmit={handleStaffSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={staffForm.name}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={staffForm.email}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                value={staffForm.password}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, password: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Staff ID *</label>
              <input
                type="text"
                value={staffForm.staffId}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, staffId: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Department *</label>
              <select
                value={staffForm.staffDepartment}
                onChange={(e) =>
                  setStaffForm({
                    ...staffForm,
                    staffDepartment: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
              </select>
            </div>
            <div className="form-group">
              <label>Class Name *</label>
              <input
                type="text"
                placeholder="CSE-2A"
                value={staffForm.className}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, className: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Phone (for SMS)</label>
              <input
                type="tel"
                value={staffForm.phone}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, phone: e.target.value })
                }
              />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="btn btn-primary">
                Create Staff
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setShowCreateStaff(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
      >
        <div>
          <h3>Events ({events.length})</h3>
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <h4>{event.title}</h4>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Venue: {event.venue}</p>
            </div>
          ))}
        </div>
        <div>
          <h3>Staff Accounts ({staff.length})</h3>
          {staff.map((s) => (
            <div key={s._id} className="event-card">
              <h4>{s.name}</h4>
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


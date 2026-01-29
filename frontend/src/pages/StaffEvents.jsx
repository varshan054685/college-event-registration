import { useEffect, useState } from "react";
import staffAPI from "../services/staffAPI";

const StaffEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  // NEW STATES
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await staffAPI.getEvents();
      setEvents(res.data);
    } catch (err) {
      alert("Failed to load events");
    }
  };

  // View registrations for an event
  const viewRegistrations = async (event) => {
    setSelectedEvent(event);
    setMessage("");
    setRollNumber("");

    try {
      const res = await staffAPI.getEventRegistrations(event._id);
      setRegistrations(res.data);
    } catch (err) {
      alert("Failed to load registrations");
    }
  };

  // REGISTER STUDENT BY FACULTY
  const registerStudent = async () => {
    if (!rollNumber) {
      alert("Please enter roll number");
      return;
    }

    try {
      setLoading(true);
      await staffAPI.registerStudent(selectedEvent._id, { rollNumber });

      setMessage("Student registered successfully ✅");
      setRollNumber("");

      // Refresh list
      const res = await staffAPI.getEventRegistrations(selectedEvent._id);
      setRegistrations(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* LEFT: EVENTS */}
      <div className="rounded bg-white p-4 shadow">
        <h2 className="mb-4 text-lg font-semibold">Events</h2>

        {events.map((event) => (
          <div
            key={event._id}
            onClick={() => viewRegistrations(event)}
            className="mb-2 cursor-pointer rounded border p-2 hover:bg-gray-100"
          >
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-gray-500">
              {new Date(event.date).toDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT: REGISTRATIONS + REGISTER STUDENT */}
      <div className="md:col-span-2 rounded bg-white p-4 shadow">
        {selectedEvent ? (
          <>
            <h2 className="mb-2 text-lg font-semibold">
              {selectedEvent.title} – Registrations
            </h2>

            {/* REGISTER STUDENT */}
            <div className="mb-6 rounded border p-4">
              <h3 className="mb-2 font-semibold">
                Register Student (Faculty)
              </h3>

              <input
                type="text"
                placeholder="Student Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="mb-3 w-full rounded border px-3 py-2"
              />

              <button
                onClick={registerStudent}
                disabled={loading}
                className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register Student"}
              </button>

              {message && (
                <p className="mt-2 text-green-600">{message}</p>
              )}
            </div>

            {/* REGISTERED STUDENTS LIST */}
            {registrations.length === 0 ? (
              <p className="text-gray-500">No registrations yet</p>
            ) : (
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Name</th>
                    <th className="border px-2 py-1">Roll No</th>
                    <th className="border px-2 py-1">Registered By</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg._id}>
                      <td className="border px-2 py-1">
                        {reg.studentId?.name}
                      </td>
                      <td className="border px-2 py-1">
                        {reg.studentId?.rollNumber}
                      </td>
                      <td className="border px-2 py-1">
                        {reg.registeredBy
                          ? "Faculty"
                          : "Student"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <p className="text-gray-500">
            Select an event to view registrations
          </p>
        )}
      </div>
    </div>
  );
};

export default StaffEvents;

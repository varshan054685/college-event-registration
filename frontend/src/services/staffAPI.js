import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // change if your backend port is different
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

const staffAPI = {
  // Get all events
  getEvents: () => API.get("/events"),

  // Get registrations of an event
  getEventRegistrations: (eventId) =>
    API.get(`/events/${eventId}/registrations`),

  // Register student by faculty
  registerStudent: (eventId, data) =>
    API.post(`/events/${eventId}/register`, data),
};

export default staffAPI;

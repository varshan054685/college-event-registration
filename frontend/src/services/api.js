import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to all requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- AUTH API ----------------
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getMe: () => api.get("/auth/me"),
  changePassword: (password) => api.post("/auth/change-password", { password }), // new
};

// ---------------- STUDENT API ----------------
export const studentAPI = {
  completeProfile: (profileData) => api.put("/student/profile", profileData),
  getAvailableEvents: () => api.get("/student/events"),
  registerForEvent: (eventId) => api.post(`/student/register-event/${eventId}`),
  getMyRegistrations: () => api.get("/student/my-registrations"),
};

// ---------------- STAFF API ----------------
export const staffAPI = {
  getEvents: () => api.get("/staff/events"),
  getEventRegistrations: (eventId) => api.get(`/staff/event/${eventId}/registrations`),
  registerStudent: (data) => api.post("/staff/register-student", data),
  getMyStudents: () => api.get("/staff/my-students"),
};

// ---------------- ADMIN API ----------------
export const adminAPI = {
  createEvent: (eventData) => api.post("/admin/create-event", eventData),
  getEventStats: (eventId) => api.get(`/admin/event-stats/${eventId}`),
  getAllEvents: () => api.get("/admin/events"),
  createStaff: (staffData) => api.post("/admin/create-staff", staffData),
  getAllStaff: () => api.get("/admin/staff"),
};

// ---------------- EVENT API ----------------
export const eventAPI = {
  getEvents: () => api.get("/events"),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post("/events", eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  registerForEvent: (id) => api.post(`/events/${id}/register`),
  getMyRegistrations: () => api.get("/events/my-registrations/all"),
};

export default api;


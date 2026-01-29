import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardLayout from "./layouts/DashboardLayout";

// COMMON
import Profile from "./pages/Profile";
import Account from "./pages/Account";

// ADMIN
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import Events from "./pages/Events";

// STAFF
import StaffDashboard from "./pages/StaffDashboard";
import StaffEvents from "./pages/StaffEvents";

// STUDENT
import StudentEvents from "./pages/StudentEvents";
import StudentEventRegister from "./pages/StudentEventRegister";

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD LAYOUT */}
        <Route element={<DashboardLayout />}>
          {/* COMMON */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/account" element={<Account />} />

          {/* Add route for profile completion */}
          <Route path="/complete-profile" element={<Profile />} />

          {/* ADMIN */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<Events />} />
          <Route path="/admin/users" element={<AdminUsers />} />

          {/* STAFF */}
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/events" element={<StaffEvents />} />

          {/* STUDENT */}
          <Route path="/student/events" element={<StudentEvents />} />
          <Route
            path="/student/register/:eventId"
            element={<StudentEventRegister />}
          />
        </Route>

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

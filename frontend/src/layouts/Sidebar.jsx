import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.error("Invalid user data in localStorage");
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 mb-1 rounded-md text-sm font-medium transition
     ${
       isActive
         ? "bg-indigo-600 text-white"
         : "text-gray-300 hover:bg-gray-700 hover:text-white"
     }`;

  return (
    /* Hidden on mobile & tablet */
    <aside className="hidden lg:flex lg:flex-col w-60 bg-gray-900 text-white min-h-screen p-4">
      <h3 className="mb-5 text-lg font-semibold">Menu</h3>

      {/* COMMON */}
      <NavLink to="/profile" className={linkClass}>
        Profile
      </NavLink>

      <NavLink to="/account" className={linkClass}>
        Account
      </NavLink>

      {/* STUDENT */}
      {user?.role === "student" && (
        <>
          <NavLink to="/student/events" className={linkClass}>
            Events
          </NavLink>

          <NavLink to="/student/my-events" className={linkClass}>
            My Registrations
          </NavLink>
        </>
      )}

      {/* STAFF */}
      {user?.role === "staff" && (
        <>
          <NavLink to="/staff/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/staff/events" className={linkClass}>
            Events
          </NavLink>
        </>
      )}

      {/* ADMIN */}
      {user?.role === "admin" && (
        <>
          <NavLink to="/admin/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/events" className={linkClass}>
            Manage Events
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            All Users
          </NavLink>
        </>
      )}

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="mt-6 w-full rounded-md bg-red-500 py-2 text-sm font-semibold hover:bg-red-600 transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;

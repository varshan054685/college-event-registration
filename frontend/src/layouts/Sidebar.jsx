import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Menu</h3>

      {/* COMMON */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? "sidebar-link active" : "sidebar-link"
        }
      >
        Profile
      </NavLink>

      <NavLink
        to="/account"
        className={({ isActive }) =>
          isActive ? "sidebar-link active" : "sidebar-link"
        }
      >
        Account
      </NavLink>

      {/* STUDENT */}
      {user?.role === "student" && (
        <>
          <NavLink
            to="/student/events"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Events
          </NavLink>

          <NavLink
            to="/student/my-events"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            My Registrations
          </NavLink>
        </>
      )}

      {/* STAFF */}
      {user?.role === "staff" && (
        <>
          <NavLink
            to="/staff/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/staff/events"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Events
          </NavLink>

          <NavLink
            to="/staff/registrations"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Student Registrations
          </NavLink>
        </>
      )}

      {/* ADMIN */}
      {user?.role === "admin" && (
        <>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Manage Events
          </NavLink>

          <NavLink
            to="/admin/add-faculty"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Add Faculty
          </NavLink>

          <NavLink
            to="/admin/add-admin"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Add Admin
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            All Users
          </NavLink>
        </>
      )}

      {/* LOGOUT */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;

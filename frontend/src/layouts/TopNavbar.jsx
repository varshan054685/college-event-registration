import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const TopNavbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const mobileLinkClass =
    "block py-2 text-white hover:text-indigo-400 transition";

  const dropdownLinkClass =
    "block rounded-md px-2 py-1 text-sm text-gray-300 hover:bg-gray-800 hover:text-white";

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative flex h-16 items-center justify-between bg-gray-800 px-5 text-white">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* 🍔 HAMBURGER */}
        <div
          className="flex cursor-pointer flex-col gap-1 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`h-[3px] w-6 bg-white transition ${
              menuOpen ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[3px] w-6 bg-white transition ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-[3px] w-6 bg-white transition ${
              menuOpen ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </div>

        <h3 className="text-lg font-semibold">College Event Portal</h3>
      </div>

      {/* 📱 MOBILE MENU */}
      {menuOpen && (
        <div className="absolute left-0 top-16 w-full bg-gray-900 p-4 lg:hidden z-50">
          {user?.role === "student" && (
            <>
              <NavLink
                to="/student/events"
                className={mobileLinkClass}
                onClick={closeMenu}
              >
                Events
              </NavLink>
              <NavLink
                to="/student/my-events"
                className={mobileLinkClass}
                onClick={closeMenu}
              >
                My Registrations
              </NavLink>
            </>
          )}

          {user?.role === "staff" && (
            <>
              <NavLink
                to="/staff/dashboard"
                className={mobileLinkClass}
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/staff/events"
                className={mobileLinkClass}
                onClick={closeMenu}
              >
                Events
              </NavLink>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <NavLink
                to="/admin/dashboard"
                className={mobileLinkClass}
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/events"
                className={mobileLinkClass}
                onClick={closeMenu}
              >
                Manage Events
              </NavLink>
              <NavLink
                to="/admin/users"
                className={mobileLinkClass}
                onClick={closeMenu}
              >
                All Users
              </NavLink>
            </>
          )}
        </div>
      )}

      {/* RIGHT */}
      <div className="relative" ref={dropdownRef}>
        {/* 👤 PROFILE ICON */}
        <div
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-700 text-lg"
        >
          👤
        </div>

        {/* PROFILE DROPDOWN */}
        {profileOpen && (
          <div className="absolute right-0 top-12 w-44 rounded-lg bg-gray-900 p-3 shadow-xl">
            <p className="mb-2 text-sm font-semibold text-white">
              {user?.name || "User"}
            </p>

            <NavLink
              to="/profile"
              className={dropdownLinkClass}
              onClick={() => setProfileOpen(false)}
            >
              Profile
            </NavLink>
            <NavLink
              to="/account"
              className={dropdownLinkClass}
              onClick={() => setProfileOpen(false)}
            >
              Account
            </NavLink>

            <button
              onClick={handleLogout}
              className="mt-2 w-full text-left text-sm text-red-500 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNavbar;

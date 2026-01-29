import React from "react";
import { Navigate } from "react-router-dom";

const ProfileRoute = ({ children }) => {
  let user = null;

  try {
    const userStr = localStorage.getItem("user");
    user = userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    localStorage.removeItem("user");
  }

  if (user && user.role === "student" && !user.profileCompleted) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
};

export default ProfileRoute;

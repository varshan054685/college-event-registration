import React from "react";
import { Navigate } from "react-router-dom";

const ProfileRoute = ({ children }) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Only check profile for students
  if (user && user.role === "student" && !user.profileCompleted) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
}

export default ProfileRoute;






import React from "react";
import { Outlet } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNavbar />

      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar />

        <div
          style={{
            flex: 1,
            padding: "24px",
            backgroundColor: "#f3f4f6",
            overflowY: "auto",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

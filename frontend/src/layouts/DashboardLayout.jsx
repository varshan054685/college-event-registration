import React from "react";
import { Outlet } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar (desktop only – we’ll control visibility later) */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

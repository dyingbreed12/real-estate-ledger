"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="mt-16 p-4 sm:p-6 md:p-8 lg:p-12">{children}</main>
      </div>
    </div>
  );
}

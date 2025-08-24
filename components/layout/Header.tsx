"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Map paths to readable titles
  const pageTitles: Record<string, string> = {
    "/": "Dashboard",
    "/crystal-ball": "Crystal Ball Forecast",
  };

  const title = pageTitles[pathname] || "Ledger App";

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center rounded-b-xl">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>

      {/* Placeholder for user info / buttons */}
      <div className="flex items-center space-x-4">
        <button className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600 transition-colors">
          Action
        </button>
        <div className="text-gray-700 font-medium">Admin</div>
      </div>
    </header>
  );
}

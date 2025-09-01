"use client";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-xl h-16 flex items-center justify-between px-4 sm:px-6 md:px-6 lg:px-8">
      {/* Mobile hamburger button */}
      {toggleSidebar && (
        <button
          className="md:hidden mr-4 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={toggleSidebar}
        >
          <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
          <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
          <span className="block w-6 h-0.5 bg-gray-700"></span>
        </button>
      )}

      <div className="text-xl font-bold text-gray-800">Dashboard</div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-600 font-medium">Admin</span>
      </div>
    </header>
  );
}
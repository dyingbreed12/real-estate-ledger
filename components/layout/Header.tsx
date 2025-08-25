"use client";

export default function Header() {
  return (
    <header className="bg-white shadow h-16 flex items-center justify-between px-6 ml-64">
      <div className="text-lg font-semibold">Dashboard</div>
      <div className="flex items-center space-x-4">
        <span>Admin</span>
      </div>
    </header>
  );
}

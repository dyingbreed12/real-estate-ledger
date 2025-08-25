"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Crystal Ball", href: "/crystal-ball" },
  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg p-6 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
    >
      <h1 className="text-xl font-bold mb-6">Ledger App</h1>
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              p-2 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-400
              ${pathname === link.href
                ? "bg-blue-600 text-white font-semibold"
                : "text-gray-700 hover:bg-gray-100"}
            `}
            onClick={() => setSidebarOpen(false)} // Close sidebar on mobile
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

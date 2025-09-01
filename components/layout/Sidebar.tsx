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
    { name: "Business", href: "/" },
    { name: "Crystal Ball", href: "/crystal-ball" },
    { name: "Lowball AI", href: "https://offeraibot.netlify.app/" },
  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-xl p-6 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
    >
      <h1 className="text-xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              p-3 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${pathname === link.href
                ? "bg-blue-600 text-white font-semibold shadow-md"
                : "text-gray-700 hover:bg-gray-100"}
            `}
            onClick={() => setSidebarOpen(false)}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
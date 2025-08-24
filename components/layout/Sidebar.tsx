"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Crystal Ball", href: "/crystal-ball" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-purple-700">Ledger App</h1>

      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors ${
              pathname === item.href ? "bg-purple-200 font-semibold" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

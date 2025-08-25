import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata = {
  title: "Ledger App",
  description: "Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Sidebar />
        <Header />
        <main className="ml-64 mt-16 p-6">{children}</main>
      </body>
    </html>
  );
}

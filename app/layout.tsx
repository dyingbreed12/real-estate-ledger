import "./globals.css";
import SidebarWrapper from "@/components/layout/SidebarWrapper";

export const metadata = {
  title: "Business Calculator",
  description: "Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 font-inter">
        <SidebarWrapper>{children}</SidebarWrapper>
      </body>
    </html>
  );
}

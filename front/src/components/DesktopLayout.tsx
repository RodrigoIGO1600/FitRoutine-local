import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DesktopQR } from "./DesktopQR";
import "./DesktopLayout.css";

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="desktop-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
      <main className="desktop-layout__main">{children}</main>
      <DesktopQR />
    </div>
  );
}

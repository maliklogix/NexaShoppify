import type { AppProps } from "next/app";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAppStore } from "@/store/appStore";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const { theme, isSidebarOpen } = useAppStore();

  return (
    <div className={`min-h-screen bg-[#0A0A0B] text-white ${theme}`}>
      <Sidebar />
      <div 
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

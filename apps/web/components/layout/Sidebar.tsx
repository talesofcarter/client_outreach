"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users,
  Plus,
  Menu,
  BarChart3,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(true);

  // Responsive Auto-Retract Logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Active Route Verification
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // Secure Logout Handler
  const handleLogout = () => {
    // 1. Destroy the secure cookie
    document.cookie =
      "tracker_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 2. Purge all cached data from the browser's memory
    queryClient.clear();

    // 3. Kick the user back to the login screen
    router.push("/login");
  };

  return (
    <aside
      className={`flex flex-col justify-between py-4 border-r border-transparent bg-[#f8fafd] transition-all duration-300 ease-in-out shrink-0 z-20 ${
        isExpanded ? "w-65 px-4" : "w-22 px-2"
      }`}
    >
      <div>
        {/* Branding & Toggle Button */}
        <div
          className={`flex items-center mb-6 h-10 ${isExpanded ? "justify-between px-4" : "justify-center"}`}
        >
          <div
            className={`flex items-center gap-2.5 overflow-hidden transition-all duration-300 ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}
          >
            <div className="flex gap-1 shrink-0">
              <div className="w-2.5 h-6 rounded-full bg-[#3186ff]" />
              <div className="w-2.5 h-6 rounded-full bg-[#fed50d]" />
              <div className="w-2.5 h-6 rounded-full bg-[#0ebc5f]" />
            </div>
            <span className="text-[18px] font-medium tracking-tight whitespace-nowrap">
              Tracker
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-[#444746] hover:bg-[#e9eef6] rounded-full transition-colors shrink-0"
            title={isExpanded ? "Collapse menu" : "Expand menu"}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action (New Lead FAB) */}
        <div className={`mb-6 flex ${isExpanded ? "px-2" : "justify-center"}`}>
          <Link
            href="?action=new-lead"
            scroll={false}
            title={!isExpanded ? "New Lead" : undefined}
            className={`flex items-center bg-white border border-[#e0e0e0] shadow-sm hover:shadow-md hover:bg-[#f8fafd] text-[#1f1f1f] font-medium transition-all duration-300 group overflow-hidden
              ${isExpanded ? "gap-3 px-5 py-3.5 w-full rounded-2xl" : "justify-center p-0 w-12 h-12 rounded-2xl"}
            `}
          >
            <Plus
              className="w-5 h-5 text-[#3186ff] group-hover:scale-110 transition-transform shrink-0"
              strokeWidth={2.5}
            />
            <span
              className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"}`}
            >
              New Lead
            </span>
          </Link>
        </div>

        {/* Navigation Pills */}
        <nav className="flex flex-col gap-1 px-2">
          <Link
            href="/"
            title={!isExpanded ? "Dashboard" : undefined}
            className={`flex items-center rounded-full font-medium transition-all duration-200 overflow-hidden group
              ${isActive("/") ? "bg-[#c2e7ff]/40 text-[#001d35]" : "text-[#444746] hover:bg-[#e9eef6]"}
              ${isExpanded ? "gap-3 px-4 py-3" : "justify-center w-12 h-12 mx-auto"}
            `}
          >
            <LayoutDashboard
              className={`w-5 h-5 shrink-0 ${isActive("/") ? "text-[#001d35]" : "text-[#444746] group-hover:text-[#1f1f1f]"}`}
            />
            <span
              className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}
            >
              Dashboard
            </span>
          </Link>

          <Link
            href="/leads"
            title={!isExpanded ? "Clients & Leads" : undefined}
            className={`flex items-center rounded-full font-medium transition-all duration-200 overflow-hidden group
              ${isActive("/leads") ? "bg-[#c2e7ff]/40 text-[#001d35]" : "text-[#444746] hover:bg-[#e9eef6]"}
              ${isExpanded ? "gap-3 px-4 py-3" : "justify-center w-12 h-12 mx-auto"}
            `}
          >
            <Users
              className={`w-5 h-5 shrink-0 ${isActive("/leads") ? "text-[#001d35]" : "text-[#444746] group-hover:text-[#1f1f1f]"}`}
            />
            <span
              className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}
            >
              Clients & Leads
            </span>
          </Link>

          <Link
            href="/analytics"
            title={!isExpanded ? "Analytics" : undefined}
            className={`flex items-center rounded-full font-medium transition-all duration-200 overflow-hidden group
              ${isActive("/analytics") ? "bg-[#c2e7ff]/40 text-[#001d35]" : "text-[#444746] hover:bg-[#e9eef6]"}
              ${isExpanded ? "gap-3 px-4 py-3" : "justify-center w-12 h-12 mx-auto"}
            `}
          >
            <BarChart3
              className={`w-5 h-5 shrink-0 ${isActive("/analytics") ? "text-[#001d35]" : "text-[#444746] group-hover:text-[#1f1f1f]"}`}
            />
            <span
              className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}
            >
              Analytics
            </span>
          </Link>
        </nav>
      </div>

      {/* Bottom Sign Out Button */}
      <div className="px-2">
        <button
          onClick={handleLogout}
          title={!isExpanded ? "Sign out" : undefined}
          className={`flex items-center rounded-full font-medium transition-all duration-200 overflow-hidden group text-[#ea4335] hover:bg-[#fef2f2]
            ${isExpanded ? "gap-3 px-4 py-3 w-full" : "justify-center w-12 h-12 mx-auto"}
          `}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span
            className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}
          >
            Sign out
          </span>
        </button>
      </div>
    </aside>
  );
}

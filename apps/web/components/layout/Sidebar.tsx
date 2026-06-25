"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users,
  Plus,
  Menu,
  BarChart3,
  ChartPie,
  LogOut,
} from "lucide-react";

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clients & Leads", href: "/leads", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: ChartPie },
];

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
      className={`flex flex-col justify-between py-5 border-r border-[#e8eaed]/80 bg-[#f8f9fa] transition-all duration-300 ease-in-out shrink-0 z-20 ${
        isExpanded ? "w-60 px-3" : "w-18 px-2"
      }`}
    >
      <div>
        {/* Branding & Toggle */}
        <div
          className={`flex items-center mb-8 h-10 ${isExpanded ? "justify-between px-2" : "justify-center"}`}
        >
          <div
            className={`flex items-center gap-2.5 overflow-hidden transition-all duration-300 ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}
          >
            <div className="flex gap-0.75 items-center shrink-0">
              <div className="w-1.75 h-5 rounded-full bg-[#3186ff]" />
              <div className="w-1.75 h-5 rounded-full bg-[#fed50d]" />
              <div className="w-1.75 h-5 rounded-full bg-[#0ebc5f]" />
            </div>
            <span className="text-[17px] font-medium tracking-tight text-[#1f1f1f] whitespace-nowrap">
              Tracker
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 flex items-center justify-center text-[#747775] hover:text-[#1f1f1f] hover:bg-[#e9eef6] rounded-lg transition-colors shrink-0"
            title={isExpanded ? "Collapse menu" : "Expand menu"}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* New Lead CTA */}
        <div className={`mb-6 ${isExpanded ? "px-1" : "flex justify-center"}`}>
          <Link
            href="?action=new-lead"
            scroll={false}
            title={!isExpanded ? "New Lead" : undefined}
            className={`flex items-center bg-white border border-[#e0e0e0] text-[#1f1f1f] text-sm font-medium transition-all duration-200 group overflow-hidden
              hover:border-[#c4c7c5] hover:shadow-sm
              ${isExpanded ? "gap-2.5 px-4 py-2.5 w-full rounded-xl" : "justify-center w-10 h-10 rounded-xl"}
            `}
          >
            <Plus
              className="w-4 h-4 text-[#3186ff] group-hover:scale-110 transition-transform shrink-0"
              strokeWidth={2.5}
            />
            <span
              className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"}`}
            >
              New Lead
            </span>
          </Link>
        </div>

        {/* Nav Label */}
        {isExpanded && (
          <p className="px-3 mb-1.5 text-[10px] font-medium text-[#9aa0a6] uppercase tracking-[0.08em]">
            Menu
          </p>
        )}

        {/* Navigation Links */}
        <nav className="flex flex-col gap-0.5">
          {sidebarLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              title={!isExpanded ? link.name : undefined}
              className={`flex items-center text-sm font-medium transition-all duration-150 overflow-hidden group rounded-xl
                ${
                  isActive(link.href)
                    ? "bg-[#e8f0fe] text-[#185FA5]"
                    : "text-[#444746] hover:bg-[#edf2fb] hover:text-[#1f1f1f]"
                }
                ${isExpanded ? "gap-3 px-3 py-2.5" : "justify-center w-10 h-10 mx-auto"}
              `}
            >
              <link.icon
                className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                  isActive(link.href)
                    ? "text-[#185FA5]"
                    : "text-[#747775] group-hover:text-[#1f1f1f]"
                }`}
              />
              <span
                className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}
              >
                {link.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom: Sign Out */}
      <div className={`${isExpanded ? "px-1" : "flex justify-center"}`}>
        {isExpanded && (
          <div className="mb-3 mx-1 border-t border-[#e8eaed]/80" />
        )}
        <button
          onClick={handleLogout}
          title={!isExpanded ? "Sign out" : undefined}
          className={`flex items-center text-sm font-medium transition-all duration-150 overflow-hidden group rounded-xl text-[#747775] hover:text-[#c5221f] hover:bg-[#fef2f2]
            ${isExpanded ? "gap-3 px-3 py-2.5 w-full" : "justify-center w-10 h-10 mx-auto"}
          `}
        >
          <LogOut className="w-4.5 h-4.5 shrink-0 transition-colors group-hover:text-[#c5221f]" />
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

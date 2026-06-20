"use client";

import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, LogOut, Loader2 } from "lucide-react";

const getAuthToken = () => {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("tracker_token="))
    ?.split("=")[1];
};

export function HeaderActions() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Fetch the active user's profile
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) throw new Error("No token found");

      const res = await fetch("http://localhost:3001/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
  });

  // 2. The Secure Logout Function
  const handleLogout = () => {
    // Destroy the cookie
    document.cookie =
      "tracker_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Clear the TanStack Query cache so data doesn't leak to the next user
    queryClient.clear();

    // Redirect to login
    router.push("/login");
  };

  // Derive the initial from the email (e.g., kelvin@... -> K)
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "";

  return (
    <div className="flex items-center gap-4">
      <button className="p-2 text-[#444746] hover:bg-[#f0f4f9] rounded-full transition-colors relative">
        <Bell className="w-5 h-5" />
        {/* Mock Notification Dot */}
        <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#ea4335] rounded-full border border-white"></span>
      </button>

      {/* Profile Dropdown Container */}
      <div className="relative group">
        <button className="w-9 h-9 rounded-full bg-[#3186ff] text-white flex items-center justify-center font-medium shadow-sm hover:shadow-md transition-all">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            userInitial
          )}
        </button>

        {/* Hover Menu Menu */}
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_4px_12px_rgba(60,64,67,0.15)] border border-[#e0e0e0]/60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right -translate-y-2.5 group-hover:translate-y-0 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e0e0e0]/60 bg-[#f8fafd]">
            <p className="text-xs font-medium text-[#444746] truncate">
              Signed in as
            </p>
            <p className="text-sm font-medium text-[#1f1f1f] truncate">
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#ea4335] hover:bg-[#fef2f2] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

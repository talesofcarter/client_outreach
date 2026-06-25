"use client";

import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, LogOut, Loader2 } from "lucide-react";
import { apiUrl } from "@/lib/api";

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

      const res = await fetch(`${apiUrl}/auth/me`, {
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

  // Derive the initial from the email
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "";

  return (
    <div className="flex items-center gap-3">
      {/* Notification Bell */}
      <button className="w-8 h-8 flex items-center justify-center text-[#9aa0a6] hover:text-[#1f1f1f] hover:bg-[#f8f9fa] rounded-lg transition-colors relative">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#E24B4A] rounded-full border border-white" />
      </button>

      {/* Profile Dropdown */}
      <div className="relative group">
        <button className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#185FA5] flex items-center justify-center text-sm font-medium hover:bg-[#b5d4f4] transition-colors">
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            userInitial
          )}
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl border border-[#e0e0e0]/70 shadow-[0_4px_16px_rgba(0,0,0,0.08)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right -translate-y-1 group-hover:translate-y-0 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e0e0e0]/60">
            <p className="text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em] mb-0.5">
              Signed in as
            </p>
            <p className="text-sm font-medium text-[#1f1f1f] truncate">
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#747775] hover:text-[#c5221f] hover:bg-[#fef2f2] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

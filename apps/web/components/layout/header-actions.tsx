"use client";

import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  LogOut,
  Loader2,
  Settings,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { apiUrl } from "@/lib/api";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

const getAuthToken = () => {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("tracker_token="))
    ?.split("=")[1];
};

// ─── Types ──
interface Lead {
  id: string;
  business_name: string;
  status: string;
  created_at: string;
  city_region: string;
}

interface Notification {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  read: boolean;
  leadId: string;
}

// ─── Helpers ───

const STATUS_LABEL: Record<string, string> = {
  NOT_CONTACTED: "Not Contacted",
  CONTACTED: "Contacted",
  FOLLOW_UP_SCHEDULED: "Follow-up Scheduled",
  NEGOTIATING: "Negotiating",
  WON: "Deal Won",
  LOST: "Deal Lost",
};

const STATUS_COLOR: Record<string, string> = {
  NOT_CONTACTED: "bg-[#f1efe8]",
  CONTACTED: "bg-[#e8f0fe]",
  FOLLOW_UP_SCHEDULED: "bg-[#faeeda]",
  NEGOTIATING: "bg-[#EEEDFE]",
  WON: "bg-[#e1f5ee]",
  LOST: "bg-[#fcebeb]",
};

const STATUS_DOT: Record<string, string> = {
  NOT_CONTACTED: "bg-[#888780]",
  CONTACTED: "bg-[#378ADD]",
  FOLLOW_UP_SCHEDULED: "bg-[#EF9F27]",
  NEGOTIATING: "bg-[#7F77DD]",
  WON: "bg-[#1D9E75]",
  LOST: "bg-[#E24B4A]",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Component ───

export function HeaderActions() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Profile dropdown state
  const [profileOpen, setProfileOpen] = useState(false);
  const [profilePos, setProfilePos] = useState({ top: 0, right: 0 });
  const avatarRef = useRef<HTMLButtonElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Notifications panel state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifPos, setNotifPos] = useState({ top: 0, right: 0 });
  const bellRef = useRef<HTMLButtonElement>(null);
  const notifPanelRef = useRef<HTMLDivElement>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

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

  // 2. Derive notifications from the leads cache (last 7 days)
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) throw new Error("No token found");
      const res = await fetch(`${apiUrl}/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
  });

  const notifications = useMemo<Notification[]>(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return leads
      .filter((l) => new Date(l.created_at).getTime() > cutoff)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 10)
      .map((l) => ({
        id: l.id,
        title: l.business_name,
        subtitle: `${STATUS_LABEL[l.status] ?? l.status} · ${l.city_region}`,
        timestamp: l.created_at,
        read: readIds.has(l.id),
        leadId: l.id,
      }));
  }, [leads, readIds]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // 3. Secure logout
  const handleLogout = () => {
    document.cookie =
      "tracker_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    queryClient.clear();
    router.push("/login");
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "";

  // ── Portal positioning helpers ──

  const calcPos = (ref: React.RefObject<HTMLButtonElement | null>) => {
    if (!ref.current) return { top: 0, right: 0 };
    const rect = ref.current.getBoundingClientRect();
    return { top: rect.bottom + 8, right: window.innerWidth - rect.right };
  };

  const openProfile = useCallback(() => {
    setNotifOpen(false);
    setProfilePos(calcPos(avatarRef));
    setProfileOpen(true);
  }, []);

  const closeProfile = useCallback(() => setProfileOpen(false), []);

  const toggleProfile = useCallback(() => {
    profileOpen ? closeProfile() : openProfile();
  }, [profileOpen, openProfile, closeProfile]);

  const openNotif = useCallback(() => {
    setProfileOpen(false);
    setNotifPos(calcPos(bellRef));
    setNotifOpen(true);
    // Mark all as read when panel opens
    setReadIds(new Set(notifications.map((n) => n.id)));
  }, [notifications]);

  const closeNotif = useCallback(() => setNotifOpen(false), []);

  const toggleNotif = useCallback(() => {
    notifOpen ? closeNotif() : openNotif();
  }, [notifOpen, openNotif, closeNotif]);

  // ── Click-outside ──

  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        profileDropdownRef.current?.contains(e.target as Node) ||
        avatarRef.current?.contains(e.target as Node)
      )
        return;
      closeProfile();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen, closeProfile]);

  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        notifPanelRef.current?.contains(e.target as Node) ||
        bellRef.current?.contains(e.target as Node)
      )
        return;
      closeNotif();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen, closeNotif]);

  // ── Reposition on scroll / resize ───

  useEffect(() => {
    if (!profileOpen && !notifOpen) return;
    const reposition = () => {
      if (profileOpen) setProfilePos(calcPos(avatarRef));
      if (notifOpen) setNotifPos(calcPos(bellRef));
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [profileOpen, notifOpen]);

  // ── Shared portal panel classes ──

  const panelBase =
    "fixed bg-white rounded-2xl border border-[#e0e0e0]/70 shadow-[0_8px_32px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)] z-[9999] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-1 duration-150 ease-out origin-top-right";

  return (
    <div className="flex items-center gap-3">
      {/* ── Bell ── */}
      <button
        ref={bellRef}
        onClick={toggleNotif}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors relative ${
          notifOpen
            ? "bg-[#f8f9fa] text-[#1f1f1f]"
            : "text-[#9aa0a6] hover:text-[#1f1f1f] hover:bg-[#f8f9fa]"
        }`}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#E24B4A] rounded-full border border-white" />
        )}
      </button>

      {/* ── Avatar ── */}
      <button
        ref={avatarRef}
        onClick={toggleProfile}
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
          profileOpen
            ? "bg-[#b5d4f4] text-[#185FA5]"
            : "bg-[#e8f0fe] text-[#185FA5] hover:bg-[#b5d4f4]"
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          userInitial
        )}
      </button>

      {notifOpen &&
        createPortal(
          <div
            ref={notifPanelRef}
            style={{ top: notifPos.top, right: notifPos.right }}
            className={`${panelBase} w-80`}
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-[#e0e0e0]/60 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1f1f1f]">
                  Notifications
                </p>
                <p className="text-[11px] text-[#9aa0a6] mt-0.5">
                  Recent pipeline activity
                </p>
              </div>
              {unreadCount > 0 && (
                <span className="text-[11px] font-medium text-[#185FA5] bg-[#e8f0fe] px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                  <div className="w-9 h-9 rounded-xl bg-[#f8f9fa] flex items-center justify-center mb-3">
                    <Bell className="w-4 h-4 text-[#9aa0a6]" />
                  </div>
                  <p className="text-sm font-medium text-[#1f1f1f]">
                    All caught up
                  </p>
                  <p className="text-xs text-[#9aa0a6] mt-0.5">
                    No new leads in the last 7 days.
                  </p>
                </div>
              ) : (
                <div className="p-1.5 space-y-0.5">
                  {notifications.map((n) => {
                    const dotColor =
                      STATUS_DOT[
                        leads.find((l) => l.id === n.leadId)?.status ?? ""
                      ] ?? "bg-[#888780]";
                    const bgColor =
                      STATUS_COLOR[
                        leads.find((l) => l.id === n.leadId)?.status ?? ""
                      ] ?? "bg-[#f1efe8]";
                    return (
                      <button
                        key={n.id}
                        onClick={() => {
                          router.push(`/leads/${n.leadId}`);
                          closeNotif();
                        }}
                        className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f8f9fa] transition-colors text-left group"
                      >
                        {/* Status color dot container */}
                        <div
                          className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center shrink-0 mt-0.5`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${dotColor}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-[#1f1f1f] truncate">
                              {n.title}
                            </p>
                            <ArrowRight className="w-3.5 h-3.5 text-[#d1d5db] group-hover:text-[#3186ff] shrink-0 transition-colors" />
                          </div>
                          <p className="text-xs text-[#9aa0a6] mt-0.5 truncate">
                            {n.subtitle}
                          </p>
                          <p className="text-[11px] text-[#c4c7c5] mt-0.5">
                            {timeAgo(n.timestamp)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-1.5 border-t border-[#e0e0e0]/60">
                <button
                  onClick={() => {
                    router.push("/leads");
                    closeNotif();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-[#185FA5] hover:bg-[#e8f0fe] rounded-xl transition-colors"
                >
                  View all leads
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>,
          document.body,
        )}

      {profileOpen &&
        createPortal(
          <div
            ref={profileDropdownRef}
            style={{ top: profilePos.top, right: profilePos.right }}
            className={`${panelBase} w-64`}
          >
            {/* User Identity */}
            <div className="px-4 pt-4 pb-3 border-b border-[#e0e0e0]/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e8f0fe] text-[#185FA5] flex items-center justify-center text-sm font-medium shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em] mb-0.5">
                    Signed in as
                  </p>
                  <p className="text-sm font-medium text-[#1f1f1f] truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Nav Items */}
            <div className="p-1.5">
              <button
                onClick={() => {
                  router.push("/settings");
                  closeProfile();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-[#444746] hover:bg-[#f8f9fa] hover:text-[#1f1f1f] rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4 text-[#9aa0a6]" />
                Settings
              </button>
              <button
                onClick={() => {
                  router.push("/help");
                  closeProfile();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-[#444746] hover:bg-[#f8f9fa] hover:text-[#1f1f1f] rounded-xl transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-[#9aa0a6]" />
                Help & Support
              </button>
            </div>

            {/* Destructive Zone */}
            <div className="p-1.5 border-t border-[#e0e0e0]/60">
              <button
                onClick={() => {
                  handleLogout();
                  closeProfile();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-[#747775] hover:text-[#c5221f] hover:bg-[#fef2f2] rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

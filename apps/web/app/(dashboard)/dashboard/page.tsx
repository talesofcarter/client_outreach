"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Loader2,
  Target,
  Send
} from "lucide-react";
import { Lead } from "@/types";
import { formatStatus } from "@/lib/formatStatus";
import { apiUrl } from "@/lib/api";
import { useMemo } from "react";
import { StatusBadge } from "@/components/leads/status-badge";

const getAuthToken = () => {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("tracker_token="))
    ?.split("=")[1];
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
};

export default function DashboardHome() {
  const router = useRouter();

  // 1. Fetch the active user to personalize the greeting
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) return null;

      const res = await fetch(`${apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.ok ? res.json() : null;
    },
  });

  const displayName = user?.name;

  // 3. Define the expected return type for TanStack Query
  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      const token = getAuthToken();
      const res = await fetch(`${apiUrl}/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
  });

  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      })
      .slice(0, 7);
  }, [leads]);

  const activeLeadsCount = leads.filter(
    (l: Lead) => l.status !== "won" && l.status !== "lost",
  ).length;

  const today = new Date().toISOString().split("T")[0];
  const contactedTodayCount = leads.filter((lead) => {
    const activityDate = new Date(lead.updated_at || lead.created_at)
      .toISOString()
      .split("T")[0];
    return lead.status.toLowerCase() === "contacted" && activityDate === today;
  }).length;

  const pendingFollowUps = leads.filter(
    (l: Lead) => l.status === "follow_up_scheduled",
  ).length;

  const dealsWonCount = leads.filter((l: Lead) => l.status === "won").length;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3186ff] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-300 mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-medium text-[#1f1f1f] tracking-tight">
          Welcome back, {displayName}
        </h1>
        <p className="text-sm text-[#747775] mt-0.5">
          Daily outreach metrics, status updates & pipeline trajectory
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Leads */}
        <div className="bg-white rounded-3xl p-5 border border-[#e0e0e0]/60 hover:border-[#c4c7c5] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-out group flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 pointer-events-none z-0 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 ease-out">
            <ArrowUpRight
              className="w-36 h-36 text-[#3186ff]"
              strokeWidth={1.5}
            />
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <p className="text-[12px] font-medium text-[#747775] uppercase tracking-widest mt-1">
              Active Leads
            </p>
            <div className="w-10 h-10 rounded-xl bg-[#f0f4f9] group-hover:bg-[#e8f0fe] transition-colors flex items-center justify-center shrink-0">
              <ArrowUpRight
                className="w-5 h-5 text-[#3186ff]"
                strokeWidth={2}
              />
            </div>
          </div>
          <div className="relative z-10">
            <h2 className="text-[32px] font-normal text-[#1f1f1f] leading-none tracking-tight">
              {activeLeadsCount}
            </h2>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="flex items-center gap-1 text-[12px] font-medium text-[#185FA5] bg-[#e8f0fe] px-2 py-0.5 rounded-md">
                <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
                12%
              </span>
              <span className="text-[13px] text-[#747775]">this week</span>
            </div>
          </div>
        </div>

        {/* Pending Follow-ups */}
        <div className="bg-white rounded-3xl p-5 border border-[#e0e0e0]/60 hover:border-[#c4c7c5] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-out group flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 pointer-events-none z-0 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 ease-out">
            <Clock className="w-36 h-36 text-[#ef9f27]" strokeWidth={1.5} />
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <p className="text-[12px] font-medium text-[#747775] uppercase tracking-widest mt-1">
              Pending Follow-ups
            </p>
            <div className="w-10 h-10 rounded-xl bg-[#f0f4f9] group-hover:bg-[#faeeda] transition-colors flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#ef9f27]" strokeWidth={2} />
            </div>
          </div>
          <div className="relative z-10">
            <h2 className="text-[32px] font-normal text-[#1f1f1f] leading-none tracking-tight">
              {pendingFollowUps}
            </h2>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="flex items-center gap-1 text-[12px] font-medium text-[#854F0B] bg-[#faeeda] px-2 py-0.5 rounded-md">
                <Clock className="w-3 h-3" strokeWidth={2.5} />8 due
              </span>
              <span className="text-[13px] text-[#747775]">today</span>
            </div>
          </div>
        </div>

        {/* Deals Won */}
        <div className="bg-white rounded-3xl p-5 border border-[#e0e0e0]/60 hover:border-[#c4c7c5] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-out group flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 pointer-events-none z-0 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 ease-out">
            <CheckCircle2
              className="w-36 h-36 text-[#1d9e75]"
              strokeWidth={1.5}
            />
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <p className="text-[12px] font-medium text-[#747775] uppercase tracking-widest mt-1">
              Deals Won
            </p>
            <div className="w-10 h-10 rounded-xl bg-[#f0f4f9] group-hover:bg-[#e1f5ee] transition-colors flex items-center justify-center shrink-0">
              <CheckCircle2
                className="w-5 h-5 text-[#1d9e75]"
                strokeWidth={2}
              />
            </div>
          </div>
          <div className="relative z-10">
            <h2 className="text-[32px] font-normal text-[#1f1f1f] leading-none tracking-tight">
              {dealsWonCount}
            </h2>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="flex items-center gap-1 text-[12px] font-medium text-[#0F6E56] bg-[#e1f5ee] px-2 py-0.5 rounded-md">
                <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />3
              </span>
              <span className="text-[13px] text-[#747775]">this month</span>
            </div>
          </div>
        </div>

        {/* 4. Contacted Today (New Card) */}
        <div className="bg-white rounded-3xl p-5 border border-[#e0e0e0]/60 hover:border-[#c4c7c5] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-out group flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 pointer-events-none z-0 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 ease-out">
            <Send className="w-36 h-36 text-[#8b5cf6]" strokeWidth={1.5} />
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <p className="text-[12px] font-medium text-[#747775] uppercase tracking-widest mt-1">
              Contacted Today
            </p>
            <div className="w-10 h-10 rounded-xl bg-[#f0f4f9] group-hover:bg-[#f3e8ff] transition-colors flex items-center justify-center shrink-0">
              <Send className="w-5 h-5 text-[#8b5cf6]" strokeWidth={2} />
            </div>
          </div>
          <div className="relative z-10">
            <h2 className="text-[32px] font-normal text-[#1f1f1f] leading-none tracking-tight">
              {contactedTodayCount}
            </h2>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="flex items-center gap-1 text-[12px] font-medium text-[#6b21a8] bg-[#f3e8ff] px-2 py-0.5 rounded-md">
                <Send className="w-3 h-3" strokeWidth={2.5} />
                Daily
              </span>
              <span className="text-[13px] text-[#747775]">outreach</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-[#e0e0e0]/60 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#e0e0e0]/60">
          <div>
            <h3 className="text-[15px] font-medium text-[#1f1f1f]">
              Recent Activity
            </h3>
            <p className="text-xs text-[#747775] mt-0.5">
              Last updated just now
            </p>
          </div>
          <button className="text-xs font-medium text-[#185FA5] hover:text-[#0c447c] transition-colors flex items-center gap-1">
            View All
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Table Body */}
        <div className="w-full overflow-x-auto min-h-50">
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#747775]">
              <Target className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm">
                No leads found. Add your first prospect to get started.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e0e0e0]/60">
                  <th className="px-6 py-3 text-[11px] font-medium text-[#747775] uppercase tracking-[0.06em]">
                    Business
                  </th>
                  <th className="px-4 py-3 text-[11px] font-medium text-[#747775] uppercase tracking-[0.06em]">
                    Category
                  </th>
                  <th className="px-4 py-3 text-[11px] font-medium text-[#747775] uppercase tracking-[0.06em]">
                    Region
                  </th>
                  <th className="px-4 py-3 text-[11px] font-medium text-[#747775] uppercase tracking-[0.06em]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-[11px] font-medium text-[#747775] uppercase tracking-[0.06em] text-right">
                    Added
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-[#e0e0e0]/40">
                {recentLeads.map((lead: Lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => router.push(`/leads/${lead.id}`)}
                    className="hover:bg-[#f8f9fa] transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-3.5 font-medium text-[#1f1f1f] whitespace-nowrap">
                      {lead.business_name}
                    </td>
                    <td className="px-4 py-3.5 text-[#444746] capitalize">
                      {lead.category?.replace("_", " ") || "-"}
                    </td>
                    <td className="px-4 py-3.5 text-[#444746]">
                      {lead.city_region}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={formatStatus(lead.status)} />
                    </td>
                    <td className="px-6 py-3.5 text-[#747775] text-right whitespace-nowrap">
                      {formatDate(lead.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

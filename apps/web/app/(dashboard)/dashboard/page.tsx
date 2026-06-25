"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Loader2,
  Target,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Leads */}
        <div className="bg-white rounded-2xl p-5 border border-[#e0e0e0]/60 relative overflow-hidden group transition-all duration-200 hover:border-[#c4c7c5] hover:shadow-sm">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-[#3186ff]/10 -translate-y-4 translate-x-4 group-hover:scale-125 transition-transform duration-500" />
          <div className="w-9 h-9 rounded-[10px] bg-[#e8f0fe] flex items-center justify-center mb-4">
            <ArrowUpRight
              className="w-4.5 h-4.5 text-[#185FA5]"
              strokeWidth={2}
            />
          </div>
          <p className="text-[11px] font-medium text-[#747775] uppercase tracking-widest">
            Active Leads
          </p>
          <h2 className="text-[30px] font-medium text-[#1f1f1f] mt-1 leading-none">
            {activeLeadsCount}
          </h2>
          <p className="text-xs text-[#185FA5] mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
            12% this week
          </p>
        </div>

        {/* Pending Follow-ups */}
        <div className="bg-white rounded-2xl p-5 border border-[#e0e0e0]/60 relative overflow-hidden group transition-all duration-200 hover:border-[#c4c7c5] hover:shadow-sm">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-[#ef9f27]/10 -translate-y-4 translate-x-4 group-hover:scale-125 transition-transform duration-500" />
          <div className="w-9 h-9 rounded-[10px] bg-[#faeeda] flex items-center justify-center mb-4">
            <Clock className="w-4.5 h-4.5 text-[#854F0B]" strokeWidth={2} />
          </div>
          <p className="text-[11px] font-medium text-[#747775] uppercase tracking-widest">
            Pending Follow-ups
          </p>
          <h2 className="text-[30px] font-medium text-[#1f1f1f] mt-1 leading-none">
            {pendingFollowUps}
          </h2>
          <p className="text-xs text-[#854F0B] mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" strokeWidth={2.5} />8 due today
          </p>
        </div>

        {/* Deals Won */}
        <div className="bg-white rounded-2xl p-5 border border-[#e0e0e0]/60 relative overflow-hidden group transition-all duration-200 hover:border-[#c4c7c5] hover:shadow-sm">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-[#1d9e75]/10 -translate-y-4 translate-x-4 group-hover:scale-125 transition-transform duration-500" />
          <div className="w-9 h-9 rounded-[10px] bg-[#e1f5ee] flex items-center justify-center mb-4">
            <CheckCircle2
              className="w-4.5 h-4.5 text-[#0F6E56]"
              strokeWidth={2}
            />
          </div>
          <p className="text-[11px] font-medium text-[#747775] uppercase tracking-widest">
            Deals Won
          </p>
          <h2 className="text-[30px] font-medium text-[#1f1f1f] mt-1 leading-none">
            {dealsWonCount}
          </h2>
          <p className="text-xs text-[#0F6E56] mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />3 this month
          </p>
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

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
import { Lead, LeadStatus } from "@/types";
import { formatStatus } from "@/lib/formatStatus";

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

const statusConfig: Record<LeadStatus, { label: string; colors: string }> = {
  not_contacted: {
    label: "Not Contacted",
    colors: "bg-[#f0f4f9] text-[#444746] border-[#e0e0e0]",
  },
  contacted: {
    label: "Contacted",
    colors: "bg-[#3186ff]/10 text-[#3186ff] border-[#3186ff]/20",
  },
  follow_up_scheduled: {
    label: "Follow-up",
    colors: "bg-[#fed50d]/20 text-[#d97706] border-[#fed50d]/30",
  },
  negotiating: {
    label: "Negotiating",
    colors: "bg-[#3186ff]/10 text-[#3186ff] border-[#3186ff]/20",
  },
  won: {
    label: "Won",
    colors: "bg-[#0ebc5f]/10 text-[#16a34a] border-[#0ebc5f]/20",
  },
  lost: {
    label: "Lost",
    colors: "bg-[#ea4335]/10 text-[#dc2626] border-[#ea4335]/20",
  },
};

export default function DashboardHome() {
  const router = useRouter();

  // 1. Fetch the active user to personalize the greeting
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) return null;
      const res = await fetch("http://localhost:3001/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.ok ? res.json() : null;
    },
  });

  // 2. Format the email into a capitalized first name (e.g., kelvin@... -> Kelvin)
  const displayName = user?.email
    ? user.email.split("@")[0].charAt(0).toUpperCase() +
      user.email.split("@")[0].slice(1)
    : "User";

  // 3. Define the expected return type for TanStack Query
  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      const token = getAuthToken();
      const res = await fetch("http://localhost:3001/leads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
  });

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
    <div className="max-w-300 mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-[28px] font-normal text-[#1f1f1f] tracking-tight">
          Welcome back, {displayName}
        </h1>
        <p className="text-base text-[#444746] mt-1">
          Here is what is happening with your outreach today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#3186ff]/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="w-10 h-10 rounded-full bg-[#3186ff]/10 text-[#3186ff] flex items-center justify-center mb-4">
            <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-medium text-[#444746]">
            Total Active Leads
          </p>
          <h2 className="text-[32px] font-normal text-[#1f1f1f] mt-1">
            {activeLeadsCount}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#fed50d]/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="w-10 h-10 rounded-full bg-[#fed50d]/20 text-[#d97706] flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-medium text-[#444746]">
            Pending Follow-ups
          </p>
          <h2 className="text-[32px] font-normal text-[#1f1f1f] mt-1">
            {pendingFollowUps}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0ebc5f]/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="w-10 h-10 rounded-full bg-[#0ebc5f]/10 text-[#0ebc5f] flex items-center justify-center mb-4">
            <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-medium text-[#444746]">Deals Won</p>
          <h2 className="text-[32px] font-normal text-[#1f1f1f] mt-1">
            {dealsWonCount}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-[28px] p-2 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)]">
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#e0e0e0]/60">
          <h3 className="text-[18px] font-medium text-[#1f1f1f]">
            Recent Activity
          </h3>
          <button className="text-sm font-medium text-[#3186ff] hover:text-[#2872dd] transition-colors">
            View All
          </button>
        </div>

        <div className="w-full overflow-x-auto min-h-50">
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#747775]">
              <Target className="w-10 h-10 mb-3 opacity-20" />
              <p>No leads found. Add your first prospect to get started.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e0e0e0]/60 text-sm font-medium text-[#444746]">
                  <th className="px-6 py-4 font-medium">Business Name</th>
                  {/* 1. Added Category Column */}
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Region</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">
                    Date Added
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {leads.map((lead: Lead) => {
                  const badge =
                    statusConfig[lead.status] || statusConfig.not_contacted;

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => router.push(`/leads/${lead.id}`)}
                      className="hover:bg-[#f0f4f9] hover:shadow-sm transition-all duration-200 group cursor-pointer border-b border-[#e0e0e0]/40 last:border-0 relative z-0 hover:z-10"
                    >
                      {/* 2. Simplified Business Name */}
                      <td className="px-6 py-4 font-medium text-[#1f1f1f]">
                        {lead.business_name}
                      </td>

                      {/* 3. New Category Cell with string formatting */}
                      <td className="px-6 py-4 text-[#444746] capitalize">
                        {lead.category?.replace("_", " ") || "-"}
                      </td>

                      <td className="px-6 py-4 text-[#444746]">
                        {lead.city_region}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${badge.colors}`}
                        >
                          {formatStatus(lead.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#444746] text-right">
                        {formatDate(lead.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

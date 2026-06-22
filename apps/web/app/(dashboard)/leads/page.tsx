"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  Download,
  Plus,
  Loader2,
  Target,
  ArrowRight,
} from "lucide-react";
import { Lead, LeadStatus } from "@/types";
import { formatStatus } from "@/lib/formatStatus";
import { apiUrl } from "@/lib/api";
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

export default function LeadsDirectoryPage() {
  const router = useRouter();
  const pathname = usePathname();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");

  // Fetch all leads
  const {
    data: leads = [],
    isLoading,
    isError,
  } = useQuery<Lead[]>({
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

  // High-performance client-side filtering
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.city_region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.category &&
          lead.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  const handleExport = () => {
    // Future implementation: Convert filteredLeads to CSV and trigger download
    console.log("Exporting leads...");
  };

  if (isError) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-[#ea4335] font-medium">
          Failed to load the leads directory.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-300 mx-auto w-full h-[calc(100vh-100px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 shrink-0">
        <div className="flex-1">
          <h1 className="text-[24px] sm:text-[28px] font-normal text-[#1f1f1f] tracking-tight">
            Clients & Leads
          </h1>
          <p className="text-[14px] sm:text-base text-[#444746] mt-1">
            Manage and track your entire outreach pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium text-[#444746] bg-white border border-[#e0e0e0] rounded-xl hover:bg-[#f8fafd] transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>

          <button
            onClick={() =>
              router.push(`${pathname}?action=new-lead`, { scroll: false })
            }
            // 3. Added flex-1 sm:flex-none and justify-center here as well
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium bg-[#3186ff] text-white rounded-xl shadow-sm hover:bg-[#2872dd] transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} /> New Lead
          </button>
        </div>
      </div>

      {/* 2. The Main Data Canvas */}
      <div className="flex-1 bg-white rounded-[28px] shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] flex flex-col overflow-hidden relative">
        {/* Filtering Toolbar */}
        <div className="px-6 py-4 border-b border-[#e0e0e0]/60 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 bg-[#f8fafd]/50">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-90">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#747775]" />
            <input
              type="text"
              placeholder="Search business, category, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-[14px] text-[#1f1f1f] bg-white border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] transition-all"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#747775]" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as LeadStatus | "ALL")
              }
              className="w-full sm:w-45 px-3 py-2 text-[14px] font-medium text-[#444746] bg-white border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] transition-all cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="NOT_CONTACTED">Not Contacted</option>
              <option value="CONTACTED">Contacted</option>
              <option value="FOLLOW_UP_SCHEDULED">Follow-up Scheduled</option>
              <option value="NEGOTIATING">Negotiating</option>
              <option value="WON">Deal Won</option>
              <option value="LOST">Deal Lost</option>
            </select>
          </div>
        </div>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#3186ff] animate-spin" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <Target className="w-12 h-12 text-[#d1d5db] mb-4" />
              <h3 className="text-[18px] font-medium text-[#1f1f1f] mb-1">
                No leads found
              </h3>
              <p className="text-[14px] text-[#444746] mb-6 max-w-75">
                {searchQuery || statusFilter !== "ALL"
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Your pipeline is empty. Add a new lead to get started."}
              </p>
              {!searchQuery && statusFilter === "ALL" && (
                <button
                  onClick={() =>
                    router.push(`${pathname}?action=new-lead`, {
                      scroll: false,
                    })
                  }
                  className="text-[#3186ff] text-sm font-medium hover:underline"
                >
                  Create your first lead
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] z-10">
                <tr className="border-b border-[#e0e0e0]/60 text-[13px] uppercase tracking-wider font-medium text-[#747775]">
                  <th className="px-6 py-4 font-medium">Business Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Region</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date Added</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                {filteredLeads.map((lead: Lead) => {
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => router.push(`/leads/${lead.id}`)}
                      className="hover:bg-[#f0f4f9] hover:shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 group cursor-pointer border-b border-[#e0e0e0]/40 last:border-0 relative z-0 hover:z-10"
                    >
                      <td className="px-6 py-4 font-medium text-[#1f1f1f]">
                        {lead.business_name}
                      </td>
                      <td className="px-6 py-4 text-[#444746] capitalize">
                        {lead.category?.replace("_", " ") || "-"}
                      </td>
                      <td className="px-6 py-4 text-[#444746]">
                        {lead.city_region}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={formatStatus(lead.status)} />
                      </td>
                      <td className="px-6 py-4 text-[#444746]">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ArrowRight className="w-4 h-4 text-[#a1a3a1] group-hover:text-[#3186ff] group-hover:translate-x-1 transition-all inline-block" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer / Pagination Placeholder */}
        {filteredLeads.length > 0 && (
          <div className="px-6 py-4 border-t border-[#e0e0e0]/60 bg-white flex items-center justify-between shrink-0">
            <span className="text-sm text-[#747775]">
              Showing{" "}
              <strong className="text-[#1f1f1f]">{filteredLeads.length}</strong>{" "}
              result{filteredLeads.length !== 1 && "s"}
            </span>
            {/* Future pagination controls can go here */}
          </div>
        )}
      </div>
    </div>
  );
}

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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 shrink-0">
        <div className="flex-1">
          <h1 className="text-[22px] sm:text-[24px] font-medium text-[#1f1f1f] tracking-tight">
            Clients & Leads
          </h1>
          <p className="text-sm text-[#747775] mt-0.5">
            Manage and track your entire outreach pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#444746] bg-white border border-[#e0e0e0] rounded-xl hover:border-[#c4c7c5] hover:bg-[#f8f9fa] transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={() =>
              router.push(`${pathname}?action=new-lead`, { scroll: false })
            }
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#3186ff] text-white rounded-xl hover:bg-[#2872dd] transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            New Lead
          </button>
        </div>
      </div>

      {/* Main Data Canvas */}
      <div className="flex-1 bg-white rounded-2xl border border-[#e0e0e0]/70 flex flex-col overflow-hidden relative">
        {/* Filtering Toolbar */}
        <div className="px-5 py-3.5 border-b border-[#e0e0e0]/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
            <input
              type="text"
              placeholder="Search business, category, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm text-[#1f1f1f] placeholder:text-[#9aa0a6] bg-[#f8f9fa] border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#3186ff] focus:ring-[1.5px] focus:ring-[#3186ff]/20 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#9aa0a6] shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as LeadStatus | "ALL")
              }
              className="w-full sm:w-48 px-3 py-2 text-sm font-medium text-[#444746] bg-[#f8f9fa] border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#3186ff] focus:ring-[1.5px] focus:ring-[#3186ff]/20 transition-all cursor-pointer appearance-none"
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
              <Loader2 className="w-7 h-7 text-[#3186ff] animate-spin" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <Target className="w-10 h-10 text-[#d1d5db] mb-3" />
              <h3 className="text-[16px] font-medium text-[#1f1f1f] mb-1">
                No leads found
              </h3>
              <p className="text-sm text-[#747775] mb-5 max-w-72">
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
                  className="text-sm font-medium text-[#3186ff] hover:text-[#2872dd] transition-colors"
                >
                  Create your first lead
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10 border-b border-[#e0e0e0]/60">
                <tr>
                  <th className="px-6 py-3 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em]">
                    Business Name
                  </th>
                  <th className="px-4 py-3 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em]">
                    Category
                  </th>
                  <th className="px-4 py-3 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em]">
                    Region
                  </th>
                  <th className="px-4 py-3 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em]">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em] text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-[#e0e0e0]/40">
                {filteredLeads.map((lead: Lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => router.push(`/leads/${lead.id}`)}
                    className="hover:bg-[#f8f9fa] transition-colors duration-150 group cursor-pointer"
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
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={formatStatus(lead.status)} />
                    </td>
                    <td className="px-4 py-3.5 text-[#747775]">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <ArrowRight className="w-4 h-4 text-[#d1d5db] group-hover:text-[#3186ff] group-hover:translate-x-0.5 transition-all inline-block" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        {filteredLeads.length > 0 && (
          <div className="px-6 py-3.5 border-t border-[#e0e0e0]/60 bg-white flex items-center justify-between shrink-0">
            <span className="text-xs text-[#9aa0a6]">
              Showing{" "}
              <span className="font-medium text-[#444746]">
                {filteredLeads.length}
              </span>{" "}
              result{filteredLeads.length !== 1 && "s"}
            </span>
            {/* Future pagination controls can go here */}
          </div>
        )}
      </div>
    </div>
  );
}

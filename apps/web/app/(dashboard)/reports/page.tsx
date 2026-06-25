"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Database,
  Hash,
  Percent,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Lead } from "@/types";
import { apiUrl } from "@/lib/api";
import { StatusBadge } from "@/components/leads/status-badge";

const getAuthToken = () => {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("tracker_token="))
    ?.split("=")[1];
};

export default function ReportsPage() {
  const isMounted = typeof window !== "undefined";

  // Pagination State
  const [regionPage, setRegionPage] = useState(1);
  const REGIONS_PER_PAGE = 8;

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

  const totalLeads = leads.length;

  // 1. Tabular Aggregation: Pipeline Status
  const pipelineData = useMemo(() => {
    if (!totalLeads) return [];
    const counts = leads.reduce(
      (acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.keys(counts)
      .map((status) => ({
        status,
        count: counts[status],
        percentage: ((counts[status] / totalLeads) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);
  }, [leads, totalLeads]);

  // 2. Tabular Aggregation: Categories
  const categoryData = useMemo(() => {
    if (!totalLeads) return [];
    const counts = leads.reduce(
      (acc, lead) => {
        const cat = lead.category || "Uncategorized";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.keys(counts)
      .map((cat) => ({
        name: cat,
        count: counts[cat],
        percentage: ((counts[cat] / totalLeads) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);
  }, [leads, totalLeads]);

  // 3. Tabular Aggregation: Regions
  const regionData = useMemo(() => {
    if (!totalLeads) return [];
    const counts = leads.reduce(
      (acc, lead) => {
        const region = lead.city_region || "Unknown Region";
        acc[region] = (acc[region] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.keys(counts)
      .map((region) => ({
        name: region,
        count: counts[region],
        percentage: ((counts[region] / totalLeads) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);
  }, [leads, totalLeads]);

  // Execute the slice for the current page
  const totalRegionPages = Math.ceil(regionData.length / REGIONS_PER_PAGE);
  const paginatedRegionData = useMemo(() => {
    const startIndex = (regionPage - 1) * REGIONS_PER_PAGE;
    return regionData.slice(startIndex, startIndex + REGIONS_PER_PAGE);
  }, [regionData, regionPage]);

  if (!isMounted || isLoading) {
    return (
      <div className="h-full min-h-150 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3186ff] animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center text-[#ea4335]">
        Failed to load report data.
      </div>
    );
  }

  return (
    <div className="max-w-300 mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 border-b border-[#e0e0e0]/60 pb-5">
        <div>
          <h1 className="text-[22px] font-medium text-[#1f1f1f] tracking-tight">
            Data Reports
          </h1>
          <p className="text-sm text-[#747775] mt-0.5">
            Raw analytical aggregations and pipeline metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#e0e0e0] px-4 py-2 rounded-xl">
          <Database className="w-4 h-4 text-[#9aa0a6]" />
          <span className="text-sm font-medium text-[#444746]">
            Total Records: <span className="text-[#1f1f1f]">{totalLeads}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Table 1: Status Ledger */}
        <div className="bg-white rounded-2xl border border-[#e0e0e0]/70 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e0e0e0]/60 shrink-0">
            <h3 className="text-[15px] font-medium text-[#1f1f1f]">
              Status Ledger
            </h3>
            <p className="text-sm text-[#9aa0a6] mt-0.5">
              Lead volume broken down by current status.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar max-h-125">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10 border-b border-[#e0e0e0]/60">
                <tr>
                  <th className="py-3 px-6 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em]">
                    Status
                  </th>
                  <th className="py-3 px-6 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em] text-right">
                    <Hash className="w-3.5 h-3.5 inline-block mr-1 align-text-bottom" />
                    Volume
                  </th>
                  <th className="py-3 px-6 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em] text-right">
                    <Percent className="w-3.5 h-3.5 inline-block mr-1 align-text-bottom" />
                    Share
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e0e0]/40">
                {pipelineData.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-10 text-center text-sm text-[#9aa0a6]"
                    >
                      No records found
                    </td>
                  </tr>
                )}
                {pipelineData.map((row) => (
                  <tr
                    key={row.status}
                    className="hover:bg-[#f8f9fa] transition-colors duration-150"
                  >
                    <td className="py-3.5 px-6">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="py-3.5 px-6 text-sm font-medium text-[#1f1f1f] text-right">
                      {row.count}
                    </td>
                    <td className="py-3.5 px-6 text-sm text-[#747775] text-right">
                      {row.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Regional Volume */}
        <div className="bg-white rounded-2xl border border-[#e0e0e0]/70 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e0e0e0]/60 shrink-0">
            <h3 className="text-[15px] font-medium text-[#1f1f1f]">
              Regional Volume
            </h3>
            <p className="text-sm text-[#9aa0a6] mt-0.5">
              Lead concentration by city and region.
            </p>
          </div>
          <div className="flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-[#e0e0e0]/60">
                <tr>
                  <th className="py-3 px-6 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em]">
                    City / Region
                  </th>
                  <th className="py-3 px-6 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em] text-right">
                    Volume
                  </th>
                  <th className="py-3 px-6 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em] text-right">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e0e0]/40">
                {paginatedRegionData.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-10 text-center text-sm text-[#9aa0a6]"
                    >
                      No records found
                    </td>
                  </tr>
                )}
                {paginatedRegionData.map((row) => (
                  <tr
                    key={row.name}
                    className="hover:bg-[#f8f9fa] transition-colors duration-150"
                  >
                    <td
                      className="py-3.5 px-6 text-sm text-[#1f1f1f]"
                      title={row.name}
                    >
                      {row.name}
                    </td>
                    <td className="py-3.5 px-6 text-sm font-medium text-[#1f1f1f] text-right">
                      {row.count}
                    </td>
                    <td className="py-3.5 px-6 text-sm text-[#747775] text-right">
                      {row.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalRegionPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3.5 bg-white border-t border-[#e0e0e0]/60 mt-auto">
              <span className="text-xs text-[#9aa0a6]">
                Showing{" "}
                <span className="font-medium text-[#444746]">
                  {(regionPage - 1) * REGIONS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-[#444746]">
                  {Math.min(regionPage * REGIONS_PER_PAGE, regionData.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[#444746]">
                  {regionData.length}
                </span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setRegionPage((p) => Math.max(1, p - 1))}
                  disabled={regionPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e0e0e0] bg-white hover:bg-[#f8f9fa] hover:border-[#c4c7c5] text-[#444746] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-[#e0e0e0] transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setRegionPage((p) => Math.min(totalRegionPages, p + 1))
                  }
                  disabled={regionPage === totalRegionPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e0e0e0] bg-white hover:bg-[#f8f9fa] hover:border-[#c4c7c5] text-[#444746] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-[#e0e0e0] transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table 3: Category Segmentation */}
        <div className="bg-white rounded-2xl border border-[#e0e0e0]/70 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e0e0e0]/60 shrink-0">
            <h3 className="text-[15px] font-medium text-[#1f1f1f]">
              Category Segmentation
            </h3>
            <p className="text-sm text-[#9aa0a6] mt-0.5">
              Outreach volume grouped by industry sector.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar max-h-125">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10 border-b border-[#e0e0e0]/60">
                <tr>
                  <th className="py-3 px-6 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em]">
                    Category
                  </th>
                  <th className="py-3 px-6 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em] text-right">
                    Volume
                  </th>
                  <th className="py-3 px-6 text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em] text-right">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e0e0]/40">
                {categoryData.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-10 text-center text-sm text-[#9aa0a6]"
                    >
                      No records found
                    </td>
                  </tr>
                )}
                {categoryData.map((row) => (
                  <tr
                    key={row.name}
                    className="hover:bg-[#f8f9fa] transition-colors duration-150"
                  >
                    <td
                      className="py-3.5 px-6 text-sm text-[#1f1f1f] capitalize"
                      title={row.name}
                    >
                      {row.name.replace(/_/g, " ")}
                    </td>
                    <td className="py-3.5 px-6 text-sm font-medium text-[#1f1f1f] text-right">
                      {row.count}
                    </td>
                    <td className="py-3.5 px-6 text-sm text-[#747775] text-right">
                      {row.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="max-w-300 mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 border-b border-[#e0e0e0]/60 pb-6">
        <div>
          <h1 className="text-[28px] font-normal text-[#1f1f1f] tracking-tight">
            Data Reports
          </h1>
          <p className="text-[15px] text-[#444746] mt-1">
            Raw analytical aggregations and pipeline metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#e0e0e0] px-5 py-2.5 rounded-xl shadow-sm">
          <Database className="w-4 h-4 text-[#747775]" />
          <span className="text-[14px] font-medium text-[#1f1f1f]">
            Total Records: {totalLeads}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {/* Table 1: Status Distribution (Scrollbar preserved if it exceeds 500px) */}
        <div className="bg-white rounded-[28px] pt-7 pb-2 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] flex flex-col">
          <div className="px-7 mb-4 shrink-0">
            <h3 className="text-[18px] font-medium text-[#1f1f1f]">
              Status Ledger
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar max-h-125">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#f8fafd] z-10 border-y border-[#e0e0e0]/60">
                <tr>
                  <th className="py-3 px-7 text-[13px] font-medium text-[#747775]">
                    Status
                  </th>
                  <th className="py-3 px-7 text-[13px] font-medium text-[#747775] text-right">
                    <Hash className="w-4 h-4 inline-block mr-1 align-text-bottom" />
                    Volume
                  </th>
                  <th className="py-3 px-7 text-[13px] font-medium text-[#747775] text-right">
                    <Percent className="w-4 h-4 inline-block mr-1 align-text-bottom" />
                    Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {pipelineData.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 text-center text-[14px] text-[#747775]"
                    >
                      No records found
                    </td>
                  </tr>
                )}
                {pipelineData.map((row) => (
                  <tr
                    key={row.status}
                    className="border-b border-[#e0e0e0]/40 last:border-0 hover:bg-[#f8fafd]/50 transition-colors"
                  >
                    <td className="py-4 px-7">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="py-4 px-7 text-[15px] font-medium text-[#1f1f1f] text-right">
                      {row.count}
                    </td>
                    <td className="py-4 px-7 text-[15px] text-[#444746] text-right">
                      {row.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Regional Performance (Pagination Applied, Scrollbar Removed) */}
        <div className="bg-white rounded-[28px] pt-7 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] flex flex-col">
          <div className="px-7 mb-4 shrink-0">
            <h3 className="text-[18px] font-medium text-[#1f1f1f]">
              Regional Volume
            </h3>
          </div>
          {/* Removed max-h and overflow-y-auto here */}
          <div className="flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f8fafd] border-y border-[#e0e0e0]/60">
                <tr>
                  <th className="py-3 px-7 text-[13px] font-medium text-[#747775]">
                    City / Region
                  </th>
                  <th className="py-3 px-7 text-[13px] font-medium text-[#747775] text-right">
                    Volume
                  </th>
                  <th className="py-3 px-7 text-[13px] font-medium text-[#747775] text-right">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRegionData.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 text-center text-[14px] text-[#747775]"
                    >
                      No records found
                    </td>
                  </tr>
                )}
                {paginatedRegionData.map((row) => (
                  <tr
                    key={row.name}
                    className="border-b border-[#e0e0e0]/40 hover:bg-[#f8fafd]/50 transition-colors"
                  >
                    <td
                      className="py-4 px-7 text-[15px] text-[#1f1f1f]"
                      title={row.name}
                    >
                      {row.name}
                    </td>
                    <td className="py-4 px-7 text-[15px] font-medium text-[#1f1f1f] text-right">
                      {row.count}
                    </td>
                    <td className="py-4 px-7 text-[15px] text-[#444746] text-right">
                      {row.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer with Pagination Controls */}
          {totalRegionPages > 1 && (
            <div className="flex items-center justify-between px-7 py-4 bg-[#f8fafd] rounded-b-[28px] border-t border-[#e0e0e0]/60 mt-auto">
              <span className="text-[13px] font-medium text-[#747775]">
                Showing {(regionPage - 1) * REGIONS_PER_PAGE + 1} to{" "}
                {Math.min(regionPage * REGIONS_PER_PAGE, regionData.length)} of{" "}
                {regionData.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRegionPage((p) => Math.max(1, p - 1))}
                  disabled={regionPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e0e0e0] bg-white hover:bg-[#f0f4f9] text-[#1f1f1f] disabled:opacity-50 disabled:hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setRegionPage((p) => Math.min(totalRegionPages, p + 1))
                  }
                  disabled={regionPage === totalRegionPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e0e0e0] bg-white hover:bg-[#f0f4f9] text-[#1f1f1f] disabled:opacity-50 disabled:hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table 3: Industry Categories (Scrollbar preserved if it exceeds 500px) */}
        <div className="bg-white rounded-[28px] pt-7 pb-2 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] flex flex-col">
          <div className="px-7 mb-4 shrink-0">
            <h3 className="text-[18px] font-medium text-[#1f1f1f]">
              Category Segmentation
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar max-h-125">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#f8fafd] z-10 border-y border-[#e0e0e0]/60">
                <tr>
                  <th className="py-3 px-7 text-[13px] font-medium text-[#747775]">
                    Category
                  </th>
                  <th className="py-3 px-7 text-[13px] font-medium text-[#747775] text-right">
                    Volume
                  </th>
                  <th className="py-3 px-7 text-[13px] font-medium text-[#747775] text-right">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryData.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 text-center text-[14px] text-[#747775]"
                    >
                      No records found
                    </td>
                  </tr>
                )}
                {categoryData.map((row) => (
                  <tr
                    key={row.name}
                    className="border-b border-[#e0e0e0]/40 last:border-0 hover:bg-[#f8fafd]/50 transition-colors"
                  >
                    <td
                      className="py-4 px-7 text-[15px] text-[#1f1f1f] capitalize"
                      title={row.name}
                    >
                      {row.name.replace(/_/g, " ")}
                    </td>
                    <td className="py-4 px-7 text-[15px] font-medium text-[#1f1f1f] text-right">
                      {row.count}
                    </td>
                    <td className="py-4 px-7 text-[15px] text-[#444746] text-right">
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

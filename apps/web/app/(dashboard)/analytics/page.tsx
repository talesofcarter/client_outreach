"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { Loader2, Target, Award, BarChart3 } from "lucide-react";
import { Lead, LeadStatus } from "@/types";
import { apiUrl } from "@/lib/api";

interface TooltipPayloadItem {
  name: string;
  value: number;
  fill?: string;
  color?: string;
  payload?: {
    name: string;
    value: number;
  };
}

interface PremiumTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const getAuthToken = () => {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("tracker_token="))
    ?.split("=")[1];
};

const statusColors: Record<LeadStatus, string> = {
  not_contacted: "#a8abaf", // Gray
  contacted: "#3186ff", // Blue
  follow_up_scheduled: "#fed50d", // Yellow
  negotiating: "#8b5cf6", // Purple
  won: "#0ebc5f", // Green
  lost: "#ea4335", // Red
};

const statusLabels: Record<LeadStatus, string> = {
  not_contacted: "Not Contacted",
  contacted: "Contacted",
  follow_up_scheduled: "Follow-up",
  negotiating: "Negotiating",
  won: "Won",
  lost: "Lost",
};

const PremiumTooltip = ({ active, payload, label }: PremiumTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-[0_4px_20px_rgba(60,64,67,0.15)] border border-[#e0e0e0]/60 outline-none">
        <p className="text-[14px] font-medium text-[#1f1f1f] mb-1 capitalize">
          {label || payload[0].name}
        </p>
        <p className="text-[13px] text-[#444746] flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: payload[0].fill || payload[0].color }}
          />
          Count:{" "}
          <strong className="text-[#1f1f1f]">{payload[0].value} Leads</strong>
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const isMounted = typeof window !== "undefined";

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

  // 1. Data Aggregation: Pipeline Status Distribution (Pie Chart)
  const pipelineData = useMemo(() => {
    const counts = leads.reduce(
      (acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.keys(counts)
      .map((status) => ({
        name: statusLabels[status as LeadStatus],
        value: counts[status],
        color: statusColors[status as LeadStatus],
      }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  // 2. Data Aggregation: Leads by Category (Bar Chart)
  const categoryData = useMemo(() => {
    const counts = leads.reduce(
      (acc, lead) => {
        const cat = (
          lead.category?.replace("_", " ") || "Uncategorized"
        ).toLowerCase();
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.keys(counts)
      .map((cat) => ({
        name: cat,
        count: counts[cat],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7); // Top 7 categories
  }, [leads]);

  // 3. Data Aggregation: Leads by Region (Horizontal Bar Chart)
  const regionData = useMemo(() => {
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
      }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  const dynamicRegionChartHeight = Math.max(350, regionData.length * 45);

  // Key Metrics
  const winRate =
    leads.length > 0
      ? Math.round(
          (leads.filter((l) => l.status.toLowerCase() === "won").length /
            leads.length) *
            100,
        )
      : 0;

  const activePipeline = leads.filter(
    (l) =>
      l.status.toLowerCase() !== "won" && l.status.toLowerCase() !== "lost",
  ).length;

  if (!isMounted || isLoading) {
    return (
      <div className="h-full min-h-150 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3186ff] animate-spin" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3186ff] animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center text-[#ea4335]">
        Failed to load analytics data.
      </div>
    );
  }

  return (
    <div className="max-w-300 mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-12">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-normal text-[#1f1f1f] tracking-tight">
          Analytics & Pipeline
        </h1>
        <p className="text-base text-[#444746] mt-1">
          Visualizing your outreach performance and conversion metrics.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-[#3186ff]/10 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-[#3186ff]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#747775]">
              Active Pipeline
            </p>
            <h2 className="text-[28px] font-normal text-[#1f1f1f] leading-tight">
              {activePipeline} Leads
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-[#0ebc5f]/10 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-[#0ebc5f]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#747775]">
              Overall Win Rate
            </p>
            <h2 className="text-[28px] font-normal text-[#1f1f1f] leading-tight">
              {winRate}%
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-[#f0f4f9] flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6 text-[#444746]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#747775]">
              Total Processed
            </p>
            <h2 className="text-[28px] font-normal text-[#1f1f1f] leading-tight">
              {leads.length} Deals
            </h2>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart: Doughnut */}
        <div className="bg-white rounded-[28px] p-7 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] flex flex-col">
          <div className="mb-6 border-b border-[#e0e0e0]/60 pb-4">
            <h3 className="text-[18px] font-medium text-[#1f1f1f]">
              Pipeline Distribution
            </h3>
            <p className="text-[14px] text-[#747775] mt-1">
              Current status of all logged leads.
            </p>
          </div>

          <div className="flex-1 min-h-75 w-full">
            {pipelineData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#747775] text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
              >
                <PieChart>
                  <Tooltip
                    content={<PremiumTooltip />}
                    cursor={{ fill: "transparent" }}
                  />
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Chart: Bar Graph */}
        <div className="bg-white rounded-[28px] p-7 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] flex flex-col">
          <div className="mb-6 border-b border-[#e0e0e0]/60 pb-4">
            <h3 className="text-[18px] font-medium text-[#1f1f1f]">
              Top Lead Categories
            </h3>
            <p className="text-[14px] text-[#747775] mt-1">
              Volume of outreach by industry sector.
            </p>
          </div>

          <div className="flex-1 min-h-75 w-full">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#747775] text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
              >
                <BarChart
                  data={categoryData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e0e0e0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#747775", fontSize: 12 }}
                    tickFormatter={(value) =>
                      value.length > 10 ? `${value.substring(0, 10)}...` : value
                    }
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#747775", fontSize: 12 }}
                  />
                  <Tooltip
                    content={<PremiumTooltip />}
                    cursor={{ fill: "#f0f4f9" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#3186ff"
                    radius={[6, 6, 6, 6]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Full Width Bottom Chart: Leads by Region (Horizontal) */}
        <div className="lg:col-span-2 bg-white rounded-[28px] p-7 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] flex flex-col">
          <div className="mb-6 border-b border-[#e0e0e0]/60 pb-4 shrink-0">
            <h3 className="text-[18px] font-medium text-[#1f1f1f]">
              Geographical Distribution
            </h3>
            <p className="text-[14px] text-[#747775] mt-1">
              Lead concentration sorted by city and region.
            </p>
          </div>

          <div className="flex-1 h-87.5 overflow-y-auto pr-2 custom-scrollbar relative">
            {regionData.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-[#747775] text-sm">
                No data available
              </div>
            ) : (
              <div
                style={{
                  height: `${dynamicRegionChartHeight}px`,
                  width: "100%",
                }}
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={0}
                  minHeight={0}
                >
                  <BarChart
                    data={regionData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 60, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                      stroke="#e0e0e0"
                    />

                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#747775", fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#1f1f1f", fontSize: 13, fontWeight: 500 }}
                      width={100}
                    />

                    <Tooltip
                      content={<PremiumTooltip />}
                      cursor={{ fill: "#f0f4f9" }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#fed50d"
                      radius={[0, 6, 6, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

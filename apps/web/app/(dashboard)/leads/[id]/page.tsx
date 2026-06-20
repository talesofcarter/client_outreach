"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { EditLeadPanel } from "@/components/leads/edit-lead-panel";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Target,
  Calendar,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import { Lead, LeadStatus } from "@/types";

const getAuthToken = () => {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("tracker_token="))
    ?.split("=")[1];
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
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

export default function LeadDetailsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const leadId = params.id as string;
  const queryClient = useQueryClient();

  const {
    data: lead,
    isLoading,
    isError,
  } = useQuery<Lead>({
    queryKey: ["lead", leadId],
    queryFn: async () => {
      const token = getAuthToken();
      const res = await fetch(`http://localhost:3001/leads/${leadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch lead details");
      return res.json();
    },
  });

  // 1. The Secure Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = getAuthToken();
      const res = await fetch(`http://localhost:3001/leads/${leadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete lead");
    },
    onSuccess: () => {
      toast.success("Lead Deleted", {
        description: "The lead has been permanently removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["leads"] }); // Refresh dashboard list
      router.push("/"); // Boot user back to dashboard
    },
    onError: (err: any) => {
      toast.error("Error", { description: err.message });
    },
  });

  // 2. The Button Handlers
  const handleEdit = () => {
    router.push(`${pathname}?action=edit-lead`, { scroll: false });
  };

  const handleDelete = () => {
    // Add a native browser confirmation dialog to prevent accidental clicks
    if (
      window.confirm(
        "Are you sure you want to delete this lead? This action cannot be undone.",
      )
    ) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#3186ff] animate-spin" />
        <p className="text-[#444746] font-medium">Loading lead profile...</p>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-[#ea4335] font-medium">
          Failed to load lead. They may have been deleted.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-[#3186ff] hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const badge = statusConfig[lead.status] || statusConfig.not_contacted;

  return (
    <div className="max-w-250 mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-12">
      {/* 1. Top Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-[#444746] hover:text-[#1f1f1f] transition-colors font-medium group px-2 py-1 -ml-2 rounded-lg hover:bg-[#f0f4f9]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#444746] bg-white border border-[#e0e0e0] rounded-xl hover:bg-[#f8fafd] transition-colors shadow-sm"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#ea4335] bg-white border border-[#e0e0e0] rounded-xl hover:bg-[#fef2f2] hover:border-[#ea4335]/30 transition-colors shadow-sm disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      </div>

      {/* 2. Header Identity Card */}
      <div className="bg-white rounded-[28px] p-8 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] relative overflow-hidden">
        {/* Subtle background accent based on status */}
        <div
          className={`absolute top-0 right-0 w-64 h-64 opacity-5 rounded-bl-[200px] pointer-events-none ${badge.colors.split(" ")[0]}`}
        />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#f0f4f9] flex items-center justify-center border border-[#e0e0e0]/60 shrink-0">
              <Building2 className="w-8 h-8 text-[#3186ff]" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-[32px] font-normal text-[#1f1f1f] tracking-tight leading-none mb-2">
                {lead.business_name}
              </h1>
              <div className="flex items-center gap-4 text-[#444746] text-[15px]">
                <span className="flex items-center gap-1.5 capitalize">
                  <Target className="w-4 h-4" />{" "}
                  {lead.category?.replace("_", " ") || "Uncategorized"}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#d1d5db]" />
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {lead.city_region}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <span
              className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium border ${badge.colors}`}
            >
              {badge.label}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#747775]">
              <Calendar className="w-3.5 h-3.5" /> Added{" "}
              {formatDate(lead.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Detailed Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Core Issues & Notes */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-7 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)]">
            <h3 className="text-[18px] font-medium text-[#1f1f1f] mb-4 border-b border-[#e0e0e0]/60 pb-3">
              Key Issues Identified
            </h3>
            <p className="text-[15px] text-[#444746] leading-relaxed whitespace-pre-wrap">
              {lead.key_issues_found}
            </p>
          </div>

          {/* Placeholder for future activity timeline / notes */}
          <div className="bg-white rounded-3xl p-7 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] opacity-60">
            <h3 className="text-[18px] font-medium text-[#1f1f1f] mb-4 border-b border-[#e0e0e0]/60 pb-3">
              Activity Log
            </h3>
            <p className="text-sm text-[#747775] italic text-center py-6">
              Interaction history and notes will appear here in future updates.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-7 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)]">
            <h3 className="text-[18px] font-medium text-[#1f1f1f] mb-5 border-b border-[#e0e0e0]/60 pb-3">
              Contact Details
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f0f4f9] flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="w-4 h-4 text-[#444746]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#747775] mb-0.5">
                    Website
                  </p>
                  {lead.website_url ? (
                    <a
                      href={lead.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] text-[#3186ff] hover:underline break-all"
                    >
                      {lead.website_url.replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    <p className="text-[14px] text-[#1f1f1f]">Not provided</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f0f4f9] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-[#444746]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#747775] mb-0.5">
                    Email Address
                  </p>
                  {lead.email ? (
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-[14px] text-[#1f1f1f] hover:text-[#3186ff] transition-colors break-all"
                    >
                      {lead.email}
                    </a>
                  ) : (
                    <p className="text-[14px] text-[#1f1f1f]">Not provided</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f0f4f9] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-[#444746]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#747775] mb-0.5">
                    Phone Number
                  </p>
                  {lead.phone ? (
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-[14px] text-[#1f1f1f] hover:text-[#3186ff] transition-colors"
                    >
                      {lead.phone}
                    </a>
                  ) : (
                    <p className="text-[14px] text-[#1f1f1f]">Not provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditLeadPanel lead={lead} />
    </div>
  );
}

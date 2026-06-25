"use client";

import { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { Lead, LeadStatus } from "@/types";
import { EditLeadPanel } from "@/components/leads/edit-lead-panel";
import { formatStatus } from "@/lib/formatStatus";
import { apiUrl } from "@/lib/api";
import { StatusBadge } from "@/components/leads/status-badge";
import ReactMarkdown from "react-markdown";

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

  // State for our custom premium modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch the active lead
  const {
    data: lead,
    isLoading,
    isError,
  } = useQuery<Lead>({
    queryKey: ["lead", leadId],
    queryFn: async () => {
      const token = getAuthToken();
      const res = await fetch(`${apiUrl}/leads/${leadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch lead details");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = getAuthToken();
      const res = await fetch(`${apiUrl}/leads/${leadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to delete lead");
      }
    },
    onSuccess: () => {
      toast.success("Lead Deleted", {
        description: "The lead has been permanently removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      router.push("/");
    },

    onError: (error: Error) => {
      toast.error("Deletion Failed", { description: error.message });
      setIsDeleteModalOpen(false);
    },
  });

  // Button Handlers
  const handleEdit = () => {
    router.push(`${pathname}?action=edit-lead`, { scroll: false });
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  // Loading and Error States
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
          className="mt-4 text-[#3186ff] hover:underline font-medium"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const badge = statusConfig[lead.status] || statusConfig.not_contacted;

  return (
    <div className="max-w-250 mx-auto w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-12">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm font-medium text-[#747775] hover:text-[#1f1f1f] transition-colors group px-2 py-1 -ml-2 rounded-lg hover:bg-[#f8f9fa]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#444746] bg-white border border-[#e0e0e0] rounded-xl hover:border-[#c4c7c5] hover:bg-[#f8f9fa] transition-all"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#747775] bg-white border border-[#e0e0e0] rounded-xl hover:text-[#c5221f] hover:bg-[#fef2f2] hover:border-[#fca5a5]/50 transition-all"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Header Identity Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#e0e0e0]/70 relative overflow-hidden">
        <div
          className={`absolute top-0 right-0 w-56 h-56 opacity-[0.04] rounded-bl-[180px] pointer-events-none ${badge.colors.split(" ")[0]}`}
        />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#e8f0fe] flex items-center justify-center border border-[#e0e0e0]/60 shrink-0">
              <Building2 className="w-7 h-7 text-[#185FA5]" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-[26px] font-medium text-[#1f1f1f] tracking-tight leading-none mb-2">
                {lead.business_name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-[#747775]">
                <span className="flex items-center gap-1.5 capitalize">
                  <Target className="w-3.5 h-3.5" />
                  {lead.category?.replace("_", " ") || "Uncategorized"}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#d1d5db]" />
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {lead.city_region}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2.5">
            <StatusBadge status={formatStatus(lead.status)} />
            <span className="flex items-center gap-1.5 text-xs text-[#9aa0a6]">
              <Calendar className="w-3.5 h-3.5" /> Added{" "}
              {formatDate(lead.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-4">
          {/* Key Issues */}
          <div className="bg-white rounded-2xl p-6 border border-[#e0e0e0]/70">
            <h3 className="text-[15px] font-medium text-[#1f1f1f] mb-3 border-b border-[#e0e0e0]/60 pb-3">
              Key Issues Identified
            </h3>
            <div className="prose prose-sm max-w-none prose-p:text-sm prose-p:text-[#444746] prose-p:leading-relaxed prose-headings:text-[#1f1f1f] prose-headings:font-medium prose-a:text-[#3186ff] prose-a:no-underline hover:prose-a:underline prose-li:text-[#444746] prose-li:text-sm prose-strong:text-[#1f1f1f]">
              <ReactMarkdown>
                {lead.key_issues_found ||
                  "*No key issues have been recorded for this lead yet.*"}
              </ReactMarkdown>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-2xl p-6 border border-[#e0e0e0]/70 opacity-60">
            <h3 className="text-[15px] font-medium text-[#1f1f1f] mb-3 border-b border-[#e0e0e0]/60 pb-3">
              Activity Log
            </h3>
            <p className="text-sm text-[#9aa0a6] italic text-center py-5">
              Interaction history and notes will appear here in future updates.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Card */}
        <div>
          <div className="bg-white rounded-2xl p-6 border border-[#e0e0e0]/70">
            <h3 className="text-[15px] font-medium text-[#1f1f1f] mb-4 border-b border-[#e0e0e0]/60 pb-3">
              Contact Details
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-[#e0e0e0]/60 flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="w-4 h-4 text-[#747775]" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em] mb-0.5">
                    Website
                  </p>
                  {lead.website_url ? (
                    <a
                      href={lead.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#3186ff] hover:underline break-all"
                    >
                      {lead.website_url.replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    <p className="text-sm text-[#9aa0a6]">Not provided</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-[#e0e0e0]/60 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-[#747775]" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em] mb-0.5">
                    Email Address
                  </p>
                  {lead.email ? (
                    <a className="text-sm text-[#1f1f1f] hover:text-[#3186ff] transition-colors break-all cursor-pointer">
                      {lead.email}
                    </a>
                  ) : (
                    <p className="text-sm text-[#9aa0a6]">Not provided</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-[#e0e0e0]/60 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-[#747775]" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#9aa0a6] uppercase tracking-[0.06em] mb-0.5">
                    Phone Number
                  </p>
                  {lead.phone ? (
                    <a className="text-sm text-[#1f1f1f] hover:text-[#3186ff] transition-colors cursor-pointer">
                      {lead.phone}
                    </a>
                  ) : (
                    <p className="text-sm text-[#9aa0a6]">Not provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Edit Panel */}
      <EditLeadPanel lead={lead} />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center pointer-events-auto">
          <div
            onClick={() => setIsDeleteModalOpen(false)}
            className="absolute inset-0 bg-[#1f1f1f]/20 backdrop-blur-[2px] animate-in fade-in duration-200"
          />

          <div className="relative bg-white w-full max-w-md rounded-2xl p-7 border border-[#e0e0e0]/70 shadow-[0_20px_60px_rgba(0,0,0,0.1)] animate-in zoom-in-95 fade-in duration-200 ease-out m-4">
            <div className="w-10 h-10 rounded-[10px] bg-[#fef2f2] border border-[#fca5a5]/40 flex items-center justify-center mb-5">
              <AlertTriangle
                className="w-5 h-5 text-[#c5221f]"
                strokeWidth={2}
              />
            </div>

            <h3 className="text-[18px] font-medium text-[#1f1f1f] tracking-tight mb-1.5">
              Delete this lead?
            </h3>
            <p className="text-sm text-[#747775] leading-relaxed mb-6">
              This action cannot be undone. All data, contact details, and
              pipeline history for{" "}
              <span className="font-medium text-[#1f1f1f]">
                {lead.business_name}
              </span>{" "}
              will be permanently removed from your database.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteMutation.isPending}
                className="px-5 py-2 text-sm font-medium text-[#444746] hover:bg-[#f8f9fa] rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium bg-[#c5221f] text-white rounded-xl hover:bg-[#a61c17] transition-all active:scale-[0.98] min-w-28 disabled:opacity-70"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Delete Lead"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

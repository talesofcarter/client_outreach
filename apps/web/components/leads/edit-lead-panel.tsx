"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  X,
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Target,
  Loader2,
  Flag,
  Tag,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { Lead } from "@/types";
import { apiUrl } from "@/lib/api";

function EditLeadPanelContent({ lead }: { lead: Lead }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const isOpen = searchParams.get("action") === "edit-lead";
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (isOpen && !isAnimating) {
    setIsAnimating(true);
  }

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const closePanel = () => {
    router.push(pathname, { scroll: false });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const updateData = Object.fromEntries(formData.entries());

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tracker_token="))
      ?.split("=")[1];

    try {
      const response = await fetch(`${apiUrl}/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update lead");
      }

      toast.success("Lead updated", {
        description: "Changes saved successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["lead", lead.id] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });

      closePanel();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      toast.error("Update Failed", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        onClick={closePanel}
        className={`absolute inset-0 bg-[#1f1f1f]/20 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <div
        className={`absolute inset-y-0 right-0 w-full max-w-130 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.12)] flex flex-col transition-transform duration-300 ease-out pointer-events-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-7 py-6 border-b border-[#e0e0e0]/60 shrink-0">
          <div>
            <h2 className="text-[20px] font-medium text-[#1f1f1f] tracking-tight">
              Edit Lead
            </h2>
            <p className="text-[14px] text-[#444746] mt-0.5">
              Update details for {lead.business_name}
            </p>
          </div>
          <button
            onClick={closePanel}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#747775] hover:bg-[#f0f4f9] hover:text-[#1f1f1f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          <form
            id="edit-lead-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="relative group">
              <select
                id="status"
                name="status"
                defaultValue={lead.status}
                className="block px-4 pb-2.5 pt-6 w-full text-[15px] font-medium text-[#3186ff] bg-[#3186ff]/5 rounded-xl border border-[#3186ff]/20 appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer cursor-pointer"
                required
              >
                <option value="NOT_CONTACTED">Not Contacted</option>
                <option value="CONTACTED">Contacted</option>
                <option value="FOLLOW_UP_SCHEDULED">Follow-up Scheduled</option>
                <option value="NEGOTIATING">Negotiating</option>
                <option value="WON">Deal Won</option>
                <option value="LOST">Deal Lost</option>
              </select>
              <label
                htmlFor="status"
                className="absolute text-[15px] text-[#3186ff] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-transparent px-1 flex items-center gap-1.5 cursor-pointer"
              >
                <Flag className="w-4 h-4" /> Pipeline Status
              </label>
            </div>

            <hr className="border-[#e0e0e0]/60" />

            <div className="relative group">
              <input
                type="text"
                id="businessName"
                name="businessName"
                defaultValue={lead.business_name}
                className="block px-4 pb-2.5 pt-6 w-full text-[15px] text-[#1f1f1f] bg-transparent rounded-xl border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] peer"
                required
                placeholder=" "
              />
              <label
                htmlFor="businessName"
                className="absolute text-[15px] text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:text-[#3186ff] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 flex items-center gap-1.5 cursor-text"
              >
                <Building2 className="w-4 h-4" /> Business Name
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <input
                  type="text"
                  id="region"
                  name="region"
                  defaultValue={lead.city_region}
                  className="block px-4 pb-2.5 pt-6 w-full text-[15px] text-[#1f1f1f] bg-transparent rounded-xl border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] peer"
                  required
                  placeholder=" "
                />
                <label
                  htmlFor="region"
                  className="absolute text-[15px] text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:text-[#3186ff] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 flex items-center gap-1.5 cursor-text"
                >
                  <MapPin className="w-4 h-4" /> Region
                </label>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  id="category"
                  name="category"
                  defaultValue={lead.category}
                  className="block px-4 pb-2.5 pt-6 w-full text-[15px] text-[#1f1f1f] bg-transparent rounded-xl border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] peer"
                  required
                  placeholder=" "
                />
                <label
                  htmlFor="category"
                  className="absolute text-[15px] text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:text-[#3186ff] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 flex items-center gap-1.5 cursor-text"
                >
                  <Tag className="w-4 h-4" /> Category
                </label>
              </div>
            </div>

            <hr className="border-[#e0e0e0]/60" />

            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="url"
                  id="website"
                  name="website"
                  defaultValue={lead.website_url || ""}
                  className="block px-4 pb-2.5 pt-6 w-full text-[15px] text-[#1f1f1f] bg-transparent rounded-xl border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="website"
                  className="absolute text-[15px] text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:text-[#3186ff] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 flex items-center gap-1.5 cursor-text"
                >
                  <Globe className="w-4 h-4" /> Website URL
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={lead.email || ""}
                    className="block px-4 pb-2.5 pt-6 w-full text-[15px] text-[#1f1f1f] bg-transparent rounded-xl border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-[15px] text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:text-[#3186ff] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 flex items-center gap-1.5 cursor-text"
                  >
                    <Mail className="w-4 h-4" /> Email
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={lead.phone || ""}
                    className="block px-4 pb-2.5 pt-6 w-full text-[15px] text-[#1f1f1f] bg-transparent rounded-xl border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="phone"
                    className="absolute text-[15px] text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:text-[#3186ff] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 flex items-center gap-1.5 cursor-text"
                  >
                    <Phone className="w-4 h-4" /> Phone
                  </label>
                </div>
              </div>
            </div>

            <hr className="border-[#e0e0e0]/60" />

            <div className="relative group">
              <textarea
                id="issues"
                name="issues"
                rows={4}
                defaultValue={lead.key_issues_found}
                className="block px-4 pb-2.5 pt-6 w-full text-[15px] text-[#1f1f1f] bg-transparent rounded-xl border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] peer resize-none"
                required
                placeholder=" "
              />
              <label
                htmlFor="issues"
                className="absolute text-[15px] text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:text-[#3186ff] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 flex items-center gap-1.5 cursor-text"
              >
                <Target className="w-4 h-4" /> Key Issues Found
              </label>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-[#e0e0e0]/60 bg-[#f8fafd] shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closePanel}
            disabled={isLoading}
            className="px-5 py-2.5 text-[14px] font-medium text-[#444746] hover:bg-[#e9eef6] rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-lead-form"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-[14px] font-medium bg-[#3186ff] text-white rounded-xl shadow-sm hover:bg-[#2872dd] transition-all active:scale-[0.98] min-w-35 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function EditLeadPanel({ lead }: { lead: Lead }) {
  return (
    <Suspense fallback={null}>
      <EditLeadPanelContent lead={lead} />
    </Suspense>
  );
}

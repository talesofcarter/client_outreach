"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  X,
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Target,
  Loader2,
  Tag,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { apiUrl } from "@/lib/api";

function NewLeadPanelContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isOpen = searchParams.get("action") === "new-lead";
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
    const rawData = Object.fromEntries(formData.entries());

    // 1. Clean the payload
    const leadData = {
      ...rawData,
      email: rawData.email?.toString().trim() || null,
      phone: rawData.phone?.toString().trim() || null,
      website: rawData.website?.toString().trim() || null,
    };

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tracker_token="))
      ?.split("=")[1];

    try {
      const response = await fetch(`${apiUrl}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(leadData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save lead");
      }

      toast.success("Lead added successfully", {
        description: `${result.business_name} has been added to your pipeline.`,
      });

      closePanel();
      router.refresh();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      toast.error("Operation Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        onClick={closePanel}
        className={`absolute inset-0 bg-[#1f1f1f]/20 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto
      ${isOpen ? "opacity-100" : "opacity-0"}
    `}
      />

      <div
        className={`absolute inset-y-0 right-0 w-full max-w-130 bg-white border-l border-[#e0e0e0]/70 flex flex-col transition-transform duration-300 ease-out pointer-events-auto
      ${isOpen ? "translate-x-0" : "translate-x-full"}
    `}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e0e0e0]/60 shrink-0">
          <div>
            <h2 className="text-[17px] font-medium text-[#1f1f1f] tracking-tight">
              Add New Lead
            </h2>
            <p className="text-sm text-[#9aa0a6] mt-0.5">
              Enter the business details below to track them.
            </p>
          </div>
          <button
            onClick={closePanel}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9aa0a6] hover:bg-[#f8f9fa] hover:text-[#1f1f1f] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form
            id="new-lead-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="relative group">
              <input
                type="text"
                id="businessName"
                name="businessName"
                className="block px-4 pb-2.5 pt-6 w-full text-sm text-[#1f1f1f] bg-transparent rounded-xl border border-[#e0e0e0] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50 transition-colors hover:border-[#c4c7c5]"
                placeholder=" "
                required
              />
              <label
                htmlFor="businessName"
                className="absolute text-sm text-[#9aa0a6] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" /> Business Name
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative group">
                <input
                  type="text"
                  id="region"
                  name="region"
                  className="block px-4 pb-2.5 pt-6 w-full text-sm text-[#1f1f1f] bg-transparent rounded-xl border border-[#e0e0e0] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50 transition-colors hover:border-[#c4c7c5]"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="region"
                  className="absolute text-sm text-[#9aa0a6] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" /> City / Region
                </label>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  id="category"
                  name="category"
                  className="block px-4 pb-2.5 pt-6 w-full text-sm text-[#1f1f1f] bg-transparent rounded-xl border border-[#e0e0e0] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50 transition-colors hover:border-[#c4c7c5]"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="category"
                  className="absolute text-sm text-[#9aa0a6] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5" /> Category
                </label>
              </div>
            </div>

            <hr className="border-[#e0e0e0]/60" />

            <div className="space-y-3">
              <div className="relative group">
                <input
                  type="url"
                  id="website"
                  name="website"
                  className="block px-4 pb-2.5 pt-6 w-full text-sm text-[#1f1f1f] bg-transparent rounded-xl border border-[#e0e0e0] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50 transition-colors hover:border-[#c4c7c5]"
                  placeholder=" "
                />
                <label
                  htmlFor="website"
                  className="absolute text-sm text-[#9aa0a6] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" /> Website URL
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="block px-4 pb-2.5 pt-6 w-full text-sm text-[#1f1f1f] bg-transparent rounded-xl border border-[#e0e0e0] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50 transition-colors hover:border-[#c4c7c5]"
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-sm text-[#9aa0a6] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="block px-4 pb-2.5 pt-6 w-full text-sm text-[#1f1f1f] bg-transparent rounded-xl border border-[#e0e0e0] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50 transition-colors hover:border-[#c4c7c5]"
                    placeholder=" "
                  />
                  <label
                    htmlFor="phone"
                    className="absolute text-sm text-[#9aa0a6] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" /> Phone Number
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
                className="block px-4 pb-2.5 pt-6 w-full text-sm text-[#1f1f1f] bg-transparent rounded-xl border border-[#e0e0e0] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50 resize-none transition-colors hover:border-[#c4c7c5]"
                placeholder=" "
                required
              />
              <label
                htmlFor="issues"
                className="absolute text-sm text-[#9aa0a6] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text flex items-center gap-1.5"
              >
                <Target className="w-3.5 h-3.5" /> Key Issues Found (Why target
                them?)
              </label>
            </div>
          </form>
        </div>

        {/* Panel Footer */}
        <div className="px-6 py-4 border-t border-[#e0e0e0]/60 shrink-0 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={closePanel}
            disabled={isLoading}
            className="px-5 py-2 text-sm font-medium text-[#444746] hover:bg-[#f8f9fa] rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="new-lead-form"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium bg-[#3186ff] text-white rounded-xl hover:bg-[#2872dd] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed min-w-28"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Lead"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function NewLeadPanel() {
  return (
    <Suspense fallback={null}>
      <NewLeadPanelContent />
    </Suspense>
  );
}

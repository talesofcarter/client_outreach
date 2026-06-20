"use client";

import { useEffect, useState } from "react";
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

export function NewLeadPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Check if the URL contains ?action=new-lead
  const isOpen = searchParams.get("action") === "new-lead";
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
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

    // 1. Extract data using standard browser APIs
    const formData = new FormData(e.currentTarget);
    const leadData = Object.fromEntries(formData.entries());

    // 2. Retrieve the JWT token saved in the cookie during login
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tracker_token="))
      ?.split("=")[1];

    try {
      // 3. Send the secure request to NestJS
      const response = await fetch("http://localhost:3001/leads", {
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
    } catch (error: any) {
      toast.error("Operation Failed", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* 1. Backdrop */}
      <div
        onClick={closePanel}
        className={`absolute inset-0 bg-[#1f1f1f]/20 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* 2. Sliding Panel */}
      <div
        className={`absolute inset-y-0 right-0 w-full max-w-130 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.12)] flex flex-col transition-transform duration-300 ease-out pointer-events-auto
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-[#e0e0e0]/60 shrink-0">
          <div>
            <h2 className="text-[20px] font-medium text-[#1f1f1f] tracking-tight">
              Add New Lead
            </h2>
            <p className="text-[14px] text-[#444746] mt-0.5">
              Enter the business details below to track them.
            </p>
          </div>
          <button
            onClick={closePanel}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#747775] hover:bg-[#f0f4f9] hover:text-[#1f1f1f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-7">
          <form
            id="new-lead-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Business Name */}
            <div className="relative group">
              <input
                type="text"
                id="businessName"
                className="block px-4 pb-2.5 pt-6 w-full text-[15px] text-[#1f1f1f] bg-transparent rounded-xl border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50"
                placeholder=" "
                required
              />
              <label
                htmlFor="businessName"
                className="absolute text-[15px] text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text flex items-center gap-1.5"
              >
                <Building2 className="w-4 h-4" /> Business Name
              </label>
            </div>

            {/* Region & Category Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <input
                  type="text"
                  id="region"
                  className="block px-4 pb-2.5 pt-6 w-full text-[15px] text-[#1f1f1f] bg-transparent rounded-xl border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="region"
                  className="absolute text-[15px] text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text flex items-center gap-1.5"
                >
                  <MapPin className="w-4 h-4" /> City / Region
                </label>
              </div>

              <div className="relative group">
                <div className="relative group">
                  <input
                    type="text"
                    id="category"
                    name="category"
                    className="block px-4 pb-2.5 pt-6 w-full text-[15px] text-[#1f1f1f] bg-transparent rounded-xl border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="category"
                    className="absolute text-[15px] text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text flex items-center gap-1.5"
                  >
                    <Tag className="w-4 h-4" /> Category
                  </label>
                </div>
              </div>
            </div>

            <hr className="border-[#e0e0e0]/60" />

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="url"
                  id="website"
                  className="block px-4 pb-2.5 pt-6 w-full text-[15px] text-[#1f1f1f] bg-transparent rounded-xl border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50"
                  placeholder=" "
                />
                <label
                  htmlFor="website"
                  className="absolute text-[15px] text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text flex items-center gap-1.5"
                >
                  <Globe className="w-4 h-4" /> Website URL
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    className="block px-4 pb-2.5 pt-6 w-full text-[15px] text-[#1f1f1f] bg-transparent rounded-xl border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50"
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-[15px] text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="tel"
                    id="phone"
                    className="block px-4 pb-2.5 pt-6 w-full text-[15px] text-[#1f1f1f] bg-transparent rounded-xl border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50"
                    placeholder=" "
                  />
                  <label
                    htmlFor="phone"
                    className="absolute text-[15px] text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text flex items-center gap-1.5"
                  >
                    <Phone className="w-4 h-4" /> Phone Number
                  </label>
                </div>
              </div>
            </div>

            <hr className="border-[#e0e0e0]/60" />

            {/* Key Issues - Textarea */}
            <div className="relative group">
              <textarea
                id="issues"
                rows={4}
                className="block px-4 pb-2.5 pt-6 w-full text-[15px] text-[#1f1f1f] bg-transparent rounded-xl border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50 resize-none"
                placeholder=" "
                required
              />
              <label
                htmlFor="issues"
                className="absolute text-[15px] text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text flex items-center gap-1.5"
              >
                <Target className="w-4 h-4" /> Key Issues Found (Why target
                them?)
              </label>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
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
            form="new-lead-form"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-[14px] font-medium bg-[#3186ff] text-white rounded-xl shadow-sm hover:bg-[#2872dd] hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed min-w-30"
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

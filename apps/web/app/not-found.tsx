"use client";

import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Premium Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[#3186ff] opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out max-w-115">
        <div className="w-24 h-24 mb-8 relative flex items-center justify-center">
          <div
            className="absolute inset-0 bg-[#3186ff]/10 rounded-full animate-pulse"
            style={{ animationDuration: "3s" }}
          />

          <div className="w-16 h-16 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-[#e0e0e0]/60 flex items-center justify-center relative z-10">
            <Compass className="w-7 h-7 text-[#3186ff]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Typography */}
        <h1 className="text-[36px] font-normal text-[#1f1f1f] tracking-tight mb-4 leading-tight">
          Lost in the pipeline?
        </h1>
        <p className="text-[16px] text-[#747775] leading-relaxed mb-10">
          We can&apos;t seem to find the page you&apos;re looking for. It might
          have been moved, deleted, or perhaps the URL is slightly off.
        </p>

        {/* Premium Button Layout */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3.5 text-[14px] font-medium text-[#444746] bg-white border border-[#e0e0e0] rounded-xl hover:bg-[#f0f4f9] hover:text-[#1f1f1f] transition-all shadow-sm flex items-center justify-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 text-[#747775] group-hover:text-[#1f1f1f] group-hover:-translate-x-1 transition-all" />
            Go Back
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 text-[14px] font-medium text-white bg-[#3186ff] rounded-xl hover:bg-[#2872dd] transition-all shadow-[0_4px_14px_0_rgba(49,134,255,0.25)] flex items-center justify-center hover:shadow-[0_6px_20px_rgba(49,134,255,0.23)] active:scale-[0.98]"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

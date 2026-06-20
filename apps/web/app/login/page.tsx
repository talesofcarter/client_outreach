"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f9] p-4">
      {/* The Wide-Format Card */}
      <div className="w-full max-w-260 bg-white rounded-[28px] p-9 sm:p-12 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] flex flex-col md:flex-row gap-10 md:gap-20">
        <div className="flex-1 flex flex-col justify-start">
          <div className="flex gap-1.5 mb-10">
            <div className="w-3.5 h-10 rounded-full bg-[#3186ff]" />
            <div className="w-3.5 h-10 rounded-full bg-[#fed50d]" />
            <div className="w-3.5 h-10 rounded-full bg-[#0ebc5f]" />
          </div>

          <h1 className="text-[36px] leading-11 font-normal text-[#1f1f1f] mb-4">
            Sign in
          </h1>
          <p className="text-base text-[#1f1f1f]">
            Continue to Outreach Tracker
          </p>
        </div>

        {/* Right Column: Interactive Form & Actions */}
        <div className="flex-1 flex flex-col justify-between pt-2">
          <form className="space-y-6">
            <div className="relative group">
              <input
                type="email"
                id="email"
                className="block px-4 pb-2.5 pt-6 w-full text-base text-[#1f1f1f] bg-transparent rounded-md border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="absolute text-base text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text"
              >
                Email address
              </label>
            </div>

            {/* Elite Input */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="block px-4 pb-2.5 pt-6 w-full text-base text-[#1f1f1f] bg-transparent rounded-md border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer pr-12"
                placeholder=" "
                required
              />
              <label
                htmlFor="password"
                className="absolute text-base text-[#747775] duration-200 transform -translate-y-4 scale-[0.80] top-4 z-10 origin-left left-4 bg-white px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-[0.80] peer-focus:-translate-y-4 peer-focus:text-[#3186ff] cursor-text"
              >
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#444746] hover:text-[#1f1f1f] transition-colors focus:outline-none z-20"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between mt-16 md:mt-24">
            <button
              type="button"
              className="relative text-sm font-medium text-[#444746] hover:text-[#3186ff] transition-colors py-1 group"
            >
              Forgot password?
            </button>

            {/* Tactile, Premium Primary Button */}
            <button
              type="button"
              className="group flex items-center gap-2 bg-[#3186ff] text-white px-7 py-3 rounded-xl text-sm font-medium shadow-sm hover:bg-[#2872dd] active:scale-[0.97] transition-all duration-200"
            >
              Next
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { apiUrl } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Request State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      document.cookie = `tracker_token=${data.access_token}; path=/; max-age=86400; SameSite=Strict`;

      toast.success("Authentication successful", {
        description: `Welcome back, ${data.user.name.split(" ")[0]}!`,
      });

      router.push("/");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";

      setError(errorMessage);
      toast.error("Login Failed", {
        description: errorMessage,
      });
      console.log("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f9] p-4">
      <div className="w-full max-w-260 bg-white rounded-[28px] p-9 sm:p-12 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] flex flex-col md:flex-row gap-10 md:gap-20">
        {/* Left Column: Branding */}
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

        {/* Right Column: Form */}
        <div className="flex-1 flex flex-col justify-between pt-2">
          {/* Changed from a standard div/form to use onSubmit */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="block px-4 pb-2.5 pt-6 w-full text-base text-[#1f1f1f] bg-transparent rounded-md border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer disabled:opacity-50"
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

            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="block px-4 pb-2.5 pt-6 w-full text-base text-[#1f1f1f] bg-transparent rounded-md border border-[#747775] appearance-none focus:outline-none focus:ring-[1.5px] focus:ring-[#3186ff] focus:border-[#3186ff] peer pr-12 disabled:opacity-50"
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
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#444746] hover:text-[#1f1f1f] transition-colors focus:outline-none z-20 disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Action Area */}
            <div className="flex items-center justify-between mt-16 md:mt-24">
              <button
                type="button"
                className="relative text-sm font-medium text-[#444746] hover:text-[#1f1f1f] transition-colors py-1 group"
              >
                Forgot password?
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="group flex items-center justify-center gap-2 bg-[#3186ff] text-white px-7 py-3 rounded-xl text-sm font-medium shadow-sm hover:bg-[#2872dd] hover:shadow-[0_8px_20px_-6px_rgba(49,134,255,0.5)] active:scale-[0.97] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed min-w-27.5"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

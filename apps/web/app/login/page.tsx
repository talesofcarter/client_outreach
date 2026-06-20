import { Search } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafd]">
      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] border border-[#e0e0e0]">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-medium text-[#1f1f1f] mb-2">
            Outreach Tracker
          </h1>
          <p className="text-[#444746]">
            Sign in to continue to your dashboard
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-md border border-[#747775] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 outline-none transition-all text-[#1f1f1f]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-md border border-[#747775] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 outline-none transition-all text-[#1f1f1f]"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              className="text-sm font-medium text-[#1a73e8] hover:bg-[#f8fafd] px-4 py-2 rounded-full transition-colors"
            >
              Forgot password?
            </button>
            <button
              type="button"
              className="bg-[#1a73e8] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#1557b0] transition-colors shadow-md"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

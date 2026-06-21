import { Search } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { HeaderActions } from "@/components/layout/header-actions";
import { NewLeadPanel } from "@/components/leads/new-lead-panel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#f8fafd] overflow-hidden font-sans text-[#1f1f1f]">
      <Sidebar />

      {/* 2. Main Content Wrapper */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-18 flex items-center justify-between px-6 shrink-0 z-10 border-b border-transparent">
          {/* Pill Search Bar */}
          <div className="relative w-full max-w-180">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#444746]" />
            <input
              type="text"
              placeholder="Search in Tracker"
              className="w-full bg-[#edf2fc] hover:bg-[#e9eef6] focus:bg-white focus:shadow-[0_1px_3px_0_rgba(60,64,67,0.3)] transition-all duration-200 rounded-full py-3.5 pl-12 pr-4 text-[#1f1f1f] placeholder:text-[#444746] outline-none border border-transparent focus:border-[#e0e0e0]"
            />
          </div>
          <HeaderActions />
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">{children}</div>
      </main>

      <NewLeadPanel />
    </div>
  );
}

import {
  Search,
  Bell,
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { NewLeadPanel } from "@/components/leads/new-lead-panel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#f8fafd] overflow-hidden text-[#1f1f1f]">
      {/* 1. The Floating Sidebar */}
      <aside className="w-65 flex flex-col justify-between p-4 border-r border-transparent">
        <div>
          {/* Branding */}
          <div className="flex items-center gap-2.5 px-4 py-4 mb-6">
            <div className="flex gap-1">
              <div className="w-2.5 h-6 rounded-full bg-[#3186ff]" />
              <div className="w-2.5 h-6 rounded-full bg-[#fed50d]" />
              <div className="w-2.5 h-6 rounded-full bg-[#0ebc5f]" />
            </div>
            <span className="text-[18px] font-medium tracking-tight">
              Tracker
            </span>
          </div>

          {/* Primary Action (Google Drive Style FAB) */}
          <div className="px-2 mb-6">
            <div className="px-2 mb-6">
              <Link
                href="?action=new-lead"
                scroll={false}
                className="flex items-center gap-3 bg-white border border-[#e0e0e0] shadow-sm hover:shadow-md hover:bg-[#f8fafd] text-[#1f1f1f] px-5 py-3.5 rounded-2xl font-medium transition-all duration-200 w-full group"
              >
                <Plus
                  className="w-5 h-5 text-[#3186ff] group-hover:scale-110 transition-transform"
                  strokeWidth={2.5}
                />
                New Lead
              </Link>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="flex flex-col gap-1 px-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 bg-[#c2e7ff]/40 text-[#001d35] rounded-full font-medium transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <a
              href="/leads"
              className="flex items-center gap-3 px-4 py-3 text-[#444746] hover:bg-[#f0f4f9] rounded-full font-medium transition-colors"
            >
              <Users className="w-5 h-5" />
              Clients & Leads
            </a>
            <a
              href="/projects"
              className="flex items-center gap-3 px-4 py-3 text-[#444746] hover:bg-[#f0f4f9] rounded-full font-medium transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              Projects
            </a>
          </nav>
        </div>

        {/* Bottom Settings */}
        <div className="px-2">
          <a
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 text-[#444746] hover:bg-[#f0f4f9] rounded-full font-medium transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </a>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-18 flex items-center justify-between px-6 shrink-0 z-10">
          {/* Pill Search Bar */}
          <div className="relative w-full max-w-180">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#444746]" />
            <input
              type="text"
              placeholder="Search in Tracker"
              className="w-full bg-[#edf2fc] hover:bg-[#e9eef6] focus:bg-white focus:shadow-[0_1px_3px_0_rgba(60,64,67,0.3)] transition-all duration-200 rounded-full py-3.5 pl-12 pr-4 text-[#1f1f1f] placeholder:text-[#444746] outline-none border border-transparent focus:border-[#e0e0e0]"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#444746] hover:bg-[#f0f4f9] rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-full bg-[#3186ff] text-white flex items-center justify-center font-medium shadow-sm hover:shadow-md transition-all">
              K
            </button>
          </div>
        </header>

        {/* The Dashboard Page Content is injected here */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">{children}</div>
      </main>

      <NewLeadPanel />
    </div>
  );
}

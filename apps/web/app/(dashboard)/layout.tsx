import {
  Search,
  Plus,
  LayoutDashboard,
  Users,
  Settings,
  Bell,
} from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-[#f8fafd] text-[#1f1f1f] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 flex flex-col p-4">
        <div className="px-4 py-2 mb-6">
          <h1 className="text-xl font-medium text-[#444746]">Tracker</h1>
        </div>

        {/* The Drive "New" Button (FAB) */}
        <button className="flex items-center gap-3 bg-white px-5 py-4 mb-6 rounded-2xl shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] hover:bg-[#f8fafd] hover:shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] transition-all w-fit text-sm font-medium text-[#444746]">
          <Plus className="w-6 h-6 text-[#1f1f1f]" />
          New Lead
        </button>

        <nav className="flex-1 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-4 px-4 py-2 bg-[#c2e7ff] text-[#001d35] rounded-full text-sm font-medium"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-4 py-2 hover:bg-[#e8eaed] text-[#444746] rounded-full text-sm font-medium transition-colors"
          >
            <Users className="w-5 h-5" />
            Pipeline
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-4 py-2 hover:bg-[#e8eaed] text-[#444746] rounded-full text-sm font-medium transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col py-2 pr-2 h-screen overflow-hidden">
        {/* TOPBAR */}
        <header className="h-16 flex items-center justify-between px-6 mb-2 rounded-2xl bg-[#f8fafd]">
          {/* Drive-style Search Bar */}
          <div className="flex-1 max-w-2xl bg-[#edf2fc] focus-within:bg-white focus-within:shadow-md transition-all rounded-full flex items-center px-4 py-2.5">
            <Search className="w-5 h-5 text-[#444746] mr-3" />
            <input
              type="text"
              placeholder="Search leads, domains, or cities..."
              className="bg-transparent border-none outline-none w-full text-[#1f1f1f] placeholder:text-[#444746]"
            />
          </div>

          <div className="flex items-center gap-4 ml-6">
            <button className="p-2 hover:bg-[#e8eaed] rounded-full transition-colors text-[#444746]">
              <Bell className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-medium shadow-sm cursor-pointer">
              ME
            </div>
          </div>
        </header>

        {/* ISOLATED CANVAS */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-[#e0e0e0] overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

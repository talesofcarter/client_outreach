import { Sidebar } from "@/components/layout/Sidebar";
import { HeaderActions } from "@/components/layout/header-actions";
import { NewLeadPanel } from "@/components/leads/new-lead-panel";
import { GlobalSearch } from "@/components/layout/global-search";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#f8fafd] overflow-hidden text-[#1f1f1f]">
      <Sidebar />

      {/* 2. Main Content Wrapper */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-18 flex items-center justify-between px-6 shrink-0 z-10 border-b border-transparent">
          {/* Pill Search Bar */}
          <GlobalSearch />

          <HeaderActions />
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">{children}</div>
      </main>

      <NewLeadPanel />
    </div>
  );
}

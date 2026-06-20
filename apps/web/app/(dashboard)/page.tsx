import { ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="max-w-300 mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Greeting Section */}
      <div>
        <h1 className="text-[28px] font-normal text-[#1f1f1f] tracking-tight">
          Welcome back, Kelvin
        </h1>
        <p className="text-base text-[#444746] mt-1">
          Here is what is happening with your outreach today.
        </p>
      </div>

      {/* Floating Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#3186ff]/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="w-10 h-10 rounded-full bg-[#3186ff]/10 text-[#3186ff] flex items-center justify-center mb-4">
            <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-medium text-[#444746]">
            Total Active Leads
          </p>
          <h2 className="text-[32px] font-normal text-[#1f1f1f] mt-1">24</h2>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#fed50d]/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="w-10 h-10 rounded-full bg-[#fed50d]/20 text-[#d97706] flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-medium text-[#444746]">
            Pending Follow-ups
          </p>
          <h2 className="text-[32px] font-normal text-[#1f1f1f] mt-1">7</h2>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0ebc5f]/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="w-10 h-10 rounded-full bg-[#0ebc5f]/10 text-[#0ebc5f] flex items-center justify-center mb-4">
            <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-medium text-[#444746]">Deals Won</p>
          <h2 className="text-[32px] font-normal text-[#1f1f1f] mt-1">12</h2>
        </div>
      </div>

      {/* Main Content Area: Recent Leads Table */}
      <div className="bg-white rounded-[28px] p-2 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)]">
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#e0e0e0]/60">
          <h3 className="text-[18px] font-medium text-[#1f1f1f]">
            Recent Activity
          </h3>
          <button className="text-sm font-medium text-[#3186ff] hover:text-[#2872dd] transition-colors">
            View All
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e0e0e0]/60 text-sm font-medium text-[#444746]">
                <th className="px-6 py-4 font-medium">Business Name</th>
                <th className="px-6 py-4 font-medium">Region</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Date Added</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Table Row 1 */}
              <tr className="hover:bg-[#f0f4f9]/50 transition-colors group cursor-pointer border-b border-[#e0e0e0]/40 last:border-0">
                <td className="px-6 py-4 font-medium text-[#1f1f1f]">
                  Alpha Tech Solutions
                </td>
                <td className="px-6 py-4 text-[#444746]">Nairobi CBD</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#3186ff]/10 text-[#3186ff] border border-[#3186ff]/20">
                    Negotiating
                  </span>
                </td>
                <td className="px-6 py-4 text-[#444746] text-right">
                  Today, 10:42 AM
                </td>
              </tr>

              {/* Table Row 2 */}
              <tr className="hover:bg-[#f0f4f9]/50 transition-colors group cursor-pointer border-b border-[#e0e0e0]/40 last:border-0">
                <td className="px-6 py-4 font-medium text-[#1f1f1f]">
                  Nyanza Logistics
                </td>
                <td className="px-6 py-4 text-[#444746]">Kisumu</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#fed50d]/20 text-[#d97706] border border-[#fed50d]/30">
                    Follow-up
                  </span>
                </td>
                <td className="px-6 py-4 text-[#444746] text-right">
                  Yesterday
                </td>
              </tr>

              {/* Table Row 3 */}
              <tr className="hover:bg-[#f0f4f9]/50 transition-colors group cursor-pointer last:border-0">
                <td className="px-6 py-4 font-medium text-[#1f1f1f]">
                  Lake Basin Retail
                </td>
                <td className="px-6 py-4 text-[#444746]">Kisumu</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#0ebc5f]/10 text-[#16a34a] border border-[#0ebc5f]/20">
                    Won
                  </span>
                </td>
                <td className="px-6 py-4 text-[#444746] text-right">Jun 18</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

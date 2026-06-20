export default function DashboardHome() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-normal text-[#1f1f1f] mb-8">
        Pipeline Overview
      </h1>

      {/* High-level stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Leads", value: "142" },
          { label: "Not Contacted", value: "86", color: "text-[#444746]" },
          { label: "In-Progress", value: "41", color: "text-[#f9ab00]" },
          { label: "Won", value: "15", color: "text-[#34a853]" },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-[#e0e0e0] bg-white hover:bg-[#f8fafd] transition-colors cursor-default"
          >
            <p className="text-sm font-medium text-[#444746] mb-2">
              {stat.label}
            </p>
            <p
              className={`text-3xl font-normal ${stat.color || "text-[#1a73e8]"}`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-96 rounded-2xl border border-[#e0e0e0] flex items-center justify-center bg-[#f8fafd]">
          <p className="text-[#747775] text-sm">
            Visual Breakdown (Bar Graph Placeholder)
          </p>
        </div>
        <div className="col-span-1 h-96 rounded-2xl border border-[#e0e0e0] flex items-center justify-center bg-[#f8fafd]">
          <p className="text-[#747775] text-sm">
            Category (Pie Chart Placeholder)
          </p>
        </div>
      </div>
    </div>
  );
}

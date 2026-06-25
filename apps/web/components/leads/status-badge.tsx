export function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  const config: Record<string, { label: string; colors: string; dot: string }> =
    {
      not_contacted: {
        label: "Not Contacted",
        colors: "bg-[#f1efe8] text-[#5F5E5A] border-[#d3d1c7]",
        dot: "bg-[#888780]",
      },
      contacted: {
        label: "Contacted",
        colors: "bg-[#e8f0fe] text-[#185FA5] border-[#b5d4f4]",
        dot: "bg-[#378ADD]",
      },
      follow_up_scheduled: {
        label: "Follow-up",
        colors: "bg-[#faeeda] text-[#854F0B] border-[#fac775]",
        dot: "bg-[#EF9F27]",
      },
      negotiating: {
        label: "Negotiating",
        colors: "bg-[#EEEDFE] text-[#3C3489] border-[#CECBF6]",
        dot: "bg-[#7F77DD]",
      },
      won: {
        label: "Won",
        colors: "bg-[#e1f5ee] text-[#0F6E56] border-[#9FE1CB]",
        dot: "bg-[#1D9E75]",
      },
      lost: {
        label: "Lost",
        colors: "bg-[#fcebeb] text-[#A32D2D] border-[#F7C1C1]",
        dot: "bg-[#E24B4A]",
      },
    };

  const fallback = {
    label: status,
    colors: "bg-[#f1efe8] text-[#888780] border-[#d3d1c7]",
    dot: "bg-[#888780]",
  };

  const { label, colors, dot } = config[normalizedStatus] || fallback;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.75 rounded-full text-[11px] font-medium border ${colors}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      {label}
    </span>
  );
}

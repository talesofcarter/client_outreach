export function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  const config: Record<string, { label: string; colors: string; dot: string }> =
    {
      not_contacted: {
        label: "Not Contacted",
        colors: "bg-[#f0f4f9] text-[#444746] border-[#e0e0e0]",
        dot: "bg-[#747775]",
      },
      contacted: {
        label: "Contacted",
        colors: "bg-[#3186ff]/10 text-[#1d4ed8] border-[#3186ff]/20",
        dot: "bg-[#3186ff]",
      },
      follow_up_scheduled: {
        label: "Follow-up",
        colors: "bg-[#fed50d]/15 text-[#9a6500] border-[#fed50d]/30",
        dot: "bg-[#eab308]",
      },
      negotiating: {
        label: "Negotiating",

        colors: "bg-[#8b5cf6]/10 text-[#5b21b6] border-[#8b5cf6]/20",
        dot: "bg-[#8b5cf6]",
      },
      won: {
        label: "Won",
        colors: "bg-[#0ebc5f]/10 text-[#15803d] border-[#0ebc5f]/20",
        dot: "bg-[#0ebc5f]",
      },
      lost: {
        label: "Lost",
        colors: "bg-[#ea4335]/10 text-[#b91c1c] border-[#ea4335]/20",
        dot: "bg-[#ea4335]",
      },
    };

  const fallback = {
    label: status,
    colors: "bg-[#f0f4f9] text-[#747775] border-[#e0e0e0]",
    dot: "bg-[#747775]",
  };

  const { label, colors, dot } = config[normalizedStatus] || fallback;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium border ${colors}`}
    >
      {/* The solid indicator dot */}
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      {label}
    </span>
  );
}

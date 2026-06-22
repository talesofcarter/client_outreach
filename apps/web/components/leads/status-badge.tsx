export function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  // Map the status the specific color palette and human-readable labels
  const config: Record<string, { label: string; colors: string }> = {
    not_contacted: {
      label: "Not Contacted",
      colors: "bg-[#f0f4f9] text-[#747775] border-[#e0e0e0]",
    },
    contacted: {
      label: "Contacted",
      colors: "bg-[#3186ff]/10 text-[#3186ff] border-[#3186ff]/20",
    },
    follow_up_scheduled: {
      label: "Follow-up",
      // Note: Text is slightly darker than the bg color for WCAG contrast compliance
      colors: "bg-[#fed50d]/10 text-[#b29500] border-[#fed50d]/20",
    },
    negotiating: {
      label: "Negotiating",
      colors: "bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20",
    },
    won: {
      label: "Won",
      colors: "bg-[#0ebc5f]/10 text-[#0ebc5f] border-[#0ebc5f]/20",
    },
    lost: {
      label: "Lost",
      colors: "bg-[#ea4335]/10 text-[#ea4335] border-[#ea4335]/20",
    },
  };

  // Fallback just in case a weird status gets into the database
  const fallback = {
    label: status,
    colors: "bg-[#f0f4f9] text-[#747775] border-[#e0e0e0]",
  };

  const { label, colors } = config[normalizedStatus] || fallback;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium border ${colors}`}
    >
      {label}
    </span>
  );
}

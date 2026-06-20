"use client";

import { useCallback, useEffect, useState } from "react";
import { toast, ToastData } from "@/lib/toast";
import { CheckCircle2, Info, AlertCircle, XCircle, X } from "lucide-react";

const toastConfig = {
  success: {
    icon: CheckCircle2,
    ring: "border-[#22c55e]/50",
    bg: "bg-[#f0fdf4]",
    iconBg: "bg-[#dcfce7]",
    iconColor: "text-[#16a34a]",
  },
  info: {
    icon: Info,
    ring: "border-[#60a5fa]/50",
    bg: "bg-[#eff6ff]",
    iconBg: "bg-[#dbeafe]",
    iconColor: "text-[#2563eb]",
  },
  warning: {
    icon: AlertCircle,
    ring: "border-[#fbbf24]/60",
    bg: "bg-[#fffbeb]",
    iconBg: "bg-[#fef3c7]",
    iconColor: "text-[#d97706]",
  },
  error: {
    icon: XCircle,
    ring: "border-[#f87171]/50",
    bg: "bg-[#fef2f2]",
    iconBg: "bg-[#fee2e2]",
    iconColor: "text-[#dc2626]",
  },
  default: {
    icon: Info,
    ring: "border-[#d1d5db]",
    bg: "bg-[#fafafa]",
    iconBg: "bg-[#f4f4f5]",
    iconColor: "text-[#525252]",
  },
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);
    });
    return unsubscribe;
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onRemove,
}: {
  toast: ToastData;
  onRemove: () => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const config = toastConfig[toast.type];
  const Icon = config.icon;

  const close = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove();
    }, 300);
  }, [onRemove]);

  useEffect(() => {
    requestAnimationFrame(() => setIsMounted(true));

    const timer = setTimeout(close, toast.duration || 4500);

    return () => clearTimeout(timer);
  }, [close, toast.duration]);

  return (
    <div
      className={`
        pointer-events-auto w-88

        ${config.bg}
        border ${config.ring}
        rounded-[18px]
        p-4 flex items-start gap-3.5
        shadow-[0_16px_48px_-12px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.08)]
        transition-all duration-300 ease-out origin-bottom
        ${
          isMounted && !isLeaving
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-[0.97]"
        }

        ${isLeaving ? "translate-x-10 opacity-0" : ""}
      `}
    >
      {/* Icon */}
      <div
        className={`
          mt-0.5 shrink-0
          w-9 h-9 flex items-center justify-center
          rounded-full
          ${config.iconBg}
        `}
      >
        <Icon className={`w-4.5 h-4.5 ${config.iconColor}`} strokeWidth={2.5} />
      </div>

      {/* Content */}
      <div className="flex-1 pt-0.5">
        <h3 className="text-[14px] font-semibold text-[#111827] tracking-tight">
          {toast.title}
        </h3>

        {toast.description && (
          <p className="mt-1 text-[13.5px] text-[#6b7280] leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={close}
        className="text-[#9ca3af] hover:text-[#111827] transition-colors p-1 -mt-1 -mr-1 rounded-full hover:bg-black/5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

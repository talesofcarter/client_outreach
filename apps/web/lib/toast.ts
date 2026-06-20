export type ToastType = "success" | "error" | "info" | "warning" | "default";

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toast: ToastData) => void;

let listeners: ToastListener[] = [];

const emit = (toast: Omit<ToastData, "id" | "type"> & { type?: ToastType }) => {
  const id = Math.random().toString(36).substring(2, 9);
  listeners.forEach((listener) =>
    listener({ ...toast, id, type: toast.type || "default" }),
  );
};

export const toast = Object.assign(
  (title: string, opts?: { description?: string; duration?: number }) =>
    emit({ title, ...opts, type: "default" }),
  {
    success: (
      title: string,
      opts?: { description?: string; duration?: number },
    ) => emit({ title, ...opts, type: "success" }),
    error: (
      title: string,
      opts?: { description?: string; duration?: number },
    ) => emit({ title, ...opts, type: "error" }),
    info: (title: string, opts?: { description?: string; duration?: number }) =>
      emit({ title, ...opts, type: "info" }),
    warning: (
      title: string,
      opts?: { description?: string; duration?: number },
    ) => emit({ title, ...opts, type: "warning" }),

    // Allows the UI component to mount and listen
    subscribe: (listener: ToastListener) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
  },
);

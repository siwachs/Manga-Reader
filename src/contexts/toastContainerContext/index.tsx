"use client";

import { createContext, useContext, useState, useMemo, useEffect } from "react";

import { TiTimes } from "react-icons/ti";
import "./toast.css";

type ToastMessage = {
  id: string | number;
  type: "success" | "error" | "warning" | "info";
  text: string;
};
type ContextType = {
  autoDismiss: boolean;
  timeOut: number;
  addToast: (toast: ToastMessage) => void;
  removeToast: (toast: ToastMessage) => void;
};

const ToastContainerContext = createContext<ContextType>({
  autoDismiss: true,
  timeOut: 5000,
  addToast: (toast: ToastMessage) => {},
  removeToast: (toast: ToastMessage) => {},
});

export function useToastContainer() {
  const context = useContext(ToastContainerContext);
  if (!context)
    throw new Error(
      "useToastContainer must be used within ToastContainerProvider",
    );

  return context;
}

const Toast: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const { autoDismiss, timeOut, removeToast } = useToastContainer();

  useEffect(() => {
    if (autoDismiss) {
      const timeOutId = setTimeout(() => {
        removeToast(toast);
      }, timeOut);

      return () => clearTimeout(timeOutId);
    }
  }, []);

  return (
    <div className="toast" data-type={toast.type}>
      <div className="timer" />
      <div className="text">{toast.text}</div>
      <div
        role="button"
        tabIndex={0}
        className="close"
        onClick={() => removeToast(toast)}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter") {
            removeToast(toast);
          }
        }}
      >
        <TiTimes className="size-5" />
      </div>
    </div>
  );
};

export function ToastContainerProvider({
  children,
  position = "top-right",
  autoDismiss = true,
  timeOut = 5000,
  latestMessageFirst = true,
}: Readonly<{
  children: React.ReactNode;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
  autoDismiss?: boolean;
  timeOut?: number;
  latestMessageFirst?: boolean;
}>) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: ToastMessage) => {
    if (latestMessageFirst) setToasts((prev) => [toast, ...prev]);
    else setToasts((prev) => [...prev, toast]);
  };

  const removeToast = (toast: ToastMessage) => {
    setToasts((prev) =>
      prev.filter((currentToast) => currentToast.id !== toast.id),
    );
  };

  const contextValue = useMemo(
    () => ({ autoDismiss, timeOut, addToast, removeToast }),
    [],
  );

  return (
    <ToastContainerContext.Provider value={contextValue}>
      {toasts.length > 0 && (
        <div className="toast-container" data-position={position}>
          {toasts.map((toast) => (
            <Toast key={toast.id.toString()} toast={toast} />
          ))}
        </div>
      )}
      {children}
    </ToastContainerContext.Provider>
  );
}

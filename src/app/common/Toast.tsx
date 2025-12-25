"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "warning" | "error" | "info";

type ToastProps = {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
};

export default function Toast({
  type,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Delay visibility for smoother animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    const hideTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose();
      }, 500);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const typeStyles: Record<ToastType, string> = {
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-white border border-[#e9e9e7] text-[#37352f]",
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-[0_4px_12px_rgba(15,15,15,0.15)] min-w-[250px] max-w-[400px] transition-all duration-500 ease-out ${
        typeStyles[type]
      } ${
        isVisible && !isExiting
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className={`text-sm font-medium ${
            type === "success" ? "text-green-800" :
            type === "warning" ? "text-yellow-800" :
            type === "error" ? "text-red-800" :
            "text-[#37352f]"
          }`}>{message}</p>
        </div>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => onClose(), 300);
          }}
          className="text-[#787774] hover:text-[#37352f] transition-colors"
          aria-label="Close toast"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}


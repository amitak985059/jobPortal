import React, { useEffect, useState } from "react";
import { useJobContext } from "../context/JobContext";

const icons = {
  success: (
    <svg
      className="w-5 h-5 text-green-400 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  error: (
    <svg
      className="w-5 h-5 text-red-400 flex-shrink-0"
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
  ),
  info: (
    <svg
      className="w-5 h-5 text-blue-400 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
      />
    </svg>
  ),
};

const borderColors = {
  success: "border-green-500/40",
  error: "border-red-500/40",
  info: "border-blue-500/40",
};

const Toast = () => {
  const { toast } = useJobContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
    } else {
      // slight delay to let exit animation play
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (!visible && !toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        transition: "all 0.3s ease",
        opacity: toast ? 1 : 0,
        transform: toast ? "translateY(0)" : "translateY(1rem)",
      }}
    >
      <div
        className={`flex items-center gap-3 bg-[#1E293B] border ${borderColors[toast?.type || "info"]} rounded-2xl px-5 py-4 shadow-2xl min-w-[260px] max-w-sm`}
      >
        {icons[toast?.type || "info"]}
        <span className="text-gray-200 text-sm font-medium">
          {toast?.message}
        </span>
      </div>
    </div>
  );
};

export default Toast;

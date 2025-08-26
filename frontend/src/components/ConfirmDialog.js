import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Props:
 * - open: boolean
 * - title: string
 * - message: string | ReactNode
 * - confirmText: string
 * - cancelText: string
 * - onConfirm: () => void
 * - onCancel: () => void
 * - tone: "danger" | "primary" (button color)
 */
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  tone = "danger",
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const confirmBtn =
    tone === "danger"
      ? "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500"
      : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500";

  return createPortal(
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[1000] flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px] animate-fadeIn"
        onClick={onCancel}
      />
      {/* Panel */}
      <div className="relative mx-4 w-full max-w-md origin-center animate-pop rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {message && (
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">{message}</p>
            )}
          </div>
          <button
            onClick={onCancel}
            className="rounded-full p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close dialog"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 ${confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>

      {/* tiny keyframe helpers */}
      <style>{`
        .animate-fadeIn { animation: fadeIn .15s ease-out both; }
        .animate-pop { animation: pop .18s cubic-bezier(.2,.9,.25,1.1) both; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pop { from { opacity: 0; transform: scale(.96) }
                         to   { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>,
    document.body
  );
}

import React, { useEffect } from "react";
import { X } from "lucide-react";

function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  children,
  maxWidth = "max-w-md",
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`w-full ${maxWidth} rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150`}
      >
        {/* Header */}
        {(title || Icon) && (
          <div className="flex items-start justify-between gap-3 pb-2 border-b border-[#FAF3E1] dark:border-[#1F1F23]">
            <div className="flex items-center gap-2.5">
              {Icon && (
                <div className="w-7 h-7 shrink-0 rounded-md bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center text-[#FF6D1F]">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              )}
              <div>
                {title && (
                  <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] mt-0.5">
                    {description}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-[#8C8C8C] dark:text-[#6E6E73] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors p-1 rounded-md hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F] cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;

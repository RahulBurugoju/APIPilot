import React from "react";
import CreateRequestForm from "./CreateRequestForm";
import { X, Send } from "lucide-react";

function CreateRequestModal({ isOpen, onClose, projectId, collection }) {
  if (!isOpen || !collection) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#FAF3E1] dark:border-[#1F1F23] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center text-[#FF6D1F]">
              <Send className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
                Create Request
              </h3>
              <p className="text-[11px] text-[#5C5C5C] dark:text-[#A1A1A6]">
                Add an API endpoint under{" "}
                <span className="font-semibold text-[#222222] dark:text-[#F5F5F7]">
                  "{collection.name}"
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#8C8C8C] dark:text-[#6E6E73] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors p-1 rounded-md"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <CreateRequestForm
          projectId={projectId}
          collectionId={collection._id}
          collectionName={collection.name}
          onSuccess={() => onClose()}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

export default CreateRequestModal;

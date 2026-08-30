import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import projectThunks from "../../features/project/project.thunk.js";
import { Trash2, Loader2, X } from "lucide-react";

function DeleteProjectModal({ isOpen, onClose, project, onDeleted }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  if (!isOpen || !project) return null;

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await dispatch(
        projectThunks.deleteProject(project._id)
      ).unwrap();

      if (result) {
        setIsDeleting(false);
        onClose();
        if (onDeleted) {
          onDeleted();
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setDeleteError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to delete project"
      );
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
        {/* Header with Danger Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FEE2E2] dark:bg-[#2A1517] border border-[#FCA5A5] dark:border-[#481E24] flex items-center justify-center text-[#DC2626] dark:text-[#F87171] shrink-0 mt-0.5">
              <Trash2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
                Delete project?
              </h3>
              <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] leading-relaxed">
                This will permanently delete{" "}
                <span className="font-semibold text-[#222222] dark:text-[#F5F5F7]">
                  "{project.name}"
                </span>
                .
              </p>
              <p className="text-xs text-[#DC2626] dark:text-[#F87171] font-medium pt-0.5">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-[#8C8C8C] dark:text-[#6E6E73] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors p-1 rounded-md"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert if deletion failed */}
        {deleteError && (
          <div className="p-2.5 rounded-md bg-[#FEE2E2] dark:bg-[#1C1214] border border-[#FCA5A5] dark:border-[#481E24] text-xs text-[#DC2626] dark:text-[#F87171]">
            {deleteError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-3.5 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#DC2626] text-white hover:bg-[#B91C1C] text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              "Delete Project"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteProjectModal;

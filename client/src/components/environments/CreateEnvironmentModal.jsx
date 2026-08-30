import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "../common/Modal";
import { Sliders, Loader2 } from "lucide-react";
import environmentThunks from "../../features/environment/environment.thunk.js";

export default function CreateEnvironmentModal({
  isOpen,
  onClose,
  projectId,
  onSuccess,
}) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !projectId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await dispatch(
        environmentThunks.createEnvironment({
          projectId,
          environmentDetails: {
            name: trimmed,
            variables: [],
            isActive,
          },
        })
      ).unwrap();

      setName("");
      setIsActive(false);
      if (onSuccess) {
        onSuccess(result?.data?.environment || result?.data);
      }
      onClose();
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to create environment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setIsActive(false);
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Environment"
      description="Create a scoped set of variables for development, staging, or production."
      icon={Sliders}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 rounded-md bg-[#FEF2F2] dark:bg-[#200B0D] border border-[#FECACA] dark:border-[#4B141A] text-[#DC2626] dark:text-[#F87171] text-xs">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="env-name-input"
            className="block text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]"
          >
            Name <span className="text-[#FF6D1F]">*</span>
          </label>
          <input
            id="env-name-input"
            type="text"
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Development, Staging, Production"
            disabled={isSubmitting}
            className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] text-xs focus:outline-none focus:border-[#FF6D1F] focus:ring-1 focus:ring-[#FF6D1F]"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            id="set-active-checkbox"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            disabled={isSubmitting}
            className="w-3.5 h-3.5 rounded border-[#E6D2A5] dark:border-[#2C2C2E] text-[#FF6D1F] focus:ring-[#FF6D1F] cursor-pointer"
          />
          <label
            htmlFor="set-active-checkbox"
            className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] select-none cursor-pointer"
          >
            Set as active environment immediately
          </label>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#FAF3E1] dark:border-[#1F1F23]">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 rounded-md border border-[#E6D2A5] dark:border-[#2C2C2E] text-[#5C5C5C] dark:text-[#A1A1A6] hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F] text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#FF6D1F] hover:bg-[#E85B0F] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <span>Create</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

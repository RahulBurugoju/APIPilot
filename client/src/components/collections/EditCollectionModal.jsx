import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import collectionThunk from "../../features/collection/collection.thunk";
import Modal from "../common/Modal";
import { Edit2, Loader2, Folder } from "lucide-react";

export default function EditCollectionModal({
  isOpen,
  onClose,
  projectId,
  collection,
  onUpdated,
}) {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (collection) {
      setName(collection.name || "");
      setBaseUrl(collection.baseUrl || "");
      setError(null);
    }
  }, [collection]);

  if (!isOpen || !collection) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !projectId || !collection._id) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await dispatch(
        collectionThunk.updateCollection({
          projectId,
          collectionId: collection._id,
          collectionDetails: {
            name: name.trim(),
            baseUrl: baseUrl.trim(),
          },
        })
      ).unwrap();

      if (result) {
        setIsSubmitting(false);
        onClose();
        if (onUpdated) onUpdated(result);
      }
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to update collection"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Collection"
      description="Update collection name or environment base URL."
      icon={Edit2}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 rounded-md bg-[#FEE2E2] dark:bg-[#1C1214] border border-[#FCA5A5] dark:border-[#481E24] text-xs text-[#DC2626] dark:text-[#F87171]">
            {error}
          </div>
        )}

        {/* Collection Name */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]">
            Collection Name <span className="text-[#FF6D1F]">*</span>
          </label>
          <div className="flex items-center rounded-md bg-[#FAF3E1]/50 dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] focus-within:border-[#FF6D1F] px-3 py-1.5 text-xs">
            <Folder className="w-4 h-4 text-[#FF6D1F] mr-2 shrink-0" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Auth APIs, Users"
              className="flex-1 bg-transparent font-medium text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] focus:outline-none"
              autoFocus
              required
            />
          </div>
        </div>

        {/* Base URL */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]">
            Base URL (Optional)
          </label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.example.com or {{baseUrl}}"
            className="w-full px-3 py-1.5 rounded-md bg-[#FAF3E1]/50 dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] focus:border-[#FF6D1F] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] focus:outline-none"
          />
          <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73]">
            Child requests will inherit this base URL automatically.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#FAF3E1] dark:border-[#1F1F23]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] text-[#5C5C5C] dark:text-[#A1A1A6] text-xs font-medium border border-[#E6D2A5] dark:border-[#2C2C2E] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#FF6D1F] text-white hover:bg-[#E85B0F] text-xs font-medium disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

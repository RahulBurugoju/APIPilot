import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import requestThunk from "../../features/request/request.Thunk.js";
import Modal from "../common/Modal";
import { Edit2, Loader2, Send } from "lucide-react";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

export default function EditRequestModal({
  isOpen,
  onClose,
  projectId,
  request,
  onUpdated,
}) {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (request) {
      setName(request.name || "");
      setMethod(request.method || "GET");
      setUrl(request.url || "");
      setError(null);
    }
  }, [request]);

  if (!isOpen || !request) return null;

  const collectionId = request.collection?._id || request.collection;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !projectId || !collectionId || !request._id) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await dispatch(
        requestThunk.updateRequest({
          projectId,
          collectionId,
          requestId: request._id,
          requestDetails: {
            name: name.trim(),
            method,
            url: url.trim(),
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
          : err?.message || "Failed to update request"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Request"
      description="Update request name, method, or URL endpoint."
      icon={Edit2}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 rounded-md bg-[#FEE2E2] dark:bg-[#1C1214] border border-[#FCA5A5] dark:border-[#481E24] text-xs text-[#DC2626] dark:text-[#F87171]">
            {error}
          </div>
        )}

        {/* Request Name */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]">
            Request Name <span className="text-[#FF6D1F]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Get User Profile"
            className="w-full px-3 py-1.5 rounded-md bg-[#FAF3E1]/50 dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] focus:border-[#FF6D1F] text-xs font-medium text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] focus:outline-none"
            autoFocus
            required
          />
        </div>

        {/* Method & URL */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]">
            Method & URL Endpoint
          </label>
          <div className="flex items-center gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-[#FAF3E1]/70 dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono font-bold text-[#FF6D1F] focus:outline-none cursor-pointer"
            >
              {HTTP_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/users or {{baseUrl}}/users"
              className="flex-1 px-3 py-1.5 rounded-md bg-[#FAF3E1]/50 dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] focus:border-[#FF6D1F] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] focus:outline-none"
            />
          </div>
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

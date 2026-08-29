import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import collectionThunk from "../../features/collection/collection.thunk";
import { Loader2, AlertCircle, FolderPlus } from "lucide-react";

function CreateCollectionForm({
  projectId,
  parentCollection = null,
  parentId = null,
  onCancel,
  onSuccess,
  isModal = false,
}) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.collection);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const effectiveParentId = parentCollection?._id || parentId || null;

  const handleOnChange = (e) => {
    const { name: fieldName, value } = e.target;
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
    if (fieldName === "name") setName(value);
    if (fieldName === "description") setDescription(value);
    if (fieldName === "baseUrl") setBaseUrl(value);
  };

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = "Collection name is required";
    } else if (name.trim().length < 2) {
      errors.name = "Collection name must be at least 2 characters";
    } else if (name.trim().length > 100) {
      errors.name = "Collection name must not exceed 100 characters";
    }

    if (description && description.length > 500) {
      errors.description = "Description must not exceed 500 characters";
    }

    setFieldErrors(errors);
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length === 0 && projectId) {
      try {
        const result = await dispatch(
          collectionThunk.createCollection({
            projectId,
            collectionDetails: {
              name: name.trim(),
              description: description.trim(),
              baseUrl: baseUrl.trim(),
              parent: effectiveParentId,
            },
          })
        ).unwrap();

        if (result) {
          setName("");
          setDescription("");
          setBaseUrl("");
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch {
        // Redux slice captures error in state.error
      }
    }
  };

  return (
    <div
      className={`w-full text-[#222222] dark:text-[#F5F5F7] space-y-4 ${
        isModal
          ? ""
          : "p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-sm"
      }`}
    >
      {/* Header (when standalone) */}
      {!isModal && (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center text-[#FF6D1F]">
            <FolderPlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
              Create Collection
            </h3>
            <p className="text-[11px] text-[#5C5C5C] dark:text-[#A1A1A6]">
              Group related requests and endpoints together.
            </p>
          </div>
        </div>
      )}

      {/* Server Error Alert */}
      {error && (
        <div className="p-2.5 rounded-md bg-[#FEE2E2] dark:bg-[#1C1214] border border-[#FCA5A5] dark:border-[#481E24] flex items-center gap-2 text-xs text-[#DC2626] dark:text-[#F87171]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            {typeof error === "string"
              ? error
              : error?.message || "Failed to create collection"}
          </span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Name Input */}
        <div>
          <label
            htmlFor="collection-name"
            className="block text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6] mb-1"
          >
            Name <span className="text-[#DC2626] dark:text-[#F87171]">*</span>
          </label>
          <input
            type="text"
            id="collection-name"
            name="name"
            value={name}
            onChange={handleOnChange}
            placeholder="e.g. Authentication"
            className={`w-full px-3 py-1.5 rounded-md bg-[#FAF3E1]/60 dark:bg-[#0B0B0D] border text-xs text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] transition-colors focus:outline-none focus:ring-1 ${
              fieldErrors.name
                ? "border-[#DC2626] dark:border-[#F87171] focus:ring-[#DC2626] dark:focus:ring-[#F87171]"
                : "border-[#E6D2A5] dark:border-[#2C2C2E] focus:border-[#FF6D1F] dark:focus:border-[#6E6E73] focus:ring-[#FF6D1F] dark:focus:ring-[#6E6E73]"
            }`}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-[11px] text-[#DC2626] dark:text-[#F87171]">
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="collection-desc"
            className="block text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6] mb-1"
          >
            Description{" "}
            <span className="text-[#8C8C8C] dark:text-[#6E6E73] text-[10px]">
              (Optional)
            </span>
          </label>
          <textarea
            id="collection-desc"
            name="description"
            rows={3}
            value={description}
            onChange={handleOnChange}
            placeholder="e.g. Authentication endpoints"
            className={`w-full px-3 py-1.5 rounded-md bg-[#FAF3E1]/60 dark:bg-[#0B0B0D] border text-xs text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] transition-colors focus:outline-none focus:ring-1 resize-none ${
              fieldErrors.description
                ? "border-[#DC2626] dark:border-[#F87171] focus:ring-[#DC2626] dark:focus:ring-[#F87171]"
                : "border-[#E6D2A5] dark:border-[#2C2C2E] focus:border-[#FF6D1F] dark:focus:border-[#6E6E73] focus:ring-[#FF6D1F] dark:focus:ring-[#6E6E73]"
            }`}
          />
          {fieldErrors.description && (
            <p className="mt-1 text-[11px] text-[#DC2626] dark:text-[#F87171]">
              {fieldErrors.description}
            </p>
          )}
        </div>

        {/* Base URL Input */}
        <div>
          <label
            htmlFor="collection-baseurl"
            className="block text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6] mb-1"
          >
            Base URL{" "}
            <span className="text-[#8C8C8C] dark:text-[#6E6E73] text-[10px]">
              (Optional, e.g. http://localhost:9000)
            </span>
          </label>
          <input
            type="text"
            id="collection-baseurl"
            name="baseUrl"
            value={baseUrl}
            onChange={handleOnChange}
            placeholder="e.g. http://localhost:9000 or https://api.example.com"
            className="w-full px-3 py-1.5 rounded-md bg-[#FAF3E1]/60 dark:bg-[#0B0B0D] border border-[#E6D2A5] dark:border-[#2C2C2E] focus:border-[#FF6D1F] dark:focus:border-[#6E6E73] focus:ring-[#FF6D1F] dark:focus:ring-[#6E6E73] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] transition-colors focus:outline-none focus:ring-1"
          />
          <p className="mt-1 text-[10px] text-[#8C8C8C] dark:text-[#6E6E73]">
            Default base URL for requests inside this collection.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-1">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-md bg-[#FF6D1F] text-white hover:bg-[#E85B0F] dark:bg-[#F5F5F7] dark:text-[#0B0B0D] dark:hover:bg-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              "Create Collection"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCollectionForm;

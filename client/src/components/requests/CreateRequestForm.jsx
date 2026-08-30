import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import requestThunk from "../../features/request/request.thunk.js";
import { Loader2, Plus, AlertCircle, Globe, Tag } from "lucide-react";

function CreateRequestForm({ projectId, collectionId, collectionName, onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.request);

  const [formData, setFormData] = useState({
    name: "",
    method: "GET",
    url: "",
  });

  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFormError("Request name is required");
      return;
    }

    if (formData.name.trim().length < 2) {
      setFormError("Request name must be at least 2 characters");
      return;
    }

    try {
      const result = await dispatch(
        requestThunk.createRequest({
          projectId,
          collectionId,
          requestDetails: {
            name: formData.name.trim(),
            method: formData.method,
            url: formData.url.trim(),
          },
        })
      ).unwrap();

      if (result) {
        setFormData({ name: "", method: "GET", url: "" });
        if (onSuccess) onSuccess(result);
      }
    } catch (err) {
      setFormError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to create request"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {collectionName && (
        <div className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6]">
          Target Collection:{" "}
          <span className="font-semibold text-[#222222] dark:text-[#F5F5F7]">
            {collectionName}
          </span>
        </div>
      )}

      {/* Local / Global Error Alert */}
      {(formError || error) && (
        <div className="p-3 rounded-md bg-[#FEE2E2] dark:bg-[#1C1214] border border-[#FCA5A5] dark:border-[#481E24] text-xs text-[#DC2626] dark:text-[#F87171] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError || error}</span>
        </div>
      )}

      {/* Name Input */}
      <div className="space-y-1.5">
        <label
          htmlFor="name"
          className="block text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]"
        >
          Name <span className="text-[#DC2626]">*</span>
        </label>
        <div className="relative">
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Login"
            required
            className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none focus:border-[#FF6D1F] transition-colors"
          />
        </div>
      </div>

      {/* Method Dropdown */}
      <div className="space-y-1.5">
        <label
          htmlFor="method"
          className="block text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]"
        >
          Method
        </label>
        <select
          id="method"
          name="method"
          value={formData.method}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono font-bold text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:border-[#FF6D1F] transition-colors cursor-pointer"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
          <option value="HEAD">HEAD</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>
      </div>

      {/* URL Input */}
      <div className="space-y-1.5">
        <label
          htmlFor="url"
          className="block text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]"
        >
          URL Endpoint <span className="text-[#8C8C8C] font-normal">(Optional)</span>
        </label>
        <input
          id="url"
          type="text"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="e.g. /auth/login or https://api.example.com/users"
          className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none focus:border-[#FF6D1F] transition-colors"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] text-[#5C5C5C] dark:text-[#A1A1A6] text-xs font-medium border border-[#E6D2A5] dark:border-[#2C2C2E] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#FF6D1F] hover:bg-[#E85B0F] text-white text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Create Request</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default CreateRequestForm;

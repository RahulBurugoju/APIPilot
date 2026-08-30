import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import projectThunks from "../../features/project/project.thunk.js";
import { resetCurrentProject, clearProjectError } from "../../features/project/projectSlice";
import { FolderPlus, AlertCircle, Loader2 } from "lucide-react";

function CreateProjectForm({ onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.project);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [projectType, setProjectType] = useState("rest");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const result = await dispatch(
        projectThunks.createProject({
          name: name.trim(),
          description: description.trim(),
          baseUrl: baseUrl.trim(),
          projectType,
        })
      ).unwrap();

      if (result) {
        setName("");
        setDescription("");
        setBaseUrl("");
        setProjectType("rest");
        dispatch(resetCurrentProject());
        dispatch(clearProjectError());
        if (onSuccess) onSuccess(result);
      }
    } catch {
      // Error is stored in redux state
    }
  };

  const handleOnChange = (e) => {
    const { name: fieldName, value } = e.target;
    if (error) {
      dispatch(clearProjectError());
    }
    if (fieldName === "name") setName(value);
    if (fieldName === "description") setDescription(value);
    if (fieldName === "baseUrl") setBaseUrl(value);
    if (fieldName === "projectType") setProjectType(value);
  };

  return (
    <div className="w-full text-[#222222] dark:text-[#F5F5F7]">
      {error && (
        <div className="mb-4 p-2.5 rounded-md bg-[#FEE2E2] dark:bg-[#1C1214] border border-[#FCA5A5] dark:border-[#481E24] flex items-center gap-2 text-xs text-[#DC2626] dark:text-[#F87171]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{typeof error === "string" ? error : error?.message || "Failed to create project"}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]">
            Project Name <span className="text-[#FF6D1F]">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleOnChange}
            placeholder="e.g. E-Commerce API, Auth Service"
            className="w-full h-9 px-3 rounded-md bg-[#FAF3E1]/50 dark:bg-[#0B0B0D] border border-[#E6D2A5] dark:border-[#1F1F23] focus:border-[#FF6D1F] text-xs font-medium text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none transition-colors"
            autoFocus
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={handleOnChange}
            placeholder="Brief overview of endpoints, microservices, or collection goals..."
            rows={3}
            className="w-full p-3 rounded-md bg-[#FAF3E1]/50 dark:bg-[#0B0B0D] border border-[#E6D2A5] dark:border-[#1F1F23] focus:border-[#FF6D1F] text-xs font-medium text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none transition-colors resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]">Base URL (Optional)</label>
          <input
            type="text"
            name="baseUrl"
            value={baseUrl}
            onChange={handleOnChange}
            placeholder="https://api.example.com or {{baseUrl}}"
            className="w-full h-9 px-3 rounded-md bg-[#FAF3E1]/50 dark:bg-[#0B0B0D] border border-[#E6D2A5] dark:border-[#1F1F23] focus:border-[#FF6D1F] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#FAF3E1] dark:border-[#1F1F23]">
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
            disabled={loading || !name.trim()}
            className="px-4 py-1.5 rounded-md bg-[#FF6D1F] hover:bg-[#E85B0F] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Creating Project...</span>
              </>
            ) : (
              <span>Create Project</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProjectForm;
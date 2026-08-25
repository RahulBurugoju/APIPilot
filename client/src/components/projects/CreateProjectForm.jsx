import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import projectThunks from "../../features/project/project.thunk";
import { resetCurrentProject, clearProjectError } from "../../features/project/projectSlice";
import { Check, FolderPlus, AlertCircle, Loader2 } from "lucide-react";

function CreateProjectForm() {
  const dispatch = useDispatch();
  const { currentProject, loading, error } = useSelector((state) => state.project);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch(projectThunks.createProject({ name: name.trim(), description: description.trim() }));
  };

  const handleOnChange = (e) => {
    const { name: fieldName, value } = e.target;
    if (error) {
      dispatch(clearProjectError());
    }
    if (fieldName === "name") {
      setName(value);
    }
    if (fieldName === "description") {
      setDescription(value);
    }
  };

  const handleCreateAnother = () => {
    setName("");
    setDescription("");
    dispatch(resetCurrentProject());
    dispatch(clearProjectError());
  };

  if (currentProject) {
    return (
      <div className="w-full max-w-md p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E5E5E7] dark:border-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-[#00966D] dark:text-[#00E599] font-medium mb-3">
          <Check className="w-4 h-4" />
          <span>Project created successfully</span>
        </div>

        <div className="space-y-2 mb-5 p-3 rounded-md bg-[#FAFAFA] dark:bg-[#0B0B0D] border border-[#E5E5E7] dark:border-[#1F1F23] text-xs">
          <div>
            <span className="text-[#86868B] dark:text-[#6E6E73] block text-[11px]">Project Name</span>
            <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">{currentProject.name}</span>
          </div>
          {currentProject.description && (
            <div>
              <span className="text-[#86868B] dark:text-[#6E6E73] block text-[11px]">Description</span>
              <span className="text-[#6E6E73] dark:text-[#A1A1A6]">{currentProject.description}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleCreateAnother}
          className="w-full h-8 px-3 rounded-md bg-[#F5F5F7] hover:bg-[#E5E5E7] dark:bg-[#1C1C1F] dark:hover:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] border border-[#E5E5E7] dark:border-[#2C2C2E] text-xs font-medium transition-colors cursor-pointer"
        >
          Create Another Project
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E5E5E7] dark:border-[#2C2C2E] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-200 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-md bg-[#F5F5F7] dark:bg-[#1C1C1F] border border-[#E5E5E7] dark:border-[#2C2C2E] flex items-center justify-center text-[#1D1D1F] dark:text-[#F5F5F7]">
          <FolderPlus className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">Create New Project</h3>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#A1A1A6]">Scaffold a new workspace collection.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2.5 rounded-md bg-[#FEE2E2] dark:bg-[#1C1214] border border-[#FCA5A5] dark:border-[#481E24] flex items-center gap-2 text-xs text-[#DC2626] dark:text-[#F87171]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{typeof error === "string" ? error : error?.message || "Failed to create project"}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">
            Project Name <span className="text-[#DC2626] dark:text-[#F87171]">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g. Payments API"
            onChange={handleOnChange}
            value={name}
            required
            className="w-full px-3 py-1.5 rounded-md bg-[#FAFAFA] dark:bg-[#0B0B0D] border border-[#E5E5E7] dark:border-[#2C2C2E] text-xs text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#86868B] dark:placeholder-[#6E6E73] focus:outline-none focus:border-[#1D1D1F] dark:focus:border-[#6E6E73] focus:ring-1 focus:ring-[#1D1D1F] dark:focus:ring-[#6E6E73] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1">
            Description <span className="text-[#86868B] dark:text-[#6E6E73] text-[10px]">(Optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Brief summary of this project..."
            onChange={handleOnChange}
            value={description}
            className="w-full px-3 py-1.5 rounded-md bg-[#FAFAFA] dark:bg-[#0B0B0D] border border-[#E5E5E7] dark:border-[#2C2C2E] text-xs text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#86868B] dark:placeholder-[#6E6E73] focus:outline-none focus:border-[#1D1D1F] dark:focus:border-[#6E6E73] focus:ring-1 focus:ring-[#1D1D1F] dark:focus:ring-[#6E6E73] transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full h-8 flex items-center justify-center gap-1.5 rounded-md bg-[#1D1D1F] text-white hover:bg-black dark:bg-[#F5F5F7] dark:text-[#0B0B0D] dark:hover:bg-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            "Create Project"
          )}
        </button>
      </form>
    </div>
  );
}

export default CreateProjectForm;
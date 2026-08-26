import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import projectThunks from "../../features/project/project.thunk";
import { clearProjectError } from "../../features/project/projectSlice";
import { Loader2, AlertCircle, Check, X } from "lucide-react";

function EditProjectForm({ onCancel, onSuccess }) {
  const dispatch = useDispatch();
  const { currentProject, loading, error } = useSelector((state) => state.project);

  const [name, setName] = useState(currentProject?.name || "");
  const [description, setDescription] = useState(currentProject?.description || "");
  const [fieldErrors, setFieldErrors] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentProject) {
      setName(currentProject.name || "");
      setDescription(currentProject.description || "");
    }
  }, [currentProject]);

  const handleOnChange = (e) => {
    const { name: fieldName, value } = e.target;
    if (error) {
      dispatch(clearProjectError());
    }
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
    if (fieldName === "name") {
      setName(value);
    }
    if (fieldName === "description") {
      setDescription(value);
    }
  };

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = "Project name is required";
    } else if (name.trim().length < 2) {
      errors.name = "Project name must be at least 2 characters";
    } else if (name.trim().length > 100) {
      errors.name = "Project name must not exceed 100 characters";
    }

    if (description && description.length > 500) {
      errors.description = "Description must not exceed 500 characters";
    }

    setFieldErrors(errors);
    return errors;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length === 0 && currentProject?._id) {
      try {
        const result = await dispatch(
          projectThunks.updateProject({
            projectId: currentProject._id,
            projectDetails: {
              name: name.trim(),
              description: description.trim(),
            },
          })
        ).unwrap();

        if (result) {
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 2500);
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch {
        // Redux slice stores error in state.error
      }
    }
  };

  return (
    <form onSubmit={handleOnSubmit} className="space-y-4" noValidate>
      {/* Server Error Alert */}
      {error && (
        <div className="p-3 rounded-md bg-[#FEE2E2] dark:bg-[#1C1214] border border-[#FCA5A5] dark:border-[#481E24] flex items-start gap-2.5 text-xs text-[#DC2626] dark:text-[#F87171]">
          <AlertCircle className="w-4 h-4 text-[#DC2626] dark:text-[#F87171] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            {typeof error === "string" ? error : error?.message || "Failed to update project"}
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="p-3 rounded-md bg-[#ECFDF5] dark:bg-[#0A2016] border border-[#A7F3D0] dark:border-[#104D30] flex items-center gap-2 text-xs text-[#065F46] dark:text-[#00E599]">
          <Check className="w-4 h-4 text-[#059669] dark:text-[#00E599] shrink-0" />
          <span>Project changes saved successfully</span>
        </div>
      )}

      {/* Name Input */}
      <div>
        <label
          htmlFor="edit-project-name"
          className="block text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6] mb-1.5"
        >
          Project Name <span className="text-[#DC2626] dark:text-[#F87171]">*</span>
        </label>
        <input
          type="text"
          id="edit-project-name"
          name="name"
          value={name}
          onChange={handleOnChange}
          placeholder="e.g. Payments API"
          className={`w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#0B0B0D] border text-xs text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] transition-colors focus:outline-none focus:ring-1 ${
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
          htmlFor="edit-project-desc"
          className="block text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6] mb-1.5"
        >
          Description <span className="text-[#8C8C8C] dark:text-[#6E6E73] text-[10px]">(Optional)</span>
        </label>
        <textarea
          id="edit-project-desc"
          name="description"
          rows={3}
          value={description}
          onChange={handleOnChange}
          placeholder="Brief summary of this project..."
          className={`w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#0B0B0D] border text-xs text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] transition-colors focus:outline-none focus:ring-1 resize-none ${
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

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#FF6D1F] text-white hover:bg-[#E85B0F] dark:bg-[#F5F5F7] dark:text-[#0B0B0D] dark:hover:bg-white text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
        >
          {loading ? (
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
  );
}

export default EditProjectForm;

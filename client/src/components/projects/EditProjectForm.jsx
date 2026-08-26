import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import projectThunks from "../../features/project/project.thunk";
import { clearProjectError } from "../../features/project/projectSlice";
import { Loader2, AlertCircle, Check } from "lucide-react";

function EditProjectForm({ onCancel, onSuccess }) {
  const dispatch = useDispatch();
  const { currentProject, loading, error } = useSelector(
    (state) => state.project
  );

  const [name, setName] = useState(currentProject?.name || "");
  const [description, setDescription] = useState(
    currentProject?.description || ""
  );
  const [baseUrl, setBaseUrl] = useState(currentProject?.baseUrl || "");
  const [projectType, setProjectType] = useState(
    currentProject?.projectType || "rest"
  );
  const [autoSave, setAutoSave] = useState(
    currentProject?.settings?.autoSave ?? true
  );
  const [defaultTimeout, setDefaultTimeout] = useState(
    currentProject?.settings?.defaultTimeout ?? 30000
  );

  const [fieldErrors, setFieldErrors] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentProject) {
      setName(currentProject.name || "");
      setDescription(currentProject.description || "");
      setBaseUrl(currentProject.baseUrl || "");
      setProjectType(currentProject.projectType || "rest");
      setAutoSave(currentProject.settings?.autoSave ?? true);
      setDefaultTimeout(currentProject.settings?.defaultTimeout ?? 30000);
    }
  }, [currentProject]);

  const handleOnChange = (e) => {
    const { name: fieldName, value, checked } = e.target;
    if (error) {
      dispatch(clearProjectError());
    }
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }

    if (fieldName === "name") setName(value);
    if (fieldName === "description") setDescription(value);
    if (fieldName === "baseUrl") setBaseUrl(value);
    if (fieldName === "projectType") setProjectType(value);
    if (fieldName === "autoSave") setAutoSave(checked);
    if (fieldName === "defaultTimeout") setDefaultTimeout(Number(value));
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

    if (baseUrl.trim()) {
      try {
        const parsedUrl = new URL(baseUrl.trim());
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
          errors.baseUrl = "Base URL must start with http:// or https://";
        }
      } catch {
        errors.baseUrl =
          "Please enter a valid URL (e.g. https://api.example.com)";
      }
    }

    if (
      isNaN(defaultTimeout) ||
      defaultTimeout < 1000 ||
      defaultTimeout > 120000
    ) {
      errors.defaultTimeout = "Timeout must be between 1000 and 120000 ms";
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
              baseUrl: baseUrl.trim(),
              projectType,
              settings: {
                autoSave,
                defaultTimeout: Number(defaultTimeout),
              },
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
    <form onSubmit={handleOnSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1" noValidate>
      {/* Server Error Alert */}
      {error && (
        <div className="p-3 rounded-md bg-[#FEE2E2] dark:bg-[#1C1214] border border-[#FCA5A5] dark:border-[#481E24] flex items-start gap-2.5 text-xs text-[#DC2626] dark:text-[#F87171]">
          <AlertCircle className="w-4 h-4 text-[#DC2626] dark:text-[#F87171] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            {typeof error === "string"
              ? error
              : error?.message || "Failed to update project"}
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

      {/* Project Type Dropdown */}
      <div>
        <label
          htmlFor="edit-project-type"
          className="block text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6] mb-1.5"
        >
          Project Type
        </label>
        <select
          id="edit-project-type"
          name="projectType"
          value={projectType}
          onChange={handleOnChange}
          className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#0B0B0D] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs text-[#222222] dark:text-[#F5F5F7] transition-colors focus:outline-none focus:border-[#FF6D1F] dark:focus:border-[#6E6E73] focus:ring-1 focus:ring-[#FF6D1F] dark:focus:ring-[#6E6E73] cursor-pointer"
        >
          <option value="rest">REST API (HTTP)</option>
        </select>
      </div>

      {/* Base URL Input */}
      <div>
        <label
          htmlFor="edit-project-baseurl"
          className="block text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6] mb-1.5"
        >
          Base URL <span className="text-[#8C8C8C] dark:text-[#6E6E73] text-[10px]">(Optional)</span>
        </label>
        <input
          type="url"
          id="edit-project-baseurl"
          name="baseUrl"
          value={baseUrl}
          onChange={handleOnChange}
          placeholder="https://api.example.com/v1"
          className={`w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#0B0B0D] border text-xs text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] font-mono transition-colors focus:outline-none focus:ring-1 ${
            fieldErrors.baseUrl
              ? "border-[#DC2626] dark:border-[#F87171] focus:ring-[#DC2626] dark:focus:ring-[#F87171]"
              : "border-[#E6D2A5] dark:border-[#2C2C2E] focus:border-[#FF6D1F] dark:focus:border-[#6E6E73] focus:ring-[#FF6D1F] dark:focus:ring-[#6E6E73]"
          }`}
        />
        {fieldErrors.baseUrl && (
          <p className="mt-1 text-[11px] text-[#DC2626] dark:text-[#F87171]">
            {fieldErrors.baseUrl}
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

      {/* Settings Section */}
      <div className="pt-2 border-t border-[#FAF3E1] dark:border-[#1F1F23] space-y-3">
        <p className="text-[11px] font-mono uppercase tracking-wider text-[#8C8C8C] dark:text-[#6E6E73] font-semibold">
          Execution Settings
        </p>

        {/* Timeout */}
        <div>
          <label
            htmlFor="edit-project-timeout"
            className="block text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6] mb-1"
          >
            Default Timeout (ms)
          </label>
          <input
            type="number"
            id="edit-project-timeout"
            name="defaultTimeout"
            min={1000}
            max={120000}
            step={500}
            value={defaultTimeout}
            onChange={handleOnChange}
            className={`w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#0B0B0D] border text-xs text-[#222222] dark:text-[#F5F5F7] font-mono transition-colors focus:outline-none focus:ring-1 ${
              fieldErrors.defaultTimeout
                ? "border-[#DC2626] dark:border-[#F87171] focus:ring-[#DC2626] dark:focus:ring-[#F87171]"
                : "border-[#E6D2A5] dark:border-[#2C2C2E] focus:border-[#FF6D1F] dark:focus:border-[#6E6E73] focus:ring-[#FF6D1F] dark:focus:ring-[#6E6E73]"
            }`}
          />
          {fieldErrors.defaultTimeout && (
            <p className="mt-1 text-[11px] text-[#DC2626] dark:text-[#F87171]">
              {fieldErrors.defaultTimeout}
            </p>
          )}
        </div>

        {/* AutoSave Toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="block text-xs font-medium text-[#222222] dark:text-[#F5F5F7]">
              Auto-save Requests
            </span>
            <span className="text-[11px] text-[#5C5C5C] dark:text-[#A1A1A6]">
              Save endpoint draft edits automatically
            </span>
          </div>
          <input
            type="checkbox"
            id="edit-project-autosave"
            name="autoSave"
            checked={autoSave}
            onChange={handleOnChange}
            className="w-4 h-4 accent-[#FF6D1F] rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#FAF3E1] dark:border-[#1F1F23]">
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

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Check,
  Loader2,
  AlertCircle,
  ShieldAlert,
  Zap,
  Sliders,
} from "lucide-react";
import environmentThunks from "../../features/environment/environment.thunk.js";

export default function EnvironmentEditor({
  environment,
  projectId,
  onDelete,
}) {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [variables, setVariables] = useState([]);
  const [revealedSecrets, setRevealedSecrets] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isActivating, setIsActivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync internal state whenever the selected environment changes
  useEffect(() => {
    if (environment) {
      setName(environment.name || "");
      const initialVars = (environment.variables || []).map((v) => ({
        key: v.key || "",
        value: v.value !== undefined && v.value !== null ? String(v.value) : "",
        enabled: v.enabled !== false,
        secret: Boolean(v.secret),
      }));
      setVariables(initialVars);
      setRevealedSecrets({});
      setError(null);
      setSaveSuccess(false);
      setShowDeleteConfirm(false);
    }
  }, [environment?._id]);

  // Determine dirty state by comparing current variables and name
  const isDirty = useMemo(() => {
    if (!environment) return false;
    if (name.trim() !== (environment.name || "")) return true;

    const original = (environment.variables || []).map((v) => ({
      key: v.key || "",
      value: v.value !== undefined && v.value !== null ? String(v.value) : "",
      enabled: v.enabled !== false,
      secret: Boolean(v.secret),
    }));

    if (variables.length !== original.length) return true;
    return JSON.stringify(variables) !== JSON.stringify(original);
  }, [name, variables, environment]);

  if (!environment) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#FAF3E1]/20 dark:bg-[#141416]/20 select-none">
        <div className="w-12 h-12 rounded-xl bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center text-[#FF6D1F] mb-3">
          <Sliders className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
          No Environment Selected
        </h3>
        <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] mt-1 max-w-xs leading-relaxed">
          Select an environment from the list or create a new one to manage its variables and secrets.
        </p>
      </div>
    );
  }

  const handleAddVariable = () => {
    setVariables((prev) => [
      ...prev,
      { key: "", value: "", enabled: true, secret: false },
    ]);
  };

  const handleRemoveVariable = (index) => {
    setVariables((prev) => prev.filter((_, i) => i !== index));
    setRevealedSecrets((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const handleVariableChange = (index, field, val) => {
    setVariables((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: val } : v))
    );
  };

  const toggleSecretReveal = (index) => {
    setRevealedSecrets((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleToggleSecret = (index) => {
    const isCurrentlySecret = variables[index]?.secret;
    handleVariableChange(index, "secret", !isCurrentlySecret);
    if (isCurrentlySecret) {
      // If turning off secret, clear reveal state
      setRevealedSecrets((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  const handleSave = async () => {
    if (!projectId || !environment?._id) return;

    // Validate keys: non-empty keys must follow valid identifier format
    for (let i = 0; i < variables.length; i++) {
      const v = variables[i];
      if (!v.key.trim()) {
        setError(`Row ${i + 1}: Variable name cannot be empty.`);
        return;
      }
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(v.key.trim())) {
        setError(
          `Row ${i + 1}: "${v.key}" is invalid. Variable names must start with a letter or underscore and contain only alphanumeric characters (e.g. baseUrl, API_KEY).`
        );
        return;
      }
    }

    setIsSaving(true);
    setError(null);

    try {
      const cleanedVariables = variables.map((v) => ({
        key: v.key.trim(),
        value: v.value,
        enabled: v.enabled !== false,
        secret: Boolean(v.secret),
      }));

      await dispatch(
        environmentThunks.updateEnvironment({
          projectId,
          environmentId: environment._id,
          environmentDetails: {
            name: name.trim() || environment.name,
            variables: cleanedVariables,
          },
        })
      ).unwrap();

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to save environment variables"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleActivate = async () => {
    if (!projectId || !environment?._id || isActivating || environment.isActive)
      return;
    setIsActivating(true);
    try {
      await dispatch(
        environmentThunks.activateEnvironment({
          projectId,
          environmentId: environment._id,
        })
      ).unwrap();
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to activate environment"
      );
    } finally {
      setIsActivating(false);
    }
  };

  const handleDelete = async () => {
    if (!projectId || !environment?._id || isDeleting) return;
    setIsDeleting(true);
    try {
      await dispatch(
        environmentThunks.deleteEnvironment({
          projectId,
          environmentId: environment._id,
        })
      ).unwrap();
      if (onDelete) {
        onDelete(environment._id);
      }
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to delete environment"
      );
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#FFFFFF] dark:bg-[#141416] rounded-xl border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-sm overflow-hidden">
      {/* ---------------------------------------------------- */}
      {/* TOP BAR: Name, Active Status, Actions                */}
      {/* ---------------------------------------------------- */}
      <div className="px-5 py-3.5 border-b border-[#FAF3E1] dark:border-[#1F1F23] flex flex-wrap items-center justify-between gap-3 bg-[#FAF3E1]/40 dark:bg-[#1C1C1F]/40 shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <div className="w-8 h-8 rounded-lg bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center text-[#FF6D1F] shrink-0">
            <Sliders className="w-4 h-4" />
          </div>

          <div className="flex-1">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Environment Name"
              className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7] bg-transparent border-b border-transparent hover:border-[#E6D2A5] focus:border-[#FF6D1F] focus:outline-none px-1 py-0.5 rounded transition-colors w-full max-w-sm"
            />
            <div className="flex items-center gap-2 mt-0.5 px-1">
              {environment.isActive ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669] dark:text-[#00E599]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#00E599] animate-pulse" />
                  Active Environment
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleActivate}
                  disabled={isActivating}
                  className="inline-flex items-center gap-1 text-[11px] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#FF6D1F] transition-colors cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-[#8C8C8C]" />
                  <span>Set as active</span>
                </button>
              )}

              <span className="text-[#8C8C8C] dark:text-[#6E6E73] text-[10px]">
                • {variables.length} {variables.length === 1 ? "variable" : "variables"}
              </span>

              {isDirty && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#FFFBEB] dark:bg-[#201806] text-[#D97706] dark:text-[#FBBF24] border border-[#FDE68A] dark:border-[#422F08]">
                  Unsaved changes
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-1.5 bg-[#FEF2F2] dark:bg-[#200B0D] border border-[#FECACA] dark:border-[#4B141A] px-2.5 py-1 rounded-md text-xs">
              <span className="text-[#DC2626] dark:text-[#F87171] font-medium text-[11px]">
                Delete environment?
              </span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-2 py-0.5 bg-[#DC2626] text-white rounded text-[11px] font-semibold hover:bg-[#B91C1C] cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-1.5 py-0.5 text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] text-[11px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 rounded-md text-[#8C8C8C] hover:text-[#DC2626] hover:bg-[#FEF2F2] dark:hover:bg-[#200B0D] transition-colors cursor-pointer"
              title="Delete environment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FF6D1F] hover:bg-[#E85B0F] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Saved</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mx-5 mt-3 p-2.5 rounded-md bg-[#FEF2F2] dark:bg-[#200B0D] border border-[#FECACA] dark:border-[#4B141A] text-[#DC2626] dark:text-[#F87171] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* VARIABLES TABLE                                      */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="border border-[#E6D2A5] dark:border-[#2C2C2E] rounded-lg overflow-hidden bg-[#FAF3E1]/20 dark:bg-[#141416]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E6D2A5] dark:border-[#2C2C2E] bg-[#FAF3E1]/60 dark:bg-[#1C1C1F]/60 text-[11px] font-semibold text-[#5C5C5C] dark:text-[#A1A1A6] uppercase tracking-wider select-none">
                <th className="w-10 px-3 py-2.5 text-center">✓</th>
                <th className="w-1/3 px-3 py-2.5">Variable</th>
                <th className="px-3 py-2.5">Value</th>
                <th className="w-20 px-2 py-2.5 text-center">Secret</th>
                <th className="w-12 px-2 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF3E1] dark:divide-[#1F1F23] text-xs font-mono">
              {variables.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-[#8C8C8C] dark:text-[#6E6E73] select-none"
                  >
                    <p className="font-sans text-xs">No variables configured yet.</p>
                    <p className="font-sans text-[11px] mt-1 text-[#8C8C8C]">
                      Add variables like <code className="bg-[#FAF3E1] dark:bg-[#1C1C1F] px-1 py-0.5 rounded text-[#FF6D1F]">baseUrl</code> or <code className="bg-[#FAF3E1] dark:bg-[#1C1C1F] px-1 py-0.5 rounded text-[#FF6D1F]">apiKey</code> to reference them in requests via <code className="bg-[#FAF3E1] dark:bg-[#1C1C1F] px-1 py-0.5 rounded text-[#FF6D1F]">&#123;&#123;variable&#125;&#125;</code>.
                    </p>
                  </td>
                </tr>
              ) : (
                variables.map((item, index) => {
                  const isRevealed = Boolean(revealedSecrets[index]);
                  const isSecret = Boolean(item.secret);
                  const showMasked = isSecret && !isRevealed;

                  return (
                    <tr
                      key={index}
                      className={`group hover:bg-[#FAF3E1]/40 dark:hover:bg-[#1C1C1F]/40 transition-colors ${
                        item.enabled === false ? "opacity-50" : ""
                      }`}
                    >
                      {/* 1. Enabled Checkbox */}
                      <td className="px-3 py-1.5 text-center">
                        <input
                          type="checkbox"
                          checked={item.enabled !== false}
                          onChange={(e) =>
                            handleVariableChange(
                              index,
                              "enabled",
                              e.target.checked
                            )
                          }
                          className="w-3.5 h-3.5 rounded border-[#E6D2A5] dark:border-[#2C2C2E] text-[#FF6D1F] focus:ring-[#FF6D1F] cursor-pointer"
                          title={item.enabled ? "Variable enabled" : "Variable disabled"}
                        />
                      </td>

                      {/* 2. Variable Name (Key) */}
                      <td className="px-3 py-1.5">
                        <input
                          type="text"
                          value={item.key}
                          onChange={(e) =>
                            handleVariableChange(index, "key", e.target.value)
                          }
                          placeholder="e.g. baseUrl"
                          className="w-full px-2 py-1 rounded bg-transparent border border-transparent hover:border-[#E6D2A5] dark:hover:border-[#2C2C2E] focus:border-[#FF6D1F] focus:bg-[#FFFFFF] dark:focus:bg-[#141416] focus:outline-none text-xs font-mono font-medium text-[#222222] dark:text-[#F5F5F7] transition-all"
                        />
                      </td>

                      {/* 3. Variable Value (with Secret Masking & Eye Reveal) */}
                      <td className="px-3 py-1.5">
                        <div className="relative flex items-center">
                          <input
                            type={showMasked ? "password" : "text"}
                            value={item.value}
                            onChange={(e) =>
                              handleVariableChange(
                                index,
                                "value",
                                e.target.value
                              )
                            }
                            placeholder={isSecret ? "••••••••••••" : "value"}
                            className="w-full pl-2 pr-8 py-1 rounded bg-transparent border border-transparent hover:border-[#E6D2A5] dark:hover:border-[#2C2C2E] focus:border-[#FF6D1F] focus:bg-[#FFFFFF] dark:focus:bg-[#141416] focus:outline-none text-xs font-mono text-[#222222] dark:text-[#F5F5F7] transition-all"
                          />

                          {/* Eye Reveal Button for Secret Variables */}
                          {isSecret && (
                            <button
                              type="button"
                              onClick={() => toggleSecretReveal(index)}
                              className="absolute right-1 p-1 text-[#8C8C8C] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer"
                              title={
                                isRevealed
                                  ? "Hide secret value"
                                  : "Reveal secret value"
                              }
                            >
                              {isRevealed ? (
                                <EyeOff className="w-3.5 h-3.5 text-[#FF6D1F]" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* 4. Secret Toggle */}
                      <td className="px-2 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSecret(index)}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            isSecret
                              ? "text-[#FF6D1F] bg-[#FAF3E1] dark:bg-[#1C1C1F]"
                              : "text-[#8C8C8C] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                          }`}
                          title={
                            isSecret
                              ? "Secret variable (masked with eye reveal)"
                              : "Mark as secret variable"
                          }
                        >
                          {isSecret ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5 opacity-50 hover:opacity-100" />
                          )}
                        </button>
                      </td>

                      {/* 5. Delete Variable Row */}
                      <td className="px-2 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariable(index)}
                          className="p-1 rounded text-[#8C8C8C] hover:text-[#DC2626] hover:bg-[#FEF2F2] dark:hover:bg-[#200B0D] transition-colors cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Remove variable"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Add Variable Button */}
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={handleAddVariable}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#E6D2A5] dark:border-[#2C2C2E] hover:border-[#FF6D1F] dark:hover:border-[#FF6D1F] text-xs font-semibold text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#FF6D1F] transition-all cursor-pointer select-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Variable</span>
          </button>

          {variables.length > 0 && (
            <span className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73]">
              Tip: Click the lock icon to mark sensitive tokens as secret.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

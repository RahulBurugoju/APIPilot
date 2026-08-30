import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Sliders,
  Plus,
  Zap,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import EnvironmentEditor from "./EnvironmentEditor.jsx";
import CreateEnvironmentModal from "./CreateEnvironmentModal.jsx";
import environmentThunks from "../../features/environment/environment.thunk.js";

export default function EnvironmentManager({ projectId }) {
  const dispatch = useDispatch();

  const environments = useSelector(
    (state) =>
      state.environment?.environments ||
      state.environments?.environments ||
      []
  );
  const activeEnvironment = useSelector(
    (state) =>
      state.environment?.activeEnvironment ||
      state.environments?.activeEnvironment
  );
  const loading = useSelector(
    (state) =>
      state.environment?.loading ?? state.environments?.loading ?? false
  );

  const [selectedEnvId, setSelectedEnvId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Automatically select the active environment or the first available environment
  useEffect(() => {
    if (environments && environments.length > 0) {
      if (!selectedEnvId || !environments.some((e) => e._id === selectedEnvId)) {
        const active = environments.find((e) => e.isActive);
        setSelectedEnvId(active ? active._id : environments[0]._id);
      }
    } else {
      setSelectedEnvId(null);
    }
  }, [environments, selectedEnvId]);

  const selectedEnvironment = environments.find((e) => e._id === selectedEnvId) || null;

  const handleActivate = async (e, envId) => {
    e.stopPropagation();
    if (!projectId || !envId) return;
    try {
      await dispatch(
        environmentThunks.activateEnvironment({
          projectId,
          environmentId: envId,
        })
      ).unwrap();
    } catch (err) {
      console.error("Failed to activate environment:", err);
    }
  };

  const handleCreated = (newEnv) => {
    if (newEnv?._id) {
      setSelectedEnvId(newEnv._id);
    }
  };

  const handleDeleted = (deletedId) => {
    const remaining = environments.filter((e) => e._id !== deletedId);
    if (remaining.length > 0) {
      const active = remaining.find((e) => e.isActive);
      setSelectedEnvId(active ? active._id : remaining[0]._id);
    } else {
      setSelectedEnvId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 h-[calc(100vh-3.5rem)] overflow-hidden bg-[#FAF3E1]/40 dark:bg-[#0B0B0D]">
      {/* ---------------------------------------------------- */}
      {/* LEFT COLUMN: Environments List (02.11.15)            */}
      {/* ---------------------------------------------------- */}
      <div className="w-full md:w-72 lg:w-80 flex flex-col rounded-xl bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-sm overflow-hidden shrink-0">
        {/* List Header */}
        <div className="px-4 py-3 border-b border-[#FAF3E1] dark:border-[#1F1F23] flex items-center justify-between bg-[#FAF3E1]/50 dark:bg-[#1C1C1F]/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FF6D1F]" />
            <h2 className="text-xs font-bold text-[#222222] dark:text-[#F5F5F7] uppercase tracking-wider">
              Environments
            </h2>
            <span className="px-1.5 py-0.2 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[10px] font-mono text-[#FF6D1F]">
              {environments.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FF6D1F] hover:bg-[#E85B0F] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Create New Environment"
          >
            <Plus className="w-3 h-3" />
            <span>New</span>
          </button>
        </div>

        {/* Environments Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {loading && environments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-[#8C8C8C]">
              <Loader2 className="w-5 h-5 animate-spin text-[#FF6D1F] mb-2" />
              <span className="text-xs">Loading environments...</span>
            </div>
          ) : environments.length === 0 ? (
            <div className="text-center py-10 px-4 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center mx-auto text-[#FF6D1F]">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
                  No environments yet
                </p>
                <p className="text-[11px] text-[#5C5C5C] dark:text-[#A1A1A6] mt-0.5">
                  Create environments for Development, Staging, or Production.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF6D1F] hover:bg-[#E85B0F] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Environment</span>
              </button>
            </div>
          ) : (
            environments.map((env) => {
              const isSelected = env._id === selectedEnvId;
              const isActive = Boolean(env.isActive);
              const varCount = env.variables?.length || 0;

              return (
                <div
                  key={env._id}
                  onClick={() => setSelectedEnvId(env._id)}
                  className={`group relative flex items-start justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FAF3E1]/80 dark:bg-[#1C1C1F] border-[#FF6D1F] shadow-xs"
                      : "bg-transparent border-[#FAF3E1] dark:border-[#1F1F23] hover:bg-[#FAF3E1]/40 dark:hover:bg-[#1C1C1F]/40"
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    {/* Active/Inactive Circle Indicator */}
                    <button
                      type="button"
                      onClick={(e) => handleActivate(e, env._id)}
                      className="mt-0.5 cursor-pointer shrink-0 transition-transform active:scale-90"
                      title={
                        isActive
                          ? "Active environment"
                          : "Click to set as active environment"
                      }
                    >
                      {isActive ? (
                        <div className="w-4 h-4 rounded-full bg-[#ECFDF5] dark:bg-[#062417] border border-[#059669] dark:border-[#00E599] flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-[#059669] dark:bg-[#00E599]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#8C8C8C] dark:border-[#6E6E73] hover:border-[#FF6D1F] transition-colors" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-semibold truncate ${
                            isSelected
                              ? "text-[#FF6D1F]"
                              : "text-[#222222] dark:text-[#F5F5F7]"
                          }`}
                        >
                          {env.name}
                        </span>

                        {isActive && (
                          <span className="px-1.5 py-0.2 rounded-full bg-[#ECFDF5] dark:bg-[#062417] text-[#059669] dark:text-[#00E599] text-[9px] font-semibold uppercase">
                            Active
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] mt-0.5">
                        {varCount} {varCount === 1 ? "variable" : "variables"}
                      </p>
                    </div>
                  </div>

                  {!isActive && (
                    <button
                      type="button"
                      onClick={(e) => handleActivate(e, env._id)}
                      className="opacity-0 group-hover:opacity-100 text-[10px] font-medium text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#FF6D1F] transition-opacity px-1.5 py-0.5 rounded bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shrink-0"
                    >
                      Activate
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Bar: + New Environment */}
        {environments.length > 0 && (
          <div className="p-3 border-t border-[#FAF3E1] dark:border-[#1F1F23] bg-[#FAF3E1]/20 dark:bg-[#1C1C1F]/20">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-[#E6D2A5] dark:border-[#2C2C2E] hover:border-[#FF6D1F] dark:hover:border-[#FF6D1F] text-xs font-semibold text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#FF6D1F] transition-all cursor-pointer select-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Environment</span>
            </button>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* RIGHT COLUMN: Environment Editor (02.11.16)          */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 h-full min-w-0">
        <EnvironmentEditor
          environment={selectedEnvironment}
          projectId={projectId}
          onDelete={handleDeleted}
        />
      </div>

      {/* Create Environment Modal (02.11.17) */}
      <CreateEnvironmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectId}
        onSuccess={handleCreated}
      />
    </div>
  );
}

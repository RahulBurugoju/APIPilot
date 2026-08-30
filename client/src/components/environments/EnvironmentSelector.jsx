import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sliders, ChevronDown, Check, Zap, Plus, Settings } from "lucide-react";
import environmentThunks from "../../features/environment/environment.thunk.js";

export default function EnvironmentSelector({
  projectId,
  onManageEnvironments,
}) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSelectEnvironment = (env) => {
    if (!env || !projectId) return;
    if (env.isActive) {
      setIsOpen(false);
      return;
    }
    dispatch(
      environmentThunks.activateEnvironment({
        projectId,
        environmentId: env._id,
      })
    );
    setIsOpen(false);
  };

  const handleManageClick = () => {
    setIsOpen(false);
    if (onManageEnvironments) {
      onManageEnvironments();
    }
  };

  const displayName = activeEnvironment?.name || "No Environment";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer select-none shadow-xs ${
          activeEnvironment
            ? "bg-[#FFFFFF] dark:bg-[#1C1C1F] border-[#E6D2A5] dark:border-[#2C2C2E] text-[#222222] dark:text-[#F5F5F7] hover:border-[#FF6D1F]"
            : "bg-[#FFFFFF] dark:bg-[#1C1C1F] border-[#E6D2A5] dark:border-[#2C2C2E] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`Active Environment: ${displayName}`}
      >
        <div className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-[#FF6D1F]" />
          <span className="text-[#8C8C8C] dark:text-[#6E6E73]">Environment:</span>
          <span className="font-semibold text-[#222222] dark:text-[#F5F5F7] max-w-[120px] sm:max-w-[160px] truncate">
            {displayName}
          </span>
          {activeEnvironment && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#00E599] animate-pulse" />
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8C8C8C] dark:text-[#6E6E73] transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8C8C8C] dark:text-[#6E6E73] border-b border-[#FAF3E1] dark:border-[#1F1F23]">
            Select Environment
          </div>

          {/* Environments list */}
          <div className="max-h-60 overflow-y-auto py-1">
            {environments.length === 0 ? (
              <div className="px-3 py-3 text-center text-[#8C8C8C] dark:text-[#6E6E73]">
                <p className="text-xs">No environments</p>
                <p className="text-[11px] mt-0.5 opacity-80">
                  Create one in Environment Manager
                </p>
              </div>
            ) : (
              environments.map((env) => {
                const isActive = Boolean(env.isActive);
                return (
                  <button
                    key={env._id}
                    type="button"
                    onClick={() => handleSelectEnvironment(env)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F] transition-colors cursor-pointer ${
                      isActive
                        ? "text-[#FF6D1F] font-semibold bg-[#FAF3E1]/40 dark:bg-[#1C1C1F]/40"
                        : "text-[#222222] dark:text-[#F5F5F7]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate">{env.name}</span>
                    </div>

                    {isActive && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#059669] dark:text-[#00E599] shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#00E599]" />
                        Active
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[#FAF3E1] dark:border-[#1F1F23] my-1" />

          {/* Manage Environments Button */}
          <button
            type="button"
            onClick={handleManageClick}
            className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-[#222222] dark:text-[#F5F5F7] hover:text-[#FF6D1F] hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F] transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>Manage Environments</span>
          </button>
        </div>
      )}
    </div>
  );
}

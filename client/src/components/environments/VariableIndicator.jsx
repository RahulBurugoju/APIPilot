import React from "react";
import { useSelector } from "react-redux";
import { Sliders, AlertCircle, CheckCircle2, Lock } from "lucide-react";

/**
 * Regex for matching {{variableName}}
 */
export const VARIABLE_REGEX = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;

/**
 * Extracts unique variable names from text
 */
export const extractVariableNames = (text) => {
  if (!text || typeof text !== "string") return [];
  const matches = text.matchAll(VARIABLE_REGEX);
  const names = new Set();
  for (const match of matches) {
    if (match[1]) {
      names.add(match[1]);
    }
  }
  return Array.from(names);
};

/**
 * Resolves variables in a string given a list or map of variables
 */
export const resolveVariablesInString = (text, variables = []) => {
  if (!text || typeof text !== "string" || !text.includes("{{")) {
    return text;
  }

  const varMap = {};
  if (Array.isArray(variables)) {
    for (const v of variables) {
      if (v && v.key && v.enabled !== false) {
        varMap[v.key] = v.value ?? "";
      }
    }
  } else if (typeof variables === "object" && variables !== null) {
    Object.assign(varMap, variables);
  }

  return text.replace(VARIABLE_REGEX, (match, varName) => {
    if (Object.prototype.hasOwnProperty.call(varMap, varName)) {
      return varMap[varName] !== undefined ? String(varMap[varName]) : "";
    }
    return match;
  });
};

export default function VariableIndicator({ text, className = "" }) {
  const activeEnvironment = useSelector(
    (state) => state.environment?.activeEnvironment || state.environments?.activeEnvironment
  );

  const varNames = extractVariableNames(text);
  if (!varNames || varNames.length === 0) {
    return null;
  }

  const envVariables = activeEnvironment?.variables || [];
  const varMap = {};
  for (const v of envVariables) {
    if (v && v.key) {
      varMap[v.key] = v;
    }
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 text-[11px] font-mono select-none animate-in fade-in duration-150 ${className}`}
    >
      <div className="flex items-center gap-1 text-[#8C8C8C] dark:text-[#6E6E73] mr-0.5">
        <Sliders className="w-3 h-3 text-[#FF6D1F]" />
        <span>Variables:</span>
      </div>

      {varNames.map((name) => {
        const found = varMap[name];
        const isDefined = Boolean(found && found.enabled !== false);
        const isSecret = Boolean(found?.secret);
        const displayValue = isDefined
          ? isSecret
            ? "••••••••"
            : String(found.value)
          : null;

        if (!activeEnvironment) {
          return (
            <span
              key={name}
              title={`Variable {{${name}}} detected, but no environment is currently active.`}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#FFFBEB] dark:bg-[#241A08] border border-[#FDE68A] dark:border-[#523B0F] text-[#B45309] dark:text-[#FBBF24]"
            >
              <AlertCircle className="w-2.5 h-2.5" />
              <span>{`{{${name}}}`}</span>
              <span className="opacity-75 text-[10px]">(no env)</span>
            </span>
          );
        }

        if (!isDefined) {
          return (
            <span
              key={name}
              title={`Variable {{${name}}} is not defined in ${activeEnvironment.name}.`}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#FEF2F2] dark:bg-[#200B0D] border border-[#FECACA] dark:border-[#4B141A] text-[#DC2626] dark:text-[#F87171]"
            >
              <AlertCircle className="w-2.5 h-2.5" />
              <span>{`{{${name}}}`}</span>
              <span className="opacity-75 text-[10px]">(missing)</span>
            </span>
          );
        }

        return (
          <span
            key={name}
            title={`{{${name}}} = "${found.value}" (from ${activeEnvironment.name})`}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#ECFDF5] dark:bg-[#062417] border border-[#A7F3D0] dark:border-[#104D30] text-[#059669] dark:text-[#00E599]"
          >
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span className="font-semibold">{`{{${name}}}`}</span>
            {isSecret ? (
              <Lock className="w-2.5 h-2.5 opacity-70" />
            ) : (
              <span className="max-w-[120px] truncate opacity-90 text-[10px]">
                = {displayValue}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

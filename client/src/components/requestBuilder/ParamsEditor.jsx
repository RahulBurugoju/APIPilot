import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import KeyValueEditor from "./KeyValueEditor.jsx";
import { extractPathVariables } from "../../utils/urlUtils.js";

function ParamsEditor({
  url: propUrl,
  params = [],
  items,
  onChange,
  pathVariables: propPathVars,
  onPathVariablesChange,
}) {
  const reduxUrl = useSelector((state) => state.request.currentRequest?.url);
  const activeUrl = propUrl !== undefined ? propUrl : reduxUrl || "";

  const actualQueryParams = items !== undefined ? items : params;

  // Local state for path variables mapping: { [paramKey]: { value: "", description: "" } }
  const [localPathVars, setLocalPathVars] = useState(propPathVars || {});

  // Extract keys dynamically whenever activeUrl changes
  const detectedPathKeys = useMemo(
    () => extractPathVariables(activeUrl),
    [activeUrl]
  );

  const handlePathVarChange = (paramKey, field, val) => {
    const updated = {
      ...localPathVars,
      [paramKey]: {
        ...(localPathVars[paramKey] || {}),
        [field]: val,
      },
    };
    setLocalPathVars(updated);
    if (onPathVariablesChange) {
      onPathVariablesChange(updated);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* 1. Query Parameters Section */}
      <div className="space-y-2">
        <KeyValueEditor
          title="Query Parameters"
          items={actualQueryParams}
          onChange={onChange}
          keyPlaceholder="Key"
          valuePlaceholder="Value"
          addButtonLabel="+ Add Parameter"
          emptyMessage="No query parameters configured. Click '+ Add Parameter' to add one."
        />
      </div>

      {/* 2. Path Variables (Root Params: :paramsVariable) */}
      <div className="space-y-3 pt-2 border-t border-[#FAF3E1] dark:border-[#1F1F23]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
              Path Variables
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] text-[#FF6D1F] border border-[#E6D2A5]/60 dark:border-[#2C2C2E] font-medium">
              :root_params
            </span>
          </div>
          {detectedPathKeys.length > 0 && (
            <span className="text-[11px] font-mono text-[#8C8C8C] dark:text-[#6E6E73]">
              {detectedPathKeys.length}{" "}
              {detectedPathKeys.length === 1 ? "variable" : "variables"}
            </span>
          )}
        </div>

        {detectedPathKeys.length === 0 ? (
          <div className="p-6 text-center rounded-lg border border-dashed border-[#E6D2A5]/70 dark:border-[#2C2C2E] bg-[#FAF3E1]/15 dark:bg-[#141416]/30">
            <p className="text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]">
              No path variables in request URL
            </p>
            <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] mt-1 font-mono">
              Type{" "}
              <code className="text-[#FF6D1F] bg-[#FAF3E1] dark:bg-[#1C1C1F] px-1 py-0.5 rounded border border-[#E6D2A5]/50 dark:border-[#2C2C2E]">
                :paramsVariable
              </code>{" "}
              in the URL bar above (e.g.{" "}
              <span className="text-[#222222] dark:text-[#F5F5F7]">
                /users/:userId/orders/:orderId
              </span>
              ) to define root path parameters.
            </p>
          </div>
        ) : (
          <div className="border border-[#E6D2A5]/70 dark:border-[#2C2C2E] rounded-lg overflow-hidden bg-[#FFFFFF] dark:bg-[#141416] shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF3E1]/60 dark:bg-[#1C1C1F] border-b border-[#E6D2A5]/60 dark:border-[#2C2C2E] text-[11px] font-mono font-medium text-[#5C5C5C] dark:text-[#A1A1A6]">
                  <th className="py-2 px-3 font-semibold w-1/3">Key</th>
                  <th className="py-2 px-3 font-semibold w-1/3">Value</th>
                  <th className="py-2 px-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {detectedPathKeys.map((k) => (
                  <tr
                    key={k}
                    className="border-b border-[#FAF3E1] dark:border-[#1F1F23] last:border-b-0 hover:bg-[#FAF3E1]/20 dark:hover:bg-[#1C1C1F]/40 transition-colors"
                  >
                    {/* Key badge */}
                    <td className="p-2 pl-3">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FAF3E1]/70 dark:bg-[#1C1C1F] text-xs font-mono font-semibold text-[#FF6D1F] border border-[#E6D2A5]/50 dark:border-[#2C2C2E]">
                        <span>:{k}</span>
                      </div>
                    </td>

                    {/* Value Input */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={localPathVars[k]?.value || ""}
                        onChange={(e) =>
                          handlePathVarChange(k, "value", e.target.value)
                        }
                        placeholder="Value"
                        className="w-full px-2.5 py-1.5 rounded-md bg-[#FAF3E1]/30 dark:bg-[#0B0B0D] border border-transparent focus:border-[#FF6D1F] focus:bg-[#FFFFFF] dark:focus:bg-[#141416] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none focus:ring-1 focus:ring-[#FF6D1F] transition-all"
                        aria-label={`Value for :${k}`}
                      />
                    </td>

                    {/* Description Input */}
                    <td className="p-2 pr-3">
                      <input
                        type="text"
                        value={localPathVars[k]?.description || ""}
                        onChange={(e) =>
                          handlePathVarChange(k, "description", e.target.value)
                        }
                        placeholder="Description (optional)"
                        className="w-full px-2.5 py-1.5 rounded-md bg-[#FAF3E1]/30 dark:bg-[#0B0B0D] border border-transparent focus:border-[#FF6D1F] focus:bg-[#FFFFFF] dark:focus:bg-[#141416] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none focus:ring-1 focus:ring-[#FF6D1F] transition-all"
                        aria-label={`Description for :${k}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParamsEditor;
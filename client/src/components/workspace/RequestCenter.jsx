import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Send,
  Plus,
  X,
  Code2,
  SlidersHorizontal,
  Shield,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Save,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  clearCurrentRequest,
  setCurrentRequestUrl,
  setCurrentRequestQueryParams,
} from "../../features/request/requestSlice.js";
import requestThunk from "../../features/request/request.Thunk.js";
import RequestHeader from "../requestBuilder/RequestHeader.jsx";

function RequestCenter({ project, request, onNewRequest }) {
  const dispatch = useDispatch();
  const reduxCurrentRequest = useSelector((state) => state.request.currentRequest);
  const selected = request !== undefined ? request : reduxCurrentRequest;

  // Derive local state from selected request
  const [method, setMethod] = useState(selected?.method || "GET");
  const [url, setUrl] = useState(selected?.url || "");
  const [activeReqTab, setActiveReqTab] = useState(
    selected?.body?.type && selected?.body?.type !== "none" ? "body" : "params"
  );
  const [bodyType, setBodyType] = useState(selected?.body?.type || "none");
  const [requestBody, setRequestBody] = useState(selected?.body?.content || "");
  const [headers, setHeaders] = useState(selected?.headers || []);
  const [queryParams, setQueryParams] = useState(selected?.queryParams || []);
  const [auth, setAuth] = useState(
    selected?.auth || {
      type: "none",
      bearer: { token: "" },
      basic: { username: "", password: "" },
      apiKey: { key: "", value: "", location: "header" },
    }
  );

  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Mock response payload for execution preview
  const mockResponse = {
    status: 200,
    statusText: "OK",
    time: "128 ms",
    size: "1.04 KB",
    data: {
      success: true,
      statusCode: 200,
      message: `${selected?.name || "Request"} executed successfully`,
      data: {
        method: method,
        endpoint: url || "/api/v1",
        authType: auth?.type || "none",
      },
    },
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(mockResponse.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!selected?._id || !selected?.collection) return;
    try {
      setIsSaving(true);
      await dispatch(
        requestThunk.updateRequest({
          projectId: project?._id,
          collectionId: selected.collection,
          requestId: selected._id,
          requestDetails: {
            method,
            url,
            body: {
              type: bodyType,
              content: requestBody,
            },
            headers,
            queryParams,
            auth,
          },
        })
      ).unwrap();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to save request changes:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Header / Param handlers
  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "", enabled: true }]);
  };

  const handleUpdateHeader = (index, field, val) => {
    const updated = [...headers];
    updated[index] = { ...updated[index], [field]: val };
    setHeaders(updated);
  };

  const handleDeleteHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleAddParam = () => {
    const updated = [...queryParams, { key: "", value: "", enabled: true }];
    setQueryParams(updated);
    dispatch(setCurrentRequestQueryParams(updated));
  };

  const handleUpdateParam = (index, field, val) => {
    const updated = [...queryParams];
    updated[index] = { ...updated[index], [field]: val };
    setQueryParams(updated);
    dispatch(setCurrentRequestQueryParams(updated));
  };

  const handleDeleteParam = (index) => {
    const updated = queryParams.filter((_, i) => i !== index);
    setQueryParams(updated);
    dispatch(setCurrentRequestQueryParams(updated));
  };

  const handleCloseTab = () => {
    dispatch(clearCurrentRequest());
  };

  // Empty state when no request is selected
  if (!selected) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FAF3E1]/30 dark:bg-[#0B0B0D] select-none h-[calc(100vh-3.5rem)]">
        <div className="max-w-md space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center mx-auto text-[#FF6D1F]">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#222222] dark:text-[#F5F5F7]">
              No Request Selected
            </h2>
            <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] mt-1 leading-relaxed">
              Select a request from the sidebar collections (e.g. Authentication → Login) or create a new request to configure and test endpoints.
            </p>
          </div>
          {onNewRequest && (
            <button
              type="button"
              onClick={onNewRequest}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#FF6D1F] hover:bg-[#E85B0F] text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Request</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-[#FAF3E1]/30 dark:bg-[#0B0B0D] select-none">
      {/* 1. Request Tabs Header */}
      <div className="flex items-center justify-between border-b border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/80 dark:bg-[#141416]/90 px-3 h-10 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-t-md bg-[#FFFFFF] dark:bg-[#0B0B0D] border-t-2 border-t-[#FF6D1F] border-x border-[#E6D2A5] dark:border-[#1F1F23] text-xs font-medium text-[#222222] dark:text-[#F5F5F7] shadow-xs">
            <span
              className={`text-[9px] font-bold font-mono ${
                method === "GET"
                  ? "text-[#059669] dark:text-[#00E599]"
                  : method === "POST"
                  ? "text-[#D97706] dark:text-[#FBBF24]"
                  : method === "DELETE"
                  ? "text-[#DC2626] dark:text-[#F87171]"
                  : "text-[#2563EB] dark:text-[#60A5FA]"
              }`}
            >
              {method}
            </span>
            <span className="truncate max-w-[160px] font-mono text-[11px]">
              {selected?.name || "Request"}
            </span>
            <button
              type="button"
              onClick={handleCloseTab}
              className="text-[#8C8C8C] hover:text-[#222222] dark:hover:text-white p-0.5 rounded cursor-pointer transition-colors"
              title="Close Tab"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={onNewRequest}
            className="p-1.5 text-[#8C8C8C] dark:text-[#6E6E73] hover:text-[#222222] dark:hover:text-[#F5F5F7] hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] rounded transition-colors cursor-pointer"
            title="New Request Tab"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-[11px] text-[#059669] dark:text-[#00E599] font-mono flex items-center gap-1">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-medium text-[#222222] dark:text-[#F5F5F7] transition-colors cursor-pointer disabled:opacity-50"
            title="Save Request Details"
          >
            {isSaving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3 text-[#5C5C5C] dark:text-[#A1A1A6]" />
            )}
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* 2. Main Request & Response Split Area */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Request Header Bar (Method, URL, Send) */}
        <RequestHeader
          method={method}
          url={url}
          onMethodChange={(newMethod) => {
            setMethod(newMethod);
          }}
          onUrlChange={(newUrl) => {
            setUrl(newUrl);
          }}
          onSend={handleSave}
          isSending={isSaving}
        />

        {/* Request Tabs & Body Editor */}
        <div className="rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-xs flex flex-col">
          {/* Sub Tab Bar */}
          <div className="flex items-center gap-1 px-3 border-b border-[#FAF3E1] dark:border-[#1F1F23] text-xs font-medium overflow-x-auto">
            {[
              {
                id: "params",
                label: `Params ${queryParams.length > 0 ? `(${queryParams.length})` : ""}`,
                icon: SlidersHorizontal,
              },
              {
                id: "headers",
                label: `Headers ${headers.length > 0 ? `(${headers.length})` : ""}`,
                icon: FileText,
              },
              {
                id: "body",
                label: `Body (${bodyType})`,
                icon: Code2,
              },
              {
                id: "auth",
                label: `Auth (${auth?.type || "none"})`,
                icon: Shield,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveReqTab(tab.id)}
                  className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 text-xs transition-colors cursor-pointer ${
                    activeReqTab === tab.id
                      ? "border-[#FF6D1F] text-[#FF6D1F] dark:text-white font-semibold"
                      : "border-transparent text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Request Sub-Tab Content */}
          <div className="p-3">
            {/* PARAMS TAB */}
            {activeReqTab === "params" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                    Query Parameters
                  </span>
                  <button
                    type="button"
                    onClick={handleAddParam}
                    className="inline-flex items-center gap-1 text-[11px] text-[#FF6D1F] hover:underline font-medium cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Parameter</span>
                  </button>
                </div>

                {queryParams.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                    No query parameters configured.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {queryParams.map((param, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={param.enabled ?? true}
                          onChange={(e) =>
                            handleUpdateParam(idx, "enabled", e.target.checked)
                          }
                          className="rounded border-[#E6D2A5] text-[#FF6D1F] focus:ring-[#FF6D1F] cursor-pointer"
                        />
                        <input
                          type="text"
                          placeholder="Key"
                          value={param.key || ""}
                          onChange={(e) =>
                            handleUpdateParam(idx, "key", e.target.value)
                          }
                          className="flex-1 px-2.5 py-1.5 rounded-md bg-[#FAF3E1]/40 dark:bg-[#0B0B0D] border border-[#E6D2A5]/60 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:border-[#FF6D1F]"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={param.value || ""}
                          onChange={(e) =>
                            handleUpdateParam(idx, "value", e.target.value)
                          }
                          className="flex-1 px-2.5 py-1.5 rounded-md bg-[#FAF3E1]/40 dark:bg-[#0B0B0D] border border-[#E6D2A5]/60 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:border-[#FF6D1F]"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteParam(idx)}
                          className="p-1 text-[#8C8C8C] hover:text-[#DC2626] rounded transition-colors cursor-pointer"
                          title="Remove Parameter"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* HEADERS TAB */}
            {activeReqTab === "headers" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                    Headers
                  </span>
                  <button
                    type="button"
                    onClick={handleAddHeader}
                    className="inline-flex items-center gap-1 text-[11px] text-[#FF6D1F] hover:underline font-medium cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Header</span>
                  </button>
                </div>

                {headers.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                    No custom headers configured.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {headers.map((hdr, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={hdr.enabled ?? true}
                          onChange={(e) =>
                            handleUpdateHeader(idx, "enabled", e.target.checked)
                          }
                          className="rounded border-[#E6D2A5] text-[#FF6D1F] focus:ring-[#FF6D1F] cursor-pointer"
                        />
                        <input
                          type="text"
                          placeholder="Header Key (e.g. Content-Type)"
                          value={hdr.key || ""}
                          onChange={(e) =>
                            handleUpdateHeader(idx, "key", e.target.value)
                          }
                          className="flex-1 px-2.5 py-1.5 rounded-md bg-[#FAF3E1]/40 dark:bg-[#0B0B0D] border border-[#E6D2A5]/60 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:border-[#FF6D1F]"
                        />
                        <input
                          type="text"
                          placeholder="Header Value (e.g. application/json)"
                          value={hdr.value || ""}
                          onChange={(e) =>
                            handleUpdateHeader(idx, "value", e.target.value)
                          }
                          className="flex-1 px-2.5 py-1.5 rounded-md bg-[#FAF3E1]/40 dark:bg-[#0B0B0D] border border-[#E6D2A5]/60 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:border-[#FF6D1F]"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteHeader(idx)}
                          className="p-1 text-[#8C8C8C] hover:text-[#DC2626] rounded transition-colors cursor-pointer"
                          title="Remove Header"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BODY TAB */}
            {activeReqTab === "body" && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                    Body Type:
                  </span>
                  {["none", "json", "text", "form-data", "urlencoded"].map((t) => (
                    <label
                      key={t}
                      className="inline-flex items-center gap-1 cursor-pointer font-mono text-xs"
                    >
                      <input
                        type="radio"
                        name="bodyType"
                        value={t}
                        checked={bodyType === t}
                        onChange={(e) => setBodyType(e.target.value)}
                        className="text-[#FF6D1F] focus:ring-[#FF6D1F]"
                      />
                      <span
                        className={
                          bodyType === t
                            ? "text-[#FF6D1F] font-bold"
                            : "text-[#5C5C5C] dark:text-[#A1A1A6]"
                        }
                      >
                        {t}
                      </span>
                    </label>
                  ))}
                </div>

                {bodyType !== "none" ? (
                  <textarea
                    rows={6}
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    placeholder={
                      bodyType === "json"
                        ? '{\n  "key": "value"\n}'
                        : "Enter request payload..."
                    }
                    className="w-full p-3 rounded-md bg-[#FAF3E1]/40 dark:bg-[#0B0B0D] border border-[#E6D2A5]/60 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:border-[#FF6D1F] transition-colors resize-none leading-relaxed"
                  />
                ) : (
                  <div className="p-6 text-center text-xs text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                    This request does not have a body.
                  </div>
                )}
              </div>
            )}

            {/* AUTH TAB */}
            {activeReqTab === "auth" && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                    Auth Type:
                  </span>
                  {["none", "bearer", "basic", "api-key"].map((t) => (
                    <label
                      key={t}
                      className="inline-flex items-center gap-1 cursor-pointer font-mono text-xs"
                    >
                      <input
                        type="radio"
                        name="authType"
                        value={t}
                        checked={(auth?.type || "none") === t}
                        onChange={(e) =>
                          setAuth({ ...auth, type: e.target.value })
                        }
                        className="text-[#FF6D1F] focus:ring-[#FF6D1F]"
                      />
                      <span
                        className={
                          (auth?.type || "none") === t
                            ? "text-[#FF6D1F] font-bold"
                            : "text-[#5C5C5C] dark:text-[#A1A1A6]"
                        }
                      >
                        {t}
                      </span>
                    </label>
                  ))}
                </div>

                {auth?.type === "bearer" && (
                  <div className="space-y-1.5 max-w-lg">
                    <label className="block text-xs font-medium text-[#222222] dark:text-[#F5F5F7]">
                      Bearer Token
                    </label>
                    <input
                      type="text"
                      placeholder="eyJhbGciOi..."
                      value={auth.bearer?.token || ""}
                      onChange={(e) =>
                        setAuth({
                          ...auth,
                          bearer: { ...auth.bearer, token: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-md bg-[#FAF3E1]/40 dark:bg-[#0B0B0D] border border-[#E6D2A5]/60 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:border-[#FF6D1F]"
                    />
                  </div>
                )}

                {auth?.type === "basic" && (
                  <div className="space-y-2 max-w-lg">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-[#222222] dark:text-[#F5F5F7]">
                        Username
                      </label>
                      <input
                        type="text"
                        placeholder="username"
                        value={auth.basic?.username || ""}
                        onChange={(e) =>
                          setAuth({
                            ...auth,
                            basic: { ...auth.basic, username: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-md bg-[#FAF3E1]/40 dark:bg-[#0B0B0D] border border-[#E6D2A5]/60 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:border-[#FF6D1F]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-[#222222] dark:text-[#F5F5F7]">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={auth.basic?.password || ""}
                        onChange={(e) =>
                          setAuth({
                            ...auth,
                            basic: { ...auth.basic, password: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-md bg-[#FAF3E1]/40 dark:bg-[#0B0B0D] border border-[#E6D2A5]/60 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:border-[#FF6D1F]"
                      />
                    </div>
                  </div>
                )}

                {auth?.type === "api-key" && (
                  <div className="space-y-2 max-w-lg">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-[#222222] dark:text-[#F5F5F7]">
                        Key
                      </label>
                      <input
                        type="text"
                        placeholder="X-API-Key"
                        value={auth.apiKey?.key || ""}
                        onChange={(e) =>
                          setAuth({
                            ...auth,
                            apiKey: { ...auth.apiKey, key: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-md bg-[#FAF3E1]/40 dark:bg-[#0B0B0D] border border-[#E6D2A5]/60 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:border-[#FF6D1F]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-[#222222] dark:text-[#F5F5F7]">
                        Value
                      </label>
                      <input
                        type="text"
                        placeholder="api_key_secret_value"
                        value={auth.apiKey?.value || ""}
                        onChange={(e) =>
                          setAuth({
                            ...auth,
                            apiKey: { ...auth.apiKey, value: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-md bg-[#FAF3E1]/40 dark:bg-[#0B0B0D] border border-[#E6D2A5]/60 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:border-[#FF6D1F]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-[#222222] dark:text-[#F5F5F7]">
                        Add To
                      </label>
                      <select
                        value={auth.apiKey?.location || "header"}
                        onChange={(e) =>
                          setAuth({
                            ...auth,
                            apiKey: {
                              ...auth.apiKey,
                              location: e.target.value,
                            },
                          })
                        }
                        className="px-3 py-2 rounded-md bg-[#FAF3E1]/40 dark:bg-[#0B0B0D] border border-[#E6D2A5]/60 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:border-[#FF6D1F] cursor-pointer"
                      >
                        <option value="header">Header</option>
                        <option value="query">Query Params</option>
                      </select>
                    </div>
                  </div>
                )}

                {(!auth?.type || auth?.type === "none") && (
                  <div className="p-4 text-center text-xs text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                    This request does not use authorization.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 3. Response Panel */}
        <div className="rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-xs flex flex-col flex-1 min-h-[240px]">
          {/* Response Status Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#FAF3E1] dark:border-[#1F1F23]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
                Response
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#ECFDF5] dark:bg-[#062417] border border-[#A7F3D0] dark:border-[#104D30] text-[#059669] dark:text-[#00E599] text-[10px] font-mono font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>200 OK</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                <Clock className="w-3 h-3" />
                <span>{mockResponse.time}</span>
              </div>
              <span className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                {mockResponse.size}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyResponse}
              className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F] text-[11px] font-mono text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[#FF6D1F]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Formatted JSON Response Window */}
          <div className="p-3 flex-1 overflow-auto bg-[#FAF3E1]/20 dark:bg-[#0B0B0D]/50 rounded-b-lg">
            <pre className="text-xs font-mono text-[#222222] dark:text-[#F5F5F7] leading-relaxed overflow-x-auto p-2">
              {JSON.stringify(mockResponse.data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestCenter;

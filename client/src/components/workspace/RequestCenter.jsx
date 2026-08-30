import { useState, useMemo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Send,
  Plus,
  X,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Save,
  Loader2,
} from "lucide-react";
import {
  clearCurrentRequest,
  setCurrentRequestUrl,
  setCurrentRequestQueryParams,
  setCurrentRequestAuth,
  clearExecutionResponse,
} from "../../features/request/requestSlice.js";
import requestThunk from "../../features/request/request.Thunk.js";
import RequestHeader from "../requestBuilder/RequestHeader.jsx";
import RequestTabs from "../requestBuilder/RequestTabs.jsx";
import ParamsEditor from "../requestBuilder/ParamsEditor.jsx";
import HeadersEditor from "../requestBuilder/HeadersEditor.jsx";
import BodyEditor from "../requestBuilder/BodyEditor.jsx";
import AuthEditor from "../requestBuilder/AuthEditor.jsx";
import ResponseViewer from "../response/ResponseViewer.jsx";
import {
  buildUrlWithQueryParams,
  parseQueryParamsFromUrl,
  combineBaseUrlAndPath,
  extractEndpointPath,
} from "../../utils/urlUtils.js";

function RequestCenter({ project, request, onNewRequest }) {
  const dispatch = useDispatch();
  const reduxCurrentRequest = useSelector((state) => state.request.currentRequest);
  const selected = request !== undefined ? request : reduxCurrentRequest;

  // Lookup target collection to retrieve its baseUrl
  const collections = useSelector((state) => state.collection.collections || []);
  const requestCollection = collections.find(
    (c) => String(c._id) === String(selected?.collection)
  );
  // Collection baseUrl takes priority; falls back to project baseUrl
  const effectiveBaseUrl = (requestCollection?.baseUrl || project?.baseUrl || "").trim();

  // Derive local state from selected request with live query param sync
  const initialParams = selected?.queryParams || [];
  const rawUrl = selected?.url || "";
  const initialEndpoint = effectiveBaseUrl
    ? extractEndpointPath(rawUrl, effectiveBaseUrl)
    : rawUrl;
  const initialUrl =
    initialParams.length > 0 && !initialEndpoint.includes("?")
      ? buildUrlWithQueryParams(initialEndpoint, initialParams)
      : initialEndpoint;

  const [method, setMethod] = useState(selected?.method || "GET");
  const [url, setUrl] = useState(initialUrl);
  const [activeReqTab, setActiveReqTab] = useState(
    selected?.body?.type && selected?.body?.type !== "none" ? "body" : "params"
  );
  const [bodyType, setBodyType] = useState(selected?.body?.type || "none");
  const [requestBody, setRequestBody] = useState(selected?.body?.content || "");
  const [headers, setHeaders] = useState(selected?.headers || []);
  const [queryParams, setQueryParams] = useState(
    initialEndpoint.includes("?")
      ? parseQueryParamsFromUrl(initialEndpoint, initialParams)
      : initialParams
  );
  const [auth, setAuth] = useState(
    selected?.auth || {
      type: "none",
      bearer: { token: "" },
      basic: { username: "", password: "" },
      apiKey: { key: "", value: "", location: "header" },
    }
  );

  // Live two-way sync: URL bar input -> Query Params table
  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    dispatch(setCurrentRequestUrl(newUrl));

    const parsedParams = parseQueryParamsFromUrl(newUrl, queryParams);
    setQueryParams(parsedParams);
    dispatch(setCurrentRequestQueryParams(parsedParams));
  };

  // Live two-way sync: Query Params table -> URL bar input
  const handleQueryParamsChange = (updatedParams) => {
    setQueryParams(updatedParams);
    dispatch(setCurrentRequestQueryParams(updatedParams));

    const nextUrl = buildUrlWithQueryParams(url, updatedParams);
    setUrl(nextUrl);
    dispatch(setCurrentRequestUrl(nextUrl));
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Read real execution state from Redux
  const execution = useSelector((state) => state.request.execution) || {
    loading: false,
    error: null,
    response: null,
  };
  const isExecuting = execution.loading;
  const executionResponse = execution.response;
  const executionError = execution.error;

  const combinedUrl = combineBaseUrlAndPath(effectiveBaseUrl, url);

  // Compute dirty state by comparing current UI state with original selected request
  const isDirty = useMemo(() => {
    if (!selected) return false;
    if (method !== (selected.method || "GET")) return true;
    if (url !== (initialUrl || "")) return true;
    if (bodyType !== (selected.body?.type || "none")) return true;
    if (requestBody !== (selected.body?.content || "")) return true;

    // Check queryParams
    const originalParams = selected.queryParams || [];
    if (JSON.stringify(queryParams) !== JSON.stringify(originalParams)) return true;

    // Check headers
    const originalHeaders = selected.headers || [];
    if (JSON.stringify(headers) !== JSON.stringify(originalHeaders)) return true;

    // Check auth
    const originalAuth = selected.auth || {
      type: "none",
      bearer: { token: "" },
      basic: { username: "", password: "" },
      apiKey: { key: "", value: "", location: "header" },
    };
    if (JSON.stringify(auth) !== JSON.stringify(originalAuth)) return true;

    return false;
  }, [selected, method, url, initialUrl, bodyType, requestBody, queryParams, headers, auth]);

  const handleSave = useCallback(async () => {
    if (!selected?._id || !selected?.collection) return;
    const colId = selected.collection?._id || selected.collection;
    try {
      setIsSaving(true);
      await dispatch(
        requestThunk.updateRequest({
          projectId: project?._id,
          collectionId: colId,
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
  }, [selected, project, dispatch, method, url, bodyType, requestBody, headers, queryParams, auth]);

  const [layoutMode, setLayoutMode] = useState(() => {
    return localStorage.getItem("apipilot_request_layout") || "stacked";
  });

  const handleToggleLayout = (mode) => {
    setLayoutMode(mode);
    localStorage.setItem("apipilot_request_layout", mode);
  };

  // Execute request against server
  const handleSend = useCallback(async () => {
    if (!selected?._id || !selected?.collection || isExecuting) return;

    // Persist any unsaved builder changes first so execution uses the latest values
    if (isDirty) {
      await handleSave();
    }

    const colId = selected.collection?._id || selected.collection;

    dispatch(
      requestThunk.executeRequest({
        projectId: project?._id,
        collectionId: colId,
        requestId: selected._id,
      })
    );
  }, [selected, isExecuting, isDirty, handleSave, project, dispatch]);

  // Keyboard shortcut: Ctrl+S / Cmd+S to save, Ctrl+Enter / Cmd+Enter to send
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, handleSend]);

  const handleCloseTab = () => {
    dispatch(clearExecutionResponse());
    dispatch(clearCurrentRequest());
  };

  // Empty state when no request is selected
  if (!selected) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FAF3E1]/30 dark:bg-[#0B0B0D] select-none h-[calc(100vh-3.5rem)]">
        <div className="max-w-md space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FAF3E1] to-[#F5E7C6] dark:from-[#1C1C1F] dark:to-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center mx-auto text-[#FF6D1F] shadow-sm">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#222222] dark:text-[#F5F5F7]">
              No Request Selected
            </h2>
            <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] mt-1.5 leading-relaxed">
              Select a request from the sidebar collections or create a new request to configure headers, parameters, and execute endpoints.
            </p>
          </div>
          {onNewRequest && (
            <button
              type="button"
              onClick={onNewRequest}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF6D1F] hover:bg-[#E85B0F] active:scale-[0.98] text-white text-xs font-semibold transition-all shadow-sm hover:shadow cursor-pointer"
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
      {/* 1. Request Tabs & Action Header */}
      <div className="flex items-center justify-between border-b border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/80 dark:bg-[#141416]/90 px-3 h-10 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          {/* Active Request Tab */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-t-lg bg-[#FFFFFF] dark:bg-[#0B0B0D] border-t-2 border-t-[#FF6D1F] border-x border-[#E6D2A5] dark:border-[#1F1F23] text-xs font-medium text-[#222222] dark:text-[#F5F5F7] shadow-xs">
            <span
              className={`text-[9px] font-bold font-mono px-1 py-0.2 rounded ${
                method === "GET"
                  ? "text-[#059669] dark:text-[#00E599] bg-[#ECFDF5] dark:bg-[#062417]"
                  : method === "POST"
                  ? "text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#201806]"
                  : method === "DELETE"
                  ? "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D]"
                  : "text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#0A1B36]"
              }`}
            >
              {method}
            </span>
            <span className="truncate max-w-[160px] font-mono text-[11px] font-semibold">
              {selected?.name || "Request"}
            </span>
            {isDirty && (
              <span
                className="w-2 h-2 rounded-full bg-[#FF6D1F] inline-block shrink-0 animate-pulse"
                title="Unsaved changes (Ctrl+S)"
              />
            )}
            <button
              type="button"
              onClick={handleCloseTab}
              className="text-[#8C8C8C] hover:text-[#222222] dark:hover:text-white p-0.5 rounded cursor-pointer transition-colors ml-1"
              title="Close Tab"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={onNewRequest}
            className="p-1.5 text-[#8C8C8C] dark:text-[#6E6E73] hover:text-[#222222] dark:hover:text-[#F5F5F7] hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] rounded transition-colors cursor-pointer"
            title="Create New Request"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Header Toolbar: Layout Mode + Save State + Save Action */}
        <div className="flex items-center gap-2">
          {/* Layout Mode Switcher */}
          <div className="flex items-center rounded-lg bg-[#FAF3E1] dark:bg-[#1C1C1F] p-0.5 border border-[#E6D2A5]/70 dark:border-[#2C2C2E]">
            <button
              type="button"
              onClick={() => handleToggleLayout("stacked")}
              className={`p-1 rounded transition-colors cursor-pointer ${
                layoutMode === "stacked"
                  ? "bg-white dark:bg-[#2C2C2E] text-[#FF6D1F] shadow-xs"
                  : "text-[#8C8C8C] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
              }`}
              title="Stacked Layout (Top / Bottom)"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 12h18" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleToggleLayout("side-by-side")}
              className={`p-1 rounded transition-colors cursor-pointer ${
                layoutMode === "side-by-side"
                  ? "bg-white dark:bg-[#2C2C2E] text-[#FF6D1F] shadow-xs"
                  : "text-[#8C8C8C] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
              }`}
              title="Side-by-Side Layout (Left / Right)"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M12 3v18" />
              </svg>
            </button>
          </div>

          {/* Save Status Badge */}
          {saveSuccess ? (
            <span className="text-[11px] text-[#059669] dark:text-[#00E599] font-mono flex items-center gap-1">
              <Check className="w-3 h-3" /> Saved
            </span>
          ) : isDirty ? (
            <span className="text-[11px] text-[#FF6D1F] font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6D1F]" /> Unsaved
            </span>
          ) : (
            <span className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
              Saved
            </span>
          )}

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer disabled:opacity-50 ${
              isDirty
                ? "bg-[#FF6D1F] hover:bg-[#E85B0F] text-white border border-[#FF6D1F] shadow-xs"
                : "bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[#222222] dark:text-[#F5F5F7]"
            }`}
            title={isDirty ? "Save changes (Ctrl+S)" : "Request is saved"}
          >
            {isSaving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save
                className={`w-3 h-3 ${
                  isDirty ? "text-white" : "text-[#5C5C5C] dark:text-[#A1A1A6]"
                }`}
              />
            )}
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* 2. Main Request & Response Workspace */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-3 sm:p-4 gap-3">
        {/* Pinned Request Header Bar (Method, URL, Send) */}
        <div className="shrink-0">
          <RequestHeader
            method={method}
            url={url}
            baseUrl={effectiveBaseUrl}
            onMethodChange={(newMethod) => {
              setMethod(newMethod);
            }}
            onUrlChange={handleUrlChange}
            onSend={handleSend}
            isSending={isExecuting}
          />
        </div>

        {/* Dynamic Split Layout (Stacked vs Side-by-Side) */}
        <div
          className={`flex-1 min-h-0 flex gap-3 overflow-hidden ${
            layoutMode === "side-by-side"
              ? "flex-col lg:flex-row"
              : "flex-col"
          }`}
        >
          {/* Request Configuration Card */}
          <div className="flex-1 min-h-[160px] min-w-0 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-xs flex flex-col overflow-hidden">
            {/* Sub Tab Bar */}
            <div className="shrink-0">
              <RequestTabs
                activeTab={activeReqTab}
                onTabChange={setActiveReqTab}
                counts={{
                  params: queryParams.length,
                  headers: headers.length,
                  bodyType: bodyType !== "none" ? bodyType : null,
                  authType: auth?.type !== "none" ? auth.type : null,
                }}
              />
            </div>

            {/* Request Sub-Tab Content - scrollable independently */}
            <div className="p-3.5 overflow-y-auto flex-1 min-h-0">
              {/* PARAMS TAB */}
              {activeReqTab === "params" && (
                <ParamsEditor
                  url={url}
                  params={queryParams}
                  onChange={handleQueryParamsChange}
                />
              )}

              {/* HEADERS TAB */}
              {activeReqTab === "headers" && (
                <HeadersEditor
                  headers={headers}
                  onChange={(updated) => {
                    setHeaders(updated);
                  }}
                />
              )}

              {/* BODY TAB */}
              {activeReqTab === "body" && (
                <BodyEditor
                  bodyType={bodyType}
                  bodyContent={requestBody}
                  onBodyTypeChange={setBodyType}
                  onBodyContentChange={setRequestBody}
                />
              )}

              {/* AUTH TAB */}
              {activeReqTab === "auth" && (
                <AuthEditor
                  auth={auth}
                  onChange={(newAuth) => {
                    setAuth(newAuth);
                    dispatch(setCurrentRequestAuth(newAuth));
                  }}
                />
              )}
            </div>
          </div>

          {/* Response Viewer Component - scrollable independently */}
          <div className="flex-1 min-h-[180px] min-w-0 flex flex-col overflow-hidden">
            <ResponseViewer
              response={executionResponse}
              loading={isExecuting}
              error={executionError}
              endpoint={combinedUrl || url}
              onClearResponse={() => dispatch(clearExecutionResponse())}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestCenter;

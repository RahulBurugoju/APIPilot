import { useState, useMemo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Send,
  Plus,
  X,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Save,
  Loader2,
} from "lucide-react";
import {
  clearCurrentRequest,
  setCurrentRequestUrl,
  setCurrentRequestQueryParams,
  setCurrentRequestAuth,
} from "../../features/request/requestSlice.js";
import requestThunk from "../../features/request/request.Thunk.js";
import RequestHeader from "../requestBuilder/RequestHeader.jsx";
import RequestTabs from "../requestBuilder/RequestTabs.jsx";
import ParamsEditor from "../requestBuilder/ParamsEditor.jsx";
import HeadersEditor from "../requestBuilder/HeadersEditor.jsx";
import BodyEditor from "../requestBuilder/BodyEditor.jsx";
import AuthEditor from "../requestBuilder/AuthEditor.jsx";
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

  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const combinedUrl = combineBaseUrlAndPath(effectiveBaseUrl, url);

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
        endpoint: combinedUrl || url || "/api/v1",
        authType: auth?.type || "none",
      },
    },
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(mockResponse.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
  }, [selected, project, dispatch, method, url, bodyType, requestBody, headers, queryParams, auth]);

  // Keyboard shortcut: Ctrl+S / Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

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
            {isDirty && (
              <span
                className="w-2 h-2 rounded-full bg-[#FF6D1F] inline-block shrink-0 animate-pulse"
                title="Unsaved changes"
              />
            )}
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
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer disabled:opacity-50 ${
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

      {/* 2. Main Request & Response Split Area */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Request Header Bar (Method, URL, Send) */}
        <RequestHeader
          method={method}
          url={url}
          baseUrl={effectiveBaseUrl}
          onMethodChange={(newMethod) => {
            setMethod(newMethod);
          }}
          onUrlChange={handleUrlChange}
          onSend={handleSave}
          isSending={isSaving}
        />

        {/* Request Tabs & Body Editor */}
        <div className="rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-xs flex flex-col">
          {/* Sub Tab Bar */}
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

          {/* Request Sub-Tab Content */}
          <div className="p-3">
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

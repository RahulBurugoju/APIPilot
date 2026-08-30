import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DEMO_REQUESTS } from "../utils/demoWorkspaceData.js";
import guestService from "../services/guest.service.js";
import RequestHeader from "../components/requestBuilder/RequestHeader.jsx";
import RequestTabs from "../components/requestBuilder/RequestTabs.jsx";
import ParamsEditor from "../components/requestBuilder/ParamsEditor.jsx";
import HeadersEditor from "../components/requestBuilder/HeadersEditor.jsx";
import BodyEditor from "../components/requestBuilder/BodyEditor.jsx";
import AuthEditor from "../components/requestBuilder/AuthEditor.jsx";
import ResponseViewer from "../components/response/ResponseViewer.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import FeatureGateModal from "../components/common/FeatureGateModal.jsx";
import {
  Terminal,
  Play,
  Cloud,
  Layers,
  ArrowRight,
  Sparkles,
  Lock,
  Plus,
  ChevronRight,
  Shield,
  FolderOpen,
} from "lucide-react";

export default function PlaygroundPage() {
  const [requests, setRequests] = useState(DEMO_REQUESTS);
  const [currentRequest, setCurrentRequest] = useState(DEMO_REQUESTS[0]);
  const [activeTab, setActiveTab] = useState("params");
  const [isExecuting, setIsExecuting] = useState(false);
  const [response, setResponse] = useState(null);
  const [executionError, setExecutionError] = useState(null);

  // Feature Gate Modal state
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);
  const [gatedFeatureInfo, setGatedFeatureInfo] = useState({
    name: "Cloud Persistence",
    description: "Save and sync your projects and endpoints.",
  });

  const triggerFeatureGate = (name, description) => {
    setGatedFeatureInfo({ name, description });
    setIsGateModalOpen(true);
  };

  // Execution Handler for Guest Proxy
  const handleExecute = async () => {
    if (!currentRequest || isExecuting) return;
    setIsExecuting(true);
    setExecutionError(null);

    try {
      const result = await guestService.executeGuestRequest({
        method: currentRequest.method || "GET",
        url: currentRequest.url,
        headers: currentRequest.headers || [],
        queryParams: currentRequest.queryParams || [],
        body: currentRequest.body || {},
        auth: currentRequest.auth || null,
      });
      setResponse(result);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Execution failed";
      setExecutionError(msg);
      setResponse({
        status: 0,
        statusText: "NETWORK_ERROR",
        headers: {},
        data: { error: msg },
        duration: 0,
        size: 0,
        contentType: "application/json",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Handlers for Request Builder edits
  const handleMethodChange = (newMethod) => {
    setCurrentRequest((prev) => ({ ...prev, method: newMethod }));
  };

  const handleUrlChange = (newUrl) => {
    setCurrentRequest((prev) => ({ ...prev, url: newUrl }));
  };

  const handleQueryParamsChange = (newParams) => {
    setCurrentRequest((prev) => ({ ...prev, queryParams: newParams }));
  };

  const handleHeadersChange = (newHeaders) => {
    setCurrentRequest((prev) => ({ ...prev, headers: newHeaders }));
  };

  const handleBodyChange = (newBody) => {
    setCurrentRequest((prev) => ({ ...prev, body: newBody }));
  };

  const handleAuthChange = (newAuth) => {
    setCurrentRequest((prev) => ({ ...prev, auth: newAuth }));
  };

  return (
    <div className="h-screen bg-[#FAF3E1] dark:bg-[#0B0B0D] text-[#222222] dark:text-[#F5F5F7] font-sans antialiased transition-colors duration-200 flex flex-col overflow-hidden">
      {/* ---------------------------------------------------- */}
      {/* GUEST BANNER                                         */}
      {/* ---------------------------------------------------- */}
      <div className="bg-[#FF6D1F] text-white px-4 py-1.5 text-xs flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-medium">
            <strong>Guest Sandbox Mode</strong> — Explore & test live API endpoints in real-time.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="px-2.5 py-0.5 rounded bg-white text-[#FF6D1F] font-bold hover:bg-[#FAF3E1] transition-colors text-[11px] flex items-center gap-1"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TOP BAR                                              */}
      {/* ---------------------------------------------------- */}
      <header className="border-b border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/95 dark:bg-[#141416]/90 backdrop-blur-md transition-colors duration-200 shrink-0 h-13">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#FF6D1F] text-white flex items-center justify-center font-bold text-xs">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-bold tracking-tight text-[#222222] dark:text-[#F5F5F7]">
                APIpilot <span className="text-xs font-normal text-[#8C8C8C]">/ Playground</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() =>
                triggerFeatureGate("Save Project to Cloud", "Save this workspace and all requests to your account.")
              }
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-semibold text-[#5C5C5C] dark:text-[#A1A1A6] transition-colors cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5 text-[#FF6D1F]" />
              <span>Save to Cloud</span>
            </button>

            <ThemeToggle />

            <div className="h-4 w-px bg-[#E6D2A5] dark:bg-[#2C2C2E]" />

            <Link
              to="/login"
              className="text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] px-2 py-1"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="text-xs font-semibold text-white bg-[#FF6D1F] hover:bg-[#E85B0F] px-3.5 py-1.5 rounded-md transition-colors shadow-xs"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* MAIN WORKSPACE VIEW (Sidebar + Request/Response)      */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Demo Endpoints */}
        <aside className="w-64 border-r border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/40 dark:bg-[#101012] flex flex-col shrink-0 overflow-hidden">
          <div className="p-3 border-b border-[#E6D2A5] dark:border-[#1F1F23] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-3.5 h-3.5 text-[#FF6D1F]" />
              <span className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
                Demo Collection
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] font-mono text-[#8C8C8C]">
              4 endpoints
            </span>
          </div>

          {/* Request List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {requests.map((req) => {
              const isSelected = currentRequest?._id === req._id;
              const methodColor =
                req.method === "GET"
                  ? "text-[#059669] dark:text-[#00E599]"
                  : req.method === "POST"
                  ? "text-[#D97706] dark:text-[#FBBF24]"
                  : "text-[#2563EB]";

              return (
                <button
                  key={req._id}
                  type="button"
                  onClick={() => {
                    setCurrentRequest(req);
                    setResponse(null);
                    setExecutionError(null);
                  }}
                  className={`w-full text-left p-2 rounded-md text-xs transition-colors flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? "bg-[#FFFFFF] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-xs"
                      : "hover:bg-[#F5E7C6]/60 dark:hover:bg-[#141416] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`font-mono font-bold text-[10px] uppercase shrink-0 ${methodColor}`}>
                      {req.method}
                    </span>
                    <span className="truncate font-medium text-[#222222] dark:text-[#F5F5F7]">
                      {req.name}
                    </span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-[#8C8C8C] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}

            {/* Gated Add Request Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  triggerFeatureGate("Custom Collections", "Create custom requests, sub-folders, and full API suites.")
                }
                className="w-full p-2 rounded-md border border-dashed border-[#E6D2A5] dark:border-[#2C2C2E] hover:border-[#FF6D1F] text-xs font-semibold text-[#8C8C8C] hover:text-[#FF6D1F] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Request</span>
                <Lock className="w-3 h-3 ml-1 opacity-70" />
              </button>
            </div>
          </div>

          {/* Upgrade Mini Footer */}
          <div className="p-3 border-t border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FFFFFF] dark:bg-[#141416] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
              <Shield className="w-3.5 h-3.5 text-[#FF6D1F]" />
              <span>Full Access Free</span>
            </div>
            <p className="text-[11px] text-[#5C5C5C] dark:text-[#A1A1A6]">
              Sign up in 30 seconds to save cloud projects & environment variables.
            </p>
            <Link
              to="/register"
              className="block w-full text-center py-1.5 rounded-md bg-[#FAF3E1] hover:bg-[#F5E7C6] dark:bg-[#1C1C1F] dark:hover:bg-[#2C2C2E] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-semibold text-[#FF6D1F] transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </aside>

        {/* Right Workspace: Request Center + Response Viewer */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#FAF3E1]/20 dark:bg-[#0B0B0D]">
          {/* Request Header Bar (Method + URL + Send) */}
          <div className="p-4 border-b border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FFFFFF] dark:bg-[#141416] shrink-0">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
                    {currentRequest.name}
                  </h2>
                  <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73]">
                    {currentRequest.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      triggerFeatureGate("Environment Variables", "Manage dynamic environment secrets and API keys.")
                    }
                    className="px-2.5 py-1 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono text-[#5C5C5C] dark:text-[#A1A1A6] flex items-center gap-1.5 hover:border-[#FF6D1F] transition-colors cursor-pointer"
                  >
                    <span>No Environment</span>
                    <Lock className="w-3 h-3 text-[#8C8C8C]" />
                  </button>
                </div>
              </div>

              {/* Input Bar */}
              <div className="flex items-center gap-2">
                <div className="w-28 shrink-0">
                  <select
                    value={currentRequest.method}
                    onChange={(e) => handleMethodChange(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-md bg-[#FAF3E1]/60 dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-bold font-mono text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:border-[#FF6D1F]"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={currentRequest.url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isExecuting) handleExecute();
                    }}
                    placeholder="https://api.example.com/v1/resource"
                    className="w-full h-9 px-3 rounded-md bg-[#FAF3E1]/60 dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6D1F]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleExecute}
                  disabled={isExecuting || !currentRequest.url?.trim()}
                  className="h-9 px-5 rounded-md bg-[#FF6D1F] hover:bg-[#E85B0F] text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isExecuting ? "Executing..." : "Send"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Split Panel: Request Tabs (Top) + Response Viewer (Bottom) */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Request Builder Left/Top */}
            <div className="flex-1 flex flex-col min-h-0 border-b md:border-b-0 md:border-r border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FFFFFF] dark:bg-[#141416] overflow-hidden">
              <RequestTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                paramsCount={currentRequest.queryParams?.filter((p) => p.key?.trim()).length || 0}
                headersCount={currentRequest.headers?.filter((h) => h.key?.trim()).length || 0}
                hasBody={currentRequest.body?.type && currentRequest.body.type !== "none"}
                hasAuth={currentRequest.auth?.type && currentRequest.auth.type !== "none"}
              />

              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === "params" && (
                  <ParamsEditor
                    queryParams={currentRequest.queryParams || []}
                    onChange={handleQueryParamsChange}
                  />
                )}

                {activeTab === "headers" && (
                  <HeadersEditor
                    headers={currentRequest.headers || []}
                    onChange={handleHeadersChange}
                  />
                )}

                {activeTab === "body" && (
                  <BodyEditor
                    body={currentRequest.body || { type: "none", content: "" }}
                    onChange={handleBodyChange}
                  />
                )}

                {activeTab === "auth" && (
                  <AuthEditor
                    auth={currentRequest.auth || { type: "none" }}
                    onChange={handleAuthChange}
                  />
                )}
              </div>
            </div>

            {/* Response Viewer Right/Bottom */}
            <div className="flex-1 flex flex-col min-h-0 bg-[#FAF3E1]/20 dark:bg-[#101012] overflow-hidden">
              <ResponseViewer
                response={response}
                loading={isExecuting}
                error={executionError}
                onRetry={handleExecute}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Feature Gate Prompt Modal */}
      <FeatureGateModal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        featureName={gatedFeatureInfo.name}
        featureDescription={gatedFeatureInfo.description}
      />
    </div>
  );
}

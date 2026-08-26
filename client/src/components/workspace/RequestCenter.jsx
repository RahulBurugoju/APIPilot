import React, { useState } from "react";
import {
  Send,
  Plus,
  X,
  Code2,
  SlidersHorizontal,
  Key,
  Shield,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

function RequestCenter({ project, request, onNewRequest }) {
  const [method, setMethod] = useState(request?.method || "GET");
  const [url, setUrl] = useState(
    request?.path
      ? `${project?.baseUrl || "https://api.example.com"}${request.path}`
      : `${project?.baseUrl || "https://api.example.com/v1"}/auth/login`
  );
  const [activeReqTab, setActiveReqTab] = useState("body");
  const [activeResTab, setActiveResTab] = useState("body");
  const [copied, setCopied] = useState(false);

  // Mock JSON payload
  const [requestBody, setRequestBody] = useState(
    JSON.stringify(
      {
        email: "alex.developer@apipilot.dev",
        password: "SuperSecretPassword123!",
      },
      null,
      2
    )
  );

  // Mock response payload
  const mockResponse = {
    status: 200,
    statusText: "OK",
    time: "142 ms",
    size: "1.28 KB",
    data: {
      success: true,
      statusCode: 200,
      message: "Authentication successful",
      data: {
        user: {
          id: "usr_998124a",
          name: "Alex Developer",
          email: "alex.developer@apipilot.dev",
          role: "workspace_admin",
        },
        accessToken: "eyJh...apipilot_sample_jwt_token",
      },
    },
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(mockResponse.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <span className="truncate max-w-[140px] font-mono text-[11px]">
              {request?.name || "User Login"}
            </span>
            <button
              type="button"
              className="text-[#8C8C8C] hover:text-[#222222] dark:hover:text-white p-0.5 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={onNewRequest}
            className="p-1.5 text-[#8C8C8C] dark:text-[#6E6E73] hover:text-[#222222] dark:hover:text-[#F5F5F7] hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] rounded transition-colors"
            title="New Request Tab"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
          <span>REST Request Center</span>
        </div>
      </div>

      {/* 2. Main Request & Response Split Area */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* URL / Method Bar */}
        <div className="flex items-center gap-2">
          {/* Method Select */}
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono font-bold text-[#FF6D1F] focus:outline-none focus:ring-1 focus:ring-[#FF6D1F] cursor-pointer shrink-0 shadow-xs"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>

          {/* URL Input Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter request URL..."
              className="w-full px-3.5 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none focus:border-[#FF6D1F] focus:ring-1 focus:ring-[#FF6D1F] transition-colors shadow-xs"
            />
          </div>

          {/* Send CTA Button */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-[#FF6D1F] hover:bg-[#E85B0F] text-white text-xs font-medium transition-colors shadow-sm cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>

        {/* Request Tabs & Body Editor Scaffolding */}
        <div className="rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-xs flex flex-col">
          {/* Sub Tab Bar */}
          <div className="flex items-center gap-1 px-3 border-b border-[#FAF3E1] dark:border-[#1F1F23] text-xs font-medium overflow-x-auto">
            {[
              { id: "params", label: "Params", icon: SlidersHorizontal },
              { id: "headers", label: "Headers (3)", icon: FileText },
              { id: "body", label: "Body (JSON)", icon: Code2 },
              { id: "auth", label: "Auth", icon: Shield },
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
            {activeReqTab === "body" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                  <span>RAW JSON</span>
                  <span className="text-[10px] text-[#059669] dark:text-[#00E599]">
                    Valid JSON
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full p-3 rounded-md bg-[#FAF3E1]/40 dark:bg-[#0B0B0D] border border-[#E6D2A5]/60 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:border-[#FF6D1F] transition-colors resize-none leading-relaxed"
                />
              </div>
            )}

            {activeReqTab === "params" && (
              <div className="p-4 text-center text-xs text-[#5C5C5C] dark:text-[#A1A1A6] font-mono">
                Query Parameters: Key-Value Editor coming soon
              </div>
            )}

            {activeReqTab === "headers" && (
              <div className="p-4 text-center text-xs text-[#5C5C5C] dark:text-[#A1A1A6] font-mono">
                Headers: Content-Type: application/json, Accept: application/json
              </div>
            )}

            {activeReqTab === "auth" && (
              <div className="p-4 text-center text-xs text-[#5C5C5C] dark:text-[#A1A1A6] font-mono">
                Authentication: Bearer Token sync enabled
              </div>
            )}
          </div>
        </div>

        {/* 3. Response Panel */}
        <div className="rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-xs flex flex-col flex-1 min-h-[260px]">
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

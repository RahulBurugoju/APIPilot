import { useState } from "react";
import { Shield, Eye, EyeOff, Lock, KeyRound, User } from "lucide-react";

const AUTH_TYPES = [
  { value: "none", label: "No Auth" },
  { value: "bearer", label: "Bearer Token" },
  { value: "basic", label: "Basic Auth" },
  { value: "api-key", label: "API Key" },
];

function AuthEditor({ auth, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  // Normalize auth object with safe defaults matching schema
  const currentAuth = {
    type: auth?.type || "none",
    bearer: { token: auth?.bearer?.token || "" },
    basic: {
      username: auth?.basic?.username || "",
      password: auth?.basic?.password || "",
    },
    apiKey: {
      key: auth?.apiKey?.key || "",
      value: auth?.apiKey?.value || "",
      location: auth?.apiKey?.location || "header",
    },
  };

  const handleTypeChange = (newType) => {
    if (!onChange) return;
    onChange({
      ...currentAuth,
      type: newType,
    });
  };

  const handleBearerChange = (token) => {
    if (!onChange) return;
    onChange({
      ...currentAuth,
      bearer: { token },
    });
  };

  const handleBasicChange = (field, val) => {
    if (!onChange) return;
    onChange({
      ...currentAuth,
      basic: {
        ...currentAuth.basic,
        [field]: val,
      },
    });
  };

  const handleApiKeyChange = (field, val) => {
    if (!onChange) return;
    onChange({
      ...currentAuth,
      apiKey: {
        ...currentAuth.apiKey,
        [field]: val,
      },
    });
  };

  return (
    <div className="space-y-4 w-full max-w-xl">
      {/* Header & Type Selector (Postman-style Radio Buttons) */}
      <div className="space-y-2.5 pb-3 border-b border-[#FAF3E1] dark:border-[#1F1F23]">
        <div>
          <h3 className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
            Authorization
          </h3>
          <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] mt-0.5">
            Configure authentication credentials for this request.
          </p>
        </div>

        <div className="inline-flex items-center rounded-lg bg-[#FAF3E1] dark:bg-[#1C1C1F] p-0.5 border border-[#E6D2A5]/70 dark:border-[#2C2C2E] gap-0.5 flex-wrap">
          {AUTH_TYPES.map((at) => {
            const isSelected = currentAuth.type === at.value;
            return (
              <button
                key={at.value}
                type="button"
                onClick={() => handleTypeChange(at.value)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer select-none ${
                  isSelected
                    ? "bg-[#FFFFFF] dark:bg-[#2C2C2E] text-[#FF6D1F] shadow-xs font-semibold"
                    : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                }`}
              >
                {at.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. No Auth Sub-Panel */}
      {currentAuth.type === "none" && (
        <div className="p-8 text-center rounded-lg border border-dashed border-[#E6D2A5]/70 dark:border-[#2C2C2E] bg-[#FAF3E1]/20 dark:bg-[#141416]/30">
          <Shield className="w-6 h-6 mx-auto text-[#8C8C8C] dark:text-[#6E6E73] mb-2 opacity-60" />
          <p className="text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]">
            This request does not use any authorization
          </p>
          <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] mt-1 font-mono">
            Select an auth type above if this endpoint requires credentials.
          </p>
        </div>
      )}

      {/* 2. Bearer Token Sub-Panel */}
      {currentAuth.type === "bearer" && (
        <div className="space-y-2 rounded-lg p-4 bg-[#FAF3E1]/20 dark:bg-[#141416]/40 border border-[#E6D2A5]/60 dark:border-[#2C2C2E]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
            <KeyRound className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>Bearer</span>
          </div>

          <div className="space-y-1 pt-1">
            <label
              htmlFor="bearer-token-input"
              className="block text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]"
            >
              Token
            </label>
            <input
              id="bearer-token-input"
              type="text"
              value={currentAuth.bearer.token}
              onChange={(e) => handleBearerChange(e.target.value)}
              placeholder="{{accessToken}}"
              className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#0B0B0D] border border-[#E6D2A5]/70 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none focus:ring-1 focus:ring-[#FF6D1F] focus:border-[#FF6D1F] transition-all shadow-2xs"
            />
            <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
              The token will be attached to the Authorization header as Bearer &lt;token&gt;.
            </p>
          </div>
        </div>
      )}

      {/* 3. Basic Auth Sub-Panel */}
      {currentAuth.type === "basic" && (
        <div className="space-y-3 rounded-lg p-4 bg-[#FAF3E1]/20 dark:bg-[#141416]/40 border border-[#E6D2A5]/60 dark:border-[#2C2C2E]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
            <User className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>Basic</span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Username */}
            <div className="space-y-1">
              <label
                htmlFor="basic-username-input"
                className="block text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]"
              >
                Username
              </label>
              <input
                id="basic-username-input"
                type="text"
                value={currentAuth.basic.username}
                onChange={(e) => handleBasicChange("username", e.target.value)}
                placeholder="user"
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#0B0B0D] border border-[#E6D2A5]/70 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none focus:ring-1 focus:ring-[#FF6D1F] focus:border-[#FF6D1F] transition-all shadow-2xs"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label
                htmlFor="basic-password-input"
                className="block text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="basic-password-input"
                  type={showPassword ? "text" : "password"}
                  value={currentAuth.basic.password}
                  onChange={(e) => handleBasicChange("password", e.target.value)}
                  placeholder="********"
                  className="w-full px-3 py-2 pr-9 rounded-md bg-[#FFFFFF] dark:bg-[#0B0B0D] border border-[#E6D2A5]/70 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none focus:ring-1 focus:ring-[#FF6D1F] focus:border-[#FF6D1F] transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8C8C] dark:text-[#6E6E73] hover:text-[#222222] dark:hover:text-[#F5F5F7] cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. API Key Sub-Panel */}
      {currentAuth.type === "api-key" && (
        <div className="space-y-3 rounded-lg p-4 bg-[#FAF3E1]/20 dark:bg-[#141416]/40 border border-[#E6D2A5]/60 dark:border-[#2C2C2E]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
            <Lock className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>API Key</span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Key */}
            <div className="space-y-1">
              <label
                htmlFor="api-key-name-input"
                className="block text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]"
              >
                Key
              </label>
              <input
                id="api-key-name-input"
                type="text"
                value={currentAuth.apiKey.key}
                onChange={(e) => handleApiKeyChange("key", e.target.value)}
                placeholder="X-API-Key"
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#0B0B0D] border border-[#E6D2A5]/70 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none focus:ring-1 focus:ring-[#FF6D1F] focus:border-[#FF6D1F] transition-all shadow-2xs"
              />
            </div>

            {/* Value */}
            <div className="space-y-1">
              <label
                htmlFor="api-key-val-input"
                className="block text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]"
              >
                Value
              </label>
              <input
                id="api-key-val-input"
                type="text"
                value={currentAuth.apiKey.value}
                onChange={(e) => handleApiKeyChange("value", e.target.value)}
                placeholder="{{apiKey}}"
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#0B0B0D] border border-[#E6D2A5]/70 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none focus:ring-1 focus:ring-[#FF6D1F] focus:border-[#FF6D1F] transition-all shadow-2xs"
              />
            </div>

            {/* Add to Location */}
            <div className="space-y-1">
              <label
                htmlFor="api-key-location-select"
                className="block text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]"
              >
                Add to
              </label>
              <select
                id="api-key-location-select"
                value={currentAuth.apiKey.location}
                onChange={(e) => handleApiKeyChange("location", e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#0B0B0D] border border-[#E6D2A5]/70 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-[#FF6D1F] focus:border-[#FF6D1F] cursor-pointer transition-all shadow-2xs"
              >
                <option value="header">Header</option>
                <option value="query">Query Params</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthEditor;

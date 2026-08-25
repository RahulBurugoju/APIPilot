import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Code,
  Shield,
  Layers,
  Terminal,
  Activity,
  Zap,
  Copy,
  Cpu,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F5F5F7] font-sans antialiased selection:bg-[#2C2C2E] selection:text-white">
      {/* ---------------------------------------------------- */}
      {/* NAVIGATION */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-[#0B0B0D]/80 backdrop-blur-md border-b border-[#1F1F23]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#1C1C1F] border border-[#2C2C2E] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-[#F5F5F7]" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-[#F5F5F7]">
              APIpilot
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs text-[#A1A1A6]">
            <a href="#overview" className="hover:text-[#F5F5F7] transition-colors">
              Overview
            </a>
            <a href="#workflow" className="hover:text-[#F5F5F7] transition-colors">
              Workflow
            </a>
            <a href="#features" className="hover:text-[#F5F5F7] transition-colors">
              Features
            </a>
            <a href="#architecture" className="hover:text-[#F5F5F7] transition-colors">
              Security
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs text-[#A1A1A6] hover:text-[#F5F5F7] px-3 py-1.5 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-medium text-[#0B0B0D] bg-[#F5F5F7] hover:bg-white px-3.5 py-1.5 rounded-md transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <section id="overview" className="pt-20 pb-16 px-6 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <p className="text-xs font-mono tracking-wider uppercase text-[#A1A1A6] mb-4">
            Developer Infrastructure
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#F5F5F7] leading-[1.12]">
            The API client engineered for clarity and precision.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#A1A1A6] leading-relaxed max-w-2xl">
            Design, inspect, and test HTTP endpoints in a focused workspace.
            Built with automatic session token rotation, schema validation, and
            contextual intelligence when you need it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#F5F5F7] text-[#0B0B0D] text-xs font-medium hover:bg-white transition-colors"
            >
              Start Free Workspace
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#141416] text-[#A1A1A6] hover:text-[#F5F5F7] border border-[#2C2C2E] text-xs font-medium hover:bg-[#1C1C1F] transition-colors"
            >
              Sign in to Account
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-6 text-xs text-[#6E6E73]">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#A1A1A6]" />
              <span>Zero client installation</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#A1A1A6]" />
              <span>Automatic token rotation</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#A1A1A6]" />
              <span>HTTP/1.1 & HTTP/2 support</span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* HERO WORKSPACE PREVIEW (Realistic Developer Tool UI) */}
        {/* ---------------------------------------------------- */}
        <div className="mt-14 rounded-xl bg-[#141416] border border-[#2C2C2E] overflow-hidden">
          {/* Workspace Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#101012] border-b border-[#1F1F23]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2C2C2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#2C2C2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#2C2C2E]" />
              <span className="ml-3 text-xs font-mono text-[#6E6E73]">
                orders-service / v1 / get-order-by-id
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#A1A1A6] font-mono text-[11px]">
                Environment: <span className="text-[#F5F5F7]">Staging</span>
              </span>
            </div>
          </div>

          {/* Request Address Bar */}
          <div className="p-3 bg-[#141416] border-b border-[#1F1F23] flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#1C1C1F] border border-[#2C2C2E] text-xs font-mono font-medium text-[#00E599]">
              GET
            </span>
            <div className="flex-1 font-mono text-xs text-[#F5F5F7] px-3 py-1 bg-[#0B0B0D] border border-[#1F1F23] rounded-md truncate">
              https://api.apipilot.dev/v1/orders/ord_84910a3
            </div>
            <button className="px-3 py-1 rounded-md bg-[#F5F5F7] text-[#0B0B0D] text-xs font-medium">
              Send
            </button>
          </div>

          {/* Workspace Body: Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#1F1F23]">
            {/* Left: Request Configuration */}
            <div className="lg:col-span-5 p-4 bg-[#101012]">
              <div className="flex items-center gap-4 text-xs text-[#A1A1A6] border-b border-[#1F1F23] pb-2 mb-3">
                <span className="text-[#F5F5F7] font-medium border-b border-[#F5F5F7] pb-2 -mb-2.5">
                  Headers (3)
                </span>
                <span>Params (1)</span>
                <span>Auth (Bearer)</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs text-[#A1A1A6]">
                <div className="flex justify-between py-1 px-2 rounded bg-[#141416]">
                  <span className="text-[#A1A1A6]">Authorization</span>
                  <span className="text-[#6E6E73] truncate max-w-[160px]">
                    Bearer eyJhbGci...
                  </span>
                </div>
                <div className="flex justify-between py-1 px-2 rounded bg-[#141416]">
                  <span className="text-[#A1A1A6]">Content-Type</span>
                  <span className="text-[#6E6E73]">application/json</span>
                </div>
                <div className="flex justify-between py-1 px-2 rounded bg-[#141416]">
                  <span className="text-[#A1A1A6]">X-Environment</span>
                  <span className="text-[#6E6E73]">staging</span>
                </div>
              </div>
            </div>

            {/* Right: Response Output */}
            <div className="lg:col-span-7 p-4 bg-[#0B0B0D]">
              <div className="flex items-center justify-between border-b border-[#1F1F23] pb-2 mb-3">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[#00E599] font-mono font-medium">
                    200 OK
                  </span>
                  <span className="text-[#6E6E73] font-mono">14ms</span>
                  <span className="text-[#6E6E73] font-mono">1.2 KB</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                  <span>JSON</span>
                  <Copy className="w-3.5 h-3.5 hover:text-[#F5F5F7] cursor-pointer transition-colors" />
                </div>
              </div>

              {/* JSON Payload Output */}
              <div className="font-mono text-xs text-[#A1A1A6] leading-relaxed overflow-x-auto">
                <pre>
                  <span className="text-[#6E6E73]">&#123;</span>
                  <br />
                  {"  "}
                  <span className="text-[#F5F5F7]">"orderId"</span>:{" "}
                  <span className="text-[#A1A1A6]">"ord_84910a3"</span>,
                  <br />
                  {"  "}
                  <span className="text-[#F5F5F7]">"status"</span>:{" "}
                  <span className="text-[#00E599]">"fulfilled"</span>,
                  <br />
                  {"  "}
                  <span className="text-[#F5F5F7]">"items"</span>: [
                  <br />
                  {"    "}&#123;{" "}
                  <span className="text-[#F5F5F7]">"sku"</span>:{" "}
                  <span className="text-[#A1A1A6]">"api-core-pro"</span>,{" "}
                  <span className="text-[#F5F5F7]">"qty"</span>:{" "}
                  <span className="text-[#A1A1A6]">1</span> &#125;
                  <br />
                  {"  "}],
                  <br />
                  {"  "}
                  <span className="text-[#F5F5F7]">"latencyMs"</span>:{" "}
                  <span className="text-[#A1A1A6]">14</span>,
                  <br />
                  {"  "}
                  <span className="text-[#F5F5F7]">"signatureValid"</span>:{" "}
                  <span className="text-[#00E599]">true</span>
                  <br />
                  <span className="text-[#6E6E73]">&#125;</span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 2: WHAT APIPILOT DOES */}
      {/* ---------------------------------------------------- */}
      <section id="workflow" className="py-20 border-t border-[#1F1F23] bg-[#0E0E10]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-mono tracking-wider uppercase text-[#A1A1A6] mb-2">
              Capabilities
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F5F7]">
              Engineered for the full API lifecycle.
            </h2>
            <p className="mt-3 text-sm text-[#A1A1A6] leading-relaxed">
              Replace fragmented tools with a single environment designed for
              inspecting, testing, and debugging service contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="border-t border-[#2C2C2E] pt-6">
              <div className="text-xs font-mono text-[#6E6E73] mb-3">01</div>
              <h3 className="text-base font-semibold text-[#F5F5F7] mb-2">
                Schema & Endpoint Exploration
              </h3>
              <p className="text-xs text-[#A1A1A6] leading-relaxed">
                Connect your OpenAPI, GraphQL, or REST endpoints. Inspect parameter
                types, headers, and request bodies with instant autocomplete and
                type validation.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border-t border-[#2C2C2E] pt-6">
              <div className="text-xs font-mono text-[#6E6E73] mb-3">02</div>
              <h3 className="text-base font-semibold text-[#F5F5F7] mb-2">
                Automated Token & Session Sync
              </h3>
              <p className="text-xs text-[#A1A1A6] leading-relaxed">
                Eliminate expired token errors. APIpilot automatically refreshes JWTs
                via HTTP-only cookies in memory, ensuring requests never fail due to
                stale credentials.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border-t border-[#2C2C2E] pt-6">
              <div className="text-xs font-mono text-[#6E6E73] mb-3">03</div>
              <h3 className="text-base font-semibold text-[#F5F5F7] mb-2">
                Response Validation & Assertions
              </h3>
              <p className="text-xs text-[#A1A1A6] leading-relaxed">
                Run assertion checks on status codes, payload shapes, response timings,
                and contract drifts before promoting code to production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 3: KEY FEATURES */}
      {/* ---------------------------------------------------- */}
      <section id="features" className="py-20 border-t border-[#1F1F23]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-mono tracking-wider uppercase text-[#A1A1A6] mb-2">
              Features
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F5F7]">
              Built for speed, privacy, and team workflows.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg bg-[#141416] border border-[#2C2C2E]">
              <Shield className="w-4 h-4 text-[#A1A1A6] mb-3" />
              <h4 className="text-sm font-semibold text-[#F5F5F7] mb-1.5">
                In-Memory Auth Vault
              </h4>
              <p className="text-xs text-[#A1A1A6] leading-relaxed">
                Tokens are stored in memory and synchronized via secure HTTP-only cookies.
                No sensitive credentials in localStorage.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#141416] border border-[#2C2C2E]">
              <Layers className="w-4 h-4 text-[#A1A1A6] mb-3" />
              <h4 className="text-sm font-semibold text-[#F5F5F7] mb-1.5">
                Environment Management
              </h4>
              <p className="text-xs text-[#A1A1A6] leading-relaxed">
                Toggle between Localhost, Staging, and Production with scoped variables
                and isolated base URLs.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#141416] border border-[#2C2C2E]">
              <Activity className="w-4 h-4 text-[#A1A1A6] mb-3" />
              <h4 className="text-sm font-semibold text-[#F5F5F7] mb-1.5">
                Precise Latency Breakdown
              </h4>
              <p className="text-xs text-[#A1A1A6] leading-relaxed">
                Measure DNS lookup, TLS handshake, TCP connection, and time to first byte
                (TTFB) on every request.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#141416] border border-[#2C2C2E]">
              <Code className="w-4 h-4 text-[#A1A1A6] mb-3" />
              <h4 className="text-sm font-semibold text-[#F5F5F7] mb-1.5">
                Code Snippet Export
              </h4>
              <p className="text-xs text-[#A1A1A6] leading-relaxed">
                Export tested endpoints to cURL, Fetch, Axios, Python Requests, Go,
                and Rust with one click.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#141416] border border-[#2C2C2E]">
              <Cpu className="w-4 h-4 text-[#A1A1A6] mb-3" />
              <h4 className="text-sm font-semibold text-[#F5F5F7] mb-1.5">
                Contextual Analysis
              </h4>
              <p className="text-xs text-[#A1A1A6] leading-relaxed">
                Ask APIpilot to diagnose unexpected 4xx/5xx responses or generate
                payload schemas directly from responses.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#141416] border border-[#2C2C2E]">
              <Zap className="w-4 h-4 text-[#A1A1A6] mb-3" />
              <h4 className="text-sm font-semibold text-[#F5F5F7] mb-1.5">
                Keyboard-First Navigation
              </h4>
              <p className="text-xs text-[#A1A1A6] leading-relaxed">
                Execute requests, switch collections, and inspect headers without
                taking your hands off the keyboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 4: CALL TO ACTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 border-t border-[#1F1F23] bg-[#0E0E10]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F5F7]">
              Start exploring your APIs with APIpilot.
            </h2>
            <p className="mt-3 text-sm text-[#A1A1A6] leading-relaxed">
              Create an account in seconds. No setup required.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                to="/register"
                className="px-4 py-2.5 rounded-md bg-[#F5F5F7] text-[#0B0B0D] text-xs font-medium hover:bg-white transition-colors"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="px-4 py-2.5 rounded-md bg-[#141416] text-[#A1A1A6] hover:text-[#F5F5F7] border border-[#2C2C2E] text-xs font-medium hover:bg-[#1C1C1F] transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FOOTER */}
      {/* ---------------------------------------------------- */}
      <footer className="border-t border-[#1F1F23] bg-[#0B0B0D] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E6E73]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#A1A1A6]">APIpilot</span>
            <span>© {new Date().getFullYear()} APIpilot. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-[#A1A1A6]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E599]" />
              <span>Operational</span>
            </div>
            <Link to="/login" className="hover:text-[#F5F5F7] transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-[#F5F5F7] transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
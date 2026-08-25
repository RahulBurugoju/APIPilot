import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/auth.thunk.js";
import { clearAuthError } from "../features/auth/authSlice.js";
import { Terminal, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import ThemeToggle from "../components/common/ThemeToggle.jsx";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error: serverError } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthError());
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) {
      dispatch(clearAuthError());
    }
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return errors;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length === 0) {
      try {
        const { email, password } = formData;
        const result = await dispatch(
          loginUser({ email: email.trim(), password })
        ).unwrap();

        if (result) {
          navigate("/dashboard");
        }
      } catch {
        // Redux authSlice stores the error payload in state.error
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0B0B0D] text-[#1D1D1F] dark:text-[#F5F5F7] font-sans flex flex-col justify-between selection:bg-[#E5E5E7] dark:selection:bg-[#2C2C2E] selection:text-black dark:selection:text-white px-4 sm:px-6 py-8 antialiased transition-colors duration-200">
      {/* ---------------------------------------------------- */}
      {/* HEADER / BRAND LOGO */}
      {/* ---------------------------------------------------- */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 group transition-opacity hover:opacity-80"
        >
          <div className="w-10 h-10 rounded-md bg-[#F5F5F7] dark:bg-[#141416] border border-[#E5E5E7] dark:border-[#2C2C2E] flex items-center justify-center">
            <Terminal className="w-4 h-4 text-[#1D1D1F] dark:text-[#F5F5F7]" />
          </div>
          <span className="text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
            APIpilot
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/register"
            className="text-sm font-medium text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors"
          >
            Create account
          </Link>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* MAIN FORM CONTAINER */}
      {/* ---------------------------------------------------- */}
      <main className="w-full max-w-sm mx-auto my-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
            Sign in to APIpilot
          </h1>
          <p className="mt-1.5 text-xs text-[#6E6E73] dark:text-[#A1A1A6]">
            Enter your credentials to access your API workspace.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-5 p-3 rounded-md bg-[#FEE2E2] dark:bg-[#1C1214] border border-[#FCA5A5] dark:border-[#481E24] flex items-start gap-2.5 text-xs text-[#DC2626] dark:text-[#F87171]">
            <AlertCircle className="w-4 h-4 text-[#DC2626] dark:text-[#F87171] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              {typeof serverError === "string"
                ? serverError
                : serverError?.message || "Authentication failed. Please check your credentials."}
            </div>
          </div>
        )}

        <form onSubmit={handleOnSubmit} className="space-y-4" noValidate>
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-1.5"
            >
              Work email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleOnChange}
              placeholder="alex@company.com"
              className={`w-full px-3 py-2 rounded-md bg-[#FAFAFA] dark:bg-[#141416] border text-xs text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#86868B] dark:placeholder-[#6E6E73] transition-colors focus:outline-none focus:ring-1 ${
                fieldErrors.email
                  ? "border-[#DC2626] dark:border-[#F87171] focus:ring-[#DC2626] dark:focus:ring-[#F87171]"
                  : "border-[#E5E5E7] dark:border-[#2C2C2E] focus:border-[#1D1D1F] dark:focus:border-[#6E6E73] focus:ring-[#1D1D1F] dark:focus:ring-[#6E6E73]"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-[11px] text-[#DC2626] dark:text-[#F87171]">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[#6E6E73] dark:text-[#A1A1A6]"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => alert("Password reset functionality will be available soon.")}
                className="text-[11px] text-[#86868B] dark:text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-[#A1A1A6] transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleOnChange}
                placeholder="Enter your password"
                className={`w-full px-3 py-2 pr-9 rounded-md bg-[#FAFAFA] dark:bg-[#141416] border text-xs text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#86868B] dark:placeholder-[#6E6E73] transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.password
                    ? "border-[#DC2626] dark:border-[#F87171] focus:ring-[#DC2626] dark:focus:ring-[#F87171]"
                    : "border-[#E5E5E7] dark:border-[#2C2C2E] focus:border-[#1D1D1F] dark:focus:border-[#6E6E73] focus:ring-[#1D1D1F] dark:focus:ring-[#6E6E73]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#86868B] dark:text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-[#A1A1A6] transition-colors cursor-pointer"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-[11px] text-[#DC2626] dark:text-[#F87171]">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 flex items-center justify-center gap-2 rounded-md bg-[#1D1D1F] text-white hover:bg-black dark:bg-[#F5F5F7] dark:text-[#0B0B0D] dark:hover:bg-white text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-[#6E6E73] dark:text-[#A1A1A6]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#1D1D1F] dark:text-[#F5F5F7] hover:underline font-medium"
          >
            Create one
          </Link>
        </div>
      </main>

      {/* ---------------------------------------------------- */}
      {/* FOOTER */}
      {/* ---------------------------------------------------- */}
      <footer className="w-full max-w-7xl mx-auto text-center text-[11px] text-[#86868B] dark:text-[#6E6E73] py-2">
        Protected by APIpilot security. By continuing, you agree to our Terms of
        Service.
      </footer>
    </div>
  );
}

export default LoginPage;
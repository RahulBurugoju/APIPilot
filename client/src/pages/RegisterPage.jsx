import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/auth.thunk.js";
import { clearAuthError } from "../features/auth/authSlice.js";
import { Terminal, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error: serverError } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Clear field-specific error as user types
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

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return errors;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length === 0) {
      try {
        const { name, email, password } = formData;
        const result = await dispatch(
          registerUser({ name: name.trim(), email: email.trim(), password })
        ).unwrap();

        if (result) {
          navigate("/dashboard");
        }
      } catch {
        // Redux authSlice handles and stores rejection payload in state.error
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F5F5F7] font-sans flex flex-col justify-between selection:bg-[#2C2C2E] selection:text-white px-4 py-8 antialiased">
      {/* ---------------------------------------------------- */}
      {/* HEADER / BRAND LOGO */}
      {/* ---------------------------------------------------- */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 group transition-opacity hover:opacity-80"
        >
          <div className="w-7 h-7 rounded-md bg-[#141416] border border-[#2C2C2E] flex items-center justify-center">
            <Terminal className="w-4 h-4 text-[#F5F5F7]" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[#F5F5F7]">
            APIpilot
          </span>
        </Link>

        <Link
          to="/login"
          className="text-xs text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors"
        >
          Sign in
        </Link>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MAIN FORM CONTAINER */}
      {/* ---------------------------------------------------- */}
      <div className="w-full max-w-sm mx-auto my-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[#F5F5F7]">
            Create an account
          </h1>
          <p className="mt-1.5 text-xs text-[#A1A1A6]">
            Start designing and testing your APIs in seconds.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-5 p-3 rounded-md bg-[#1C1214] border border-[#481E24] flex items-start gap-2.5 text-xs text-[#F87171]">
            <AlertCircle className="w-4 h-4 text-[#F87171] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              {typeof serverError === "string"
                ? serverError
                : serverError?.message || "Registration failed. Please try again."}
            </div>
          </div>
        )}

        <form onSubmit={handleOnSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-[#A1A1A6] mb-1.5"
            >
              Full name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleOnChange}
              placeholder="e.g. Alex Morgan"
              className={`w-full px-3 py-2 rounded-md bg-[#141416] border text-xs text-[#F5F5F7] placeholder-[#6E6E73] transition-colors focus:outline-none focus:ring-1 ${
                fieldErrors.name
                  ? "border-[#F87171] focus:ring-[#F87171]"
                  : "border-[#2C2C2E] focus:border-[#6E6E73] focus:ring-[#6E6E73]"
              }`}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-[11px] text-[#F87171]">
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-[#A1A1A6] mb-1.5"
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
              className={`w-full px-3 py-2 rounded-md bg-[#141416] border text-xs text-[#F5F5F7] placeholder-[#6E6E73] transition-colors focus:outline-none focus:ring-1 ${
                fieldErrors.email
                  ? "border-[#F87171] focus:ring-[#F87171]"
                  : "border-[#2C2C2E] focus:border-[#6E6E73] focus:ring-[#6E6E73]"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-[11px] text-[#F87171]">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-[#A1A1A6] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleOnChange}
                placeholder="At least 6 characters"
                className={`w-full px-3 py-2 pr-9 rounded-md bg-[#141416] border text-xs text-[#F5F5F7] placeholder-[#6E6E73] transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.password
                    ? "border-[#F87171] focus:ring-[#F87171]"
                    : "border-[#2C2C2E] focus:border-[#6E6E73] focus:ring-[#6E6E73]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E6E73] hover:text-[#A1A1A6] transition-colors"
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
              <p className="mt-1 text-[11px] text-[#F87171]">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-[#A1A1A6] mb-1.5"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleOnChange}
                placeholder="Repeat password"
                className={`w-full px-3 py-2 pr-9 rounded-md bg-[#141416] border text-xs text-[#F5F5F7] placeholder-[#6E6E73] transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.confirmPassword
                    ? "border-[#F87171] focus:ring-[#F87171]"
                    : "border-[#2C2C2E] focus:border-[#6E6E73] focus:ring-[#6E6E73]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E6E73] hover:text-[#A1A1A6] transition-colors"
                tabIndex={-1}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-[11px] text-[#F87171]">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 flex items-center justify-center gap-2 rounded-md bg-[#F5F5F7] text-[#0B0B0D] text-xs font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-[#A1A1A6]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#F5F5F7] hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* FOOTER */}
      {/* ---------------------------------------------------- */}
      <footer className="w-full max-w-sm mx-auto text-center text-[11px] text-[#6E6E73]">
        Protected by APIpilot security. By continuing, you agree to our Terms of
        Service.
      </footer>
    </div>
  );
}

export default RegisterPage;

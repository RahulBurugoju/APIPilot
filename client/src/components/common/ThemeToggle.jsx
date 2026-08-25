import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`w-8 h-8 rounded-md flex items-center justify-center transition-all duration-150 cursor-pointer border border-[#E5E5E7] dark:border-[#2C2C2E] bg-[#F5F5F7] dark:bg-[#141416] text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-[#E5E5E7] dark:hover:bg-[#1C1C1F] active:scale-95 select-none ${className}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-[#A1A1A6] hover:text-[#F5F5F7] transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#6E6E73] hover:text-[#1D1D1F] transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}

export default ThemeToggle;

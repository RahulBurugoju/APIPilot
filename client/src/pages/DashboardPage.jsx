import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../features/auth/auth.thunk.js'
import CreateProjectForm from '../components/projects/CreateProjectForm.jsx'
import ThemeToggle from '../components/common/ThemeToggle.jsx'

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0B0B0D] text-[#1D1D1F] dark:text-[#F5F5F7] font-sans antialiased transition-colors duration-200">
      {/* Top Bar */}
      <header className="border-b border-[#E5E5E7] dark:border-[#1F1F23] bg-[#FFFFFF]/80 dark:bg-[#141416]/50 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              APIpilot Workspace
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#6E6E73] dark:text-[#A1A1A6] hidden sm:inline">
              Signed in as <span className="text-[#1D1D1F] dark:text-[#F5F5F7] font-medium">{user?.email || user?.name || "User"}</span>
            </span>
            <ThemeToggle />
            <button
              onClick={() => dispatch(logoutUser())}
              className="px-3 py-1.5 rounded-md bg-[#F5F5F7] dark:bg-[#1C1C1F] hover:bg-[#E5E5E7] dark:hover:bg-[#2C2C2E] text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] border border-[#E5E5E7] dark:border-[#2C2C2E] transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
            Projects
          </h1>
          <p className="text-xs text-[#6E6E73] dark:text-[#A1A1A6] mt-1">
            Manage your API collections, environments, and mock services.
          </p>
        </div>

        <CreateProjectForm />
      </main>
    </div>
  );
}

export default DashboardPage;
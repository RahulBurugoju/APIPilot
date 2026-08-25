import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../features/auth/auth.thunk.js'
import CreateProjectForm from '../components/projects/CreateProjectForm.jsx'

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F5F5F7] font-sans antialiased">
      {/* Top Bar */}
      <header className="border-b border-[#1F1F23] bg-[#141416]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-tight text-[#F5F5F7]">
              APIpilot Workspace
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#A1A1A6]">
              Signed in as <span className="text-[#F5F5F7] font-medium">{user?.email || user?.name || "User"}</span>
            </span>
            <button
              onClick={() => dispatch(logoutUser())}
              className="px-3 py-1.5 rounded-md bg-[#1C1C1F] hover:bg-[#2C2C2E] text-[#A1A1A6] hover:text-[#F5F5F7] border border-[#2C2C2E] transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F7]">
            Projects
          </h1>
          <p className="text-xs text-[#A1A1A6] mt-1">
            Manage your API collections, environments, and mock services.
          </p>
        </div>

        <CreateProjectForm />
      </main>
    </div>
  );
}

export default DashboardPage
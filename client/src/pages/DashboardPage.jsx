import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../features/auth/auth.thunk.js'
import CreateProjectForm from '../components/projects/CreateProjectForm.jsx'
import ThemeToggle from '../components/common/ThemeToggle.jsx'
import { useEffect } from 'react'
import projectThunks from '../features/project/project.thunk.js'
import ProjectList from '../components/projects/ProjectList.jsx'

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  useEffect(()=>{
    dispatch(projectThunks.getProjects());
  },[dispatch])

  return (
    <div className="min-h-screen bg-[#FAF3E1] dark:bg-[#0B0B0D] text-[#222222] dark:text-[#F5F5F7] font-sans antialiased transition-colors duration-200">
      {/* Top Bar */}
      <header className="border-b border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/90 dark:bg-[#141416]/50 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-tight text-[#222222] dark:text-[#F5F5F7]">
              APIpilot Workspace
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#5C5C5C] dark:text-[#A1A1A6] hidden sm:inline">
              Signed in as <span className="text-[#222222] dark:text-[#F5F5F7] font-semibold">{user?.email || user?.name || "User"}</span>
            </span>
            <ThemeToggle />
            <button
              onClick={() => dispatch(logoutUser())}
              className="px-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] text-[#222222] dark:text-[#A1A1A6] hover:text-[#FF6D1F] dark:hover:text-[#F5F5F7] border border-[#E6D2A5] dark:border-[#2C2C2E] transition-colors cursor-pointer shadow-xs"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#222222] dark:text-[#F5F5F7]">
            Projects
          </h1>
          <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] mt-1">
            Manage your API collections, environments, and mock services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <CreateProjectForm />
          </div>

          <div className="lg:col-span-8">
            <ProjectList />
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
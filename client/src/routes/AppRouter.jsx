import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicOnlyRoute from "./PublicOnlyRoute.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import ProjectWorkspacePage from "../pages/project/ProjectWorkspacePage.jsx";

function AppRouter() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      element: <PublicOnlyRoute />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
      ],
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/dashboard",
          element: <DashboardPage />,
        },
        {
          path: "/projects/:projectId",
          element: <ProjectWorkspacePage />,
        },
      ],
    },
    {
      path: "*",
      element: <LandingPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default AppRouter;

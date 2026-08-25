import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";

function AppRouter() {
  const router = createBrowserRouter([
    // ----------------------------------------------------
    // Public-Only Routes (Guests Only: redirect to "/" if logged in)
    // ----------------------------------------------------
    // ----------------------------------------------------
    // Public-Only Routes (Guests Only)
    // ----------------------------------------------------
    {
      element: <PublicOnlyRoute />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/login",
          element: <LoginPage/>,
        },
        {
          path: "/register",
          element: <RegisterPage/>,
        },
      ],
    },

    // ----------------------------------------------------
    // Protected Routes (Authenticated Users Only: redirect to "/login" if logged out)
    // ----------------------------------------------------
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/dashboard",
          element: <DashboardPage/>,
        },
        {
          path: "/profile",
          element: <div>User Profile (Protected Placeholder)</div>,
        },
        // Add more protected routes here in future (e.g. /projects, /api-keys, etc.)
      ],
    },

    // ----------------------------------------------------
    // Optional Public Routes (Accessible to both authenticated & guest users)
    // ----------------------------------------------------
    // {
    //   path: "/about",
    //   element: <div>About Us (Placeholder)</div>,
    // },

    // ----------------------------------------------------
    // 404 Not Found Catch-All Route
    // ----------------------------------------------------
    {
      path: "*",
      element: <div>404 - Page Not Found</div>,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default AppRouter;


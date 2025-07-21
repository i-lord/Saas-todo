import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import TasksPage from "./pages/TasksPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./routes/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <AuthPage key="login" initialMode="login" />,
  },
  {
    path: "/signup",
    element: <AuthPage key="signup" initialMode="signup" />,
  },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <Layout />, // AppBar + Drawer
        children: [
          { path: '', element: <Home /> },
          { path: 'tasks', element: <TasksPage /> },
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}

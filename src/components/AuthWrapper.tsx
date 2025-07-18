import React, { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { RootState } from "../store";
import { setTheme } from "../store/slices/themeSlice";
import LandingPage from "./LandingPage";
import LoadingSpinner from "./common/LoadingSpinner";
import { setUser } from "../store/slices/authSlice";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useAuth();
  const { mode } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const userParam = params.get("user");
    console.log(userParam);
    if (accessToken && userParam) {
      localStorage.setItem("auth_token", accessToken);
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        dispatch(setUser(user));
      } catch {
        //
      }
      // Remove query params from URL and redirect to landing page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [dispatch]);

  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      dispatch(setTheme(savedTheme));
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      dispatch(setTheme(prefersDark ? "dark" : "light"));
    }
  }, [dispatch]);

  // Apply theme to document
  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <>{children}</>;
};

export default AuthWrapper;

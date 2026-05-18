import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import PreviewPage from "./pages/PreviewPage";
import WebsitePreviewMobilePage from "./pages/dashboard/WebsitePreviewMobilePage";
import SiteViewPage from "./pages/SiteViewPage";
import OwnerHomePage from "./pages/OwnerHomePage";
import OwnerProductsPage from "./pages/OwnerProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import DataDeletionPage from "./pages/DataDeletionPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import ProtectedRoute from "./components/dashboard/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import OverviewPage from "./pages/dashboard/OverviewPage";
import AIGeneratorPage from "./pages/dashboard/AIGeneratorPage";
import ProductsCrudPage from "./pages/dashboard/ProductsCrudPage";
import WebsitePreviewPage from "./pages/dashboard/WebsitePreviewPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

export default function App() {
  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme =
      savedTheme === "dark" || savedTheme === "light"
        ? (savedTheme as "light" | "dark")
        : prefersDark
          ? "dark"
          : "light";

    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    document.documentElement.style.colorScheme = initialTheme;
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/data-deletion" element={<DataDeletionPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard/preview/mobile"
            element={<WebsitePreviewMobilePage />}
          />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<OverviewPage />} />
            <Route path="/dashboard/generator" element={<AIGeneratorPage />} />
            <Route path="/dashboard/products" element={<ProductsCrudPage />} />
            <Route path="/dashboard/preview" element={<WebsitePreviewPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="/owner" element={<OwnerHomePage />} />
        <Route path="/owner/products" element={<OwnerProductsPage />} />
        <Route path="/generate" element={<DashboardPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/site/:slug" element={<SiteViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

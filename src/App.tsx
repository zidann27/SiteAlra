import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import PreviewPage from "./pages/PreviewPage";
import SiteViewPage from "./pages/SiteViewPage";
import OwnerHomePage from "./pages/OwnerHomePage";
import OwnerProductsPage from "./pages/OwnerProductsPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/dashboard/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import OverviewPage from "./pages/dashboard/OverviewPage";
import AIGeneratorPage from "./pages/dashboard/AIGeneratorPage";
import ProductsCrudPage from "./pages/dashboard/ProductsCrudPage";
import WebsitePreviewPage from "./pages/dashboard/WebsitePreviewPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<OverviewPage />} />
            <Route path="/dashboard/generator" element={<AIGeneratorPage />} />
            <Route path="/dashboard/products" element={<ProductsCrudPage />} />
            <Route path="/dashboard/preview" element={<WebsitePreviewPage />} />
            <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
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

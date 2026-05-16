import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Eye,
  Rocket,
  ArrowLeft,
  Copy,
  CheckCheck,
  Loader2,
  Monitor,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import { AIContent, GenerateFormData } from "../lib/types";
import { deploySite } from "../lib/api";
import SiteTemplate from "../components/preview/SiteTemplate";

interface LocationState {
  formData: GenerateFormData;
  aiContent: AIContent;
}

export default function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [deployError, setDeployError] = useState("");

  if (!state?.formData || !state?.aiContent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Data tidak ditemukan. Silakan buat website terlebih dahulu.
          </p>
          <Link
            to="/generate"
            className="text-blue-600 hover:underline font-medium"
          >
            Kembali ke Generator
          </Link>
        </div>
      </div>
    );
  }

  const { formData, aiContent } = state;

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployError("");
    try {
      const site = await deploySite(formData, aiContent);
      const siteUrl = `${window.location.origin}/site/${site.slug}`;
      setDeployedUrl(siteUrl);
      setIsDeploying(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setDeployError(message || "Gagal deploy website. Silakan coba lagi.");
      setIsDeploying(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(deployedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleVisitSite = () => {
    if (deployedUrl) {
      const path = deployedUrl.replace(window.location.origin, "");
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <Link
                to="/generate"
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
              >
                <ArrowLeft size={18} />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-blue-500" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    Preview Website
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {formData.businessName}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === "desktop"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <Monitor size={14} /> Desktop
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === "mobile"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <Smartphone size={14} /> Mobile
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/generate"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-xs font-medium transition-colors"
              >
                <RefreshCw size={14} /> Buat Ulang
              </Link>
              {!deployedUrl ? (
                <button
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg text-sm transition-all shadow-sm"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />{" "}
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Rocket size={15} /> Deploy Website
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleVisitSite}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition-all"
                >
                  <Eye size={15} /> Buka Website
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {deployedUrl && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-700 font-semibold text-sm">
                Website berhasil di-deploy!
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-white border border-green-200 text-green-700 px-3 py-1.5 rounded-lg font-mono">
                {deployedUrl}
              </code>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCheck size={13} /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Salin URL
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {deployError && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-red-600 text-sm text-center">{deployError}</p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto py-8 px-4">
        <div
          className={`mx-auto transition-all duration-300 bg-white dark:bg-slate-900 shadow-2xl rounded-lg overflow-hidden ${
            viewMode === "mobile"
              ? "w-[428px] h-[928px] ring-4 ring-gray-900 dark:ring-slate-200 ring-offset-8 dark:ring-offset-slate-950 rounded-[2.5rem]"
              : "max-w-6xl"
          }`}
        >
          <div
            className={
              viewMode === "mobile"
                ? "w-[428px] h-[928px] overflow-y-auto overflow-x-hidden"
                : "w-full"
            }
          >
            <SiteTemplate
              content={aiContent}
              businessName={formData.businessName}
              category={formData.category}
              isPreview={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

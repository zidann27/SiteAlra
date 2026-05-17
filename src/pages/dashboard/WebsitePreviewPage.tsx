import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Pencil,
  Palette,
  Info,
  Rocket,
  Copy,
  CheckCheck,
  Loader2,
  Monitor,
  Smartphone,
} from "lucide-react";
import SiteTemplate from "../../components/preview/SiteTemplate";
import {
  applyProfileOverrides,
  getDefaultProfile,
  loadAiContent,
  loadProducts,
  loadProfile,
  saveAiContent,
  saveProfile,
  type DashboardProduct,
} from "../../lib/dashboardStore";
import type { AIContent } from "../../lib/types";
import type { GenerateFormData } from "../../lib/types";
import { deploySite } from "../../lib/api";

function mapProductsToAI(products: DashboardProduct[]): AIContent["products"] {
  return products.map((p) => ({
    name: p.name,
    description: p.description || "",
    price: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(p.price),
    imageDataUrl: p.imageDataUrl,
  }));
}

export default function WebsitePreviewPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getDefaultProfile());
  const [content, setContent] = useState<AIContent | null>(null);

  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [deployError, setDeployError] = useState("");

  const [editOpen, setEditOpen] = useState(false);

  const [draft, setDraft] = useState({
    title: "",
    tagline: "",
    description: "",
    about: "",
    themeColor: "#2563eb",
  });

  useEffect(() => {
    let alive = true;

    (async () => {
      const [profileData, ai, products] = await Promise.all([
        loadProfile(),
        loadAiContent(),
        loadProducts(),
      ]);

      if (!alive) return;
      setProfile(profileData);

      if (!ai) {
        setContent(null);
        return;
      }

      const merged = applyProfileOverrides(
        ai,
        profileData,
        products.length ? mapProductsToAI(products) : undefined,
      );

      if (!merged) {
        setContent(null);
        return;
      }

      setContent(merged);
      setDraft({
        title: merged.title || "",
        tagline: merged.tagline || "",
        description: merged.description || "",
        about: merged.about || "",
        themeColor: profileData.themeColor,
      });
    })();

    return () => {
      alive = false;
    };
  }, []);

  const deployFormData: GenerateFormData | null = useMemo(() => {
    if (!content) return null;

    const businessName = (profile.name || content.title || "").trim();
    const rawDescription = (
      profile.shortDescription ||
      content.description ||
      ""
    )
      .trim()
      .replace(/\s+/g, " ");
    // Keep it short: backend DB may still have small varchar limits.
    const businessDescription = rawDescription.slice(0, 180);

    return {
      businessName: businessName || "UMKM",
      businessDescription,
      category: profile.businessType || "umum",
    };
  }, [content, profile]);

  const handleDeploy = async () => {
    if (!content || !deployFormData) return;

    setIsDeploying(true);
    setDeployError("");

    try {
      const site = await deploySite(deployFormData, content);
      const siteUrl = site.url || `${window.location.origin}/site/${site.slug}`;
      setDeployedUrl(siteUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setDeployError(message || "Gagal deploy website. Silakan coba lagi.");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopy = async () => {
    if (!deployedUrl) return;
    await navigator.clipboard.writeText(deployedUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  const handleVisitSite = () => {
    if (!deployedUrl) return;
    const path = deployedUrl.replace(window.location.origin, "");
    navigate(path);
  };

  const applyEdits = async () => {
    if (!content) return;

    const next: AIContent = {
      ...content,
      title: draft.title,
      tagline: draft.tagline,
      description: draft.description,
      about: draft.about,
      colorScheme: { ...content.colorScheme, primary: draft.themeColor },
    };

    setContent(next);
    await saveAiContent(next);
    await saveProfile({
      ...profile,
      name: draft.title,
      themeColor: draft.themeColor,
    });
  };

  if (!content) {
    return (
      <div className="max-w-2xl">
        <div className="bg-white dark:bg-slate-900 transition-colors rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-8">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 transition-colors text-blue-600 flex items-center justify-center mb-4">
            <Eye size={20} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Website Preview
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Belum ada konten AI. Generate dulu di menu AI Generator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Website Preview
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Preview landing page UMKM (Hero, About, Produk, CTA).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-stretch sm:items-center justify-end gap-2 w-full lg:w-auto">
          <div className="grid grid-cols-2 sm:inline-flex items-stretch gap-1 bg-gray-100 dark:bg-slate-800 transition-colors rounded-xl p-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setViewMode("desktop")}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all w-full sm:w-auto ${
                viewMode === "desktop"
                  ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Monitor size={14} /> Desktop
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/preview/mobile")}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white w-full sm:w-auto"
            >
              <Smartphone size={14} /> Mobile
            </button>
          </div>

          {!deployedUrl ? (
            <button
              type="button"
              onClick={handleDeploy}
              disabled={isDeploying}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-semibold transition-colors w-full sm:w-auto"
            >
              {isDeploying ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Deploying...
                </>
              ) : (
                <>
                  <Rocket size={14} /> Deploy
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleVisitSite}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <Eye size={14} /> Buka Website
            </button>
          )}

          <button
            type="button"
            onClick={() => setEditOpen((v) => !v)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 dark:bg-slate-800 rounded-xl text-xs font-semibold transition-colors w-full sm:w-auto"
          >
            <Pencil size={14} /> Edit Section
          </button>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 dark:bg-slate-800 rounded-xl text-xs font-semibold transition-colors w-full sm:w-auto"
          >
            <Palette size={14} /> Change Theme Color
          </button>
        </div>
      </div>

      {deployedUrl && (
        <div className="bg-green-50 dark:bg-green-500/10 transition-colors border border-green-200 rounded-2xl px-4 sm:px-6 py-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-700 font-semibold text-sm">
              Website berhasil di-deploy!
            </span>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-white dark:bg-slate-800 border border-green-200 text-green-700 px-3 py-2 rounded-xl font-mono max-w-[65vw] truncate">
              {deployedUrl}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              {copied ? (
                <>
                  <CheckCheck size={13} /> Tersalin
                </>
              ) : (
                <>
                  <Copy size={13} /> Salin URL
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {deployError && (
        <div className="bg-red-50 dark:bg-red-500/10 transition-colors border border-red-200 rounded-2xl px-4 sm:px-6 py-4 mb-6">
          <p className="text-red-600 text-sm">{deployError}</p>
        </div>
      )}

      {editOpen && (
        <div className="bg-white dark:bg-slate-900 transition-colors rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Nama UMKM (Hero)
              </label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 dark:text-gray-100 dark:bg-slate-800 dark:placeholder-gray-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={draft.tagline}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, tagline: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 dark:text-gray-100 dark:bg-slate-800 dark:placeholder-gray-500 text-sm"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Deskripsi singkat
              </label>
              <textarea
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 dark:text-gray-100 dark:bg-slate-800 dark:placeholder-gray-500 text-sm resize-none"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                About section
              </label>
              <textarea
                value={draft.about}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, about: e.target.value }))
                }
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 dark:text-gray-100 dark:bg-slate-800 dark:placeholder-gray-500 text-sm resize-none"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Theme color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={draft.themeColor}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, themeColor: e.target.value }))
                  }
                  className="h-10 w-14 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {draft.themeColor}
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-2 flex items-center gap-2">
                <Info size={12} />
                FE-only: mengubah warna primary pada template.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={applyEdits}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 transition-colors rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-4 sm:p-6 overflow-x-auto">
        <div
          className={`mx-auto transition-all duration-300 bg-white dark:bg-slate-800 shadow-2xl overflow-hidden ${
            viewMode === "mobile"
              ? "w-[428px] h-[928px] ring-4 ring-gray-900 ring-offset-8 ring-offset-white dark:ring-offset-slate-900 rounded-[2.5rem]"
              : "w-full rounded-2xl"
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
              content={content}
              businessName={content.title}
              category={profile.businessType}
              isPreview={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

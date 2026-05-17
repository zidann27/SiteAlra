import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Monitor, Smartphone } from "lucide-react";
import SiteTemplate from "../../components/preview/SiteTemplate";
import MobileViewportFrame from "../../components/preview/MobileViewportFrame";
import {
  applyProfileOverrides,
  getDefaultProfile,
  loadAiContent,
  loadProducts,
  loadProfile,
  type DashboardProduct,
} from "../../lib/dashboardStore";
import type { AIContent } from "../../lib/types";

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

export default function WebsitePreviewMobilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getDefaultProfile());
  const [content, setContent] = useState<AIContent | null>(null);

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
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors">
        <div className="text-center bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-8 max-w-sm transition-colors">
          <p className="text-gray-500 dark:text-slate-400 transition-colors">
            Belum ada konten AI untuk preview mobile.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/preview")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold"
          >
            <ArrowLeft size={14} /> Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 dark:bg-slate-950 flex flex-col overflow-hidden transition-colors">
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm transition-colors flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white transition-colors">
              <Smartphone
                size={16}
                className="text-blue-600 dark:text-blue-400"
              />{" "}
              Mobile Preview
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 transition-colors">
              Viewport fixed 428 x 928
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard/preview")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Monitor size={14} /> Desktop View
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/preview")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={14} /> Kembali
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start pt-8 pb-12 px-4">
        <div className="w-[428px] h-[928px] rounded-[2.5rem] ring-4 ring-gray-900 ring-offset-4 ring-offset-gray-100 dark:ring-offset-slate-950 bg-white shadow-2xl overflow-hidden flex-shrink-0 transition-colors">
          <MobileViewportFrame width={428} height={928}>
            <SiteTemplate
              content={content}
              businessName={content.title}
              category={profile.businessType}
              isPreview={true}
            />
          </MobileViewportFrame>
        </div>
      </div>
    </div>
  );
}

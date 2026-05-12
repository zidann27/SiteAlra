import { useEffect, useState } from "react";
import { Eye, Pencil, Palette, Info } from "lucide-react";
import SiteTemplate from "../../components/preview/SiteTemplate";
import {
  getDefaultProfile,
  loadAiContent,
  loadProducts,
  loadProfile,
  saveAiContent,
  saveProfile,
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

export default function WebsitePreviewPage() {
  const [profile, setProfile] = useState(getDefaultProfile());
  const [content, setContent] = useState<AIContent | null>(null);

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

      const merged: AIContent = {
        ...ai,
        style: profileData.style,
        title: profileData.name || ai.title,
        contact: {
          phone: profileData.phone || ai.contact.phone,
          email:
            profileData.publicEmail ||
            profileData.ownerEmail ||
            ai.contact.email,
          address: profileData.address || ai.contact.address,
          hours: profileData.hours || ai.contact.hours,
        },
        brand: {
          ...(ai.brand ?? {}),
          logoDataUrl: profileData.logoDataUrl ?? ai.brand?.logoDataUrl,
        },
        products: products.length ? mapProductsToAI(products) : ai.products,
        colorScheme: {
          ...ai.colorScheme,
          primary: profileData.themeColor || ai.colorScheme.primary,
        },
      };

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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Eye size={20} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Website Preview</h1>
          <p className="text-gray-500 mt-2">
            Belum ada konten AI. Generate dulu di menu AI Generator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Website Preview
          </h1>
          <p className="text-gray-500 mt-2">
            Preview landing page UMKM (Hero, About, Produk, CTA).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Pencil size={14} /> Edit Section
          </button>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Palette size={14} /> Change Theme Color
          </button>
        </div>
      </div>

      {editOpen && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama UMKM (Hero)
              </label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={draft.tagline}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, tagline: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi singkat
              </label>
              <textarea
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm resize-none"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                About section
              </label>
              <textarea
                value={draft.about}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, about: e.target.value }))
                }
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm resize-none"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Theme color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={draft.themeColor}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, themeColor: e.target.value }))
                  }
                  className="h-10 w-14 rounded-lg border border-gray-200 bg-white"
                />
                <div className="text-sm text-gray-600">{draft.themeColor}</div>
              </div>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-2">
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SiteTemplate
          content={content}
          businessName={content.title}
          category={profile.businessType}
          isPreview={true}
        />
      </div>
    </div>
  );
}

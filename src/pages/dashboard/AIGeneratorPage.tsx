import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Info, Loader2 } from "lucide-react";
import { chatWithAssistant, generateWebsiteContent } from "../../lib/api";
import type { AIContent } from "../../lib/types";
import {
  getDefaultProfile,
  loadProfile,
  saveAiContent,
  saveProfile,
  setWebsiteActive,
  type UmkmStyle,
} from "../../lib/dashboardStore";

const BUSINESS_TYPES = [
  { value: "kuliner", label: "Kuliner" },
  { value: "jasa", label: "Jasa" },
  { value: "fashion", label: "Fashion" },
  { value: "kecantikan", label: "Kecantikan" },
  { value: "elektronik", label: "Elektronik" },
  { value: "pendidikan", label: "Pendidikan" },
  { value: "kesehatan", label: "Kesehatan" },
  { value: "umum", label: "Umum" },
];

const STYLES: Array<{ value: UmkmStyle; label: string }> = [
  { value: "modern", label: "Modern" },
  { value: "minimal", label: "Minimal" },
  { value: "food", label: "Food" },
  { value: "luxury", label: "Luxury" },
];

function applyStyleToContent(style: UmkmStyle, content: AIContent): AIContent {
  const base: AIContent = { ...content, style };

  // FE-only: keep it minimal, only adjust tagline tone a bit.
  if (style === "minimal") {
    return { ...base, tagline: content.tagline.slice(0, 60) };
  }

  return base;
}

export default function AIGeneratorPage() {
  const navigate = useNavigate();
  const [initial, setInitial] = useState(getDefaultProfile());
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [umkmName, setUmkmName] = useState("");
  const [businessType, setBusinessType] = useState(initial.businessType);
  const [shortDescription, setShortDescription] = useState("");
  const [targetCustomers, setTargetCustomers] = useState("");
  const [style, setStyle] = useState<UmkmStyle>(initial.style);
  const [descPrompt, setDescPrompt] = useState("");

  const [generatingDesc, setGeneratingDesc] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      const profile = await loadProfile();
      if (!alive) return;
      setInitial(profile);
      setUmkmName(profile.name);
      setBusinessType(profile.businessType);
      setShortDescription(profile.shortDescription);
      setTargetCustomers(profile.targetCustomers);
      setStyle(profile.style);
      setLoadingProfile(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const onGenerateDescription = async () => {
    if (loadingProfile || generatingDesc) return;

    if (!umkmName.trim()) {
      setError("Nama UMKM wajib diisi sebelum generate deskripsi.");
      return;
    }

    if (!descPrompt.trim()) {
      setError("Tulis permintaan deskripsi dulu.");
      return;
    }

    setError("");
    setGeneratingDesc(true);

    try {
      const message = `Buat deskripsi singkat (1-3 kalimat) untuk bisnis berikut.\nNama: ${umkmName}\nJenis usaha: ${businessType}\nTarget pelanggan: ${targetCustomers || "-"}\nKebutuhan pengguna: ${descPrompt}\nGunakan bahasa Indonesia, tanpa Markdown.`;
      const res = await chatWithAssistant({
        message,
        context: {
          businessName: umkmName,
          businessType,
          targetCustomers,
        },
      });
      setShortDescription(res.reply.trim());
    } catch {
      setError("Gagal generate deskripsi. Coba lagi sebentar.");
    } finally {
      setGeneratingDesc(false);
    }
  };

  const onGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loadingProfile) return;

    if (!umkmName.trim()) {
      setError("Nama UMKM wajib diisi.");
      return;
    }

    if (!shortDescription.trim()) {
      setError("Deskripsi singkat wajib diisi.");
      return;
    }

    if (!targetCustomers.trim()) {
      setError("Target pelanggan wajib diisi.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const nextProfile = {
        ...initial,
        name: umkmName,
        businessType,
        shortDescription,
        targetCustomers,
        style,
      };

      // save profile first
      await saveProfile(nextProfile);

      const ai = await generateWebsiteContent({
        businessName: umkmName,
        businessDescription: `${shortDescription}\nTarget pelanggan: ${targetCustomers}\nStyle: ${style}\nKontak (gunakan jika ada):\nTelepon: ${nextProfile.phone || "-"}\nEmail: ${nextProfile.publicEmail || nextProfile.ownerEmail || "-"}\nAlamat: ${nextProfile.address || "-"}\nJam buka: ${nextProfile.hours || "-"}`,
        category: businessType,
      });

      const styled = applyStyleToContent(style, ai);
      const merged: AIContent = {
        ...styled,
        title: nextProfile.name || styled.title,
        contact: {
          phone: nextProfile.phone || styled.contact.phone,
          email:
            nextProfile.publicEmail ||
            nextProfile.ownerEmail ||
            styled.contact.email,
          address: nextProfile.address || styled.contact.address,
          hours: nextProfile.hours || styled.contact.hours,
        },
        brand: {
          ...(styled.brand ?? {}),
          logoDataUrl: nextProfile.logoDataUrl ?? styled.brand?.logoDataUrl,
        },
        colorScheme: {
          ...styled.colorScheme,
          primary: nextProfile.themeColor || styled.colorScheme.primary,
        },
      };
      await saveAiContent(merged);
      await setWebsiteActive(true);
      navigate("/dashboard/preview", { replace: true });
    } catch {
      setError(
        "Gagal generate website. Coba jalankan backend API atau coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          AI Website Generator
        </h1>
        <p className="text-gray-500 mt-2">
          Isi form ini lalu klik Generate Website.
        </p>
      </div>

      <form
        onSubmit={onGenerate}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama UMKM <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={umkmName}
              onChange={(e) => setUmkmName(e.target.value)}
              placeholder="Contoh: Warung Bu Sari"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 placeholder-gray-400 text-sm"
              maxLength={120}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Usaha <span className="text-red-500">*</span>
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm"
            >
              {BUSINESS_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Deskripsi singkat <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={onGenerateDescription}
                disabled={generatingDesc}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-200 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-60"
              >
                {generatingDesc ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                Generate AI
              </button>
            </div>
            <input
              type="text"
              value={descPrompt}
              onChange={(e) => setDescPrompt(e.target.value)}
              placeholder="Mau bikin deskripsi tentang apa? AI bakal bantu bikinin deskripsinya"
              className="w-full mb-3 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 placeholder-gray-400 text-sm"
              maxLength={200}
            />
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Jelaskan produk/layanan utama UMKM kamu..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 placeholder-gray-400 text-sm resize-none"
              maxLength={600}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target pelanggan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={targetCustomers}
              onChange={(e) => setTargetCustomers(e.target.value)}
              placeholder="Contoh: mahasiswa, ibu rumah tangga, pekerja kantoran"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 placeholder-gray-400 text-sm"
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Style <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStyle(s.value)}
                  className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                    style === s.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <Info size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
          <p className="text-xs text-gray-400 flex items-center gap-2">
            <Info size={12} />
            Konten AI akan tersimpan untuk preview.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Website
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

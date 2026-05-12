import { useEffect, useState } from "react";
import { Save, Image as ImageIcon } from "lucide-react";
import {
  fileToDataUrl,
  loadProfile,
  saveProfile,
  type UmkmProfile,
} from "../../lib/dashboardStore";

export default function SettingsPage() {
  const [form, setForm] = useState<UmkmProfile>({
    name: "",
    businessType: "kuliner",
    shortDescription: "",
    targetCustomers: "",
    style: "modern",
    ownerEmail: "",
    phone: "",
    publicEmail: "",
    address: "",
    hours: "",
    domainName: "",
    logoDataUrl: null,
    themeColor: "#2563eb",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const maxImageBytes = 5 * 1024 * 1024;

  useEffect(() => {
    let alive = true;

    (async () => {
      const profile = await loadProfile();
      if (!alive) return;
      setForm(profile);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await saveProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaved(false);
      setError(
        err instanceof Error ? err.message : "Gagal menyimpan settings.",
      );
    }
  };

  const onLogo = async (file: File | null, input?: HTMLInputElement) => {
    if (!file) return;
    if (file.size > maxImageBytes) {
      setError("Ukuran logo terlalu besar (maks 5MB).");
      setForm((f) => ({ ...f, logoDataUrl: null }));
      if (input) input.value = "";
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setForm((f) => ({ ...f, logoDataUrl: dataUrl }));
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-gray-500 mt-2">
          Pengaturan UMKM tersimpan di akun kamu.
        </p>
      </div>

      <form
        onSubmit={onSave}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama UMKM
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Logo upload
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center">
                {form.logoDataUrl ? (
                  <img
                    src={form.logoDataUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={20} className="text-gray-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onLogo(e.target.files?.[0] ?? null, e.target)}
                className="text-sm text-gray-600"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Theme color picker
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.themeColor}
                onChange={(e) =>
                  setForm((f) => ({ ...f, themeColor: e.target.value }))
                }
                className="h-10 w-14 rounded-lg border border-gray-200 bg-white"
              />
              <div className="text-sm text-gray-600">{form.themeColor}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email owner
            </label>
            <input
              type="email"
              value={form.ownerEmail}
              onChange={(e) =>
                setForm((f) => ({ ...f, ownerEmail: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telepon (publik)
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="contoh: 0812xxxxxxx"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email (publik)
              </label>
              <input
                type="email"
                value={form.publicEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, publicEmail: e.target.value }))
                }
                placeholder="contoh: cs@tokokamu.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alamat (publik)
            </label>
            <textarea
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              rows={3}
              placeholder="contoh: Jl. Mawar No. 12, Bandung"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jam buka
            </label>
            <input
              type="text"
              value={form.hours}
              onChange={(e) =>
                setForm((f) => ({ ...f, hours: e.target.value }))
              }
              placeholder="contoh: Sen–Sab 09:00–21:00"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Domain name (optional dummy)
            </label>
            <input
              type="text"
              value={form.domainName}
              onChange={(e) =>
                setForm((f) => ({ ...f, domainName: e.target.value }))
              }
              placeholder="contoh: tokokamu.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm"
            />
          </div>
        </div>

        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            {saved ? "Tersimpan." : ""}
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <Save size={16} />
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Info,
  Package,
  Pencil,
  Trash2,
  Plus,
  X,
  Check,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

type OwnerProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
};

const STORAGE_KEY = "sitealra_owner_products_v1";

function formatIDR(value: number): string {
  if (!Number.isFinite(value)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function OwnerProductsPage() {
  const [products, setProducts] = useState<OwnerProduct[]>([]);
  const [error, setError] = useState("");

  const [draft, setDraft] = useState({
    id: "" as string | "",
    name: "",
    description: "",
    price: "" as string | "",
  });

  const isEditing = useMemo(() => Boolean(draft.id), [draft.id]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as OwnerProduct[];
      if (Array.isArray(parsed)) setProducts(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  const resetDraft = () => {
    setDraft({ id: "", name: "", description: "", price: "" });
    setError("");
  };

  const startEdit = (p: OwnerProduct) => {
    setDraft({
      id: p.id,
      name: p.name,
      description: p.description,
      price: String(p.price),
    });
    setError("");
  };

  const remove = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (draft.id === id) resetDraft();
  };

  const upsert = (e: React.FormEvent) => {
    e.preventDefault();

    if (!draft.name.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }

    const priceNumber = Number(String(draft.price).replace(/,/g, "."));
    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      setError("Harga tidak valid.");
      return;
    }

    setError("");

    if (draft.id) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === draft.id
            ? {
                ...p,
                name: draft.name.trim(),
                description: draft.description.trim(),
                price: priceNumber,
              }
            : p,
        ),
      );
    } else {
      const next: OwnerProduct = {
        id: newId(),
        name: draft.name.trim(),
        description: draft.description.trim(),
        price: priceNumber,
      };
      setProducts((prev) => [next, ...prev]);
    }

    resetDraft();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <Link
          to="/owner"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Dashboard Owner
        </Link>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-xs font-semibold mb-3">
            <Package size={12} />
            Produk
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Kelola Produk
          </h1>
          <p className="text-gray-500 text-lg">
            Frontend dulu: data disimpan lokal. Nanti tinggal ganti ke database
            (MySQL via Express) per user.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900">
                  {isEditing ? "Edit Produk" : "Tambah Produk"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Isi nama, deskripsi, dan harga.
                </p>
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetDraft}
                  className="inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-semibold transition-colors"
                >
                  <X size={14} />
                  Batal
                </button>
              )}
            </div>

            <form onSubmit={upsert} className="p-7 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, name: e.target.value }))
                  }
                  placeholder="Contoh: Keripik Pedas 250gr"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 placeholder-gray-400 text-sm"
                  maxLength={120}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={draft.description}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, description: e.target.value }))
                  }
                  placeholder="Tulis deskripsi singkat produk..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 placeholder-gray-400 text-sm resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {draft.description.length}/500 karakter
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Harga (IDR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={draft.price}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, price: e.target.value }))
                  }
                  placeholder="Contoh: 25000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 placeholder-gray-400 text-sm"
                  min={0}
                  step={500}
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <Info
                    size={16}
                    className="text-red-500 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                {isEditing ? (
                  <>
                    <Check size={16} /> Simpan Perubahan
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Tambah Produk
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 flex items-center gap-2">
                <Info size={12} />
                Setelah backend siap, form ini tinggal dihubungkan ke API
                Express.
              </p>
            </form>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900">Daftar Produk</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {products.length} item
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProducts([])}
                className="inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-semibold transition-colors"
              >
                <Trash2 size={14} />
                Hapus Semua
              </button>
            </div>

            {products.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Package size={20} />
                </div>
                <p className="text-gray-700 font-semibold">Belum ada produk.</p>
                <p className="text-gray-400 text-sm mt-1">
                  Tambah produk pertama kamu di panel kiri.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="p-6 flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 truncate">
                          {p.name}
                        </h3>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-sm font-semibold text-blue-600">
                          {formatIDR(p.price)}
                        </span>
                      </div>
                      {p.description ? (
                        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                          {p.description}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-sm mt-2">
                          Tanpa deskripsi.
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

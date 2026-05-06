import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  X,
  Check,
} from "lucide-react";
import {
  fileToDataUrl,
  loadProducts,
  newId,
  saveProducts,
  type DashboardProduct,
} from "../../lib/dashboardStore";

function formatIDR(value: number): string {
  if (!Number.isFinite(value)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}

type Draft = {
  id: string;
  name: string;
  price: string;
  description: string;
  imageDataUrl: string | null;
};

export default function ProductsCrudPage() {
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const maxImageBytes = 5 * 1024 * 1024;

  const [draft, setDraft] = useState<Draft>({
    id: "",
    name: "",
    price: "",
    description: "",
    imageDataUrl: null,
  });

  const isEditing = useMemo(() => Boolean(draft.id), [draft.id]);

  useEffect(() => {
    let alive = true;

    (async () => {
      const data = await loadProducts();
      if (!alive) return;
      setProducts(data);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const commitProducts = async (nextProducts: DashboardProduct[]) => {
    const result = await saveProducts(nextProducts);
    if (!result.ok) {
      setError(
        result.error === "network"
          ? "Gagal menyimpan. Periksa koneksi atau backend."
          : "Gagal menyimpan perubahan. Coba lagi.",
      );
      return false;
    }

    setProducts(nextProducts);
    setError("");
    return true;
  };

  const openCreate = () => {
    setDraft({
      id: "",
      name: "",
      price: "",
      description: "",
      imageDataUrl: null,
    });
    setError("");
    setModalOpen(true);
  };

  const openEdit = (p: DashboardProduct) => {
    setDraft({
      id: p.id,
      name: p.name,
      price: String(p.price),
      description: p.description,
      imageDataUrl: p.imageDataUrl,
    });
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setError("");
  };

  const onDelete = async (id: string) => {
    const nextProducts = products.filter((p) => p.id !== id);
    await commitProducts(nextProducts);
  };

  const onSubmit = async (e: React.FormEvent) => {
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

    let nextProducts: DashboardProduct[] = [];
    if (draft.id) {
      nextProducts = products.map((p) =>
        p.id === draft.id
          ? {
              ...p,
              name: draft.name.trim(),
              price: priceNumber,
              description: draft.description.trim(),
              imageDataUrl: draft.imageDataUrl,
            }
          : p,
      );
    } else {
      const next: DashboardProduct = {
        id: newId(),
        name: draft.name.trim(),
        price: priceNumber,
        description: draft.description.trim(),
        imageDataUrl: draft.imageDataUrl,
      };
      nextProducts = [next, ...products];
    }

    if (await commitProducts(nextProducts)) {
      closeModal();
    }
  };

  const onImageChange = async (
    file: File | null,
    input?: HTMLInputElement,
  ) => {
    if (!file) return;
    if (file.size > maxImageBytes) {
      setError("Ukuran gambar terlalu besar (maks 5MB).");
      setDraft((d) => ({ ...d, imageDataUrl: null }));
      if (input) input.value = "";
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setDraft((d) => ({ ...d, imageDataUrl: dataUrl }));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            CRUD Produk
          </h1>
          <p className="text-gray-500 mt-2">
            Kelola produk dalam bentuk grid card.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <ImageIcon size={20} />
          </div>
          <p className="text-gray-700 font-semibold">Belum ada produk.</p>
          <p className="text-gray-400 text-sm mt-1">
            Klik “Tambah Produk” untuk mulai.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
                {p.imageDataUrl ? (
                  <img
                    src={p.imageDataUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon size={26} className="mx-auto mb-2" />
                    <div className="text-xs">Tidak ada gambar</div>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate">
                      {p.name}
                    </div>
                    <div className="text-sm font-semibold text-blue-600 mt-1">
                      {formatIDR(p.price)}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                  {p.description || "Tanpa deskripsi."}
                </p>

                <div className="mt-5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[200] overflow-y-auto">
          <div
            className="absolute inset-0 bg-gray-900/40"
            onClick={closeModal}
          />
          <div className="min-h-full flex items-start sm:items-center justify-center px-4 py-8">
            <div className="relative w-full max-w-lg max-h-[calc(100vh-4rem)] bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden flex flex-col">
              <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">
                    {isEditing ? "Edit Produk" : "Tambah Produk"}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Isi nama, harga, deskripsi, dan upload gambar.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={onSubmit}
                className="p-7 space-y-5 overflow-y-auto"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, name: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm"
                    maxLength={120}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Harga <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={draft.price}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, price: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm"
                    min={0}
                    step={500}
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
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 text-sm resize-none"
                    maxLength={600}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload gambar
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center">
                      {draft.imageDataUrl ? (
                        <img
                          src={draft.imageDataUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={20} className="text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        onImageChange(e.target.files?.[0] ?? null, e.target)
                      }
                      className="text-sm text-gray-600"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  <Check size={16} /> {isEditing ? "Simpan" : "Tambah"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

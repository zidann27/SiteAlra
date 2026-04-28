import { Link } from "react-router-dom";
import { Package, Sparkles, ArrowRight, LayoutDashboard } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function OwnerHomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-xs font-semibold mb-3">
            <LayoutDashboard size={12} />
            Dashboard Owner
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Kelola Website & Produk
          </h1>
          <p className="text-gray-500 text-lg">
            Mulai dari generate website, lalu isi produk kamu lewat CRUD.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Sparkles size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Generate Website
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Isi profil bisnis, generate konten dengan AI, lalu preview dan
              deploy.
            </p>
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Mulai Generate
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Package size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Kelola Produk
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Tambah, ubah, dan hapus produk. Data produk nantinya akan tampil
              dinamis di website.
            </p>
            <Link
              to="/owner/products"
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Buka Produk
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <h3 className="font-bold text-gray-900 mb-2">
            Saran alur paling simpel
          </h3>
          <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1">
            <li>Generate website dulu (bikin halaman dan tema).</li>
            <li>Kelola produk di dashboard owner.</li>
            <li>
              Nanti halaman produk di website ambil data dari database
              (dinamis).
            </li>
          </ol>
        </div>
      </div>

      <Footer />
    </div>
  );
}

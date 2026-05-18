import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white">SiteAlra</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Platform pembuat website UMKM bertenaga AI. Buat website
              profesional untuk bisnis Anda dalam hitungan detik.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Produk</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/generate"
                  className="hover:text-white transition-colors"
                >
                  Generator Website
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Fitur
                </a>
              </li>
              <li>
                <a
                  href="#examples"
                  className="hover:text-white transition-colors"
                >
                  Contoh Website
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Bantuan & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/data-deletion"
                  className="hover:text-white transition-colors"
                >
                  Data Deletion
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="text-xs text-center">
            © 2026 SiteAlra. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}

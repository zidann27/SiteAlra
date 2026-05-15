import { Link } from 'react-router-dom';
import { Zap, Heart } from 'lucide-react';

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
              Platform pembuat website UMKM bertenaga AI. Buat website profesional untuk bisnis Anda dalam hitungan detik.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Produk</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/generate" className="hover:text-white transition-colors">Generator Website</Link></li>
              <li><a href="#features" className="hover:text-white transition-colors">Fitur</a></li>
              <li><a href="#examples" className="hover:text-white transition-colors">Contoh Website</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Kategori</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white cursor-default transition-colors">Kuliner</span></li>
              <li><span className="hover:text-white cursor-default transition-colors">Jasa & Layanan</span></li>
              <li><span className="hover:text-white cursor-default transition-colors">Fashion</span></li>
              <li><span className="hover:text-white cursor-default transition-colors">Kecantikan</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">© 2026 SiteAlra.  All rights reserved.</p>
          <p className="text-xs flex items-center gap-1">
            Dibuat dengan <Heart size={12} className="text-red-400" /> untuk UMKM Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}

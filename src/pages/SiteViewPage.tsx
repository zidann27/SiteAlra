import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, Zap } from 'lucide-react';
import { GeneratedSite } from '../lib/types';
import { getSiteBySlug } from '../lib/api';
import SiteTemplate from '../components/preview/SiteTemplate';

export default function SiteViewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [site, setSite] = useState<GeneratedSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        const data = await getSiteBySlug(slug);
        if (!data) {
          setError('Website tidak ditemukan.');
        } else {
          setSite(data);
        }
      } catch {
        setError('Gagal memuat website. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat website...</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Website Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">{error || 'Website yang Anda cari tidak tersedia.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Zap size={16} />
            Buat Website Baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 py-2 bg-gray-900/90 backdrop-blur-md text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-blue-400" />
          <span className="font-medium text-white">SiteAlra</span>
          <span className="text-gray-500">·</span>
          <span className="text-gray-400 hidden sm:inline">Dibuat dengan AI dalam 30 detik</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {site.view_count + 1} kunjungan
          </span>
          <Link
            to="/generate"
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition-colors"
          >
            Buat Website Saya
          </Link>
        </div>
      </div>

      <div className="pt-10">
        <SiteTemplate
          content={site.ai_content}
          businessName={site.business_name}
          category={site.category}
          slug={site.slug}
          isPreview={false}
        />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CategoryCard from '../components/generator/CategoryCard';
import GenerationProgress from '../components/generator/GenerationProgress';
import { CATEGORIES, GenerateFormData } from '../lib/types';
import { generateWebsiteContent } from '../lib/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<GenerateFormData>({
    businessName: '',
    businessDescription: '',
    category: 'kuliner',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim() || !form.businessDescription.trim()) {
      setError('Nama usaha dan deskripsi wajib diisi.');
      return;
    }
    setError('');
    setIsGenerating(true);

    try {
      const aiContent = await generateWebsiteContent(form);
      navigate('/preview', { state: { formData: form, aiContent } });
    } catch (err) {
      setError('Terjadi kesalahan saat membuat website. Silakan coba lagi.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors">
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </Link>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-xs font-semibold mb-3">
            <Sparkles size={12} />
            AI Website Generator
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Buat Website Bisnis Anda
          </h1>
          <p className="text-gray-500 text-lg">
            Isi informasi bisnis Anda dan biarkan AI kami bekerja.
          </p>
        </div>

        {isGenerating ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <GenerationProgress />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Usaha <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  placeholder="Contoh: Warung Bu Sari, Salon Cantik Indah..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 placeholder-gray-400 text-sm"
                  maxLength={100}
                />
                <p className="text-xs text-gray-400 mt-1">{form.businessName.length}/100 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi Usaha <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.businessDescription}
                  onChange={(e) => setForm({ ...form, businessDescription: e.target.value })}
                  placeholder="Ceritakan tentang bisnis Anda: apa yang Anda jual, keunggulan produk/layanan, target pelanggan, dll..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 placeholder-gray-400 text-sm resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1">{form.businessDescription.length}/500 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Kategori Bisnis <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {CATEGORIES.map((cat) => (
                    <CategoryCard
                      key={cat.value}
                      {...cat}
                      selected={form.category === cat.value}
                      onClick={() => setForm({ ...form, category: cat.value })}
                    />
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

            <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <Info size={12} />
                Konten dibuat otomatis oleh AI · Mock data digunakan jika API tidak tersedia
              </p>
              <button
                type="submit"
                disabled={!form.businessName || !form.businessDescription}
                className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm"
              >
                <Sparkles size={16} />
                Generate Website
              </button>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
}

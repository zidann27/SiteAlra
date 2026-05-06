import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  const previewImage = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg';

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Didukung kecerdasan buatan (AI)</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white dark:text-blue-50 leading-tight mb-6">
            Website Profesional
            <span className="block bg-gradient-to-r from-blue-300 via-sky-300 to-cyan-300 dark:from-blue-200 dark:via-sky-200 dark:to-cyan-200 bg-clip-text text-transparent">
              untuk UMKM Anda
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Buat website bisnis yang menakjubkan dalam hitungan detik. Cukup masukkan nama usaha Anda,
            dan AI kami akan membuat seluruh konten website secara otomatis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/generate"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30 hover:-translate-y-0.5 text-base"
            >
              Buat Website Gratis
              <ArrowRight size={18} />
            </Link>
            <a
              href="#examples"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all duration-200 text-base"
            >
              Lihat Contoh
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            {['Gratis selamanya', 'Tanpa kartu kredit', 'Siap dalam 30 detik'].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle size={15} className="text-green-400" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
          <div className="relative bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/50 border-b border-slate-700/50">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-4 bg-slate-700/50 rounded-md px-3 py-1 text-xs text-slate-400 text-center">
                sitealra.id/site/warung-bu-sari
              </div>
            </div>
            <div className="aspect-[16/7] bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 w-[200%] h-full flex animate-hero-loop-left opacity-40">
                <img
                  src={previewImage}
                  alt="Preview website"
                  className="w-1/2 h-full object-cover flex-shrink-0"
                />
                <img
                  src={previewImage}
                  alt="Preview website"
                  className="w-1/2 h-full object-cover flex-shrink-0"
                />
              </div>
              <div className="relative z-10 text-center px-8">
                <p className="text-3xl font-bold text-amber-900 mb-2">Warung Bu Sari</p>
                <p className="text-amber-700 font-medium">Cita Rasa Rumahan yang Selalu Dinantikan</p>
                <div className="mt-4 inline-block bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-semibold">
                  Lihat Menu
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

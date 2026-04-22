import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
          ))}
        </div>

        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
          Bergabung dengan ribuan UMKM
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            yang sudah online
          </span>
        </h2>

        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Jangan biarkan bisnis Anda tertinggal. Mulai bangun kehadiran online Anda hari ini — gratis, cepat, dan profesional.
        </p>

        <Link
          to="/generate"
          className="inline-flex items-center gap-2 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 shadow-xl shadow-blue-600/25 hover:-translate-y-0.5 text-lg"
        >
          Mulai Sekarang — Gratis
          <ArrowRight size={20} />
        </Link>

        <p className="mt-6 text-slate-400 text-sm">Tidak perlu kartu kredit · Tidak perlu coding · Siap dalam 30 detik</p>
      </div>
    </section>
  );
}

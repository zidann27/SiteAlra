import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
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
          <span className="text-blue-200">yang sudah online</span>
        </h2>

        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Jangan biarkan bisnis Anda tertinggal. Mulai bangun kehadiran online Anda hari ini — gratis, cepat, dan profesional.
        </p>

        <Link
          to="/generate"
          className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-xl hover:-translate-y-0.5 text-lg"
        >
          Mulai Sekarang — Gratis
          <ArrowRight size={20} />
        </Link>

        <p className="mt-6 text-blue-200 text-sm">Tidak perlu kartu kredit · Tidak perlu coding · Siap dalam 30 detik</p>
      </div>
    </section>
  );
}

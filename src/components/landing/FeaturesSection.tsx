import { Sparkles, Globe, Smartphone, Zap, Palette, Share2 } from 'lucide-react';
import { useScrollReveal, revealStyle } from '../../lib/useScrollReveal';

const features = [
  { icon: Sparkles, color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600', title: 'AI-Powered Content', description: 'Konten website dibuat otomatis oleh AI: judul, deskripsi, produk, hingga informasi kontak — semua relevan dengan bisnis Anda.' },
  { icon: Zap, color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600', title: 'Siap dalam 30 Detik', description: 'Tidak perlu coding atau desain. Cukup isi form singkat dan website Anda siap tampil dalam hitungan detik.' },
  { icon: Smartphone, color: 'bg-green-50 dark:bg-green-950/60 text-green-600', title: 'Responsif di Semua Perangkat', description: 'Website otomatis menyesuaikan tampilan di ponsel, tablet, maupun desktop — tanpa konfigurasi tambahan.' },
  { icon: Palette, color: 'bg-pink-50 dark:bg-pink-950/60 text-pink-600', title: 'Desain Sesuai Kategori', description: 'Skema warna dan gaya visual dipilih otomatis berdasarkan kategori bisnis Anda untuk tampilan yang profesional.' },
  { icon: Globe, color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600', title: 'URL Unik Instan', description: 'Setiap website mendapat URL unik yang bisa langsung dibagikan ke pelanggan, tanpa perlu beli domain.' },
  { icon: Share2, color: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600', title: 'Mudah Dibagikan', description: 'Salin link website Anda dan bagikan via WhatsApp, Instagram, atau media sosial lainnya dengan mudah.' },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={revealStyle(visible, index * 80)}
      className="group p-6 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900 hover:-translate-y-1"
    >
      <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
        <feature.icon size={22} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
}

export default function FeaturesSection() {
  const { ref: headingRef, visible: headingVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} style={revealStyle(headingVisible)} className="text-center mb-16">
          <span className="inline-block text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Fitur Unggulan</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Semua yang Anda butuhkan
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Dari generasi konten hingga publish — kami tangani semuanya untuk Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

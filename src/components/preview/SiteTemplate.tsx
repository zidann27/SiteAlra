import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import { AIContent } from '../../lib/types';

interface SiteTemplateProps {
  content: AIContent;
  businessName: string;
  category: string;
  slug?: string;
  isPreview?: boolean;
}

export default function SiteTemplate({ content, businessName, isPreview = false }: SiteTemplateProps) {
  const { colorScheme } = content;

  return (
    <div className="font-sans bg-white" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav
        className="sticky top-0 z-50 shadow-sm"
        style={{ backgroundColor: colorScheme.primary }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <span className="text-white font-bold text-lg tracking-tight">{content.title}</span>
            <div className="hidden sm:flex items-center gap-6">
              {['Beranda', 'Tentang', 'Produk', 'Kontak'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <section
        id="beranda"
        className="relative min-h-[420px] flex items-center overflow-hidden"
        style={{ backgroundColor: colorScheme.secondary }}
      >
        <div className="absolute inset-0">
          <img
            src={content.heroImage}
            alt={content.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colorScheme.primary}CC, ${colorScheme.accent}99)` }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              {content.title}
            </h1>
            <p className="text-xl text-white/90 mb-6 font-medium">{content.tagline}</p>
            <p className="text-white/80 mb-8 leading-relaxed text-sm">{content.description}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#kontak"
                className="inline-block px-6 py-3 bg-white font-semibold rounded-lg text-sm transition-all hover:opacity-90"
                style={{ color: colorScheme.primary }}
              >
                Hubungi Kami
              </a>
              <a
                href="#produk"
                className="inline-block px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-lg text-sm hover:bg-white/20 transition-all"
              >
                Lihat Produk
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="tentang" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{ backgroundColor: colorScheme.secondary, color: colorScheme.primary }}
              >
                Tentang Kami
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Kenapa Memilih {businessName}?
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">{content.about}</p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[['100+', 'Pelanggan Puas'], ['5+', 'Tahun Pengalaman'], ['4.9', 'Rating Kepuasan']].map(([num, label]) => (
                  <div key={label} className="text-center p-3 rounded-xl" style={{ backgroundColor: colorScheme.secondary }}>
                    <div className="text-2xl font-bold" style={{ color: colorScheme.primary }}>{num}</div>
                    <div className="text-xs text-gray-500 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img src={content.heroImage} alt="About" className="w-full h-full object-cover" />
              </div>
              <div
                className="absolute -bottom-4 -left-4 w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: colorScheme.primary }}
              >
                <div className="text-center text-white">
                  <div className="text-xl font-bold">✓</div>
                  <div className="text-xs font-medium">Terpercaya</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="produk" className="py-16" style={{ backgroundColor: colorScheme.secondary }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: colorScheme.primary + '20', color: colorScheme.primary }}
            >
              Produk & Layanan
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Yang Kami Tawarkan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.products.map((product, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl"
                  style={{ backgroundColor: colorScheme.secondary }}
                >
                  {['🍽️', '⭐', '🎁', '💎', '🏆', '✨'][index % 6]}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{product.description}</p>
                <div
                  className="font-bold text-lg"
                  style={{ color: colorScheme.primary }}
                >
                  {product.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="kontak" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: colorScheme.secondary, color: colorScheme.primary }}
            >
              Hubungi Kami
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Kami Siap Membantu Anda</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Phone, label: 'Telepon', value: content.contact.phone },
              { icon: Mail, label: 'Email', value: content.contact.email },
              { icon: MapPin, label: 'Alamat', value: content.contact.address },
              { icon: Clock, label: 'Jam Buka', value: content.contact.hours },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: colorScheme.secondary }}
                >
                  <Icon size={20} style={{ color: colorScheme.primary }} />
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-sm text-gray-700 font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-white/70" style={{ backgroundColor: colorScheme.accent }}>
        <p>© 2024 {content.title}. Semua hak cipta dilindungi.</p>
        {!isPreview && (
          <p className="mt-2 flex items-center justify-center gap-1 text-xs text-white/50">
            Dibuat dengan <ExternalLink size={10} /> SiteAlra
          </p>
        )}
      </footer>
    </div>
  );
}

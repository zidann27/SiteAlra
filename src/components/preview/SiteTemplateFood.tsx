import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  UtensilsCrossed,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import type { AIContent } from "../../lib/types";

interface SiteTemplateProps {
  content: AIContent;
  businessName: string;
  category: string;
  slug?: string;
  isPreview?: boolean;
}

export default function SiteTemplateFood({
  content,
  businessName,
  isPreview = false,
}: SiteTemplateProps) {
  const { colorScheme } = content;
  const logo = content.brand?.logoDataUrl;
  const useProductCarousel = content.products.length > 6;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sanitizeText = (text: string) => {
    const trimmed = (text || "").trim();
    if (!trimmed) return trimmed;

    const cutMarkers = [
      /\bstyle\s*:/i,
      /\bkontak\b\s*[:(]/i,
      /\btelepon\b\s*:/i,
      /\bemail\b\s*:/i,
      /\bjam\s*buka\b\s*:/i,
    ];

    let cutIndex = -1;
    for (const marker of cutMarkers) {
      const match = marker.exec(trimmed);
      if (match && (cutIndex === -1 || match.index < cutIndex)) {
        cutIndex = match.index;
      }
    }

    return (cutIndex >= 0 ? trimmed.slice(0, cutIndex) : trimmed)
      .replace(/\s+/g, " ")
      .trim();
  };

  const clamp2Style = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  } as const;

  const featured = content.products[0];

  return (
    <div
      className="font-sans bg-white antialiased text-gray-900 selection:bg-gray-900 selection:text-white overflow-x-hidden"
      style={{
        fontFamily: "system-ui, sans-serif",
        scrollBehavior: "smooth",
        ["--food-primary" as any]: colorScheme.primary,
        ["--food-primary-soft" as any]: `${colorScheme.primary}12`,
      }}
    >
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 min-w-0">
              {logo ? (
                <img
                  src={logo}
                  alt={`${content.title} logo`}
                  className="w-10 h-10 rounded-full bg-white object-cover flex-shrink-0 shadow-md"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-lg"
                  style={{ backgroundColor: colorScheme.primary }}
                >
                  <UtensilsCrossed size={16} />
                </div>
              )}

              <div className="min-w-0">
                <div
                  className="font-extrabold text-base tracking-tight truncate"
                  style={{ color: colorScheme.primary }}
                >
                  {content.title}
                </div>
                <div className="text-[11px] text-gray-400 truncate">
                  Menu & Promo Harian
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                {[
                  ["Beranda", "beranda"],
                  ["Menu", "produk"],
                  ["Kontak", "kontak"],
                ].map(([label, id]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-[0.2em] text-gray-700 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {label}
                  </a>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="sm:hidden inline-flex items-center justify-center w-11 h-11 rounded-2xl text-white shadow-lg"
                style={{ backgroundColor: colorScheme.primary }}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          <div
            className={`sm:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-72 pb-4" : "max-h-0"}`}
          >
            <div className="mt-3 rounded-[1.75rem] bg-white border border-gray-100 shadow-lg p-3">
              <div className="grid grid-cols-1 gap-2">
                {[
                  ["Beranda", "beranda"],
                  ["Menu", "produk"],
                  ["Kontak", "kontak"],
                ].map(([label, id]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 bg-gray-50 border border-gray-100"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        id="beranda"
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${colorScheme.secondary}, #ffffff)`,
        }}
      >
        <div className="absolute inset-0">
          <img
            src={content.heroImage}
            alt={content.title}
            className="w-full h-full object-cover scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${colorScheme.primary}DD, ${colorScheme.accent}99)`,
              backdropFilter: "blur(2px)",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 xs:py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-5 bg-white/70 border border-white/60 backdrop-blur-md shadow-md">
                <UtensilsCrossed
                  size={14}
                  style={{ color: colorScheme.primary }}
                />
                Food
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight drop-shadow-lg">
                {content.title}
              </h1>

              <p className="text-lg sm:text-xl text-white/95 mb-5 font-bold">
                {content.tagline}
              </p>

              <p className="text-white/85 mb-8 leading-relaxed text-sm max-w-xl">
                {sanitizeText(content.description)}
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#produk"
                  className="inline-flex items-center justify-center px-7 py-3 bg-white font-extrabold rounded-full text-sm shadow-xl hover:scale-105 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                  style={{ color: colorScheme.primary }}
                >
                  Lihat Menu
                </a>
                <a
                  href="#kontak"
                  className="inline-flex items-center justify-center px-7 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-extrabold rounded-full text-sm hover:bg-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                >
                  Pesan Sekarang
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/75 backdrop-blur-2xl border border-white/50 rounded-[2rem] p-6 shadow-2xl hover:-translate-y-2 hover:rotate-1 transition-all duration-500">
                <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-gray-600">
                  Rekomendasi
                </div>
                <div className="mt-2 text-lg font-extrabold text-gray-900">
                  {featured?.name || businessName}
                </div>
                <div className="mt-1 text-sm text-gray-600" style={clamp2Style}>
                  {sanitizeText(featured?.description || content.about)}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div
                    className="text-sm font-extrabold"
                    style={{ color: colorScheme.primary }}
                  >
                    {featured?.price || ""}
                  </div>
                  <div
                    className="text-[11px] font-extrabold uppercase tracking-[0.2em] px-3 py-2 rounded-full"
                    style={{
                      backgroundColor: `${colorScheme.primary}15`,
                      color: colorScheme.primary,
                    }}
                  >
                    Best Seller
                  </div>
                </div>
              </div>

              <div
                className="hidden lg:block absolute -bottom-10 -right-6 w-28 h-28 rounded-[2rem]"
                style={{
                  backgroundColor: `${colorScheme.primary}33`,
                  animation: "float 6s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="tentang"
        className="py-14"
        style={{ backgroundColor: colorScheme.secondary }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-xl overflow-hidden">
            <div className="p-7">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2">
                  <div
                    className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4"
                    style={{
                      backgroundColor: `${colorScheme.primary}12`,
                      color: colorScheme.primary,
                    }}
                  >
                    Tentang Kami
                  </div>

                  <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                    Kenapa Memilih {businessName}?
                  </h2>

                  <p className="text-gray-600 leading-relaxed text-base">
                    {sanitizeText(content.about)}
                  </p>
                </div>

                <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
                  {[
                    ["🔥", "Rasa Mantap"],
                    ["⏱️", "Cepat"],
                    ["⭐", "Favorit"],
                  ].map(([icon, label]) => (
                    <div
                      key={label}
                      className="p-4 rounded-3xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="text-2xl">{icon}</div>
                      <div className="mt-3 text-xs font-extrabold uppercase tracking-[0.2em] text-gray-500">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="produk" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4"
              style={{
                backgroundColor: `${colorScheme.primary}12`,
                color: colorScheme.primary,
              }}
            >
              Menu
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Yang Kami Tawarkan
            </h2>
          </div>

          {useProductCarousel ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {content.products.map((product, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-lg"
                >
                  <div className="group p-5 sm:p-6 hover:bg-[color:var(--food-primary-soft)] transition-all duration-300">
                    <div className="flex items-start gap-4 transition-all duration-300">
                      <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 shadow-md group-hover:shadow-xl transition-all duration-300">
                        {product.imageDataUrl ? (
                          <img
                            src={product.imageDataUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-2xl"
                            style={{ backgroundColor: colorScheme.secondary }}
                          >
                            {["🍗", "🍜", "🍔", "🥤", "🍟", "🍰"][index % 6]}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-extrabold text-gray-900 truncate group-hover:text-[color:var(--food-primary)] transition-colors duration-300">
                              {product.name}
                            </div>
                            <div
                              className="mt-1 text-sm text-gray-600 leading-relaxed"
                              style={clamp2Style}
                            >
                              {product.description}
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div
                              className="text-sm font-extrabold"
                              style={{ color: colorScheme.primary }}
                            >
                              {product.price}
                            </div>
                            <div
                              className="mt-2 inline-flex text-[10px] font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                              style={{
                                backgroundColor: `${colorScheme.primary}12`,
                                color: colorScheme.primary,
                              }}
                            >
                              {index % 3 === 0
                                ? "Favorit"
                                : index % 3 === 1
                                  ? "Baru"
                                  : "Promo"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-lg">
              <div className="divide-y divide-gray-100">
                {content.products.map((product, index) => (
                  <div
                    key={index}
                    className="group p-5 sm:p-6 hover:bg-[color:var(--food-primary-soft)] transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 transition-all duration-300">
                      <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 shadow-md group-hover:shadow-xl transition-all duration-300">
                        {product.imageDataUrl ? (
                          <img
                            src={product.imageDataUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-2xl"
                            style={{ backgroundColor: colorScheme.secondary }}
                          >
                            {["🍗", "🍜", "🍔", "🥤", "🍟", "🍰"][index % 6]}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-extrabold text-gray-900 truncate group-hover:text-[color:var(--food-primary)] transition-colors duration-300">
                              {product.name}
                            </div>
                            <div
                              className="mt-1 text-sm text-gray-600 leading-relaxed"
                              style={clamp2Style}
                            >
                              {product.description}
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div
                              className="text-sm font-extrabold"
                              style={{ color: colorScheme.primary }}
                            >
                              {product.price}
                            </div>
                            <div
                              className="mt-2 inline-flex text-[10px] font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                              style={{
                                backgroundColor: `${colorScheme.primary}12`,
                                color: colorScheme.primary,
                              }}
                            >
                              {index % 3 === 0
                                ? "Favorit"
                                : index % 3 === 1
                                  ? "Baru"
                                  : "Promo"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="kontak"
        className="relative py-16 overflow-hidden"
        style={{ backgroundColor: colorScheme.secondary }}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 w-full h-16 text-white"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,64 C240,96 480,32 720,64 C960,96 1200,32 1440,64 L1440,0 L0,0 Z"
          />
          <path
            d="M0,70 C240,102 480,38 720,70 C960,102 1200,38 1440,70"
            fill="none"
            stroke={colorScheme.primary}
            strokeWidth="2"
            opacity="0.18"
          />
        </svg>

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 w-full h-16 text-white"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,56 C240,24 480,88 720,56 C960,24 1200,88 1440,56 L1440,120 L0,120 Z"
          />
          <path
            d="M0,52 C240,20 480,84 720,52 C960,20 1200,84 1440,52"
            fill="none"
            stroke={colorScheme.primary}
            strokeWidth="2"
            opacity="0.18"
          />
        </svg>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-4 sm:p-7">
              <div className="text-center mb-6 sm:mb-10">
                <div
                  className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-3 sm:mb-4"
                  style={{
                    backgroundColor: `${colorScheme.primary}12`,
                    color: colorScheme.primary,
                  }}
                >
                  Kontak
                </div>

                <h2 className="text-2xl xs:text-3xl sm:text-3xl font-extrabold text-gray-900">
                  Kami Siap Membantu Anda
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: Phone,
                    label: "Telepon",
                    value: content.contact.phone,
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: content.contact.email,
                  },
                  {
                    icon: MapPin,
                    label: "Alamat",
                    value: content.contact.address,
                  },
                  {
                    icon: Clock,
                    label: "Jam Buka",
                    value: content.contact.hours,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="text-center p-3 sm:p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className="w-10 sm:w-12 h-10 sm:h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3"
                      style={{ backgroundColor: `${colorScheme.primary}12` }}
                    >
                      <Icon
                        size={14}
                        className="sm:w-[18px] sm:h-[18px]"
                        style={{ color: colorScheme.primary }}
                      />
                    </div>

                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-1">
                      {label}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-800 font-medium leading-snug">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-sm text-gray-500 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
        <p>© 2026 {content.title}. Semua hak cipta dilindungi.</p>

        {!isPreview && (
          <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
            Dibuat dengan <ExternalLink size={10} /> SiteAlra
          </p>
        )}
      </footer>

      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-12px);
            }
            100% {
              transform: translateY(0px);
            }
          }
        `}
      </style>
    </div>
  );
}

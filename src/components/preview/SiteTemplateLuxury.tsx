import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ArrowRight,
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

export default function SiteTemplateLuxury({
  content,
  isPreview = false,
}: SiteTemplateProps) {
  const { colorScheme } = content;
  const logo = content.brand?.logoDataUrl;
  const useProductCarousel = content.products.length > 6;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const clamp2Style = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  } as const;

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
      if (match && (cutIndex === -1 || match.index < cutIndex))
        cutIndex = match.index;
    }

    return (cutIndex >= 0 ? trimmed.slice(0, cutIndex) : trimmed)
      .replace(/\s+/g, " ")
      .trim();
  };

  return (
    <div
      className="bg-[#f4f1eb] text-[#1d1d1d] overflow-x-hidden"
      style={{
        fontFamily: `"Inter", system-ui, sans-serif`,
      }}
    >
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#f4f1eb]/90 border-b-2 border-black/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* LOGO */}
            <div className="flex items-center gap-4">
              {logo ? (
                <img
                  src={logo}
                  alt={`${content.title} logo`}
                  className="w-11 h-11 rounded-full object-cover"
                />
              ) : (
                <div className="w-11 h-11 rounded-full border border-black/20 flex items-center justify-center text-sm font-semibold">
                  LX
                </div>
              )}

              <div>
                <div className="font-black text-lg tracking-tight uppercase">
                  {content.title}
                </div>

                <div className="text-xs tracking-[0.25em] uppercase text-black/40">
                  Collection
                </div>
              </div>
            </div>

            {/* MENU */}
            <div className="hidden lg:flex items-center gap-10">
              {[
                ["Home", "beranda"],
                ["About", "tentang"],
                ["Collections", "produk"],
                ["Contact", "kontak"],
              ].map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="relative text-[12px] uppercase tracking-[0.2em] text-black/55 hover:text-black transition-all duration-300 after:absolute after:left-0 after:-bottom-2 after:w-0 after:h-[1px] after:bg-black hover:after:w-full after:transition-all after:duration-300"
                >
                  {label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* CTA */}
              <a
                href="#kontak"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-3 bg-black text-white text-xs uppercase tracking-[0.2em] hover:bg-[#2b2b2b] transition-all duration-300"
              >
                Contact
                <ArrowRight size={14} />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-black/20 bg-white/70 text-black shadow-sm"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-72 pb-4" : "max-h-0"}`}
          >
            <div className="mt-3 rounded-[1.75rem] border border-black/10 bg-[#f8f4ee] p-3 shadow-lg">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Home", "beranda"],
                  ["About", "tentang"],
                  ["Collections", "produk"],
                  ["Contact", "kontak"],
                ].map(([label, id]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-2xl px-3 py-3 text-xs uppercase tracking-[0.2em] text-black/70 bg-white/70 border border-black/5"
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
        className="min-h-[60vh] sm:min-h-screen flex items-center py-8 sm:py-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* LEFT */}
            <div className="relative p-4 sm:p-10 lg:p-16 flex flex-col justify-center">
              {/* TOP */}
              <div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-black/40 mb-6 sm:mb-8">
                  Premium
                </div>

                <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.9] tracking-tight">
                  WHERE
                  <br />
                  <span style={{ color: colorScheme.primary }}>QUALITY</span>
                  <br />
                  MEETS STYLE.
                </h1>

                <p className="mt-6 sm:mt-8 text-black/60 leading-relaxed max-w-md text-xs sm:text-base">
                  {sanitizeText(content.description)}
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href="#produk"
                    className="px-7 py-4 text-xs uppercase tracking-[0.25em] text-white transition-all duration-300 hover:translate-y-[-2px]"
                    style={{
                      backgroundColor: colorScheme.primary,
                    }}
                  >
                    Explore Collection
                  </a>

                  <a
                    href="#kontak"
                    className="px-7 py-4 border border-black/10 text-xs uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all duration-300"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div
              className="relative min-h-[300px] sm:min-h-[500px] lg:min-h-full"
              style={{
                backgroundColor: `${colorScheme.primary}20`,
              }}
            >
              <img
                src={content.heroImage}
                alt={content.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-black/5" />

              {/* FLOATING INFO */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/10 p-6">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-white/70">
                    Signature
                  </div>

                  <div className="mt-3 text-2xl font-semibold text-white">
                    {content.tagline}
                  </div>

                  <div className="mt-3 text-sm text-white/70 leading-relaxed">
                    Elegant details crafted for timeless premium experiences.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="bg-[#f4f1eb] py-12">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-6">
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to right, transparent, ${colorScheme.primary}66, transparent)`,
              }}
            />
            <div
              className="w-3.5 h-3.5 rotate-45 border"
              style={{ borderColor: `${colorScheme.primary}99` }}
            />
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to right, transparent, ${colorScheme.primary}66, transparent)`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: `${colorScheme.primary}55` }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: `${colorScheme.primary}88` }}
            />
            <span
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: `${colorScheme.primary}55` }}
            />
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <section id="tentang" className="py-20 sm:py-28 bg-[#f8f5ef]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* IMAGE */}
            <div className="relative">
              <div className="overflow-hidden shadow-2xl">
                <img
                  src={content.heroImage}
                  alt="About"
                  className="w-full h-[420px] sm:h-[650px] object-cover hover:scale-105 transition-transform duration-1000"
                />
              </div>

              <div
                className="absolute -bottom-10 -right-10 w-52 h-52"
                style={{
                  backgroundColor: `${colorScheme.primary}15`,
                }}
              />
            </div>

            {/* CONTENT */}
            <div>
              <div className="text-[11px] uppercase tracking-[0.35em] text-black/40 mb-6">
                About Brand
              </div>

              <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
                Timeless Elegance
                <span className="block" style={{ color: colorScheme.primary }}>
                  Meets Modern Style
                </span>
              </h2>

              <p className="mt-8 text-black/60 leading-relaxed text-base sm:text-lg">
                {sanitizeText(content.about)}
              </p>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  ["100+", "Premium Clients"],
                  ["10+", "Years Experience"],
                  ["4.9", "Rating"],
                ].map(([num, label]) => (
                  <div
                    key={label}
                    className="bg-white p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <div
                      className="text-4xl font-black"
                      style={{ color: colorScheme.primary }}
                    >
                      {num}
                    </div>

                    <div className="mt-3 text-xs uppercase tracking-[0.2em] text-black/40">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="bg-[#f8f5ef] py-12">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-6">
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to right, transparent, ${colorScheme.primary}55, transparent)`,
              }}
            />
            <div
              className="w-3.5 h-3.5 rotate-45 border"
              style={{ borderColor: `${colorScheme.primary}88` }}
            />
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to right, transparent, ${colorScheme.primary}55, transparent)`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: `${colorScheme.primary}44` }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: `${colorScheme.primary}77` }}
            />
            <span
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: `${colorScheme.primary}44` }}
            />
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <section id="produk" className="py-12 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div>
              <div className="text-[11px] uppercase tracking-[0.35em] text-black/40 mb-5">
                Collection
              </div>

              <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                Featured Products
              </h2>
            </div>

            <p className="max-w-xl text-black/55 leading-relaxed">
              Carefully curated premium collections with elegant presentation
              inspired by fashion and jewelry editorial websites.
            </p>
          </div>

          {/* PRODUCTS LIST */}
          {useProductCarousel ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {content.products.map((product, index) => (
                <div
                  key={index}
                  className="group bg-[#faf7f2] overflow-hidden hover:shadow-[0_25px_80px_rgba(0,0,0,0.08)] transition-all duration-700"
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    {product.imageDataUrl ? (
                      <img
                        src={product.imageDataUrl}
                        alt={product.name}
                        className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                    ) : (
                      <div
                        className="w-full h-[420px] flex items-center justify-center text-5xl"
                        style={{
                          backgroundColor: `${colorScheme.primary}10`,
                        }}
                      >
                        {["✦", "◇", "◆", "⬡", "✧", "◈"][index % 6]}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* PRICE */}
                    <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-xl px-4 py-2 text-xs uppercase tracking-[0.2em] shadow-lg">
                      {product.price}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-5">
                      <div className="min-w-0">
                        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">
                          {product.name}
                        </h3>

                        <p
                          className="mt-4 text-black/55 leading-relaxed text-sm"
                          style={clamp2Style}
                        >
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* FOOT */}
                    <div className="mt-8 flex items-center justify-end">
                      <a
                        href="#kontak"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] hover:gap-3 transition-all duration-300"
                        style={{
                          color: colorScheme.primary,
                        }}
                      >
                        Request
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {content.products.map((product, index) => (
                <div
                  key={index}
                  className="group bg-[#faf7f2] overflow-hidden hover:shadow-[0_25px_80px_rgba(0,0,0,0.08)] transition-all duration-700"
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    {product.imageDataUrl ? (
                      <img
                        src={product.imageDataUrl}
                        alt={product.name}
                        className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                    ) : (
                      <div
                        className="w-full h-[420px] flex items-center justify-center text-5xl"
                        style={{
                          backgroundColor: `${colorScheme.primary}10`,
                        }}
                      >
                        {["✦", "◇", "◆", "⬡", "✧", "◈"][index % 6]}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* PRICE */}
                    <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-xl px-4 py-2 text-xs uppercase tracking-[0.2em] shadow-lg">
                      {product.price}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-5">
                      <div className="min-w-0">
                        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">
                          {product.name}
                        </h3>

                        <p
                          className="mt-4 text-black/55 leading-relaxed text-sm"
                          style={clamp2Style}
                        >
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* FOOT */}
                    <div className="mt-8 flex items-center justify-end">
                      <a
                        href="#kontak"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] hover:gap-3 transition-all duration-300"
                        style={{
                          color: colorScheme.primary,
                        }}
                      >
                        Request
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-6">
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to right, transparent, ${colorScheme.primary}55, transparent)`,
              }}
            />
            <div
              className="w-3.5 h-3.5 rotate-45 border"
              style={{ borderColor: `${colorScheme.primary}88` }}
            />
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to right, transparent, ${colorScheme.primary}55, transparent)`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: `${colorScheme.primary}44` }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: `${colorScheme.primary}77` }}
            />
            <span
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: `${colorScheme.primary}44` }}
            />
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <section id="kontak" className="py-12 sm:py-20 lg:py-28 bg-[#f8f5ef]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          {/* HEADER */}
          <div className="text-center mb-10 sm:mb-16 lg:mb-20">
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-black/40 mb-3 sm:mb-5">
              Contact
            </div>

            <h2 className="text-2xl xs:text-3xl sm:text-5xl font-black tracking-tight">
              Let’s Create Something Great
            </h2>
          </div>

          {/* CONTACT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
            {[
              { icon: Phone, label: "Phone", value: content.contact.phone },
              { icon: Mail, label: "Email", value: content.contact.email },
              {
                icon: MapPin,
                label: "Address",
                value: content.contact.address,
              },
              { icon: Clock, label: "Hours", value: content.contact.hours },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="bg-white p-4 sm:p-8 overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500"
              >
                <div
                  className="w-10 sm:w-14 h-10 sm:h-14 flex items-center justify-center mb-3 sm:mb-6"
                  style={{
                    backgroundColor: `${colorScheme.primary}10`,
                  }}
                >
                  <Icon
                    size={18}
                    className="sm:w-[22px] sm:h-[22px]"
                    style={{ color: colorScheme.primary }}
                  />
                </div>

                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-black/35 mb-2 sm:mb-3">
                  {label}
                </div>

                <div className="text-xs sm:text-base text-black/70 leading-relaxed max-w-full break-words whitespace-pre-line">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative overflow-hidden bg-[#111111] text-white">
        <div
          className="absolute top-0 left-0 w-full h-[1px]"
          style={{
            background: `linear-gradient(to right, transparent, ${colorScheme.primary}, transparent)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* LEFT */}
            <div>
              <div className="text-2xl font-black uppercase tracking-tight">
                {content.title}
              </div>

              <div className="mt-3 text-sm text-white/45 max-w-md leading-relaxed">
                Crafted with premium aesthetics, timeless layouts, and elegant
                modern experiences.
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-center lg:text-right">
              <div className="text-sm text-white/60">
                © 2026 {content.title}
              </div>

              {!isPreview && (
                <div className="mt-3 flex items-center justify-center lg:justify-end gap-2 text-xs uppercase tracking-[0.2em] text-white/35">
                  <ExternalLink size={12} />
                  Built with SiteAlra
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

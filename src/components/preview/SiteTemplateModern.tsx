import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Sparkles,
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

export default function SiteTemplateModern({
  content,
  businessName,
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

  return (
    <div
      className="relative bg-[#fafafa] text-gray-900 antialiased"
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        scrollBehavior: "smooth",
      }}
    >
      {/* BACKGROUND DECOR */}
      <div
        className={`${isPreview ? "absolute" : "fixed"} inset-0 -z-10 overflow-hidden`}
      >
        <div
          className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: colorScheme.primary }}
        />

        <div
          className="absolute bottom-[-250px] right-[-100px] w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: colorScheme.accent }}
        />
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="h-20 flex items-center justify-between gap-3">
            {/* LOGO */}
            <div className="flex items-center gap-3 min-w-0">
              {logo ? (
                <img
                  src={logo}
                  alt={`${content.title} logo`}
                  className="w-11 h-11 rounded-2xl object-cover shadow-md"
                />
              ) : (
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.accent})`,
                  }}
                >
                  <Sparkles size={18} />
                </div>
              )}

              <div>
                <div className="font-black text-lg tracking-tight">
                  {content.title}
                </div>
              </div>
            </div>

            {/* MENU */}
            <div className="hidden md:flex items-center gap-8">
              {[
                ["Beranda", "beranda"],
                ["Tentang", "tentang"],
                ["Produk", "produk"],
                ["Kontak", "kontak"],
              ].map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="relative text-sm font-medium text-gray-600 hover:text-black transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all after:duration-300"
                >
                  {label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <a
                href="#kontak"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.accent})`,
                }}
              >
                Contact
                <ArrowRight size={16} />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/80 border border-white/50 text-gray-900 shadow-sm"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-72 pb-4" : "max-h-0"}`}
          >
            <div className="mt-3 rounded-3xl border border-white/20 bg-white/90 backdrop-blur-xl p-3 shadow-xl">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Beranda", "beranda"],
                  ["Tentang", "tentang"],
                  ["Produk", "produk"],
                  ["Kontak", "kontak"],
                ].map(([label, id]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-2xl px-3 py-3 text-sm font-semibold text-gray-700 bg-white/70 border border-gray-100 hover:bg-white"
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
        className="relative min-h-[60vh] sm:min-h-screen flex items-center overflow-hidden"
      >
        {/* IMAGE */}
        <div className="absolute inset-0">
          <img
            src={content.heroImage}
            alt={content.title}
            className="w-full h-full object-cover scale-105"
          />

          <div className="absolute inset-0 bg-black/50" />

          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${colorScheme.primary}88, ${colorScheme.accent}66)`,
            }}
          />
        </div>

        {/* CONTENT */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-8 sm:py-16 lg:py-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">
                <Sparkles size={14} />
                Modern Template
              </div>

              <h1 className="text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight text-white">
                Build a<span className="block text-white/80">Modern Brand</span>
              </h1>

              <p className="mt-7 text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
                {content.description}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#produk"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white text-sm font-bold shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                  style={{ color: colorScheme.primary }}
                >
                  Explore Products
                  <ArrowRight size={18} />
                </a>

                <a
                  href="#kontak"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-bold hover:bg-white/20 hover:scale-105 transition-all duration-300"
                >
                  Get in Touch
                </a>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-7 shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="relative overflow-hidden rounded-[1.5rem]">
                  <img
                    src={content.heroImage}
                    alt={content.title}
                    className="w-full h-[240px] sm:h-[300px] lg:h-[360px] object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/70 font-bold">
                        Featured Brand
                      </div>

                      <div className="mt-2 text-2xl font-bold text-white">
                        {businessName}
                      </div>

                      <div className="mt-2 text-sm text-white/70 leading-relaxed">
                        {content.tagline}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FLOATING ELEMENTS */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-40"
                style={{ backgroundColor: colorScheme.accent }}
              />

              <div
                className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-30"
                style={{ backgroundColor: colorScheme.primary }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="tentang" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* IMAGE */}
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] shadow-2xl">
                <img
                  src={content.heroImage}
                  alt="About"
                  className="w-full h-[250px] sm:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div
                className="absolute -bottom-8 -right-8 w-48 h-48 rounded-[2rem] blur-3xl opacity-30"
                style={{ backgroundColor: colorScheme.primary }}
              />
            </div>

            {/* CONTENT */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6"
                style={{
                  backgroundColor: `${colorScheme.primary}15`,
                  color: colorScheme.primary,
                }}
              >
                About Us
              </div>

              <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
                Why Choose
                <span className="block">{businessName}?</span>
              </h2>

              <p className="mt-7 text-gray-600 text-lg leading-relaxed">
                {content.about}
              </p>

              <div className="mt-10 grid grid-cols-3 gap-5">
                {[
                  ["100+", "Happy Clients"],
                  ["24/7", "Support"],
                  ["4.9", "Reviews"],
                ].map(([num, label]) => (
                  <div
                    key={label}
                    className="p-5 rounded-3xl border border-gray-100 bg-[#fafafa] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div
                      className="text-3xl font-black"
                      style={{ color: colorScheme.primary }}
                    >
                      {num}
                    </div>

                    <div className="mt-2 text-sm text-gray-500 font-medium">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="produk" className="py-32 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] mb-5"
                style={{
                  backgroundColor: `${colorScheme.primary}12`,
                  color: colorScheme.primary,
                }}
              >
                Featured Products
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none">
                Crafted for
                <span className="block text-gray-400">Modern Brands</span>
              </h2>
            </div>

            <p className="max-w-xl text-gray-500 text-base leading-relaxed">
              Elegant layouts with premium interactions inspired by Apple,
              Framer, Linear, and modern SaaS experiences.
            </p>
          </div>

          {/* GRID */}
          {useProductCarousel ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {content.products.map((product, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 hover:border-transparent hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)] transition-all duration-700"
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    {product.imageDataUrl ? (
                      <img
                        src={product.imageDataUrl}
                        alt={product.name}
                        className="w-full h-[340px] object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    ) : (
                      <div
                        className="w-full h-[340px] flex items-center justify-center text-6xl"
                        style={{
                          background: `linear-gradient(135deg, ${colorScheme.primary}15, ${colorScheme.accent}15)`,
                        }}
                      >
                        {["⚡", "⭐", "🎁", "💡", "🏷️", "✨"][index % 6]}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                    <div className="absolute top-5 right-5">
                      <div className="bg-white/80 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {product.price}
                      </div>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {product.name}
                      </h3>

                      <p
                        className="mt-3 text-white/75 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500"
                        style={clamp2Style}
                      >
                        {product.description}
                      </p>

                      <div className="mt-6">
                        <button className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:gap-3 transition-all duration-300">
                          View Details
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                    style={{ backgroundColor: colorScheme.primary }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {content.products.map((product, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 hover:border-transparent hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)] transition-all duration-700"
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    {product.imageDataUrl ? (
                      <img
                        src={product.imageDataUrl}
                        alt={product.name}
                        className="w-full h-[340px] object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    ) : (
                      <div
                        className="w-full h-[340px] flex items-center justify-center text-6xl"
                        style={{
                          background: `linear-gradient(135deg, ${colorScheme.primary}15, ${colorScheme.accent}15)`,
                        }}
                      >
                        {["⚡", "⭐", "🎁", "💡", "🏷️", "✨"][index % 6]}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                    <div className="absolute top-5 right-5">
                      <div className="bg-white/80 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {product.price}
                      </div>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {product.name}
                      </h3>

                      <p
                        className="mt-3 text-white/75 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500"
                        style={clamp2Style}
                      >
                        {product.description}
                      </p>

                      <div className="mt-6">
                        <button className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:gap-3 transition-all duration-300">
                          View Details
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                    style={{ backgroundColor: colorScheme.primary }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section id="kontak" className="py-12 sm:py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10 sm:mb-16 lg:mb-20">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] mb-4 sm:mb-6"
              style={{
                backgroundColor: `${colorScheme.primary}12`,
                color: colorScheme.primary,
              }}
            >
              Contact
            </div>

            <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight">
              Let’s Create
              <span className="block text-gray-400">Something Great</span>
            </h2>
          </div>

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
                className="group relative overflow-hidden rounded-[2rem] border border-gray-100 bg-[#fafafa] p-4 sm:p-8 hover:bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500"
              >
                <div
                  className="w-10 sm:w-14 h-10 sm:h-14 rounded-2xl flex items-center justify-center mb-3 sm:mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.primary}15, ${colorScheme.accent}15)`,
                  }}
                >
                  <Icon
                    size={16}
                    className="sm:w-[22px] sm:h-[22px]"
                    style={{ color: colorScheme.primary }}
                  />
                </div>

                <div className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-2 sm:mb-3">
                  {label}
                </div>

                <div className="text-xs sm:text-[15px] leading-relaxed text-gray-700 font-normal max-w-full break-words whitespace-pre-line">
                  {value}
                </div>

                <div
                  className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: colorScheme.primary }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.accent})`,
          }}
        />

        <div className="absolute inset-0 backdrop-blur-3xl opacity-40" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            {/* LEFT */}
            <div>
              <div className="flex items-center gap-3">
                {logo ? (
                  <img
                    src={logo}
                    alt="logo"
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white">
                    <Sparkles size={20} />
                  </div>
                )}

                <div>
                  <div className="text-2xl font-black tracking-tight text-white">
                    {content.title}
                  </div>

                  <div className="text-sm text-white/60">
                    Modern digital experience.
                  </div>
                </div>
              </div>

              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70">
                Premium website template with elegant interactions, immersive
                layouts, and contemporary visual language.
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-start lg:items-end gap-4">
              <div className="flex items-center gap-6 text-sm text-white/70">
                <a
                  href="#beranda"
                  className="hover:text-white transition-colors"
                >
                  Home
                </a>

                <a
                  href="#tentang"
                  className="hover:text-white transition-colors"
                >
                  About
                </a>

                <a
                  href="#produk"
                  className="hover:text-white transition-colors"
                >
                  Products
                </a>

                <a
                  href="#kontak"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </div>

              {!isPreview && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <ExternalLink size={14} />
                  Built with SiteAlra
                </div>
              )}
            </div>
          </div>

          <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-white/50">
              © 2026 {content.title}. All rights reserved.
            </div>

            <div className="text-xs uppercase tracking-[0.2em] text-white/40">
              Modern UI Experience
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

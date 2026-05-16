import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
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

export default function SiteTemplateMinimal({
  content,
  businessName,
  isPreview = false,
}: SiteTemplateProps) {
  const { colorScheme } = content;
  const logo = content.brand?.logoDataUrl;
  const useProductCarousel = content.products.length > 6;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sanitizeHeroText = (text: string) => {
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

    const cleaned = (cutIndex >= 0 ? trimmed.slice(0, cutIndex) : trimmed)
      .replace(/\s+/g, " ")
      .trim();

    return cleaned;
  };

  const heroDescription = sanitizeHeroText(content.description);

  const clamp2Style = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  } as const;

  return (
    <div
      className="relative bg-white text-black antialiased overflow-x-hidden"
      style={{
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      {/* NAVBAR */}
      <nav
        className={
          isPreview
            ? "absolute top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-black/5"
            : "fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-black/5"
        }
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="h-20 flex items-center justify-between gap-3">
            {/* LOGO */}
            <div className="flex items-center gap-3 min-w-0">
              {logo ? (
                <img
                  src={logo}
                  alt={content.title}
                  className="w-10 h-10 object-contain"
                />
              ) : null}

              <div className="text-3xl font-light tracking-tight uppercase truncate">
                {content.title}
              </div>
            </div>

            {/* MENU */}
            <div className="hidden md:flex items-center gap-8">
              {[
                ["Home", "beranda"],
                ["About", "tentang"],
                ["Products", "produk"],
                ["Contact", "kontak"],
              ].map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="text-sm text-black/70 hover:text-black transition-colors duration-300"
                >
                  {label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-2xl border border-black/10 bg-white text-black shadow-sm"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-72 pb-4" : "max-h-0"}`}
          >
            <div className="mt-3 rounded-[1.5rem] border border-black/5 bg-white shadow-sm p-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Home", "beranda"],
                  ["About", "tentang"],
                  ["Products", "produk"],
                  ["Contact", "kontak"],
                ].map(([label, id]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-2xl px-3 py-3 text-sm text-black/75 border border-black/5 bg-black/[0.02]"
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
        className="relative h-[70vh] sm:h-screen sm:min-h-[700px] overflow-hidden bg-white"
      >
        {/* IMAGE */}
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-10 lg:right-10 overflow-hidden rounded-3xl">
            <img
              src={content.heroImage}
              alt={content.title}
              className="w-full h-full object-cover scale-[1.02]"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/25" />
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative h-full flex items-end">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pb-8 sm:pb-16 lg:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-end">
              {/* LEFT */}
              <div>
                <h1 className="text-white text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-none">
                  {content.title}
                </h1>

                <p className="mt-6 text-white/85 text-base sm:text-lg max-w-lg leading-relaxed font-light">
                  {content.tagline}
                </p>

                <div className="mt-8">
                  <a
                    href="#tentang"
                    className="inline-flex items-center px-7 py-3 border border-white/60 text-white text-sm uppercase tracking-[0.15em] hover:bg-white hover:text-black transition-all duration-500"
                  >
                    Find Out More
                  </a>
                </div>
              </div>

              {/* RIGHT */}
              <div className="lg:text-right">
                <div className="space-y-5 text-white/90 max-w-md lg:ml-auto">
                  <div
                    className="text-sm sm:text-base font-light leading-relaxed"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 6,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {heroDescription}
                  </div>

                  <div className="text-sm uppercase tracking-[0.15em]">
                    {businessName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="tentang" className="py-28 border-b border-black/5 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* LEFT */}
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-black/40 mb-6">
                About
              </div>

              <h2 className="text-4xl lg:text-5xl font-light leading-tight tracking-tight">
                Why Choose
                <br />
                {businessName}?
              </h2>
            </div>

            {/* RIGHT */}
            <div>
              <p className="text-lg text-black/70 leading-[2] font-light">
                {content.about}
              </p>

              <div className="mt-14 grid grid-cols-3 gap-6">
                {[
                  ["100+", "Clients"],
                  ["5+", "Years"],
                  ["4.9", "Rating"],
                ].map(([num, label]) => (
                  <div key={label}>
                    <div className="text-3xl font-light">{num}</div>

                    <div className="mt-2 text-xs uppercase tracking-[0.2em] text-black/40">
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
      <section id="produk" className="py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-black/40 mb-6">
                Products
              </div>

              <h2 className="text-4xl lg:text-5xl font-light tracking-tight">
                Selected Works
              </h2>
            </div>

            <div className="max-w-md text-black/50 leading-relaxed font-light">
              Carefully curated products and services with minimalist aesthetic
              and timeless presentation.
            </div>
          </div>

          {/* GRID */}
          {useProductCarousel ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
              {content.products.map((product, index) => (
                <div key={index} className="group">
                  {/* IMAGE */}
                  <div className="relative overflow-hidden bg-[#f5f5f5] aspect-[4/5]">
                    {product.imageDataUrl ? (
                      <img
                        src={product.imageDataUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-light text-black/30">
                        {["01", "02", "03", "04", "05", "06"][index % 6]}
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="pt-6">
                    <div className="flex items-start justify-between gap-5">
                      <div className="min-w-0">
                        <h3 className="text-xl font-light tracking-tight">
                          {product.name}
                        </h3>

                        <p
                          className="mt-3 text-sm text-black/55 leading-relaxed font-light"
                          style={clamp2Style}
                        >
                          {product.description}
                        </p>
                      </div>

                      <div
                        className="text-sm whitespace-nowrap"
                        style={{ color: colorScheme.primary }}
                      >
                        {product.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 gap-y-12 lg:gap-y-20">
              {content.products.map((product, index) => (
                <div key={index} className="group">
                  {/* IMAGE */}
                  <div className="relative overflow-hidden bg-[#f5f5f5] aspect-[4/5]">
                    {product.imageDataUrl ? (
                      <img
                        src={product.imageDataUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-light text-black/30">
                        {["01", "02", "03", "04", "05", "06"][index % 6]}
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="pt-6">
                    <div className="flex items-start justify-between gap-5">
                      <div className="min-w-0">
                        <h3 className="text-xl font-light tracking-tight">
                          {product.name}
                        </h3>

                        <p
                          className="mt-3 text-sm text-black/55 leading-relaxed font-light"
                          style={clamp2Style}
                        >
                          {product.description}
                        </p>
                      </div>

                      <div
                        className="text-sm whitespace-nowrap"
                        style={{ color: colorScheme.primary }}
                      >
                        {product.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="kontak"
        className="py-12 sm:py-20 lg:py-28 border-t border-black/5 bg-[#fafafa]"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20">
            {/* LEFT */}
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-black/40 mb-4 sm:mb-6">
                Contact
              </div>

              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-tight">
                Let's Work
                <br />
                Together
              </h2>
            </div>

            {/* RIGHT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-8 sm:gap-y-12">
              {[
                {
                  icon: Phone,
                  label: "Phone",
                  value: content.contact.phone,
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: content.contact.email,
                },
                {
                  icon: MapPin,
                  label: "Address",
                  value: content.contact.address,
                },
                {
                  icon: Clock,
                  label: "Hours",
                  value: content.contact.hours,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon size={16} className="text-black/40" />

                    <div className="text-xs uppercase tracking-[0.2em] text-black/40">
                      {label}
                    </div>
                  </div>

                  <div className="text-lg font-light leading-relaxed text-black/75">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-black/5 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-black/40">© 2026 {content.title}</div>

          {!isPreview && (
            <div className="flex items-center gap-2 text-sm text-black/40">
              <ExternalLink size={14} />
              SiteAlra
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

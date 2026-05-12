import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { AIContent } from "../../lib/types";

interface SiteTemplateProps {
  content: AIContent;
  businessName: string;
  category: string;
  slug?: string;
  isPreview?: boolean;
}

export default function SiteTemplate({
  content,
  businessName,
  isPreview = false,
}: SiteTemplateProps) {
  const { colorScheme } = content;
  const logo = content.brand?.logoDataUrl;
  const style = content.style || "modern";
  const isMinimal = style === "minimal";

  return (
    <div
      className="font-sans bg-white"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <nav
        className={
          isMinimal
            ? "sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
            : "sticky top-0 z-50 shadow-sm"
        }
        style={isMinimal ? undefined : { backgroundColor: colorScheme.primary }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={
              isMinimal
                ? "flex items-center justify-between h-16"
                : "flex items-center justify-between h-14"
            }
          >
            <div className="flex items-center gap-2 min-w-0">
              {logo ? (
                <img
                  src={logo}
                  alt={`${content.title} logo`}
                  className={
                    isMinimal
                      ? "w-8 h-8 object-contain flex-shrink-0"
                      : "w-8 h-8 rounded-lg bg-white/10 object-cover flex-shrink-0"
                  }
                />
              ) : null}
              <span
                className={
                  isMinimal
                    ? "text-white font-bold text-lg tracking-tight truncate drop-shadow-sm"
                    : "text-white font-bold text-lg tracking-tight truncate"
                }
              >
                {content.title}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              {["Beranda", "Tentang", "Produk", "Kontak"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={
                    isMinimal
                      ? "text-white/80 hover:text-white text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
                      : "text-white/80 hover:text-white text-sm font-medium transition-colors"
                  }
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <section
        id="beranda"
        className={
          isMinimal
            ? "relative min-h-[520px] flex items-center overflow-hidden bg-white"
            : "relative min-h-[420px] flex items-center overflow-hidden"
        }
        style={
          isMinimal ? undefined : { backgroundColor: colorScheme.secondary }
        }
      >
        <div className="absolute inset-0">
          <img
            src={content.heroImage}
            alt={content.title}
            className={
              isMinimal
                ? "w-full h-full object-cover"
                : "w-full h-full object-cover opacity-20"
            }
          />
          {isMinimal ? (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.primary}CC, ${colorScheme.accent}99)`,
              }}
            />
          )}
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <h1
              className={
                isMinimal
                  ? "text-4xl sm:text-5xl font-semibold text-white mb-4 leading-tight tracking-tight"
                  : "text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight"
              }
            >
              {content.title}
            </h1>
            <p className="text-xl text-white/90 mb-6 font-medium">
              {content.tagline}
            </p>
            <p className="text-white/80 mb-8 leading-relaxed text-sm">
              {content.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#kontak"
                className={
                  isMinimal
                    ? "inline-block px-6 py-3 bg-white text-gray-900 font-semibold rounded-none text-sm transition-all hover:bg-white/90"
                    : "inline-block px-6 py-3 bg-white font-semibold rounded-lg text-sm transition-all hover:opacity-90"
                }
                style={isMinimal ? undefined : { color: colorScheme.primary }}
              >
                Hubungi Kami
              </a>
              <a
                href="#produk"
                className={
                  isMinimal
                    ? "inline-block px-6 py-3 bg-transparent border border-white/70 text-white font-semibold rounded-none text-sm hover:bg-white/10 transition-all"
                    : "inline-block px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-lg text-sm hover:bg-white/20 transition-all"
                }
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
                className={
                  isMinimal
                    ? "inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-gray-500"
                    : "inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                }
                style={{
                  backgroundColor: isMinimal
                    ? undefined
                    : colorScheme.secondary,
                  color: isMinimal ? undefined : colorScheme.primary,
                }}
              >
                Tentang Kami
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Kenapa Memilih {businessName}?
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {content.about}
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  ["100+", "Pelanggan Puas"],
                  ["5+", "Tahun Pengalaman"],
                  ["4.9", "Rating Kepuasan"],
                ].map(([num, label]) => (
                  <div
                    key={label}
                    className={
                      isMinimal
                        ? "text-center p-3 border border-gray-100 bg-white"
                        : "text-center p-3 rounded-xl"
                    }
                    style={
                      isMinimal
                        ? undefined
                        : { backgroundColor: colorScheme.secondary }
                    }
                  >
                    <div
                      className="text-2xl font-bold"
                      style={{ color: colorScheme.primary }}
                    >
                      {num}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div
                className={
                  isMinimal
                    ? "aspect-square overflow-hidden border border-gray-100"
                    : "aspect-square rounded-2xl overflow-hidden shadow-xl"
                }
              >
                <img
                  src={content.heroImage}
                  alt="About"
                  className="w-full h-full object-cover"
                />
              </div>
              {!isMinimal && (
                <div
                  className="absolute -bottom-4 -left-4 w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: colorScheme.primary }}
                >
                  <div className="text-center text-white">
                    <div className="text-xl font-bold">✓</div>
                    <div className="text-xs font-medium">Terpercaya</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="produk"
        className={isMinimal ? "py-16 bg-white" : "py-16"}
        style={
          isMinimal ? undefined : { backgroundColor: colorScheme.secondary }
        }
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div
              className={
                isMinimal
                  ? "inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-gray-500"
                  : "inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              }
              style={{
                backgroundColor: isMinimal
                  ? undefined
                  : colorScheme.primary + "20",
                color: isMinimal ? undefined : colorScheme.primary,
              }}
            >
              Produk & Layanan
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Yang Kami Tawarkan
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.products.map((product, index) => (
              <div
                key={index}
                className={
                  isMinimal
                    ? "bg-white border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors"
                    : "bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                }
              >
                {product.imageDataUrl ? (
                  <div
                    className={
                      isMinimal
                        ? "aspect-[4/5] overflow-hidden bg-gray-50 flex items-center justify-center"
                        : "h-36 rounded-2xl overflow-hidden mb-4 bg-gray-50 flex items-center justify-center"
                    }
                    style={
                      isMinimal
                        ? undefined
                        : { backgroundColor: colorScheme.secondary }
                    }
                  >
                    <img
                      src={product.imageDataUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={
                      isMinimal
                        ? "w-full aspect-[4/5] border-b border-gray-100 flex items-center justify-center text-3xl"
                        : "w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl"
                    }
                    style={
                      isMinimal
                        ? undefined
                        : { backgroundColor: colorScheme.secondary }
                    }
                  >
                    {["🍽️", "⭐", "🎁", "💎", "🏆", "✨"][index % 6]}
                  </div>
                )}
                <h3
                  className={
                    isMinimal
                      ? "px-5 pt-4 font-semibold text-gray-900 text-sm tracking-tight"
                      : "font-bold text-gray-900 mb-2"
                  }
                >
                  {product.name}
                </h3>
                <p
                  className={
                    isMinimal
                      ? "px-5 mt-1 text-gray-500 text-xs leading-relaxed line-clamp-2"
                      : "text-gray-500 text-sm mb-4 leading-relaxed"
                  }
                >
                  {product.description}
                </p>
                <div
                  className={
                    isMinimal
                      ? "px-5 pb-5 mt-3 font-semibold text-sm"
                      : "font-bold text-lg"
                  }
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
              className={
                isMinimal
                  ? "inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-gray-500"
                  : "inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              }
              style={{
                backgroundColor: isMinimal ? undefined : colorScheme.secondary,
                color: isMinimal ? undefined : colorScheme.primary,
              }}
            >
              Hubungi Kami
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Kami Siap Membantu Anda
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Phone, label: "Telepon", value: content.contact.phone },
              { icon: Mail, label: "Email", value: content.contact.email },
              { icon: MapPin, label: "Alamat", value: content.contact.address },
              { icon: Clock, label: "Jam Buka", value: content.contact.hours },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className={
                  isMinimal
                    ? "text-center p-5 border border-gray-100 hover:border-gray-200 transition-colors"
                    : "text-center p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                }
              >
                <div
                  className={
                    isMinimal
                      ? "w-12 h-12 border border-gray-200 flex items-center justify-center mx-auto mb-3"
                      : "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  }
                  style={
                    isMinimal
                      ? undefined
                      : { backgroundColor: colorScheme.secondary }
                  }
                >
                  <Icon size={20} style={{ color: colorScheme.primary }} />
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  {label}
                </p>
                <p className="text-sm text-gray-700 font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer
        className={
          isMinimal
            ? "py-10 text-center text-sm text-gray-600 bg-gray-50 border-t border-gray-100"
            : "py-8 text-center text-sm text-white/70"
        }
        style={isMinimal ? undefined : { backgroundColor: colorScheme.accent }}
      >
        <p>© 2024 {content.title}. Semua hak cipta dilindungi.</p>
        {!isPreview && (
          <p
            className={
              isMinimal
                ? "mt-2 flex items-center justify-center gap-1 text-xs text-gray-400"
                : "mt-2 flex items-center justify-center gap-1 text-xs text-white/50"
            }
          >
            Dibuat dengan <ExternalLink size={10} /> SiteAlra
          </p>
        )}
      </footer>
    </div>
  );
}

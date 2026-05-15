import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useScrollReveal, revealStyle } from '../../lib/useScrollReveal';

const faqs = [
  {
    q: 'Apakah SiteAlra benar-benar gratis?',
    a: 'Ya, membuat website di SiteAlra sepenuhnya gratis. Kamu bisa membuat, mengelola, dan mempublikasikan website bisnis tanpa biaya apapun.',
  },
  {
    q: 'Apakah saya perlu keahlian coding?',
    a: 'Tidak sama sekali. SiteAlra dirancang untuk siapa saja — cukup isi informasi bisnis kamu, dan AI kami akan membuatkan website profesional secara otomatis.',
  },
  {
    q: 'Berapa lama proses pembuatan website?',
    a: 'Proses pembuatan hanya membutuhkan sekitar 30 detik setelah kamu mengisi data bisnis. Website langsung bisa diakses dan dibagikan.',
  },
  {
    q: 'Bisakah saya mengedit konten website setelah dibuat?',
    a: 'Tentu saja. Kamu bisa mengubah teks, gambar, daftar produk, dan semua konten kapan saja melalui dashboard owner yang mudah digunakan.',
  },
  {
    q: 'Apakah website saya bisa ditemukan di Google?',
    a: 'Website yang dibuat di SiteAlra sudah dioptimasi dengan struktur HTML yang baik dan meta tag yang relevan untuk membantu mesin pencari mengindeks halamanmu.',
  },
  {
    q: 'Bagaimana cara menambahkan produk ke website?',
    a: 'Login ke dashboard, masuk ke menu Produk, lalu tambahkan nama, harga, deskripsi, dan foto produk. Semua perubahan langsung tampil di website publikmu.',
  },
  {
    q: 'Apakah ada batasan jumlah produk yang bisa ditambahkan?',
    a: 'Saat ini tidak ada batasan. Kamu bebas menambahkan produk sebanyak yang kamu butuhkan.',
  },
];

// ── Item FAQ dengan animasi buka/tutup ──
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={revealStyle(visible, index * 80)}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-4 text-left px-6 py-5 rounded-2xl border transition-all duration-200 group ${
          open
            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 shadow-sm'
            : 'bg-white dark:bg-slate-800 border-zinc-100 dark:border-slate-700 hover:border-blue-100 dark:hover:border-blue-800 hover:bg-zinc-50/60 dark:hover:bg-slate-700/60'
        }`}
        aria-expanded={open}
      >
        <span className={`font-semibold text-sm sm:text-base leading-snug transition-colors ${
          open
            ? 'text-blue-700 dark:text-blue-400'
            : 'text-zinc-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400'
        }`}>
          {q}
        </span>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 transition-all duration-300 ${
            open ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-slate-500'
          }`}
        />
      </button>

      {/* Answer panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="px-6 pt-3 pb-5 text-sm text-zinc-600 dark:text-slate-400 leading-relaxed">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const { ref: headingRef, visible: headingVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50 dark:bg-blue-950/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headingRef}
          style={revealStyle(headingVisible)}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 border border-blue-100 dark:border-blue-900">
            <HelpCircle size={14} />
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-gray-100 mb-4 leading-tight">
            Pertanyaan yang{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Sering Ditanyakan
            </span>
          </h2>
          <p className="text-zinc-500 dark:text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
            Belum menemukan jawaban yang kamu cari? Hubungi kami kapan saja.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

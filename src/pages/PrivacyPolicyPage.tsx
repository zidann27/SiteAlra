import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 text-zinc-900">
      <Navbar />
      <main className="pt-24 pb-16 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-10 h-56 w-56 rounded-full bg-blue-200/40 blur-[90px]" />
          <div className="absolute top-24 -left-10 h-64 w-64 rounded-full bg-sky-200/40 blur-[110px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Legal
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Privacy Policy
              </h1>

              <p className="mt-4 max-w-2xl text-base text-zinc-700">
                Kami menjaga privasi pengguna SiteAlra dengan transparan.
                Berikut ini ringkasan data yang kami kumpulkan, alasan
                penggunaannya, dan pilihan yang Anda miliki.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
            <section className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
              <div className="space-y-6 text-sm leading-relaxed text-zinc-700">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    Informasi yang kami kumpulkan
                  </h2>
                  <ul className="mt-3 list-disc pl-5 space-y-2">
                    <li>Identitas akun: nama, email, dan preferensi login.</li>
                    <li>
                      Profil bisnis: kategori, deskripsi, dan media pendukung.
                    </li>
                    <li>
                      Data penggunaan: aktivitas dashboard dan performa konten.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    Cara kami menggunakan data
                  </h2>
                  <ul className="mt-3 list-disc pl-5 space-y-2">
                    <li>Memberikan layanan pembuatan situs dan fitur AI.</li>
                    <li>Menjaga keamanan akun dan mencegah penyalahgunaan.</li>
                    <li>Meningkatkan pengalaman produk melalui analitik.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    Penyimpanan & keamanan
                  </h2>
                  <p className="mt-3">
                    Kami menerapkan kontrol akses dan enkripsi sesuai standar
                    industri. Data disimpan hanya selama dibutuhkan untuk
                    operasional layanan.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    Hak Anda
                  </h2>
                  <p className="mt-3">
                    Anda dapat memperbarui data, meminta salinan data, atau
                    mengajukan penghapusan akun kapan saja melalui email kami.
                  </p>
                </div>
              </div>
            </section>

            <aside className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
              <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">
                  Kontak Privasi
                </p>
                <h2 className="mt-3 text-lg font-semibold text-zinc-900">
                  Pusat Bantuan Privasi
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Untuk pertanyaan seputar data dan privasi, hubungi kami
                  melalui email berikut.
                </p>
              </div>
              <div className="mt-4 rounded-xl bg-zinc-900 p-4 text-white">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                  Email
                </p>
                <p className="mt-2 text-sm font-semibold">
                  agnankun18@gmail.com
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

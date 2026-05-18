import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function TermsAndConditionsPage() {
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
                Terms & Conditions
              </h1>

              <p className="mt-4 max-w-2xl text-base text-zinc-700">
                Dengan menggunakan SiteAlra, Anda menyetujui syarat dan
                ketentuan yang berlaku. Silakan baca dengan seksama sebelum
                melanjutkan.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
            <section className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
              <div className="space-y-6 text-sm leading-relaxed text-zinc-700">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    1. Definisi & Penggunaan Layanan
                  </h2>
                  <p className="mt-3">
                    SiteAlra adalah platform pembuat website berbasis AI untuk
                    UMKM. Dengan mengakses layanan ini, Anda menerima kondisi
                    penggunaan dan tanggung jawab hukum yang terkait.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    2. Akun Pengguna & Keamanan
                  </h2>
                  <ul className="mt-3 list-disc pl-5 space-y-2">
                    <li>
                      Anda bertanggung jawab menjaga kerahasiaan password.
                    </li>
                    <li>
                      Segala aktivitas akun Anda menjadi tanggung jawab Anda.
                    </li>
                    <li>
                      Kami berhak menonaktifkan akun yang melanggar aturan.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    3. Konten & Kepemilikan Intelektual
                  </h2>
                  <p className="mt-3">
                    Konten yang Anda buat di SiteAlra adalah milik Anda.
                    SiteAlra tidak mengklaim hak kepemilikan atas website atau
                    data bisnis Anda. Namun, Anda memberikan lisensi kepada kami
                    untuk menjalankan dan meningkatkan layanan.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    4. Larangan Penggunaan
                  </h2>
                  <p className="mt-3">Anda dilarang:</p>
                  <ul className="mt-2 list-disc pl-5 space-y-2">
                    <li>Menggunakan layanan untuk kegiatan ilegal.</li>
                    <li>
                      Mengunggah konten yang menyinggung, diskriminatif, atau
                      berbahaya.
                    </li>
                    <li>
                      Mencoba mengganggu keamanan atau stabilitas sistem kami.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    5. Pembatasan Tanggung Jawab
                  </h2>
                  <p className="mt-3">
                    SiteAlra menyediakan layanan "sebagaimana adanya" tanpa
                    jaminan tertentu. Kami tidak bertanggung jawab atas kerugian
                    tidak langsung, kehilangan data, atau kerusakan bisnis yang
                    timbul dari penggunaan layanan.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    6. Pembaruan & Perubahan Layanan
                  </h2>
                  <p className="mt-3">
                    Kami berhak mengubah atau menghentikan layanan tanpa
                    pemberitahuan sebelumnya. Anda akan diberitahu melalui email
                    untuk perubahan signifikan.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    7. Pembayaran & Biaya
                  </h2>
                  <p className="mt-3">
                    Jika ada layanan berbayar, Anda setuju membayar sesuai harga
                    yang tercantum. Pembatalan dapat dilakukan kapan saja sesuai
                    ketentuan billing.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    8. Hukum & Penyelesaian Perselisihan
                  </h2>
                  <p className="mt-3">
                    Syarat dan ketentuan ini diatur oleh hukum Indonesia.
                    Perselisihan akan diselesaikan melalui musyawarah atau
                    mediasi terlebih dahulu.
                  </p>
                </div>
              </div>
            </section>

            <aside className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
              <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">
                  Penting
                </p>
                <h2 className="mt-3 text-lg font-semibold text-zinc-900">
                  Syarat Wajib Baca
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Dengan menggunakan platform ini, Anda dianggap telah membaca
                  dan menyetujui seluruh ketentuan yang berlaku.
                </p>
              </div>
              <div className="mt-4 rounded-xl bg-zinc-900 p-4 text-white">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                  Pertanyaan
                </p>
                <p className="mt-2 text-sm font-semibold">
                  agnankun18@gmail.com
                </p>
              </div>
              <div className="mt-4 text-xs text-zinc-500">
                Hubungi kami jika ada pertanyaan tentang syarat dan ketentuan
                ini.
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

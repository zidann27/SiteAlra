import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50 text-zinc-900">
      <Navbar />
      <main className="pt-24 pb-16 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-16 h-56 w-56 rounded-full bg-blue-200/50 blur-[100px]" />
          <div className="absolute bottom-10 right-0 h-64 w-64 rounded-full bg-sky-200/50 blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Legal
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Data Deletion Instructions
              </h1>
              <p className="mt-3 text-sm text-zinc-600">
                Terakhir diperbarui: 18 Mei 2026
              </p>
              <p className="mt-4 max-w-2xl text-base text-zinc-700">
                Kami siap membantu penghapusan akun dan data Anda dengan proses
                yang jelas serta terukur.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <section className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">
                Langkah Penghapusan Data
              </h2>
              <ol className="mt-4 space-y-3 text-sm text-zinc-700">
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                    1
                  </span>
                  Kirim email ke alamat yang tertera dengan subjek yang sesuai.
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                    2
                  </span>
                  Sertakan email akun SiteAlra Anda dan permintaan penghapusan.
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                    3
                  </span>
                  Tim kami memverifikasi dan memproses permintaan Anda.
                </li>
              </ol>

              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-700">
                  Subjek Email
                </p>
                <p className="mt-2 text-sm font-semibold text-blue-900">
                  Data Deletion Request
                </p>
              </div>
            </section>

            <aside className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">Kontak</h2>
              <p className="mt-3 text-sm text-zinc-600">
                Kirim permintaan ke email berikut. Kami akan menghapus akun dan
                data terkait dalam waktu maksimal 7 hari kerja.
              </p>
              <div className="mt-4 rounded-xl bg-blue-600/90 p-4 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-100">
                  Email
                </p>
                <p className="mt-2 text-sm font-semibold">
                  agnankun18@gmail.com
                </p>
              </div>
              <div className="mt-4 text-xs text-zinc-500">
                Jam operasional: Senin - Jumat, 09.00 - 17.00 WIB.
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { requestPasswordReset } from "../lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email wajib diisi."); return; }
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim email reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans selection:bg-blue-100 bg-white">

      {/* ── LEFT PANEL — hidden on mobile ── */}
      <div className="hidden md:flex md:w-1/2 bg-[#020617] items-center justify-center p-16 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80')" }} />
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[#020617] via-[#020617]/90 to-blue-900/40" />
        <div className="absolute top-1/3 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-[110px] z-[2]" />
        <div className="absolute bottom-1/4 right-0 w-56 h-56 bg-indigo-500/15 rounded-full blur-[90px] z-[2]" />
        <div className="relative z-10 w-full max-w-md flex flex-col justify-center">
          <div className="mb-8"><span className="text-2xl font-bold tracking-tighter text-white">SiteAlra.</span></div>
          <div className="mb-8 w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Mail size={28} className="text-blue-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-[1.15]">Lupa<br />Password?</h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">Jangan khawatir. Masukkan email kamu dan kami akan kirimkan instruksi untuk mereset password.</p>
          <div className="mt-10 space-y-4">
            {[{ step: "1", label: "Masukkan alamat email kamu" }, { step: "2", label: "Cek kotak masuk email" }, { step: "3", label: "Klik link & buat password baru" }].map(({ step, label }) => (
              <div key={step} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-300 text-xs font-bold">{step}</span>
                </div>
                <span className="text-zinc-400 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full md:w-1/2 bg-white flex flex-col min-h-screen relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50 rounded-full blur-[120px] -z-10 opacity-60" />

       

        {/* Centered content */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-sm">

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-3">Reset Password</h2>
              <p className="text-zinc-500 text-sm">Kami akan mengirim link reset ke email kamu.</p>
            </div>

            {done ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Send size={22} className="text-emerald-600" />
                </div>
                <h3 className="font-semibold text-emerald-800 mb-2">Email Terkirim!</h3>
                <p className="text-emerald-700 text-sm leading-relaxed">
                  Jika email <span className="font-medium">{email}</span> terdaftar, link reset password sudah dikirim. Cek kotak masuk kamu.
                </p>
                <Link to="/login" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
                  <ArrowLeft size={14} />
                  Kembali ke Login
                </Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Alamat Email</label>
                  <div className="relative group flex items-center">
                    <div className="absolute left-4 flex items-center justify-center">
                      <Mail size={18} className="text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                      placeholder="you@email.com"
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50/50 hover:bg-white border border-zinc-100 rounded-2xl focus:outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-600/5 transition-all text-zinc-900 placeholder-zinc-400 text-sm font-medium"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm">
                    <span className="mt-0.5">⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-zinc-950 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all text-sm active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-zinc-200"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Send size={16} />Kirim Link Reset</>
                  )}
                </button>
              </form>
            )}

            <p className="mt-8 text-center text-sm text-zinc-500">
              Ingat password kamu?{" "}
              <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800 transition-colors">
                Masuk sekarang
              </Link>
            </p>

          </div>
        </div>
      </div>

    </div>
  );
}

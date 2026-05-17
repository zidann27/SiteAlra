import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";
import { resetPassword } from "../lib/auth";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") || "", [params]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // password strength indicator
  const strength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabel = ["", "Sangat Lemah", "Lemah", "Cukup", "Kuat", "Sangat Kuat"][strength];
  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-blue-500", "bg-emerald-500"][strength];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { setError("Token reset tidak valid."); return; }
    if (password.length < 6) { setError("Password minimal 6 karakter."); return; }
    if (password !== confirm) { setError("Konfirmasi password tidak sama."); return; }

    setError("");
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans selection:bg-blue-100 bg-white overflow-hidden">
      {/* ── LEFT PANEL ── */}
      <div className="w-full md:w-1/2 bg-[#020617] flex items-center justify-center p-8 sm:p-16 min-h-[40vh] md:min-h-screen relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0 opacity-25 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80')",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[#020617] via-[#020617]/90 to-blue-900/40" />
        {/* Glow */}
        <div className="absolute top-1/3 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-[110px] z-[2]" />
        <div className="absolute bottom-1/4 right-0 w-56 h-56 bg-indigo-500/15 rounded-full blur-[90px] z-[2]" />

        <div className="relative z-10 w-full max-w-md flex flex-col justify-center">
          <div className="mb-8">
            <span className="text-2xl font-bold tracking-tighter text-white">SiteAlra.</span>
          </div>

          {/* Icon dekorasi */}
          <div className="mb-8 w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <ShieldCheck size={28} className="text-blue-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-[1.15]">
            Password
            <br />
            Baru
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            Buat password baru yang kuat untuk mengamankan akun kamu.
            Pastikan kamu mengingatnya dengan baik.
          </p>

          {/* Tips keamanan */}
          <div className="mt-10 space-y-3">
            {[
              "Minimal 6 karakter",
              "Kombinasi huruf besar & kecil",
              "Tambahkan angka atau simbol",
            ].map((tip) => (
              <div key={tip} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
                <span className="text-zinc-400 text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8 sm:p-16 min-h-[60vh] md:min-h-screen relative">
        {/* Blur decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50 rounded-full blur-[120px] -z-10 opacity-60" />

        <Link
          to="/login"
          className="absolute top-8 left-8 sm:left-16 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Login
        </Link>

        <div className="w-full max-w-sm flex flex-col relative z-10">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-3">
              Buat Password Baru
            </h2>
            <p className="text-zinc-500 text-sm">
              Masukkan password baru untuk akun kamu.
            </p>
          </div>

          {/* ── SUCCESS STATE ── */}
          {done ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-emerald-800 mb-2 text-lg">Password Berhasil Direset!</h3>
              <p className="text-emerald-700 text-sm leading-relaxed">
                Password kamu sudah diperbarui. Kamu akan diarahkan ke halaman login dalam beberapa detik...
              </p>
              <div className="mt-4 flex justify-center">
                <div className="w-5 h-5 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Password baru */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  Password Baru
                </label>
                <div className="relative group flex items-center">
                  <div className="absolute left-4 flex items-center justify-center">
                    <Lock
                      size={18}
                      className="text-zinc-400 group-focus-within:text-blue-600 transition-colors"
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-zinc-50/50 hover:bg-white border border-zinc-100 rounded-2xl focus:outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-600/5 transition-all text-zinc-900 placeholder-zinc-400 text-sm font-medium tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-zinc-400 hover:text-blue-600 transition-colors focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password strength bar */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength ? strengthColor : "bg-zinc-100"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${
                      strength <= 1 ? "text-red-500" :
                      strength === 2 ? "text-orange-500" :
                      strength === 3 ? "text-yellow-600" :
                      strength === 4 ? "text-blue-600" :
                      "text-emerald-600"
                    }`}>
                      {strengthLabel}
                    </p>
                  </div>
                )}
              </div>

              {/* Konfirmasi password */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative group flex items-center">
                  <div className="absolute left-4 flex items-center justify-center">
                    <Lock
                      size={18}
                      className="text-zinc-400 group-focus-within:text-blue-600 transition-colors"
                    />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-4 bg-zinc-50/50 hover:bg-white border rounded-2xl focus:outline-none focus:bg-white focus:ring-4 transition-all text-zinc-900 placeholder-zinc-400 text-sm font-medium tracking-wide ${
                      confirm.length > 0 && confirm !== password
                        ? "border-red-200 focus:border-red-300 focus:ring-red-600/5"
                        : confirm.length > 0 && confirm === password
                        ? "border-emerald-200 focus:border-emerald-300 focus:ring-emerald-600/5"
                        : "border-zinc-100 focus:border-blue-200 focus:ring-blue-600/5"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 text-zinc-400 hover:text-blue-600 transition-colors focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {confirm.length > 0 && confirm === password && (
                    <div className="absolute right-10">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    </div>
                  )}
                </div>
                {confirm.length > 0 && confirm !== password && (
                  <p className="mt-1 text-xs text-red-500">Password tidak sama</p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm">
                  <span className="mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-zinc-950 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all text-sm active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-zinc-200 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    Simpan Password Baru
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-zinc-500">
            Ingat password lama kamu?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-700 hover:text-blue-800 transition-colors"
            >
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

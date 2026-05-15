import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import {
  getFacebookAuthUrl,
  getGoogleAuthUrl,
  signInWithPassword,
} from "../lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { redirectTo, registered } = useMemo(() => {
    const state = location.state as {
      from?: string;
      registered?: boolean;
    } | null;
    return {
      redirectTo: state?.from || "/dashboard",
      registered: Boolean(state?.registered),
    };
  }, [location.state]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    if (!password.trim()) {
      setError("Password wajib diisi.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await signInWithPassword(email.trim(), password);
      sessionStorage.setItem("sitealra_chat_start_new", "1");
      const target = new URL(redirectTo, window.location.origin);
      target.searchParams.set("startNew", "1");
      navigate(`${target.pathname}${target.search}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    "Template website profesional",
    "Kelola produk & galeri dengan mudah",
    "Pembuatan konten bertenaga AI",
  ];

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans selection:bg-blue-100 bg-white overflow-hidden">
      {/* ── LEFT PANEL ── */}
      <div className="w-full md:w-1/2 bg-[#020617] flex items-center justify-center p-8 sm:p-16 min-h-[40vh] md:min-h-screen relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0 opacity-30 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556740734-7f95834d1fb2?auto=format&fit=crop&q=80')",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[#020617] via-[#020617]/90 to-blue-900/40" />
        {/* Glow */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] z-[2]" />
        <div className="absolute bottom-1/4 right-0 w-56 h-56 bg-indigo-500/15 rounded-full blur-[90px] z-[2]" />

        <div className="relative z-10 w-full max-w-md flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-8">
            <span className="text-2xl font-bold tracking-tighter text-white">SiteAlra.</span>
          </div>

          {/* Icon dekorasi */}
          <div className="mb-8 w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <ArrowRight size={28} className="text-blue-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-[1.15]">
            Bangun Website
            <br />
            Bisnis Anda
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mb-10">
            Platform all-in-one untuk UMKM Indonesia. Buat, kelola, dan kembangkan bisnis kamu secara digital.
          </p>

          <ul className="space-y-4">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3 text-zinc-300">
                <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-300 text-xs font-bold">{idx + 1}</span>
                </div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* =========================================
          RIGHT PANEL: THE LOGIN AREA (PUTIH + BLUR)
      ========================================= */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8 sm:p-16 min-h-[60vh] md:min-h-screen relative">
        {/* Efek Blur halus di latar belakang */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50 rounded-full blur-[120px] -z-10 opacity-60"></div>

        <Link
          to="/"
          className="absolute top-8 left-8 sm:left-16 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </Link>

        <div className="w-full max-w-sm flex flex-col relative h-full justify-center z-10">
          {/* Header Content */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-3">
              Welcome Back!
            </h2>
            <p className="text-zinc-500 font-medium text-sm">
              Masuk untuk mengelola website dan produk.
            </p>
          </div>

          {registered && (
            <div className="mb-5 px-4 py-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-sm font-medium">
              Akun berhasil dibuat. Silakan login.
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Alamat Email
              </label>
              <div className="relative group flex items-center">
                <div className="absolute left-4 flex items-center justify-center">
                  <Mail
                    size={18}
                    className="text-zinc-400 group-focus-within:text-blue-600 transition-colors"
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="owner@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50/50 hover:bg-white border border-zinc-100 rounded-2xl focus:outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-600/5 transition-all text-zinc-900 placeholder-zinc-400 text-sm font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 mt-4 bg-zinc-950 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all text-sm active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-zinc-200"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
              ) : (
                "Masuk"
              )}
            </button>

            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-700 hover:text-blue-800"
              >
                Lupa password?
              </Link>
            </div>
          </form>

          <div className="mt-4">
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-zinc-400 text-center">
              atau
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                aria-label="Lanjutkan dengan Facebook"
                onClick={() => {
                  window.location.href = getFacebookAuthUrl();
                }}
                className="inline-flex items-center justify-center gap-3 px-5 py-3 bg-white border border-zinc-200 text-zinc-800 font-medium rounded-2xl transition-all text-sm hover:border-blue-200 hover:text-blue-700"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    fill="#1877F2"
                    d="M24 12.07C24 5.405 18.627 0 12 0S0 5.405 0 12.07c0 6.022 4.388 11.023 10.125 11.93v-8.44H7.078v-3.49h3.047V9.43c0-3.03 1.792-4.71 4.533-4.71 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.49 0-1.953.93-1.953 1.887v2.258h3.328l-.532 3.49h-2.796V24C19.612 23.093 24 18.092 24 12.07z"
                  />
                </svg>
                Facebook
              </button>

              <button
                type="button"
                aria-label="Lanjutkan dengan Google"
                onClick={() => {
                  window.location.href = getGoogleAuthUrl();
                }}
                className="inline-flex items-center justify-center gap-3 px-5 py-3 bg-white border border-zinc-200 text-zinc-800 font-medium rounded-2xl transition-all text-sm hover:border-blue-200 hover:text-blue-700"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.9h5.48c-.22 1.3-1.52 3.82-5.48 3.82-3.3 0-5.99-2.7-5.99-6.02 0-3.32 2.69-6.02 5.99-6.02 1.88 0 3.14.8 3.86 1.48l2.63-2.53C16.9 3.36 14.66 2.4 12 2.4 6.98 2.4 2.88 6.53 2.88 11.9c0 5.37 4.1 9.5 9.12 9.5 5.27 0 8.74-3.72 8.74-8.97 0-.6-.06-1.05-.14-1.5H12z"
                  />
                  <path
                    fill="#34A853"
                    d="M3.45 7.42l3.21 2.35c.87-2.62 3.26-4.47 5.34-4.47 1.88 0 3.14.8 3.86 1.48l2.63-2.53C16.9 3.36 14.66 2.4 12 2.4 8.19 2.4 4.88 4.6 3.45 7.42z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12 21.4c2.63 0 4.84-.87 6.46-2.36l-3.08-2.5c-.86.58-1.98.98-3.38.98-2.47 0-4.57-1.63-5.31-3.88l-3.23 2.49c1.42 2.8 4.36 4.87 8.54 4.87z"
                  />
                  <path
                    fill="#4285F4"
                    d="M20.6 12.07c0-.58-.06-1.05-.14-1.5H12v3.9h5.48c-.29 1.73-1.52 3.02-3.08 3.88l3.08 2.5c1.8-1.67 2.82-4.12 2.82-7.78z"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-500">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-700 hover:text-blue-800"
              >
                Klik disini untuk daftar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

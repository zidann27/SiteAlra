import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
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

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/login");
    }, 800);
  };

  const features = [
    "Template website profesional",
    "Kelola produk & galeri dengan mudah",
    "Pembuatan konten bertenaga AI",
  ];

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans selection:bg-blue-100 bg-white overflow-hidden">
      {/* =========================================
          LEFT PANEL: THE BRAND VISTA (TONE BIRU)
      ========================================= */}
      <div className="w-full md:w-1/2 bg-[#020617] flex items-center justify-center p-8 sm:p-16 min-h-[40vh] md:min-h-screen relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556740734-7f95834d1fb2?auto=format&fit=crop&q=80')",
          }}
        ></div>

        <div className="absolute inset-0 z-1 bg-gradient-to-br from-[#020617] via-[#020617]/90 to-blue-900/40"></div>
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] z-2"></div>

        <div className="relative z-10 w-full max-w-md flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-10 tracking-tight leading-[1.15]">
            Mulai Bangun<br />
            Website Bisnis
          </h1>

          <ul className="space-y-6">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-4 text-zinc-300">
                <div className="bg-blue-500/20 p-1 rounded-full">
                  <ArrowRight size={18} className="text-blue-400 flex-shrink-0" />
                </div>
                <span className="font-medium tracking-wide text-sm">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* =========================================
          RIGHT PANEL: THE REGISTER AREA (PUTIH + BLUR)
      ========================================= */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8 sm:p-16 min-h-[60vh] md:min-h-screen relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50 rounded-full blur-[120px] -z-10 opacity-60"></div>

        <div className="w-full max-w-sm flex flex-col relative h-full justify-center z-10">
          <div className="mb-6">
            <span className="text-2xl font-bold tracking-tighter text-zinc-950">
              SiteAlra.
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-3">
              Daftar Owner
            </h2>
            <p className="text-zinc-500 font-medium text-sm">
              Buat akun untuk mulai mengelola website dan produk.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
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

            {error && (
              <div className="px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}


            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 mt-4 bg-zinc-950 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all text-sm active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-zinc-200"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </form>

          <div className="mt-4">
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-zinc-400 text-center">
              atau
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                aria-label="Lanjutkan dengan Facebook"
                className="inline-flex items-center justify-center gap-3 px-5 py-3 bg-white border border-zinc-200 text-zinc-800 font-medium rounded-2xl transition-all text-sm hover:border-blue-200 hover:text-blue-700"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                >
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
                className="inline-flex items-center justify-center gap-3 px-5 py-3 bg-white border border-zinc-200 text-zinc-800 font-medium rounded-2xl transition-all text-sm hover:border-blue-200 hover:text-blue-700"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                >
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
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-700 hover:text-blue-800"
              >
                Klik disini untuk login
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  Mail, 
  Lock,
  Eye, 
  EyeOff, 
  ArrowRight
} from "lucide-react";
import { signIn } from "../lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from || "/dashboard";
  }, [location.state]);

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
      signIn(email.trim());
      navigate(redirectTo, { replace: true });
      setIsSubmitting(false);
    }, 800);
  };

  const features = [
    "Template website profesional",
    "Kelola produk & galeri dengan mudah",
    "Pembuatan konten bertenaga AI"
  ];

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans selection:bg-blue-100 bg-white overflow-hidden">
      
      {/* =========================================
          LEFT PANEL: THE BRAND VISTA (TONE BIRU)
      ========================================= */}
      <div className="w-full md:w-1/2 bg-[#020617] flex items-center justify-center p-8 sm:p-16 min-h-[40vh] md:min-h-screen relative overflow-hidden">
        
        {/* Background Image UMKM */}
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556740734-7f95834d1fb2?auto=format&fit=crop&q=80')" }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-1 bg-gradient-to-br from-[#020617] via-[#020617]/90 to-blue-900/40"></div>

        {/* Dekorasi Cahaya (Glow) */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] z-2"></div>

        <div className="relative z-10 w-full max-w-md flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-10 tracking-tight leading-[1.15]">
            Bangun Website<br />
            Bisnis Anda
          </h1>

          <ul className="space-y-6">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-4 text-zinc-300">
                <div className="bg-blue-500/20 p-1 rounded-full">
                    <ArrowRight size={18} className="text-blue-400 flex-shrink-0" />
                </div>
                <span className="font-medium tracking-wide text-sm">{feature}</span>
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

        <div className="w-full max-w-sm flex flex-col relative h-full justify-center z-10">
          
          {/* Logo (Hanya Tulisan) */}
          <div className="mb-12">
            <span className="text-2xl font-bold tracking-tighter text-zinc-950">SiteAlra.</span>
          </div>

          {/* Header Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">Login Owner</h2>
            <p className="text-zinc-500 font-medium text-sm">Masuk untuk mengelola website dan produk.</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            
            {/* Email Input */}
            <div>
              <div className="relative group flex items-center">
                <div className="absolute left-4 flex items-center justify-center">
                  <Mail size={18} className="text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
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
                  <Lock size={18} className="text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
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
              <p className="text-xs text-zinc-400 mt-2 pl-1">
                FE-only: password belum dicek ke server.
              </p>
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
                "Masuk ke Dashboard"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-auto pt-12 text-center">
            <p className="text-xs font-medium text-zinc-400">
              Platform SiteAlra. Dibuat untuk bisnis Indonesia.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
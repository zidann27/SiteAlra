# Git Workflow Tim (3 Orang)

Repo: https://github.com/AgnanToro/SiteAlra

## Aturan Inti
- Jangan push langsung ke `main`.
- Kerja pakai branch masing-masing.
- Merge ke `main` lewat Pull Request (PR).

## Setup Awal (Sekali Saja)
```bash
git clone https://github.com/AgnanToro/SiteAlra.git
cd SiteAlra
git checkout main
git pull origin main
git checkout -b fitur-nama-kamu
```

Contoh branch: `fitur-dashboard`, `backend-crud`, `update-api`.

## Cara Upload Perubahan
```bash
git status
git add ./ git add *
git checkout -b branchbaru (bikin branch baru)
git commit -m "feat: deskripsi perubahan"
git push -u origin branchbaru
```

Lalu buka GitHub dan buat PR:
- from: `fitur-nama-kamu`
- to: `main`

## Cara Ambil Update Terbaru dari Teman
```bash
git checkout main
git pull origin main
git checkout namabranch
git merge main
```

## Kalau Ada Konflik
1. Buka file yang konflik.
2. Rapikan isi kodenya.
3. Lanjutkan:
```bash
git add .
git commit
```

## Rutinitas Harian (Singkat)
```bash
git checkout main
git pull origin main
git checkout fitur-nama-kamu
# ngoding...
git add .
git commit -m "feat/fix: ..."
git push
```
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme === 'dark' || savedTheme === 'light'
      ? (savedTheme as 'light' | 'dark')
      : (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    document.documentElement.style.colorScheme = initialTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.style.colorScheme = nextTheme;
  };

  const navBg = 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-slate-800';
  const textColor = 'text-gray-700 dark:text-gray-200';
  const logoColor = 'text-blue-600 dark:text-blue-400';
  const themeButtonBg = 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-200 border border-transparent';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600">
              <Zap size={18} className="text-white" />
            </div>
            <span className={`font-bold text-lg ${logoColor}`}>SiteAlra</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium hover:opacity-80 transition-opacity ${textColor}`}>Beranda</Link>
            <a href="#features" className={`text-sm font-medium hover:opacity-80 transition-opacity ${textColor}`}>Fitur</a>
            <a href="#examples" className={`text-sm font-medium hover:opacity-80 transition-opacity ${textColor}`}>Contoh</a>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${themeButtonBg}`}
              aria-label={theme === 'light' ? 'Ganti ke mode malam' : 'Ganti ke mode siang'}
              title={theme === 'light' ? 'Mode Siang (aktif)' : 'Mode Malam (aktif)'}
            >
              {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              to="/generate"
              className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Buat Website
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${themeButtonBg}`}
              aria-label={theme === 'light' ? 'Ganti ke mode malam' : 'Ganti ke mode siang'}
            >
              {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className={`p-2 rounded-lg ${textColor}`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 px-4 py-4 flex flex-col gap-3">
          <Link to="/" className="text-sm font-medium text-gray-700 dark:text-gray-200 py-2" onClick={() => setMobileOpen(false)}>Beranda</Link>
          <a href="#features" className="text-sm font-medium text-gray-700 dark:text-gray-200 py-2" onClick={() => setMobileOpen(false)}>Fitur</a>
          <a href="#examples" className="text-sm font-medium text-gray-700 dark:text-gray-200 py-2" onClick={() => setMobileOpen(false)}>Contoh</a>
          <Link
            to="/generate"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg text-center"
            onClick={() => setMobileOpen(false)}
          >
            Buat Website
          </Link>
        </div>
      )}
    </nav>
  );
}
 ----

 import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, Zap } from 'lucide-react';
import { GeneratedSite } from '../lib/types';
import { getSiteBySlug } from '../lib/api';
import SiteTemplate from '../components/preview/SiteTemplate';

export default function SiteViewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [site, setSite] = useState<GeneratedSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        const data = await getSiteBySlug(slug);
        if (!data) {
          setError('Website tidak ditemukan.');
        } else {
          setSite(data);
        }
      } catch {
        setError('Gagal memuat website. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader2 size={40} className="text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Memuat website...</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors duration-300">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Website Tidak Ditemukan</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error || 'Website yang Anda cari tidak tersedia.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Zap size={16} />
            Buat Website Baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 py-2 bg-gray-900/90 backdrop-blur-md text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-blue-400" />
          <span className="font-medium text-white">SiteAlra</span>
          <span className="text-gray-500">·</span>
          <span className="text-gray-400 hidden sm:inline">Dibuat dengan AI dalam 30 detik</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {site.view_count + 1} kunjungan
          </span>
          <Link
            to="/generate"
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition-colors"
          >
            Buat Website Saya
          </Link>
        </div>
      </div>

      <div className="pt-10">
        <SiteTemplate
          content={site.ai_content}
          businessName={site.business_name}
          category={site.category}
          slug={site.slug}
          isPreview={false}
        />
      </div>
    </div>
  );
}

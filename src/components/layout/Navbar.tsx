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

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg =
    isLanding && !scrolled
      ? "bg-transparent"
      : "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100";

  const textColor = isLanding && !scrolled ? "text-white" : "text-gray-700";
  const logoColor = isLanding && !scrolled ? "text-white" : "text-blue-600";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLanding && !scrolled ? "bg-white/20" : "bg-blue-600"}`}
            >
              <Zap
                size={18}
                className={isLanding && !scrolled ? "text-white" : "text-white"}
              />
            </div>
            <span className={`font-bold text-lg ${logoColor}`}>SiteAlra</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium hover:opacity-80 transition-opacity ${textColor}`}
            >
              Beranda
            </Link>
            <Link
              to="/login"
              className={`text-sm font-medium hover:opacity-80 transition-opacity ${textColor}`}
            >
              Owner
            </Link>
            <a
              href="#features"
              className={`text-sm font-medium hover:opacity-80 transition-opacity ${textColor}`}
            >
              Fitur
            </a>
            <a
              href="#examples"
              className={`text-sm font-medium hover:opacity-80 transition-opacity ${textColor}`}
            >
              Contoh
            </a>
            <Link
              to="/generate"
              className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Buat Website
            </Link>
          </div>

          <button
            className={`md:hidden p-2 rounded-lg ${textColor}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 py-2"
            onClick={() => setMobileOpen(false)}
          >
            Beranda
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium text-gray-700 py-2"
            onClick={() => setMobileOpen(false)}
          >
            Owner
          </Link>
          <a
            href="#features"
            className="text-sm font-medium text-gray-700 py-2"
            onClick={() => setMobileOpen(false)}
          >
            Fitur
          </a>
          <a
            href="#examples"
            className="text-sm font-medium text-gray-700 py-2"
            onClick={() => setMobileOpen(false)}
          >
            Contoh
          </a>
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

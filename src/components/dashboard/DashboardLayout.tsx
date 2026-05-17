import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  Package,
  Eye,
  Settings,
  LogOut,
  ChevronsLeft,
  Bot,
} from "lucide-react";
import { getSessionUser, signOut } from "../../lib/auth";
import DashboardChatWidget from "./DashboardChatWidget";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
};

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/generator", label: "AI Generator", icon: Sparkles },
  { to: "/dashboard/products", label: "Produk", icon: Package },
  { to: "/dashboard/preview", label: "Preview", icon: Eye },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getSessionUser();
  const chatWidgetRef = useRef<{ openChat: () => void }>(null);

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("sitealra_sidebar_collapsed_v1") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("sitealra_sidebar_collapsed_v1", String(collapsed));
    } catch {
      // ignore
    }
  }, [collapsed]);

  useEffect(() => {
    // Auto-collapse sidebar on preview route to maximize content area.
    if (location.pathname.startsWith("/dashboard/preview")) {
      setCollapsed((v) => (v ? v : true));
    }

    const params = new URLSearchParams(location.search);
    if (params.get("startNew") !== "1") return;

    sessionStorage.setItem("sitealra_chat_start_new", "1");
    params.delete("startNew");
    const nextSearch = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: true },
    );
  }, [location.pathname, location.search, navigate]);

  const sidebarWidth = collapsed ? "md:w-24" : "md:w-64";
  const contentPadding = collapsed ? "md:pl-24" : "md:pl-64";

  const onLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">
      <div className="flex">
        <aside
          className={`hidden md:flex ${sidebarWidth} md:flex-col md:fixed md:inset-y-0 z-[110] transition-[width] duration-300`}
        >
          <div className="h-[calc(100vh-2rem)] my-4 ml-4 mr-0 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden flex flex-col transition-colors">
            <div
              className={`h-16 flex items-center justify-between border-b border-gray-100 dark:border-slate-800 transition-colors ${
                collapsed ? "px-2" : "px-4"
              }`}
            >
              {collapsed ? (
                <button
                  type="button"
                  onClick={() => setCollapsed(false)}
                  className="p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors mx-auto"
                  aria-label="Expand sidebar"
                  title="Expand sidebar"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    SA
                  </div>
                </button>
              ) : (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      SA
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900 dark:text-white truncate transition-colors">
                        SiteAlra
                      </div>
                      <div className="text-xs text-gray-400 dark:text-slate-500 truncate transition-colors">
                        Dashboard
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCollapsed(true)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-colors"
                    aria-label="Collapse sidebar"
                    title="Collapse sidebar"
                  >
                    <ChevronsLeft size={18} />
                  </button>
                </>
              )}
            </div>

            <nav
              className={`flex-1 py-4 space-y-1 ${collapsed ? "px-2" : "px-3"}`}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={Boolean(item.end)}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `group flex items-center rounded-xl text-sm font-semibold transition-colors ${
                        collapsed
                          ? "justify-center px-3 py-3"
                          : "gap-3 px-3 py-2.5"
                      } ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200"
                      }`
                    }
                  >
                    <Icon size={16} />
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div
              className={`border-t border-gray-100 dark:border-slate-800 transition-colors ${collapsed ? "px-2 py-3" : "px-4 py-4"}`}
            >
              {!collapsed && (
                <>
                  <div className="text-xs text-gray-400 dark:text-slate-500 mb-2 transition-colors">
                    Login sebagai
                  </div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate transition-colors">
                    {user?.email || "-"}
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={onLogout}
                title={collapsed ? "Logout" : undefined}
                className={`mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition-colors ${
                  collapsed ? "mt-0" : ""
                }`}
              >
                <LogOut size={14} />
                {!collapsed && "Logout"}
              </button>
            </div>
          </div>
        </aside>

        <div
          className={`flex-1 ${contentPadding} md:pr-4 md:py-4 transition-[padding] duration-300 flex flex-col w-full`}
          style={{ paddingBottom: 0 }}
        >
          <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 md:hidden transition-colors gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">
                SA
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-gray-900 dark:text-white truncate transition-colors">
                  SiteAlra
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1 px-2 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition-colors flex-shrink-0"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-slate-950 transition-colors md:py-0 pb-24 md:pb-0">
            <Outlet />
          </main>

          <DashboardChatWidget ref={chatWidgetRef} />
        </div>
      </div>

      {/* Mobile bottom nav: centered floating capsule */}
      <nav className="fixed bottom-4 left-0 right-0 md:hidden pointer-events-none">
        <div className="max-w-md mx-auto px-4">
          <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 dark:border-slate-800 flex items-center justify-between px-4 py-2 transition-colors">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.to}
                  href={item.to}
                  className="flex-1 flex flex-col items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-xs font-semibold px-2 py-1 transition-colors"
                >
                  <Icon size={18} />
                  <span className="mt-0.5 text-[10px] truncate">
                    {item.label}
                  </span>
                </a>
              );
            })}
            <button
              type="button"
              onClick={() => chatWidgetRef.current?.openChat()}
              className="w-12 h-12 inline-flex items-center justify-center text-white rounded-full bg-blue-600 hover:bg-blue-700 shadow-md transition-colors"
              title="Buka Chatbot"
            >
              <Bot size={20} />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  Package,
  Eye,
  BarChart3,
  Settings,
  LogOut,
  ChevronsLeft,
} from "lucide-react";
import { getSessionUser, signOut } from "../../lib/auth";
import DashboardChatWidget from "./DashboardChatWidget";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/generator", label: "AI Generator", icon: Sparkles },
  { to: "/dashboard/products", label: "Produk", icon: Package },
  { to: "/dashboard/preview", label: "Preview", icon: Eye },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const user = getSessionUser();

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

  const sidebarWidth = collapsed ? "md:w-24" : "md:w-64";
  const contentPadding = collapsed ? "md:pl-24" : "md:pl-64";

  const onLogout = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside
          className={`hidden md:flex ${sidebarWidth} md:flex-col md:fixed md:inset-y-0 transition-[width] duration-300`}
        >
          <div className="h-[calc(100vh-2rem)] my-4 ml-4 mr-0 bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden flex flex-col">
            <div
              className={`h-16 flex items-center justify-between border-b border-gray-100 ${
                collapsed ? "px-2" : "px-4"
              }`}
            >
              {collapsed ? (
                <button
                  type="button"
                  onClick={() => setCollapsed(false)}
                  className="p-2 rounded-2xl hover:bg-gray-50 transition-colors mx-auto"
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
                      <div className="text-sm font-bold text-gray-900 truncate">
                        SiteAlra
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        Dashboard
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCollapsed(true)}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
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
                    end={item.end as any}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `group flex items-center rounded-xl text-sm font-semibold transition-colors ${
                        collapsed
                          ? "justify-center px-3 py-3"
                          : "gap-3 px-3 py-2.5"
                      } ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
              className={`border-t border-gray-100 ${collapsed ? "px-2 py-3" : "px-4 py-4"}`}
            >
              {!collapsed && (
                <>
                  <div className="text-xs text-gray-400 mb-2">
                    Login sebagai
                  </div>
                  <div className="text-sm font-semibold text-gray-700 truncate">
                    {user?.email || "-"}
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={onLogout}
                title={collapsed ? "Logout" : undefined}
                className={`mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors ${
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
          className={`flex-1 ${contentPadding} md:pr-4 md:py-4 transition-[padding] duration-300`}
        >
          <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-4 sm:px-6 md:hidden">
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </header>

          <main className="px-4 sm:px-6 py-8 md:py-0">
            <Outlet />
          </main>

          <DashboardChatWidget />
        </div>
      </div>
    </div>
  );
}

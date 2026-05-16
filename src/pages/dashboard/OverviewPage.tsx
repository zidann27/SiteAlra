import { useEffect, useState } from "react";
import { Package, Users, Globe, Sparkles, BarChart3 } from "lucide-react";
import {
  getVisitorTotal,
  isWebsiteActive,
  loadProducts,
} from "../../lib/dashboardStore";

function StatCard({
  title,
  value,
  subtitle,
  Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  Icon: React.ComponentType<{ size?: string | number; className?: string }>;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider transition-colors">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2 transition-colors">
            {value}
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors">
            {subtitle}
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [visitorTotal, setVisitorTotal] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [websiteActive, setWebsiteActiveState] = useState(false);
  const [products, setProducts] = useState<Array<{ name: string }>>([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      const [visitor, productsList, website] = await Promise.all([
        getVisitorTotal(),
        loadProducts(),
        isWebsiteActive(),
      ]);

      if (!alive) return;
      setVisitorTotal(visitor);
      setProductsCount(productsList.length);
      setProducts(productsList);
      setWebsiteActiveState(website);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const topProduct = products[0]?.name || "-";

  const chart = [
    { label: "Sen", value: 12 },
    { label: "Sel", value: 18 },
    { label: "Rab", value: 10 },
    { label: "Kam", value: 22 },
    { label: "Jum", value: 30 },
    { label: "Sab", value: 26 },
    { label: "Min", value: 14 },
  ];

  const max = Math.max(...chart.map((c) => c.value));

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-slate-400 mt-2 transition-colors">
          Ringkasan status website, produk, dan analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          title="Total Produk"
          value={String(productsCount)}
          subtitle="Jumlah produk yang tersimpan"
          Icon={Package}
        />
        <StatCard
          title="Total Visitor"
          value={String(visitorTotal)}
          subtitle="Total pengunjung tersimpan"
          Icon={Users}
        />
        <StatCard
          title="Status Website"
          value={websiteActive ? "Active" : "Inactive"}
          subtitle="Status berdasarkan akun"
          Icon={Globe}
        />
        <StatCard
          title="Produk Paling Dilihat"
          value={topProduct}
          subtitle="Produk teratas saat ini"
          Icon={BarChart3}
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-bold text-gray-900 dark:text-white transition-colors">
              Grafik Visitor
            </div>
            <div className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors">
              7 hari terakhir
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 items-end h-40">
          {chart.map((c) => (
            <div key={c.label} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-xl bg-blue-600/90"
                style={{
                  height: `${Math.max(8, Math.round((c.value / max) * 100))}%`,
                }}
                title={`${c.value}`}
              />
              <div className="text-xs text-gray-400 dark:text-slate-500 transition-colors">
                {c.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

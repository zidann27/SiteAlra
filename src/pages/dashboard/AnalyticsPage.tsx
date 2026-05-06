import { useEffect, useMemo, useState } from "react";
import { BarChart3, MousePointerClick, Percent, Users } from "lucide-react";
import { getVisitorTotal, loadProducts } from "../../lib/dashboardStore";

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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [visitorTotal, setVisitorTotal] = useState(0);
  const [products, setProducts] = useState<Array<{ name: string }>>([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      const [visitor, list] = await Promise.all([
        getVisitorTotal(),
        loadProducts(),
      ]);

      if (!alive) return;
      setVisitorTotal(visitor);
      setProducts(list);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const topProduct = products[0]?.name || "-";

  // Dummy values (FE-only)
  const clickCta = Math.max(0, Math.round(visitorTotal * 0.12));
  const conversionRate = visitorTotal > 0 ? Math.round((clickCta / visitorTotal) * 100) : 0;

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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-2">
          Statistik ringkas untuk dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Visitor"
          value={String(visitorTotal)}
          subtitle="Total pengunjung tersimpan"
          Icon={Users}
        />
        <StatCard
          title="Produk paling dilihat"
          value={topProduct}
          subtitle="Produk teratas saat ini"
          Icon={BarChart3}
        />
        <StatCard
          title="Click CTA"
          value={String(clickCta)}
          subtitle="Perkiraan keterlibatan"
          Icon={MousePointerClick}
        />
        <StatCard
          title="Conversion rate"
          value={`${conversionRate}%`}
          subtitle="Perkiraan konversi"
          Icon={Percent}
        />
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-bold text-gray-900">Grafik Visitor</div>
            <div className="text-sm text-gray-500 mt-1">7 hari terakhir</div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 items-end h-40">
          {chart.map((c) => (
            <div key={c.label} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-xl bg-blue-600/90"
                style={{ height: `${Math.max(8, Math.round((c.value / max) * 100))}%` }}
                title={`${c.value}`}
              />
              <div className="text-xs text-gray-400">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

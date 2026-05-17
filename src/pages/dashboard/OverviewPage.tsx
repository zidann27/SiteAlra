import { useEffect, useState } from "react";
import { Package, Users, Globe, BarChart3 } from "lucide-react";
import {
  getVisitorSeries7d,
  isWebsiteActive,
  loadProducts,
} from "../../lib/dashboardStore";

function formatDayLabel(dateKey: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", { weekday: "short" })
      .format(new Date(`${dateKey}T00:00:00Z`))
      .replace(".", "");
  } catch {
    return "-";
  }
}

function formatLongDate(dateKey: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    }).format(new Date(`${dateKey}T00:00:00Z`));
  } catch {
    return dateKey;
  }
}

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
  const [visitorTotal7d, setVisitorTotal7d] = useState(0);
  const [visitorSeries, setVisitorSeries] = useState<
    Array<{ date: string; value: number }>
  >([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [productsCount, setProductsCount] = useState(0);
  const [websiteActive, setWebsiteActiveState] = useState(false);
  const [products, setProducts] = useState<Array<{ name: string }>>([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      const [series, productsList, website] = await Promise.all([
        getVisitorSeries7d(),
        loadProducts(),
        isWebsiteActive(),
      ]);

      if (!alive) return;
      setVisitorSeries(series);
      setVisitorTotal7d(series.reduce((sum, p) => sum + p.value, 0));
      setProductsCount(productsList.length);
      setProducts(productsList);
      setWebsiteActiveState(website);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const topProduct = products[0]?.name || "-";
  const chartData = visitorSeries.length
    ? visitorSeries
    : [0, 1, 2, 3, 4, 5, 6].map((i) => {
        const d = new Date();
        d.setUTCDate(d.getUTCDate() - (6 - i));
        return { date: d.toISOString().slice(0, 10), value: 0 };
      });
  const maxValue = Math.max(1, ...chartData.map((d) => d.value));
  const selectedPoint =
    chartData.find((d) => d.date === selectedDate) ||
    chartData[chartData.length - 1];

  useEffect(() => {
    if (!selectedDate && chartData.length) {
      setSelectedDate(chartData[chartData.length - 1].date);
    }
  }, [chartData, selectedDate]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="px-4 sm:px-8 pt-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white transition-colors">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 mt-2 transition-colors">
          Ringkasan status website, produk, dan analytics.
        </p>
      </div>

      <div className="px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
          <StatCard
            title="Total Produk"
            value={String(productsCount)}
            subtitle="Jumlah produk yang tersimpan"
            Icon={Package}
          />
          <StatCard
            title="Visitor 7 Hari"
            value={String(visitorTotal7d)}
            subtitle="Total kunjungan 7 hari terakhir"
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
      </div>

      <div className="px-4 sm:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-4 sm:p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-bold text-sm sm:text-base text-gray-900 dark:text-white transition-colors">
                Grafik Visitor
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors">
                7 hari terakhir (deployment terbaru)
              </div>
            </div>
          </div>

          <div className="mb-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-900/40 px-3 py-2 text-xs sm:text-sm text-blue-800 dark:text-blue-200">
            <span className="font-semibold">Dipilih:</span>{" "}
            {selectedPoint
              ? `${formatLongDate(selectedPoint.date)} - ${selectedPoint.value} kunjungan`
              : "-"}
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 sm:gap-3 h-40 sm:h-44 min-w-[320px]">
              {chartData.map((point) => {
                const active = selectedPoint?.date === point.date;
                return (
                  <div
                    key={point.date}
                    className="flex flex-col items-center gap-2 h-full"
                  >
                    <div className="w-full flex-1 flex items-end">
                      <button
                        type="button"
                        onClick={() => setSelectedDate(point.date)}
                        className={`w-full rounded-xl transition-all ${
                          active
                            ? "bg-blue-600 shadow-[0_8px_20px_rgba(37,99,235,0.35)]"
                            : "bg-blue-500/80 hover:bg-blue-600"
                        }`}
                        style={{
                          height: `${Math.max(8, Math.round((point.value / maxValue) * 100))}%`,
                        }}
                        title={`${point.value} kunjungan`}
                        aria-label={`${formatDayLabel(point.date)} ${point.value} kunjungan`}
                      />
                    </div>
                    <div
                      className={`text-xs sm:text-sm transition-colors whitespace-nowrap ${
                        active
                          ? "text-blue-700 dark:text-blue-300 font-semibold"
                          : "text-gray-400 dark:text-slate-500"
                      }`}
                    >
                      {formatDayLabel(point.date)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-gray-400 dark:text-slate-600 text-center my-2">
            ← Scroll →
          </div>

          <div className="mt-4 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
            Total 7 hari:{" "}
            <span className="font-semibold text-gray-700 dark:text-slate-200">
              {chartData.reduce((sum, p) => sum + p.value, 0)}
            </span>{" "}
            kunjungan
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Package, Users, Globe, Sparkles } from "lucide-react";
import {
  getVisitorTotal,
  isWebsiteActive,
  loadAiContent,
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

export default function OverviewPage() {
  const [visitorTotal, setVisitorTotal] = useState(0);

  useEffect(() => {
    setVisitorTotal(getVisitorTotal());
  }, []);

  const productsCount = useMemo(() => loadProducts().length, []);
  const websiteActive = useMemo(() => isWebsiteActive(), []);
  const aiReady = useMemo(() => Boolean(loadAiContent()), []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-2">
          Ringkasan cepat untuk website dan produk kamu.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Produk"
          value={String(productsCount)}
          subtitle="Jumlah produk yang tersimpan"
          Icon={Package}
        />
        <StatCard
          title="Total Visitor Website"
          value={String(visitorTotal)}
          subtitle="Dummy counter (FE-only)"
          Icon={Users}
        />
        <StatCard
          title="Status Website"
          value={websiteActive ? "Active" : "Inactive"}
          subtitle="Berdasarkan data tersimpan"
          Icon={Globe}
        />
        <StatCard
          title="Status AI"
          value={aiReady ? "Ready" : "Not Generated"}
          subtitle="Konten AI tersimpan"
          Icon={Sparkles}
        />
      </div>
    </div>
  );
}

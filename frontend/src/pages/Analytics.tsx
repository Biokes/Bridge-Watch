import { useState } from "react";
import ColorPreviewTool from "../components/ColorPreviewTool";
import BridgeComparison from "../components/analytics/BridgeComparison";
import SnapshotCard from "../components/analytics/SnapshotCard";
import { useAnalytics } from "../hooks/useAnalytics";


export default function Analytics() {
  const { bridgeData, isLoading, totalBridges, totalAssets, avgHealthScore, totalTVL } = useAnalytics();
  const [snapshot, setSnapshot] = useState<{ title: string; timestamp: string } | null>(null);

  const formatCurrency = (v: number) => {
    if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    return `$${v.toLocaleString()}`;
  };

  const handleCaptureSnapshot = () => {
    setSnapshot({
      title: `Ecosystem Overview - ${new Date().toLocaleDateString()}`,
      timestamp: new Date().toLocaleString(),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="mt-2 text-stellar-text-secondary">
            Historical trends, cross-asset comparisons, and ecosystem health metrics
          </p>
        </div>
        <button
          onClick={handleCaptureSnapshot}
          disabled={isLoading || bridgeData.length === 0}
          className="px-4 py-2 bg-stellar-blue text-white rounded-lg text-sm font-semibold hover:bg-stellar-blue/90 transition-colors disabled:opacity-50"
        >
          Capture Snapshot
        </button>
      </div>

      {snapshot && (
        <section className="print:m-0 print:p-0">
          <div className="flex justify-between items-center mb-4 no-print">
            <h2 className="text-xl font-semibold text-white">Latest Snapshot</h2>
            <button onClick={() => setSnapshot(null)} className="text-sm text-stellar-text-secondary hover:text-white">
              Dismiss
            </button>
          </div>
          <SnapshotCard 
            title={snapshot.title}
            bridges={bridgeData.slice(0, 5)} 
            timestamp={snapshot.timestamp}
          />
        </section>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Bridges Monitored", value: totalBridges },
          { label: "Total Assets Tracked", value: totalAssets },
          { label: "Average Health Score", value: avgHealthScore ? `${avgHealthScore.toFixed(1)}%` : "--" },
          { label: "Total Value Locked", value: formatCurrency(totalTVL) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-stellar-card border border-stellar-border rounded-lg p-6"
          >
            <p className="text-sm text-stellar-text-secondary">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <BridgeComparison bridges={bridgeData} isLoading={isLoading} />

      {/* Health Score Trends */}
      <div className="bg-stellar-card border border-stellar-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Health Score Trends
        </h2>
        <div className="h-64 flex items-center justify-center">
          <p className="text-stellar-text-secondary">
            Historical health score charts will render here once data is
            available
          </p>
        </div>
      </div>

      {/* Volume Analytics */}
      <div className="bg-stellar-card border border-stellar-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Bridge Volume Analytics
        </h2>
        <div className="h-64 flex items-center justify-center">
          <p className="text-stellar-text-secondary">
            Volume analytics will render here once bridge monitoring data is
            collected
          </p>
        </div>
      </div>

      {/* Liquidity Distribution */}
      <div className="bg-stellar-card border border-stellar-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Liquidity Distribution Across DEXs
        </h2>
        <div className="h-64 flex items-center justify-center">
          <p className="text-stellar-text-secondary">
            DEX liquidity distribution charts will render here once data is
            aggregated
          </p>
        </div>
      </div>

      <ColorPreviewTool />
    </div>
  );
}

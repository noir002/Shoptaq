import { useEffect, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { RiRefreshLine, RiTrophyLine, RiBarChartBoxLine } from 'react-icons/ri';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const COLORS = ['#a078ff', '#4cd7f6', '#adc6ff', '#f59e0b', '#ffb4ab', '#ec4899'];

const chartOptions = (yCallback) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: 'rgba(255,255,255,0.5)', font: { size: 11, family: 'JetBrains Mono' } } },
    tooltip: {
      backgroundColor: '#0f172a',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      titleColor: '#fff',
      bodyColor: 'rgba(255,255,255,0.7)',
      padding: 12,
      titleFont: { family: 'Geist' },
      bodyFont: { family: 'JetBrains Mono' }
    },
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11, family: 'JetBrains Mono' } }, border: { display: false } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11, family: 'JetBrains Mono' }, callback: yCallback }, border: { display: false } },
  },
  interaction: { intersect: false, mode: 'index' },
});

const Analytics = () => {
  const [monthly, setMonthly] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [m, t, i, g, o] = await Promise.all([
        api.get('/analytics/monthly'),
        api.get('/analytics/top-products'),
        api.get('/analytics/inventory'),
        api.get('/analytics/growth'),
        api.get('/analytics/overview'),
      ]);
      setMonthly(m.data);
      setTopProducts(t.data);
      setInventory(i.data);
      setGrowth(g.data);
      setOverview(o.data);
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const Skeleton = ({ h = 'h-64' }) => (
    <div className={`skeleton ${h} rounded-xl w-full`} />
  );

  // Revenue line chart
  const revenueData = {
    labels: monthly.map((d) => d.month),
    datasets: [{
      label: 'Revenue ($)',
      data: monthly.map((d) => d.revenue),
      borderColor: '#a078ff',
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
        g.addColorStop(0, 'rgba(160, 120, 255, 0.35)');
        g.addColorStop(1, 'rgba(160, 120, 255, 0)');
        return g;
      },
      fill: true, tension: 0.4, pointBackgroundColor: '#a078ff', pointRadius: 4,
    }],
  };

  // Orders bar
  const ordersData = {
    labels: monthly.map((d) => d.month),
    datasets: [
      { label: 'Orders', data: monthly.map((d) => d.orders), backgroundColor: 'rgba(76,213,246,0.6)', borderColor: '#4cd7f6', borderWidth: 2, borderRadius: 5 },
      { label: 'Units Sold', data: monthly.map((d) => d.units), backgroundColor: 'rgba(160,120,255,0.4)', borderColor: '#a078ff', borderWidth: 2, borderRadius: 5 },
    ],
  };

  // Inventory doughnut
  const invData = {
    labels: inventory.map((i) => i._id),
    datasets: [{
      data: inventory.map((i) => i.totalStock),
      backgroundColor: COLORS.map((c) => c + 'bb'),
      borderColor: COLORS,
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  // Growth line
  const growthData = {
    labels: growth.map((g) => g.label),
    datasets: [{
      label: 'New Products',
      data: growth.map((g) => g.count),
      borderColor: '#4cd7f6',
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
        g.addColorStop(0, 'rgba(76,213,246,0.3)');
        g.addColorStop(1, 'rgba(76,213,246,0)');
        return g;
      },
      fill: true, tension: 0.4, pointBackgroundColor: '#4cd7f6', pointRadius: 4,
    }],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-extrabold text-2xl tracking-tight font-headline-md">Analytics Center</h2>
          <p className="text-on-surface-variant text-sm mt-0.5 font-body-md">Performance insights and real-time operations</p>
        </div>
        <button onClick={fetchAll} className="btn-secondary flex items-center gap-2 text-sm font-label-md">
          <RiRefreshLine /> Refresh
        </button>
      </div>

      {/* KPI Summary */}
      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: `$${overview.totalRevenue?.toLocaleString('en', { minimumFractionDigits: 2 })}`, color: 'text-primary-fixed-dim' },
            { label: 'Total Orders', value: overview.totalOrders?.toLocaleString(), color: 'text-secondary' },
            { label: 'Total Products', value: overview.totalProducts?.toLocaleString(), color: 'text-tertiary-fixed-dim' },
            { label: 'Avg Order Value', value: `$${overview.avgOrderValue?.toFixed(2)}`, color: 'text-amber-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-5 relative overflow-hidden">
              <div className="noise-overlay opacity-15" />
              <div className="relative z-10">
                <p className="text-on-surface-variant text-xs mb-1.5 font-label-sm uppercase tracking-wider">{label}</p>
                <p className={`text-2xl font-bold font-mono tracking-tight ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Revenue & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 relative overflow-hidden">
          <div className="noise-overlay opacity-20" />
          <div className="relative z-10">
            <h3 className="text-white font-bold text-base font-headline-md mb-1">Revenue Trend</h3>
            <p className="text-on-surface-variant text-xs mb-5 font-body-md">Last 12 months performance</p>
            {loading ? <Skeleton /> : <div style={{ height: '240px' }}><Line data={revenueData} options={chartOptions((v) => `$${(v/1000).toFixed(0)}k`)} /></div>}
          </div>
        </div>
        <div className="card p-6 relative overflow-hidden">
          <div className="noise-overlay opacity-20" />
          <div className="relative z-10">
            <h3 className="text-white font-bold text-base font-headline-md mb-1">Orders & Units</h3>
            <p className="text-on-surface-variant text-xs mb-5 font-body-md">Monthly comparison breakdown</p>
            {loading ? <Skeleton /> : <div style={{ height: '240px' }}><Bar data={ordersData} options={chartOptions()} /></div>}
          </div>
        </div>
      </div>

      {/* Inventory & Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 relative overflow-hidden">
          <div className="noise-overlay opacity-20" />
          <div className="relative z-10">
            <h3 className="text-white font-bold text-base font-headline-md mb-1">Stock Distribution</h3>
            <p className="text-on-surface-variant text-xs mb-5 font-body-md">Inventory share by category</p>
            {loading ? <Skeleton h="h-48" /> : (
              <div style={{ height: '200px' }}>
                <Doughnut data={invData} options={{
                  responsive: true, maintainAspectRatio: false, cutout: '70%',
                  plugins: {
                    legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.5)', font: { size: 10, family: 'JetBrains Mono' }, padding: 12, boxWidth: 10 } },
                    tooltip: { backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, titleColor: '#fff', bodyColor: 'rgba(255,255,255,0.7)', padding: 10, bodyFont: { family: 'JetBrains Mono' } },
                  },
                }} />
              </div>
            )}
          </div>
        </div>

        <div className="card p-6 lg:col-span-2 relative overflow-hidden">
          <div className="noise-overlay opacity-20" />
          <div className="relative z-10">
            <h3 className="text-white font-bold text-base font-headline-md mb-1">Product Growth</h3>
            <p className="text-on-surface-variant text-xs mb-5 font-body-md">New products cataloged monthly</p>
            {loading ? <Skeleton h="h-48" /> : <div style={{ height: '200px' }}><Line data={growthData} options={chartOptions()} /></div>}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="card p-6 relative overflow-hidden">
        <div className="noise-overlay opacity-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
              <RiTrophyLine className="text-amber-400 text-lg" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base font-headline-md">Top Performing Products</h3>
              <p className="text-on-surface-variant text-xs font-body-md">Ranked by overall generated revenue</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
          ) : topProducts.length === 0 ? (
            <p className="text-white/30 text-center py-8">No sales data yet</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => {
                const maxRev = topProducts[0]?.totalRevenue || 1;
                const pct = ((p.totalRevenue / maxRev) * 100).toFixed(0);
                return (
                  <div key={p._id} className="flex items-center gap-4 p-3 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 transition-colors">
                    <span className={`text-sm font-bold w-6 font-mono text-center ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-white/50' : 'text-white/30'}`}>
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-white text-sm font-medium truncate">{p.productTitle}</p>
                        <span className="text-white font-bold font-mono text-sm ml-2 flex-shrink-0">${p.totalRevenue?.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: COLORS[i] }} />
                      </div>
                    </div>
                    <span className="text-on-surface-variant font-mono text-xs w-16 text-right flex-shrink-0">{p.totalSold} sold</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card p-6 relative overflow-hidden">
        <div className="noise-overlay opacity-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-lg bg-secondary/15 border border-secondary/25 flex items-center justify-center">
              <RiBarChartBoxLine className="text-secondary text-lg" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base font-headline-md">Inventory Breakdown</h3>
              <p className="text-on-surface-variant text-xs font-body-md">Category stock levels and metrics</p>
            </div>
          </div>
          {loading ? (
            <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-10 rounded" />)}</div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Products</th>
                    <th>Total Stock</th>
                    <th>Avg Price</th>
                    <th>Low Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((inv) => (
                    <tr key={inv._id}>
                      <td className="font-semibold text-white">{inv._id}</td>
                      <td className="font-mono">{inv.productCount}</td>
                      <td className="font-mono">{inv.totalStock.toLocaleString()}</td>
                      <td className="font-mono">${inv.avgPrice?.toFixed(2)}</td>
                      <td>
                        {inv.lowStockCount > 0 ? (
                          <span className="badge badge-warning font-mono">{inv.lowStockCount} items</span>
                        ) : (
                          <span className="badge badge-success">OK</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { RiRefreshLine, RiAwardLine, RiDatabase2Line } from 'react-icons/ri';
import PageHeader from '../components/ui/PageHeader';
import { chartColors, chartTooltip, chartScales } from '../utils/chartTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const SEGMENT_COLORS = [chartColors.primary, chartColors.secondary, '#fb923c', '#fdba74', '#ea580c'];

const chartOptions = (yCallback) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#64748b', font: { size: 11, family: 'JetBrains Mono' } } },
    tooltip: chartTooltip,
  },
  scales: {
    x: chartScales.x,
    y: { ...chartScales.y, ticks: { ...chartScales.y.ticks, callback: yCallback } },
  },
  interaction: { intersect: false, mode: 'index' },
});

const TABS = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'orders', label: 'Fulfillment' },
  { id: 'inventory', label: 'Stock mix' },
];

const Analytics = () => {
  const [monthly, setMonthly] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('revenue');

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
      toast.error('Insights could not be loaded');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const Skeleton = ({ h = 'h-64' }) => <div className={`skeleton ${h} rounded-xl w-full`} />;

  const revenueData = {
    labels: monthly.map((d) => d.month),
    datasets: [{
      label: 'Net sales ($)',
      data: monthly.map((d) => d.revenue),
      borderColor: chartColors.primary,
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
        g.addColorStop(0, 'rgba(249, 115, 22, 0.22)');
        g.addColorStop(1, 'rgba(249, 115, 22, 0)');
        return g;
      },
      fill: true, tension: 0.4, pointBackgroundColor: chartColors.primary, pointRadius: 4,
    }],
  };

  const ordersData = {
    labels: monthly.map((d) => d.month),
    datasets: [
      { label: 'Transactions', data: monthly.map((d) => d.orders), backgroundColor: 'rgba(245, 158, 11, 0.35)', borderColor: chartColors.secondary, borderWidth: 2, borderRadius: 5 },
      { label: 'Units fulfilled', data: monthly.map((d) => d.units), backgroundColor: 'rgba(249, 115, 22, 0.28)', borderColor: chartColors.primary, borderWidth: 2, borderRadius: 5 },
    ],
  };

  const invData = {
    labels: inventory.map((i) => i._id),
    datasets: [{
      data: inventory.map((i) => i.totalStock),
      backgroundColor: SEGMENT_COLORS.map((c) => c + 'bb'),
      borderColor: SEGMENT_COLORS,
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const growthData = {
    labels: growth.map((g) => g.label),
    datasets: [{
      label: 'New listings',
      data: growth.map((g) => g.count),
      borderColor: chartColors.secondary,
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
        g.addColorStop(0, 'rgba(245, 158, 11, 0.28)');
        g.addColorStop(1, 'rgba(245, 158, 11, 0)');
        return g;
      },
      fill: true, tension: 0.4, pointBackgroundColor: chartColors.secondary, pointRadius: 4,
    }],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        badge="Business Insights"
        title="Performance intelligence"
        subtitle="Analyze revenue trajectories, fulfillment volume, department allocation, and top-performing merchandise."
        actions={
          <button onClick={fetchAll} className="btn-secondary flex items-center gap-2 text-sm">
            <RiRefreshLine /> Refresh
          </button>
        }
      />

      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Net sales', value: `$${overview.totalRevenue?.toLocaleString('en', { minimumFractionDigits: 2 })}`, accent: 'border-l-primary' },
            { label: 'Transactions', value: overview.totalOrders?.toLocaleString(), accent: 'border-l-secondary' },
            { label: 'Catalog size', value: overview.totalProducts?.toLocaleString(), accent: 'border-l-primary' },
            { label: 'Avg. transaction', value: `$${overview.avgOrderValue?.toFixed(2)}`, accent: 'border-l-amber-500' },
          ].map(({ label, value, accent }) => (
            <div key={label} className={`card p-5 border-l-4 ${accent}`}>
              <p className="text-on-surface-variant text-[10px] uppercase tracking-wider font-label-sm mb-2">{label}</p>
              <p className="text-2xl font-bold text-on-surface font-mono tabular-nums">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="view-toggle w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`view-toggle__btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeTab === 'revenue' && (
          <div className="section-panel lg:col-span-2">
            <div className="section-panel__head">
              <h3 className="text-on-surface font-semibold text-sm">Revenue trajectory</h3>
              <span className="text-on-surface-variant text-xs">Trailing 12 months</span>
            </div>
            <div className="section-panel__body">
              {loading ? <Skeleton /> : <div style={{ height: '260px' }}><Line data={revenueData} options={chartOptions((v) => `$${(v / 1000).toFixed(0)}k`)} /></div>}
            </div>
          </div>
        )}
        {activeTab === 'orders' && (
          <div className="section-panel lg:col-span-2">
            <div className="section-panel__head">
              <h3 className="text-on-surface font-semibold text-sm">Fulfillment volume</h3>
              <span className="text-on-surface-variant text-xs">Transactions vs units shipped</span>
            </div>
            <div className="section-panel__body">
              {loading ? <Skeleton /> : <div style={{ height: '260px' }}><Bar data={ordersData} options={chartOptions()} /></div>}
            </div>
          </div>
        )}
        {activeTab === 'inventory' && (
          <>
            <div className="section-panel">
              <div className="section-panel__head">
                <h3 className="text-on-surface font-semibold text-sm">Stock by department</h3>
              </div>
              <div className="section-panel__body">
                {loading ? <Skeleton h="h-48" /> : (
                  <div style={{ height: '220px' }}>
                    <Doughnut data={invData} options={{
                      responsive: true, maintainAspectRatio: false, cutout: '68%',
                      plugins: {
                        legend: { position: 'bottom', labels: { color: '#64748b', font: { size: 10, family: 'JetBrains Mono' }, padding: 10, boxWidth: 10 } },
                        tooltip: chartTooltip,
                      },
                    }} />
                  </div>
                )}
              </div>
            </div>
            <div className="section-panel">
              <div className="section-panel__head">
                <h3 className="text-on-surface font-semibold text-sm">Catalog expansion</h3>
              </div>
              <div className="section-panel__body">
                {loading ? <Skeleton h="h-48" /> : <div style={{ height: '220px' }}><Line data={growthData} options={chartOptions()} /></div>}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="section-panel">
          <div className="section-panel__head">
            <div className="flex items-center gap-2">
              <RiAwardLine className="text-amber-600" />
              <div>
                <h3 className="text-on-surface font-semibold text-sm">Revenue leaders</h3>
                <p className="text-on-surface-variant text-xs">Top merchandise by net sales</p>
              </div>
            </div>
          </div>
          <div className="section-panel__body">
            {loading ? (
              <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
            ) : topProducts.length === 0 ? (
              <p className="text-on-surface-variant text-center py-8 text-sm">No sales data recorded yet</p>
            ) : (
              <div className="space-y-2">
                {topProducts.map((p, i) => {
                  const maxRev = topProducts[0]?.totalRevenue || 1;
                  const pct = ((p.totalRevenue / maxRev) * 100).toFixed(0);
                  return (
                    <div key={p._id} className="data-row">
                      <span className={`text-xs font-bold font-mono w-6 ${i === 0 ? 'text-amber-600' : 'text-on-surface-variant'}`}>#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2 mb-1.5">
                          <p className="text-on-surface text-sm font-medium truncate">{p.productTitle}</p>
                          <span className="font-mono text-sm font-semibold text-on-surface">${p.totalRevenue?.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="h-1.5 bg-surface-muted/60 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: SEGMENT_COLORS[i] }} />
                        </div>
                      </div>
                      <span className="text-on-surface-variant text-xs font-mono w-14 text-right">{p.totalSold} units</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="section-panel">
          <div className="section-panel__head">
            <div className="flex items-center gap-2">
              <RiDatabase2Line className="text-secondary" />
              <div>
                <h3 className="text-on-surface font-semibold text-sm">Department breakdown</h3>
                <p className="text-on-surface-variant text-xs">Stock levels and pricing averages</p>
              </div>
            </div>
          </div>
          <div className="section-panel__body p-0">
            {loading ? (
              <div className="p-5 space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-10 rounded" />)}</div>
            ) : (
              <div className="table-container border-0 rounded-none">
                <table className="table text-xs">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>SKUs</th>
                      <th>Units</th>
                      <th>Avg price</th>
                      <th>Alerts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((inv) => (
                      <tr key={inv._id}>
                        <td className="font-semibold">{inv._id}</td>
                        <td className="font-mono">{inv.productCount}</td>
                        <td className="font-mono">{inv.totalStock.toLocaleString()}</td>
                        <td className="font-mono">${inv.avgPrice?.toFixed(2)}</td>
                        <td>
                          {inv.lowStockCount > 0 ? (
                            <span className="badge badge-warning text-[10px]">{inv.lowStockCount} low</span>
                          ) : (
                            <span className="badge badge-success text-[10px]">Healthy</span>
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
    </div>
  );
};

export default Analytics;

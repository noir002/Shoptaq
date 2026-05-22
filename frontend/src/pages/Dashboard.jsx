import { useEffect, useState } from 'react';
import {
  RiMoneyDollarCircleLine, RiShoppingCart2Line, RiStackLine,
  RiExchangeDollarLine, RiAlertLine, RiArrowRightLine, RiRefreshLine,
  RiAddLine, RiBarChartBoxLine, RiSparkling2Line, RiTruckLine,
} from 'react-icons/ri';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/ui/StatCard';
import PageHeader from '../components/ui/PageHeader';
import RevenueChart from '../components/charts/RevenueChart';
import SalesChart from '../components/charts/SalesChart';
import TopProductsChart from '../components/charts/TopProductsChart';
import toast from 'react-hot-toast';

const ACTIVITY_FEED = [
  { type: 'order', text: 'Bulk order #ORD-8842 fulfilled — 12 units', time: '12m ago', color: 'bg-secondary' },
  { type: 'stock', text: 'Reorder threshold hit for Meridian Linen Set', time: '38m ago', color: 'bg-amber-500' },
  { type: 'ai', text: 'Merchandising copy generated for 3 SKUs', time: '1h ago', color: 'bg-primary' },
  { type: 'catalog', text: 'New variant added to Alpine Trail Pack', time: '2h ago', color: 'bg-accent' },
];

const QUICK_ACTIONS = [
  { to: '/products', label: 'Add SKU', desc: 'Expand catalog', icon: RiAddLine },
  { to: '/analytics', label: 'View reports', desc: 'Performance data', icon: RiBarChartBoxLine },
  { to: '/ai', label: 'AI merchandising', desc: 'Copy & pricing', icon: RiSparkling2Line },
];

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [overviewRes, monthlyRes, topRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/analytics/monthly'),
        api.get('/analytics/top-products'),
      ]);
      setOverview(overviewRes.data);
      setMonthly(monthlyRes.data);
      setTopProducts(topRes.data);
      if (isRefresh) toast.success('Metrics refreshed');
    } catch {
      toast.error('Unable to load operations data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const statCards = [
    {
      title: 'Net Sales',
      hint: 'Gross merchandise value',
      value: overview?.totalRevenue?.toFixed(2) || 0,
      prefix: '$',
      delta: 14.2,
      deltaLabel: 'vs prior period',
      icon: RiMoneyDollarCircleLine,
      color: 'primary',
    },
    {
      title: 'Transactions',
      hint: 'Completed checkouts',
      value: overview?.totalOrders || 0,
      delta: 9.6,
      deltaLabel: 'vs prior period',
      icon: RiShoppingCart2Line,
      color: 'green',
    },
    {
      title: 'Active SKUs',
      hint: 'Listed in catalog',
      value: overview?.totalProducts || 0,
      delta: 3.8,
      deltaLabel: 'this quarter',
      icon: RiStackLine,
      color: 'blue',
    },
    {
      title: 'Avg. Transaction',
      hint: 'Revenue per order',
      value: overview?.avgOrderValue?.toFixed(2) || 0,
      prefix: '$',
      delta: -1.4,
      deltaLabel: 'vs prior period',
      icon: RiExchangeDollarLine,
      color: 'amber',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        badge="Operations Hub"
        title="Retail performance snapshot"
        subtitle="Monitor revenue, fulfillment health, and catalog signals across your Shoptaq workspace."
        actions={
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <RiRefreshLine className={refreshing ? 'animate-spin' : ''} />
            Sync data
          </button>
        }
      />

      <div className="kpi-strip">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {QUICK_ACTIONS.map(({ to, label, desc, icon: Icon }) => (
          <Link key={to} to={to} className="quick-action">
            <div className="w-10 h-10 rounded-lg bg-primary-container/10 border border-primary-container/20 flex items-center justify-center">
              <Icon className="text-primary text-lg" />
            </div>
            <div>
              <p className="text-on-surface text-sm font-semibold">{label}</p>
              <p className="text-on-surface-variant text-xs">{desc}</p>
            </div>
            <RiArrowRightLine className="ml-auto text-on-surface-variant" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <RevenueChart data={monthly} loading={loading} />
            </div>
            <div className="lg:col-span-2">
              <TopProductsChart data={topProducts} loading={loading} />
            </div>
          </div>
          <SalesChart data={monthly} loading={loading} />
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="section-panel">
            <div className="section-panel__head">
              <div>
                <h3 className="text-on-surface font-semibold text-sm">Activity log</h3>
                <p className="text-on-surface-variant text-xs mt-0.5">Recent workspace events</p>
              </div>
            </div>
            <div className="section-panel__body space-y-3">
              {ACTIVITY_FEED.map((item) => (
                <div key={item.text} className="data-row !p-2.5">
                  <span className={`activity-dot ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-on-surface text-xs leading-snug">{item.text}</p>
                    <p className="text-on-surface-variant text-[10px] mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!loading && overview?.lowStockProducts?.length > 0 && (
            <div className="section-panel">
              <div className="section-panel__head">
                <div className="flex items-center gap-2">
                  <RiAlertLine className="text-amber-600" />
                  <div>
                    <h3 className="text-on-surface font-semibold text-sm">Replenishment queue</h3>
                    <p className="text-on-surface-variant text-xs">{overview.lowStockProducts.length} SKUs below threshold</p>
                  </div>
                </div>
                <Link to="/products?lowStock=true" className="text-secondary text-xs font-semibold hover:underline flex items-center gap-0.5">
                  Open <RiArrowRightLine />
                </Link>
              </div>
              <div className="section-panel__body space-y-2 max-h-[280px] overflow-y-auto">
                {overview.lowStockProducts.map((p) => (
                  <div key={p._id} className="data-row">
                    <div className="w-10 h-10 rounded-lg bg-surface-muted/50 border border-outline/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {p.image ? (
                        <img src={p.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <RiTruckLine className="text-on-surface-variant" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-on-surface text-sm font-medium truncate">{p.title}</p>
                      <p className="text-on-surface-variant text-xs">{p.category}</p>
                    </div>
                    <span className={`badge text-[10px] ${p.stock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                      {p.stock === 0 ? 'Unavailable' : `${p.stock} units`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {!loading && overview?.outOfStock > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <RiAlertLine className="text-red-600 text-xl flex-shrink-0" />
          <p className="text-red-800 text-sm flex-1">
            <span className="font-semibold">{overview.outOfStock} SKUs</span> are unavailable and may impact conversion. Prioritize restock or substitute listings.
          </p>
          <Link to="/products?lowStock=true" className="btn-danger text-xs py-2 px-4 whitespace-nowrap self-start sm:self-center">
            Manage inventory
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

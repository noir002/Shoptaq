import { useEffect, useState } from 'react';
import {
  RiMoneyDollarCircleLine, RiShoppingBagLine, RiBarChartLine,
  RiAlertLine, RiArrowRightLine, RiRefreshLine
} from 'react-icons/ri';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/ui/StatCard';
import RevenueChart from '../components/charts/RevenueChart';
import SalesChart from '../components/charts/SalesChart';
import TopProductsChart from '../components/charts/TopProductsChart';
import toast from 'react-hot-toast';

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
      if (isRefresh) toast.success('Dashboard refreshed');
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: overview?.totalRevenue?.toFixed(2) || 0,
      prefix: '$',
      delta: 12.5,
      deltaLabel: 'vs last month',
      icon: RiMoneyDollarCircleLine,
      color: 'primary',
    },
    {
      title: 'Total Orders',
      value: overview?.totalOrders || 0,
      delta: 8.3,
      deltaLabel: 'vs last month',
      icon: RiShoppingBagLine,
      color: 'green',
    },
    {
      title: 'Total Products',
      value: overview?.totalProducts || 0,
      delta: 4.1,
      deltaLabel: 'this month',
      icon: RiBarChartLine,
      color: 'blue',
    },
    {
      title: 'Avg. Order Value',
      value: overview?.avgOrderValue?.toFixed(2) || 0,
      prefix: '$',
      delta: -2.1,
      deltaLabel: 'vs last month',
      icon: RiMoneyDollarCircleLine,
      color: 'amber',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-extrabold text-2xl tracking-tight font-headline-md">Store Overview</h2>
          <p className="text-on-surface-variant text-sm mt-0.5 font-body-md">Real-time status of your ecommerce operations</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="btn-secondary flex items-center gap-2 text-sm font-label-md"
        >
          <RiRefreshLine className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} loading={loading} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={monthly} loading={loading} />
        </div>
        <TopProductsChart data={topProducts} loading={loading} />
      </div>

      {/* Sales chart */}
      <SalesChart data={monthly} loading={loading} />

      {/* Low Stock Alerts */}
      {!loading && overview?.lowStockProducts?.length > 0 && (
        <div className="card p-6 animate-fade-in relative overflow-hidden">
          <div className="noise-overlay opacity-30" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                  <RiAlertLine className="text-amber-400 text-lg" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base font-headline-md">Low Stock Alerts</h3>
                  <p className="text-white/40 text-xs font-body-md">{overview.lowStockProducts.length} products need attention</p>
                </div>
              </div>
              <Link to="/products?lowStock=true" className="flex items-center gap-1 text-secondary text-sm hover:underline transition-colors font-label-md">
                View all <RiArrowRightLine />
              </Link>
            </div>

          <div className="space-y-2">
            {overview.lowStockProducts.map((p) => (
              <div key={p._id} className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-9 h-9 rounded-lg object-cover bg-white/5" onError={(e) => { e.target.src = ''; e.target.className = 'w-9 h-9 rounded-lg bg-white/5'; }} />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                      <RiShoppingBagLine className="text-white/20" />
                    </div>
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">{p.title}</p>
                    <p className="text-white/40 text-xs">{p.category}</p>
                  </div>
                </div>
                <span className={`badge ${p.stock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                  {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
          </div>
        </div>
      )}

      {/* Out of stock summary */}
      {!loading && overview?.outOfStock > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-fade-in">
          <RiAlertLine className="text-red-400 text-xl flex-shrink-0" />
          <p className="text-red-300 text-sm">
            <span className="font-bold">{overview.outOfStock} products</span> are completely out of stock. Restock them to avoid losing sales.
          </p>
          <Link to="/products?lowStock=true" className="ml-auto btn-danger text-xs py-1.5 px-3 whitespace-nowrap">
            Manage
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#a078ff', '#4cd7f6', '#adc6ff', '#f59e0b', '#ffb4ab'];

const TopProductsChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="card p-6">
        <div className="skeleton h-5 w-36 rounded mb-4" />
        <div className="flex justify-center">
          <div className="skeleton w-40 h-40 rounded-full" />
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="card p-6">
        <h3 className="text-white font-bold text-base mb-6">Top Products</h3>
        <p className="text-white/30 text-center text-sm py-10">No sales data available</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d.productTitle || 'Unknown'),
    datasets: [
      {
        data: data.map((d) => d.totalRevenue),
        backgroundColor: COLORS.map((c) => c + 'cc'),
        borderColor: COLORS,
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#171f33',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: 'rgba(255,255,255,0.7)',
        padding: 12,
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.toLocaleString()}`,
        },
      },
    },
    cutout: '70%',
  };

  const total = data.reduce((s, d) => s + d.totalRevenue, 0);

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-bold text-base">Top Products</h3>
          <p className="text-white/40 text-xs mt-0.5">By revenue</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative" style={{ width: '140px', height: '140px', flexShrink: 0 }}>
          <Doughnut data={chartData} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-white font-bold text-sm">${(total / 1000).toFixed(1)}k</p>
            <p className="text-white/40 text-xs">Total</p>
          </div>
        </div>
        <div className="flex-1 space-y-2.5 min-w-0">
          {data.map((item, i) => {
            const pct = total > 0 ? ((item.totalRevenue / total) * 100).toFixed(1) : 0;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                <p className="text-white/70 text-xs truncate flex-1">{item.productTitle}</p>
                <span className="text-white/50 text-xs flex-shrink-0">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopProductsChart;

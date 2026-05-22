import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const RevenueChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="card p-6">
        <div className="skeleton h-5 w-36 rounded mb-4" />
        <div className="skeleton h-48 w-full rounded-xl" />
      </div>
    );
  }

  const labels = data.map((d) => d.month || d.label);
  const revenues = data.map((d) => d.revenue);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenues,
        borderColor: '#a078ff',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(160,120,255,0.3)');
          gradient.addColorStop(1, 'rgba(160,120,255,0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#a078ff',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
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
        borderColor: 'rgba(160,120,255,0.3)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: 'rgba(255,255,255,0.7)',
        padding: 12,
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: {
          color: 'rgba(255,255,255,0.4)',
          font: { size: 11 },
          callback: (v) => `$${(v / 1000).toFixed(0)}k`,
        },
        border: { display: false },
      },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-bold text-base">Revenue Overview</h3>
          <p className="text-white/40 text-xs mt-0.5">Last 12 months</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-500" />
          <span className="text-white/40 text-xs">Monthly revenue</span>
        </div>
      </div>
      <div style={{ height: '220px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;

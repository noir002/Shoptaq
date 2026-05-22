import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { chartColors, chartTooltip, chartScales } from '../../utils/chartTheme';

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
        borderColor: chartColors.primary,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartColors.primary,
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
        ...chartTooltip,
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: chartScales.x,
      y: {
        ...chartScales.y,
        ticks: {
          ...chartScales.y.ticks,
          callback: (v) => `$${(v / 1000).toFixed(0)}k`,
        },
      },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5 px-1">
        <div>
          <h3 className="text-on-surface font-semibold text-sm">Net sales trend</h3>
          <p className="text-on-surface-variant text-xs mt-0.5">Trailing twelve months · USD</p>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary-container/10 border border-primary-container/20 px-2 py-1 rounded-md">
          Live
        </span>
      </div>
      <div style={{ height: '220px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;

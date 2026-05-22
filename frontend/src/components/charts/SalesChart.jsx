import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { chartColors, chartTooltip, chartScales, chartLegend } from '../../utils/chartTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="card p-6">
        <div className="skeleton h-5 w-36 rounded mb-4" />
        <div className="skeleton h-48 w-full rounded-xl" />
      </div>
    );
  }

  const labels = data.map((d) => d.month || d.label);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Transactions',
        data: data.map((d) => d.orders),
        backgroundColor: chartColors.secondaryFill,
        borderColor: chartColors.secondary,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(245, 158, 11, 0.45)',
      },
      {
        label: 'Units fulfilled',
        data: data.map((d) => d.units),
        backgroundColor: chartColors.primaryFill,
        borderColor: chartColors.primary,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(249, 115, 22, 0.45)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: chartLegend,
      tooltip: chartTooltip,
    },
    scales: {
      x: { ...chartScales.x, grid: { display: false } },
      y: chartScales.y,
    },
  };

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5 px-1">
        <div>
          <h3 className="text-on-surface font-semibold text-sm">Fulfillment throughput</h3>
          <p className="text-on-surface-variant text-xs mt-0.5">Transactions vs units shipped by period</p>
        </div>
      </div>
      <div style={{ height: '220px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesChart;

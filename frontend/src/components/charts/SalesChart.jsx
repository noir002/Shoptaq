import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

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
        label: 'Orders',
        data: data.map((d) => d.orders),
        backgroundColor: 'rgba(76, 215, 246, 0.4)', // secondary
        borderColor: '#4cd7f6',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(76, 215, 246, 0.65)',
      },
      {
        label: 'Units Sold',
        data: data.map((d) => d.units),
        backgroundColor: 'rgba(160, 120, 255, 0.4)', // primary
        borderColor: '#a078ff',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(160, 120, 255, 0.65)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'rgba(255,255,255,0.5)', font: { size: 11 }, boxWidth: 12, boxHeight: 12, borderRadius: 3 },
      },
      tooltip: {
        backgroundColor: '#171f33',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: 'rgba(255,255,255,0.7)',
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } },
        border: { display: false },
      },
    },
  };

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-bold text-base">Sales Volume</h3>
          <p className="text-white/40 text-xs mt-0.5">Orders & units per month</p>
        </div>
      </div>
      <div style={{ height: '220px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesChart;

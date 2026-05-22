/** Shared Chart.js theme — white & orange */
export const chartColors = {
  primary: '#f97316',
  secondary: '#f59e0b',
  primaryFill: 'rgba(249, 115, 22, 0.22)',
  secondaryFill: 'rgba(245, 158, 11, 0.35)',
};

export const chartTooltip = {
  backgroundColor: '#fffbf7',
  borderColor: '#fde8d4',
  borderWidth: 1,
  titleColor: '#1e293b',
  bodyColor: '#64748b',
  padding: 12,
};

export const chartScales = {
  x: {
    grid: { color: 'rgba(249, 115, 22, 0.08)' },
    ticks: { color: '#64748b', font: { size: 11 } },
    border: { display: false },
  },
  y: {
    grid: { color: 'rgba(249, 115, 22, 0.08)' },
    ticks: { color: '#64748b', font: { size: 11 } },
    border: { display: false },
  },
};

export const chartLegend = {
  labels: { color: '#64748b', font: { size: 11 }, boxWidth: 12, boxHeight: 12, borderRadius: 3 },
};

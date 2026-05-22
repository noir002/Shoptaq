/** Shared Chart.js theme for light neomorphic UI */
export const chartColors = {
  primary: '#6366f1',
  secondary: '#0891b2',
  primaryFill: 'rgba(99, 102, 241, 0.25)',
  secondaryFill: 'rgba(8, 145, 178, 0.3)',
};

export const chartTooltip = {
  backgroundColor: '#f8fafc',
  borderColor: '#d8e2ee',
  borderWidth: 1,
  titleColor: '#1e293b',
  bodyColor: '#64748b',
  padding: 12,
};

export const chartScales = {
  x: {
    grid: { color: 'rgba(100, 116, 139, 0.12)' },
    ticks: { color: '#64748b', font: { size: 11 } },
    border: { display: false },
  },
  y: {
    grid: { color: 'rgba(100, 116, 139, 0.12)' },
    ticks: { color: '#64748b', font: { size: 11 } },
    border: { display: false },
  },
};

export const chartLegend = {
  labels: { color: '#64748b', font: { size: 11 }, boxWidth: 12, boxHeight: 12, borderRadius: 3 },
};

import { RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri';

const StatCard = ({ title, value, delta, deltaLabel, icon: Icon, color = 'primary', loading = false, prefix = '', suffix = '' }) => {
  const colorMap = {
    primary: {
      bg: 'bg-primary-container/10',
      text: 'text-primary-container',
      border: 'border-primary-container/20',
      glow: 'shadow-glow',
    },
    green: {
      bg: 'bg-secondary/10',
      text: 'text-secondary',
      border: 'border-secondary/20',
      glow: 'shadow-glow-green',
    },
    amber: {
      bg: 'bg-tertiary/10',
      text: 'text-tertiary',
      border: 'border-tertiary/20',
      glow: '',
    },
    red: {
      bg: 'bg-error/10',
      text: 'text-error',
      border: 'border-error/20',
      glow: 'shadow-glow-red',
    },
    blue: {
      bg: 'bg-secondary/10',
      text: 'text-secondary',
      border: 'border-secondary/20',
      glow: '',
    },
  };

  const c = colorMap[color] || colorMap.primary;
  const isPositive = delta >= 0;

  if (loading) {
    return (
      <div className="card p-6 space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton w-10 h-10 rounded-xl" />
        </div>
        <div className="skeleton h-8 w-32 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    );
  }

  return (
    <div className="card-hover p-6 group animate-fade-in relative overflow-hidden">
      <div className="noise-overlay opacity-30" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-on-surface-variant text-sm font-semibold font-label-md uppercase tracking-wider">{title}</p>
          <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center 
                           group-hover:scale-115 transition-transform duration-300 ${c.glow}`}>
            {Icon && <Icon className={`${c.text} text-xl`} />}
          </div>
        </div>

        <div className="mb-3">
          <span className="text-3xl font-extrabold text-white tracking-tight font-headline-md">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </span>
        </div>

        {delta !== undefined && (
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${isPositive ? 'text-secondary bg-secondary/10 border border-secondary/20' : 'text-error bg-error/10 border border-error/20'}`}>
              {isPositive ? <RiArrowUpLine /> : <RiArrowDownLine />}
              {Math.abs(delta)}%
            </span>
            {deltaLabel && (
              <span className="text-white/30 text-xs font-label-sm">{deltaLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

import { RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri';

const StatCard = ({ title, value, delta, deltaLabel, icon: Icon, color = 'primary', loading = false, prefix = '', suffix = '', hint }) => {
  const colorMap = {
    primary: { accent: 'bg-primary', iconBg: 'bg-primary-container/10', iconText: 'text-primary-fixed-dim', border: 'border-primary-container/20' },
    green: { accent: 'bg-secondary', iconBg: 'bg-secondary/10', iconText: 'text-secondary', border: 'border-secondary/20' },
    amber: { accent: 'bg-amber-500', iconBg: 'bg-amber-50', iconText: 'text-amber-600', border: 'border-amber-200' },
    red: { accent: 'bg-error', iconBg: 'bg-error/10', iconText: 'text-error', border: 'border-error/20' },
    blue: { accent: 'bg-primary', iconBg: 'bg-orange-50', iconText: 'text-orange-700', border: 'border-orange-200' },
  };

  const c = colorMap[color] || colorMap.primary;
  const isPositive = delta >= 0;

  if (loading) {
    return (
      <div className="card p-5 animate-pulse">
        <div className="flex gap-4">
          <div className="skeleton w-1 rounded-full h-16" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-3 w-28 rounded" />
            <div className="skeleton h-7 w-24 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5 group animate-fade-in relative overflow-hidden">
      <div className="flex gap-4">
        <div className={`w-1 rounded-full ${c.accent} opacity-80 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider font-label-sm">{title}</p>
              {hint && <p className="text-on-surface-variant/80 text-[10px] mt-0.5">{hint}</p>}
            </div>
            {Icon && (
              <div className={`w-9 h-9 rounded-lg ${c.iconBg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`${c.iconText} text-lg`} />
              </div>
            )}
          </div>

          <p className="text-2xl font-bold text-on-surface tracking-tight font-headline-md tabular-nums">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>

          {delta !== undefined && (
            <div className="flex items-center gap-2 mt-2.5">
              <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                isPositive ? 'text-secondary bg-secondary/10 border border-secondary/20' : 'text-error bg-error/10 border border-error/20'
              }`}>
                {isPositive ? <RiArrowUpLine /> : <RiArrowDownLine />}
                {Math.abs(delta)}%
              </span>
              {deltaLabel && <span className="text-on-surface-variant text-[11px]">{deltaLabel}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;

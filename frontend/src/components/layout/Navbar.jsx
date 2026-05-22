import { useLocation, Link } from 'react-router-dom';
import { RiBellLine, RiSearchLine, RiPulseLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../constants/catalog';

const crumbs = {
  '/dashboard': ['Operations', 'Hub'],
  '/products': ['Catalog', 'SKU Inventory'],
  '/analytics': ['Intelligence', 'Business Insights'],
  '/ai': ['Merchandising', 'AI Studio'],
};

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const trail = crumbs[pathname] || [BRAND.name];

  const now = new Date();
  const dateLabel = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="h-[72px] flex items-center justify-between px-6 lg:px-8 border-b border-outline/50 bg-surface-container/95 backdrop-blur-md z-20">
      <div className="flex items-center gap-4 min-w-0">
        <nav className="flex items-center gap-1.5 text-xs font-label-sm text-on-surface-variant min-w-0">
          <Link to="/dashboard" className="hover:text-primary transition-colors shrink-0">
            {BRAND.name}
          </Link>
          {trail.map((part, i) => (
            <span key={part} className="flex items-center gap-1.5 min-w-0">
              <span className="text-outline">/</span>
              <span className={i === trail.length - 1 ? 'text-on-surface font-semibold truncate' : 'truncate'}>
                {part}
              </span>
            </span>
          ))}
        </nav>
        <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-semibold uppercase tracking-wider">
          <RiPulseLine className="text-xs" />
          Synced
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 h-9 px-3 rounded-xl bg-surface-muted/50 border border-outline/50 min-w-[200px]">
          <RiSearchLine className="text-on-surface-variant text-sm" />
          <span className="text-on-surface-variant text-xs">Search catalog, orders…</span>
        </div>

        <span className="hidden sm:block text-on-surface-variant text-xs font-label-sm">{dateLabel}</span>

        <button
          type="button"
          className="relative w-9 h-9 rounded-xl bg-surface-raised border border-outline/50 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all shadow-neo-sm"
          aria-label="Notifications"
        >
          <RiBellLine size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full ring-2 ring-surface-container" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-outline/50">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="hidden sm:block max-w-[140px]">
            <p className="text-on-surface text-xs font-semibold leading-none truncate">{user?.name}</p>
            <p className="text-on-surface-variant text-[10px] mt-1 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

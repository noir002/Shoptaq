import { useLocation } from 'react-router-dom';
import { RiBellLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Real-time overview of your store\'s operations and metrics.' },
  '/products': { title: 'Products', subtitle: 'Manage your product inventory, details, and AI optimizations.' },
  '/analytics': { title: 'Analytics', subtitle: 'Detailed breakdowns of revenue, sales, and category statistics.' },
  '/ai': { title: 'AI Command Center', subtitle: 'Leverage Google Gemini to generate copy, pricing recommendations, and trends.' },
};

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const pageInfo = pageTitles[pathname] || { title: 'Sage AI', subtitle: '' };

  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-white/10 bg-surface-container-low/40 backdrop-blur-xl z-20">
      <div>
        <h2 className="text-white font-bold text-xl leading-tight font-headline-md tracking-tight">{pageInfo.title}</h2>
        <p className="text-on-surface-variant text-xs mt-0.5 font-body-md">{pageInfo.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
          <RiBellLine size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full ring-2 ring-background animate-pulse" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-on-primary-container font-bold text-sm shadow-glow">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="hidden sm:block overflow-hidden max-w-[120px]">
            <p className="text-white text-sm font-semibold leading-none truncate">{user?.name}</p>
            <p className="text-white/40 text-[10px] mt-1 font-label-sm truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import { NavLink, useNavigate } from 'react-router-dom';
import {
  RiDashboardLine, RiArchiveLine, RiPieChart2Line,
  RiSparkling2Line, RiLogoutBoxLine, RiMenuFoldLine, RiMenuUnfoldLine,
  RiStore2Line,
} from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { BRAND, NAV_SECTIONS } from '../../constants/catalog';
import toast from 'react-hot-toast';

const iconMap = {
  dashboard: RiDashboardLine,
  products: RiArchiveLine,
  analytics: RiPieChart2Line,
  ai: RiSparkling2Line,
};

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Session ended securely');
    navigate('/login');
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out
        bg-surface-container border-r border-outline/50 shadow-neo-lg
        ${collapsed ? 'w-[76px]' : 'w-[268px]'}`}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-outline/40">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-surface-raised shadow-neo-sm border border-white/80">
          <RiStore2Line className="text-primary text-xl" />
        </div>
        {!collapsed && (
<<<<<<< HEAD
          <div className="animate-fade-in overflow-hidden">
            <h1 className="text-white font-bold text-base leading-none tracking-tight">Shoptaq</h1>
            <span className="text-secondary text-xs font-semibold uppercase tracking-wider font-label-sm">AI Command</span>
=======
          <div className="animate-fade-in overflow-hidden min-w-0">
            <h1 className="text-on-surface font-bold text-sm leading-tight tracking-tight truncate">{BRAND.name}</h1>
            <span className="text-on-surface-variant text-[10px] font-medium uppercase tracking-wider font-label-sm block truncate">
              {BRAND.tagline}
            </span>
>>>>>>> 9f55e72
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-on-surface-variant hover:text-primary transition-colors p-1.5 hover:bg-surface-muted/50 rounded-lg"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <RiMenuUnfoldLine size={18} /> : <RiMenuFoldLine size={18} />}
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 pt-4">
          <div className="neo-inset px-3 py-2.5 text-[10px] text-on-surface-variant font-label-sm leading-relaxed">
            <span className="text-secondary font-semibold">Live</span> · {BRAND.workspace}
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-2">
            {!collapsed && <p className="nav-section-label">{section.label}</p>}
            <div className="space-y-1">
              {section.items.map(({ path, label, icon }) => {
                const Icon = iconMap[icon];
                return (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
                    }
                    title={collapsed ? label : undefined}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!collapsed && <span className="text-sm truncate">{label}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-5 border-t border-outline/40 space-y-3">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl border border-outline/50 bg-surface-raised animate-fade-in">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-on-surface text-xs font-semibold truncate">{user.name}</p>
              <p className="text-on-surface-variant text-[10px] truncate capitalize">{user.role || 'operator'}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`nav-item w-full hover:text-error ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Sign out' : undefined}
        >
          <RiLogoutBoxLine size={20} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm">Sign out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

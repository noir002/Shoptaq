import { NavLink, useNavigate } from 'react-router-dom';
import {
  RiDashboardLine, RiShoppingBagLine, RiBarChartLine,
  RiRobot2Line, RiLogoutBoxLine, RiMenuFoldLine, RiMenuUnfoldLine
} from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: RiDashboardLine },
  { path: '/products', label: 'Products', icon: RiShoppingBagLine },
  { path: '/analytics', label: 'Analytics', icon: RiBarChartLine },
  { path: '/ai', label: 'AI Generator', icon: RiRobot2Line },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out
        bg-surface-container/60 backdrop-blur-xl border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.3)]
        ${collapsed ? 'w-[72px]' : 'w-[280px]'}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-white/5">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#060e20]">
          <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-1.66-.45-3.22-1.22-4.57" stroke="url(#sidebar-logo-grad)"/>
            <path d="m15.5 5.5 3-3" stroke="url(#sidebar-logo-grad)"/>
            <path d="m15.5 8.5 3 3" stroke="url(#sidebar-logo-grad)"/>
            <defs>
              <linearGradient id="sidebar-logo-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A855F7"/>
                <stop offset="1" stopColor="#3B82F6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <h1 className="text-white font-bold text-base leading-none tracking-tight">Sage</h1>
            <span className="text-secondary text-xs font-semibold uppercase tracking-wider font-label-sm">AI Command</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-white/40 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
        >
          {collapsed ? <RiMenuUnfoldLine size={18} /> : <RiMenuFoldLine size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active text-white' : 'text-on-surface-variant'} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && <span className="animate-fade-in text-sm font-label-md">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-6 border-t border-white/5 space-y-4">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/3 border border-white/5 animate-fade-in overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-on-primary-container font-bold text-sm flex-shrink-0 shadow-glow">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">{user.name}</p>
              <p className="text-white/40 text-[10px] uppercase font-label-sm truncate">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`nav-item w-full hover:text-error hover:bg-error-container/20 hover:border-error-container/30 border border-transparent ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <RiLogoutBoxLine size={20} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm animate-fade-in font-label-md">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

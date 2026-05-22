import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiEyeLine, RiEyeOffLine, RiMailLine, RiLockLine, RiStore2Line, RiShieldCheckLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { BRAND } from '../constants/catalog';

const TRUST_ITEMS = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: 'SOC 2', label: 'Security ready' },
  { value: '24/7', label: 'Ops monitoring' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Enter your credentials to continue');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
      toast.success(`Welcome back, ${data.name}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen tech-bg flex relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />
      </div>

      <div className="hidden lg:flex lg:w-[52%] relative z-10 items-center justify-center p-12 border-r border-outline/50 bg-surface-container-lowest/40">
        <div className="max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-surface-raised border border-outline/50 flex items-center justify-center mb-8 shadow-neo">
            <RiStore2Line className="text-primary text-3xl" />
          </div>
<<<<<<< HEAD
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            <span className="gradient-text font-black">Shoptaq</span>
=======
          <p className="text-secondary text-xs font-semibold uppercase tracking-widest mb-3">{BRAND.tagline}</p>
          <h2 className="text-4xl font-extrabold text-on-surface leading-tight tracking-tight mb-4">
            Operate your retail business with <span className="gradient-text">confidence</span>
>>>>>>> 9f55e72
          </h2>
          <p className="text-on-surface-variant text-base leading-relaxed">
            {BRAND.name} unifies catalog management, fulfillment analytics, and AI merchandising in one professional workspace.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {TRUST_ITEMS.map(({ value, label }) => (
              <div key={label} className="neo-inset rounded-xl p-4 text-center">
                <p className="text-primary font-bold text-lg font-mono">{value}</p>
                <p className="text-on-surface-variant text-[10px] uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-start gap-2 text-on-surface-variant text-sm">
            <RiShieldCheckLine className="text-secondary text-lg flex-shrink-0 mt-0.5" />
            <p>Enterprise-grade session handling with encrypted credentials and role-based access.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 z-10">
<<<<<<< HEAD
        <div className="w-full max-w-md animate-fade-in glass-panel p-8 md:p-10 border border-white/10 rounded-2xl relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="noise-overlay" />
          <div className="relative z-10">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6 lg:hidden">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center border border-white/10">
                  <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-1.66-.45-3.22-1.22-4.57" stroke="url(#mob-logo-grad)"/>
                    <path d="m15.5 5.5 3-3" stroke="url(#mob-logo-grad)"/>
                    <path d="m15.5 8.5 3 3" stroke="url(#mob-logo-grad)"/>
                    <defs>
                      <linearGradient id="mob-logo-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#A855F7"/>
                        <stop offset="1" stopColor="#3B82F6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="text-white font-bold text-lg tracking-tight">Shoptaq</span>
=======
        <div className="w-full max-w-md animate-fade-in card p-8 md:p-10">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-surface-raised border border-outline/50 flex items-center justify-center">
              <RiStore2Line className="text-primary text-xl" />
            </div>
            <span className="text-on-surface font-bold text-lg">{BRAND.name}</span>
          </div>

          <h1 className="text-2xl font-bold text-on-surface mb-1">Sign in</h1>
          <p className="text-on-surface-variant text-sm mb-8">Access your {BRAND.name} operations workspace</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-2">Work email</label>
              <div className="relative">
                <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-11"
                  placeholder="operator@company.com"
                  autoComplete="email"
                />
>>>>>>> 9f55e72
              </div>
            </div>

<<<<<<< HEAD
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider font-label-sm mb-2">Email address</label>
                <div className="relative">
                  <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-11"
                    placeholder="admin@shoptaq.com"
                    autoComplete="email"
                  />
                </div>
=======
            <div>
              <label className="block text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-11 pr-11"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
                  {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
>>>>>>> 9f55e72
              </div>
            </div>

            <button id="login-submit" type="submit" disabled={loading} className="btn-primary w-full h-12 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 spinner" /> Authenticating…</> : 'Continue to workspace'}
            </button>
          </form>

          <p className="text-center text-on-surface-variant text-sm mt-8">
            New to {BRAND.name}?{' '}
            <Link to="/signup" className="text-secondary font-semibold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

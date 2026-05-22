import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiEyeLine, RiEyeOffLine, RiMailLine, RiLockLine, RiUserLine, RiStore2Line, RiCheckLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { BRAND } from '../constants/catalog';

const FEATURES = [
  'Unified SKU catalog with replenishment alerts',
  'Executive dashboards and department analytics',
  'AI listing copy, taxonomy, and margin tools',
  'Secure team access with audit-ready sessions',
];

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('All fields are required');
    if (form.password !== form.confirm) return toast.error('Passwords must match');
    if (form.password.length < 6) return toast.error('Use at least 6 characters');

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
      toast.success(`Workspace ready — welcome, ${data.name}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen tech-bg flex relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />
      </div>

      <div className="hidden lg:flex lg:w-[52%] relative z-10 items-center justify-center p-12 border-r border-outline/50 bg-surface-container-lowest/40">
        <div className="max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-surface-raised border border-outline/50 flex items-center justify-center mb-8 shadow-neo">
            <RiStore2Line className="text-primary text-3xl" />
          </div>
<<<<<<< HEAD
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Join <span className="gradient-text font-black">Shoptaq</span>
=======
          <h2 className="text-4xl font-extrabold text-on-surface leading-tight mb-4">
            Launch your <span className="gradient-text">{BRAND.name}</span> workspace
>>>>>>> 9f55e72
          </h2>
          <p className="text-on-surface-variant text-base leading-relaxed mb-8">
            Onboard in minutes and start managing inventory, insights, and merchandising from a single platform.
          </p>
          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 p-3 rounded-xl border border-outline/40 bg-surface-raised">
                <RiCheckLine className="text-secondary text-lg flex-shrink-0 mt-0.5" />
                <span className="text-on-surface-variant text-sm">{f}</span>
              </li>
            ))}
          </ul>
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
                    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-1.66-.45-3.22-1.22-4.57" stroke="url(#mob-signup-grad)"/>
                    <path d="m15.5 5.5 3-3" stroke="url(#mob-signup-grad)"/>
                    <path d="m15.5 8.5 3 3" stroke="url(#mob-signup-grad)"/>
                    <defs>
                      <linearGradient id="mob-signup-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#A855F7"/>
                        <stop offset="1" stopColor="#3B82F6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="text-white font-bold text-lg tracking-tight">Shoptaq</span>
=======
        <div className="w-full max-w-md animate-fade-in card p-8 md:p-10">
          <h1 className="text-2xl font-bold text-on-surface mb-1">Create account</h1>
          <p className="text-on-surface-variant text-sm mb-8">Set up your operator profile for {BRAND.name}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1.5">Full name</label>
              <div className="relative">
                <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input id="signup-name" type="text" value={form.name} onChange={update('name')} className="input pl-11" placeholder="Alex Morgan" />
>>>>>>> 9f55e72
              </div>
            </div>

            <div>
              <label className="block text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1.5">Work email</label>
              <div className="relative">
                <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input id="signup-email" type="email" value={form.email} onChange={update('email')} className="input pl-11" placeholder="alex@retailco.com" />
              </div>
            </div>

            <div>
              <label className="block text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input id="signup-password" type={showPass ? 'text' : 'password'} value={form.password} onChange={update('password')} className="input pl-11 pr-11" placeholder="Minimum 6 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
                  {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1.5">Confirm password</label>
              <div className="relative">
                <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input id="signup-confirm" type="password" value={form.confirm} onChange={update('confirm')} className={`input pl-11 ${form.confirm && form.confirm !== form.password ? 'border-red-400' : ''}`} placeholder="Re-enter password" />
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p className="text-error text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <button id="signup-submit" type="submit" disabled={loading} className="btn-primary w-full h-12 mt-2 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 spinner" /> Creating workspace…</> : 'Create workspace'}
            </button>
          </form>

          <p className="text-center text-on-surface-variant text-sm mt-8">
            Already registered?{' '}
            <Link to="/login" className="text-secondary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiEyeLine, RiEyeOffLine, RiMailLine, RiLockLine, RiUserLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
      toast.success(`Account created! Welcome, ${data.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex relative overflow-hidden">
      {/* Global Background Glow Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12 z-10 border-r border-white/5 bg-surface-container-lowest/30 backdrop-blur-xl">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-secondary/15 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-primary/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-surface-container/80 flex items-center justify-center mx-auto mb-8 shadow-glow border border-white/10 animate-float">
            <svg className="w-14 h-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-1.66-.45-3.22-1.22-4.57" stroke="url(#signup-logo-grad)"/>
              <path d="m15.5 5.5 3-3" stroke="url(#signup-logo-grad)"/>
              <path d="m15.5 8.5 3 3" stroke="url(#signup-logo-grad)"/>
              <defs>
                <linearGradient id="signup-logo-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#A855F7"/>
                  <stop offset="1" stopColor="#3B82F6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Join Sage <span className="gradient-text font-black">AI</span>
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed font-body-md">
            Get real-time insights and copy recommendations from Google Gemini.
          </p>
          <div className="mt-10 space-y-3">
            {['🤖 AI content generation', '📊 Real-time analytics dashboards', '📦 Smart low-stock alerts', '🔐 Secure token administration'].map((f) => (
              <div key={f} className="glass-panel rounded-xl px-5 py-3 text-left">
                <p className="text-white/70 text-sm font-body-md">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right signup form */}
      <div className="flex-1 flex items-center justify-center p-6 z-10">
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
                <span className="text-white font-bold text-lg tracking-tight">Sage AI</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Create account</h1>
              <p className="text-on-surface-variant text-sm">Set up your admin command center in seconds</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider font-label-sm mb-1.5">Full name</label>
                <div className="relative">
                  <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
                  <input id="signup-name" type="text" value={form.name} onChange={update('name')} className="input pl-11" placeholder="John Doe" />
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider font-label-sm mb-1.5">Email address</label>
                <div className="relative">
                  <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
                  <input id="signup-email" type="email" value={form.email} onChange={update('email')} className="input pl-11" placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider font-label-sm mb-1.5">Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
                  <input
                    id="signup-password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={update('password')}
                    className="input pl-11 pr-11"
                    placeholder="Min 6 characters"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider font-label-sm mb-1.5">Confirm password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
                  <input
                    id="signup-confirm"
                    type="password"
                    value={form.confirm}
                    onChange={update('confirm')}
                    className={`input pl-11 ${form.confirm && form.confirm !== form.password ? 'border-red-500/50' : ''}`}
                    placeholder="Repeat password"
                  />
                </div>
                {form.confirm && form.confirm !== form.password && (
                  <p className="text-error text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              <button id="signup-submit" type="submit" disabled={loading} className="btn-primary w-full mt-4 flex items-center justify-center gap-2 h-12 shadow-[0_4px_20px_rgba(160,120,255,0.3)]">
                {loading ? <><div className="w-4 h-4 spinner" />Creating account...</> : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-white/40 text-sm mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary hover:underline font-semibold transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

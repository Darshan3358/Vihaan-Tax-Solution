import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/common/SEO';

export const AdminLogin: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@vihaantax.com');
  const [password, setPassword] = useState('Admin@123456');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login" />
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-navy-900 border border-navy-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-gold text-navy-950 flex items-center justify-center font-black text-2xl mx-auto shadow-gold-glow">
              V
            </div>
            <h1 className="text-2xl font-bold text-white">Admin CMS Portal</h1>
            <p className="text-xs text-slate-400">Vihaan Tax Solutions Content & Lead System</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Admin Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-brand-gold to-amber-500 hover:from-amber-500 hover:to-brand-gold text-navy-950 font-bold py-3.5 rounded-xl shadow-gold-glow transition text-sm"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-[11px] text-slate-400 text-center space-y-1">
            <span className="font-semibold text-brand-gold block">Default Credentials (Seed Account):</span>
            <p>Email: admin@vihaantax.com</p>
            <p>Password: Admin@123456</p>
          </div>
        </div>
      </div>
    </>
  );
};

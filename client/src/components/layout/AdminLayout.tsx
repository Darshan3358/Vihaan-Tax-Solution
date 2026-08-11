import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Home,
  MessageSquareQuote,
  HelpCircle,
  FileImage,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Leads & Enquiries', path: '/admin/leads', icon: Users },
    { name: 'Services CMS', path: '/admin/services', icon: Briefcase },
    { name: 'Homepage CMS', path: '/admin/homepage-cms', icon: Home },
    { name: 'Testimonials CMS', path: '/admin/testimonials', icon: MessageSquareQuote },
    { name: 'FAQ Manager', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Media Library', path: '/admin/media', icon: FileImage },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-navy-950 text-white p-4 flex justify-between items-center border-b border-navy-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-gold text-navy-950 flex items-center justify-center font-bold">
            V
          </div>
          <span className="font-bold text-sm">Vihaan Admin CMS</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg bg-navy-900"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 w-64 bg-navy-950 text-slate-300 flex flex-col justify-between border-r border-navy-900 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } h-screen`}
      >
        <div>
          {/* Header */}
          <div className="p-6 border-b border-navy-900">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold to-amber-600 flex items-center justify-center text-navy-950 font-black text-xl shadow-gold-glow">
                V
              </div>
              <div>
                <span className="font-extrabold text-base text-white block leading-none">Vihaan CMS</span>
                <span className="text-[10px] uppercase tracking-widest text-brand-gold font-semibold block mt-1">
                  Tax Consultancy Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Content & Lead Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-md font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-gold' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Actions */}
        <div className="p-4 border-t border-navy-900 space-y-3 bg-navy-900/50">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-slate-400 block truncate">{user?.email || 'admin@vihaantax.com'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-navy-900">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-navy-900 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition"
              title="Preview Website"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-gold" />
              <span>Live Site</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg text-xs font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

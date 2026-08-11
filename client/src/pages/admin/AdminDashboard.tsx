import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileCheck, Clock, CheckCircle2, ArrowUpRight, MessageSquare, Briefcase } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { dashboardApi } from '../../services/api';
import { IDashboardStats } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SEO } from '../../components/common/SEO';

const COLORS = ['#0B1F33', '#164E78', '#C9A227', '#16803C', '#667085', '#D92D20'];

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<IDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await dashboardApi.getStats();
        setData(statsData);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-2xl bg-slate-200 animate-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-200 animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <>
      <SEO title="Admin Dashboard" />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-navy-900">Dashboard Overview</h1>
            <p className="text-xs text-slate-500">Real-time Lead Inquiries, Conversion Performance, and System Metrics.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/leads"
              className="bg-brand-blue hover:bg-navy-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Manage All Leads</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Total Inquiries</span>
              <h3 className="text-3xl font-extrabold text-navy-900 mt-1">{stats?.totalLeads || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">New Unread Leads</span>
              <h3 className="text-3xl font-extrabold text-brand-blue mt-1">{stats?.newLeads || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">In Discussion</span>
              <h3 className="text-3xl font-extrabold text-amber-600 mt-1">{stats?.inDiscussionLeads || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Converted Clients</span>
              <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{stats?.convertedLeads || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Bar Chart: Leads by Service */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-navy-900 mb-4">Inquiries Distribution by Service</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.leadsByService || []}>
                  <XAxis dataKey="name" stroke="#667085" fontSize={11} />
                  <YAxis stroke="#667085" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#164E78" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Status Breakdown */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-navy-900 mb-4">Lead Status Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.leadsByStatus || []}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {(data?.leadsByStatus || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Lead Inquiries Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-navy-900">Recent Customer Inquiries</h3>
            <Link to="/admin/leads" className="text-xs font-bold text-brand-blue hover:underline">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4">Lead Ref</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Phone / Email</th>
                  <th className="p-4">Requested Service</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data?.recentLeads || []).map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-navy-900">{lead.leadNumber}</td>
                    <td className="p-4 font-medium text-slate-800">{lead.name}</td>
                    <td className="p-4 text-slate-600">
                      <div>{lead.phone}</div>
                      <div className="text-[10px] text-slate-400">{lead.email}</div>
                    </td>
                    <td className="p-4 font-semibold text-brand-blue">{lead.serviceName}</td>
                    <td className="p-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to="/admin/leads"
                        className="p-1.5 rounded-lg text-brand-blue hover:bg-blue-50 transition inline-block"
                        title="View Details"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, CheckCircle2, Globe, MessageSquare } from 'lucide-react';
import { testimonialApi, settingApi } from '../../services/api';
import { ITestimonial } from '../../types';
import { useCMS } from '../../context/CMSContext';
import { Modal } from '../../components/common/Modal';
import { SEO } from '../../components/common/SEO';
import { toast } from 'sonner';

export const AdminTestimonials: React.FC = () => {
  const { settings, refreshSettings } = useCMS();
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<ITestimonial> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatingSource, setIsUpdatingSource] = useState(false);

  const handleUpdateReviewSource = async (source: 'live' | 'mock') => {
    setIsUpdatingSource(true);
    try {
      await settingApi.updateAdminSettings({ reviewSource: source });
      await refreshSettings();
      toast.success(`Default Website Review Mode changed to ${source === 'live' ? 'Live Google Reviews' : 'Admin Custom Reviews'}`);
    } catch (err) {
      toast.error('Failed to update review display mode');
    } finally {
      setIsUpdatingSource(false);
    }
  };

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const data = await testimonialApi.getAdminTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenEdit = (item?: ITestimonial) => {
    if (item) {
      setEditingItem(JSON.parse(JSON.stringify(item)));
    } else {
      setEditingItem({
        name: '',
        designation: 'Client',
        company: '',
        rating: 5,
        content: '',
        published: true,
        displayOrder: testimonials.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.content) {
      toast.error('Client name and review content are required');
      return;
    }

    try {
      if (editingItem._id) {
        await testimonialApi.updateTestimonial(editingItem._id, editingItem);
        toast.success('Testimonial updated');
      } else {
        await testimonialApi.createTestimonial(editingItem);
        toast.success('Testimonial created');
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      toast.error('Failed to save testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await testimonialApi.deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      toast.success('Testimonial deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <SEO title="Testimonials CMS" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-navy-900">Testimonials CMS</h1>
            <p className="text-xs text-slate-500">Manage client reviews, ratings, and display statuses.</p>
          </div>

          <button
            onClick={() => handleOpenEdit()}
            className="bg-brand-gold text-navy-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-gold-glow hover:bg-amber-400 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        </div>

        {/* Review Mode Control Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-navy-900 flex items-center gap-2">
                <span>Homepage Review Display Mode</span>
                <span className="text-[10px] bg-brand-cyan/10 text-brand-cyan px-2 py-0.5 rounded-full font-bold">
                  Current Mode: {settings?.reviewSource === 'live' ? 'Live Google Reviews' : 'Admin Custom Reviews'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose whether the homepage defaults to real Google Reviews or custom reviews added in this CMS.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
              <button
                type="button"
                disabled={isUpdatingSource}
                onClick={() => handleUpdateReviewSource('live')}
                className={`px-3.5 py-2 rounded-lg font-bold text-xs transition flex items-center gap-2 ${
                  settings?.reviewSource === 'live'
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Live Google Reviews</span>
              </button>

              <button
                type="button"
                disabled={isUpdatingSource}
                onClick={() => handleUpdateReviewSource('mock')}
                className={`px-3.5 py-2 rounded-lg font-bold text-xs transition flex items-center gap-2 ${
                  settings?.reviewSource === 'mock'
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-brand-gold" />
                <span>Admin Added Reviews</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="p-4">Client Name</th>
                <th className="p-4">Designation & Company</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Loading testimonials...
                  </td>
                </tr>
              ) : (
                testimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-navy-900">{t.name}</td>
                    <td className="p-4 text-slate-600">
                      {t.designation} {t.company ? `(${t.company})` : ''}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <span>{t.rating}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </div>
                    </td>
                    <td className="p-4">
                      {t.published ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">Draft</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1.5 text-brand-blue hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && editingItem && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem._id ? 'Edit Testimonial' : 'Add Testimonial'}
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Client Name *</label>
              <input
                type="text"
                required
                value={editingItem.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={editingItem.designation || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, designation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={editingItem.company || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
              <select
                value={editingItem.rating || 5}
                onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value={5}>5 Stars - Excellent</option>
                <option value={4}>4 Stars - Good</option>
                <option value={3}>3 Stars - Average</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Testimonial Review *</label>
              <textarea
                rows={4}
                required
                value={editingItem.content || ''}
                onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-navy-900 text-white font-bold rounded-xl text-xs hover:bg-brand-blue transition"
              >
                Save Review
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

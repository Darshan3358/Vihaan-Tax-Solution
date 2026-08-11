import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { faqApi } from '../../services/api';
import { IFAQ } from '../../types';
import { Modal } from '../../components/common/Modal';
import { SEO } from '../../components/common/SEO';
import { toast } from 'sonner';

export const AdminFAQs: React.FC = () => {
  const [faqs, setFaqs] = useState<IFAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<IFAQ> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const data = await faqApi.getAdminFAQs();
      setFaqs(data);
    } catch (err) {
      console.error('Error fetching admin FAQs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenEdit = (item?: IFAQ) => {
    if (item) {
      setEditingItem(JSON.parse(JSON.stringify(item)));
    } else {
      setEditingItem({
        question: '',
        answer: '',
        category: 'General',
        published: true,
        displayOrder: faqs.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.question || !editingItem?.answer) {
      toast.error('Question and Answer are required');
      return;
    }

    try {
      if (editingItem._id) {
        await faqApi.updateFAQ(editingItem._id, editingItem);
        toast.success('FAQ updated');
      } else {
        await faqApi.createFAQ(editingItem);
        toast.success('FAQ created');
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (err) {
      toast.error('Failed to save FAQ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await faqApi.deleteFAQ(id);
      setFaqs((prev) => prev.filter((f) => f._id !== id));
      toast.success('FAQ deleted');
    } catch (err) {
      toast.error('Failed to delete FAQ');
    }
  };

  return (
    <>
      <SEO title="FAQ Manager" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-navy-900">FAQ Manager</h1>
            <p className="text-xs text-slate-500">Add, edit, reorder, and categorize frequently asked questions.</p>
          </div>

          <button
            onClick={() => handleOpenEdit()}
            className="bg-brand-gold text-navy-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-gold-glow hover:bg-amber-400 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New FAQ</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="p-4">Category</th>
                <th className="p-4">Question</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    Loading FAQs...
                  </td>
                </tr>
              ) : (
                faqs.map((f) => (
                  <tr key={f._id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-brand-blue">{f.category}</td>
                    <td className="p-4 font-bold text-slate-800">{f.question}</td>
                    <td className="p-4">
                      {f.published ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">Draft</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(f)}
                        className="p-1.5 text-brand-blue hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(f._id)}
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
          title={editingItem._id ? 'Edit FAQ' : 'Add New FAQ'}
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={editingItem.category || 'General'}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="GST">GST</option>
                <option value="ITR">ITR</option>
                <option value="Accounting">Accounting</option>
                <option value="Business Registration">Business Registration</option>
                <option value="Audit">Audit</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Question *</label>
              <input
                type="text"
                required
                value={editingItem.question || ''}
                onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Answer *</label>
              <textarea
                rows={4}
                required
                value={editingItem.answer || ''}
                onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
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
                Save FAQ
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

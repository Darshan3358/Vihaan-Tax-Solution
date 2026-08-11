import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { serviceApi } from '../../services/api';
import { IService } from '../../types';
import { Modal } from '../../components/common/Modal';
import { SEO } from '../../components/common/SEO';
import { toast } from 'sonner';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<IService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<Partial<IService> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await serviceApi.getAdminServices();
      setServices(data);
    } catch (err) {
      console.error('Error fetching admin services:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenEdit = (service?: IService) => {
    if (service) {
      setEditingService(JSON.parse(JSON.stringify(service)));
    } else {
      setEditingService({
        title: '',
        slug: '',
        shortDescription: '',
        description: '',
        icon: 'FileText',
        heroImage: '/images/hero.png',
        thumbnail: '/images/hero.png',
        benefits: ['Fast Processing', '100% Tax Compliant'],
        process: [
          { stepNumber: '01', title: 'Consultation', description: 'Initial review of requirements.' },
        ],
        documents: ['PAN Card', 'Aadhaar Card'],
        ctaText: 'Book Consultation',
        displayOrder: services.length + 1,
        published: true,
        seo: { metaTitle: '', metaDescription: '', keywords: [] },
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title || !editingService?.shortDescription) {
      toast.error('Title and Short Description are required');
      return;
    }

    // Auto slug if empty
    const slug =
      editingService.slug ||
      editingService.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const payload = { ...editingService, slug };

    try {
      if (editingService._id) {
        await serviceApi.updateService(editingService._id, payload);
        toast.success('Service updated successfully');
      } else {
        await serviceApi.createService(payload);
        toast.success('Service created successfully');
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await serviceApi.deleteService(id);
      setServices((prev) => prev.filter((s) => s._id !== id));
      toast.success('Service deleted');
    } catch (err) {
      toast.error('Failed to delete service');
    }
  };

  return (
    <>
      <SEO title="Service CMS" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-navy-900">Service Management CMS</h1>
            <p className="text-xs text-slate-500">Create, edit, reorder, and update core tax & accounting services.</p>
          </div>

          <button
            onClick={() => handleOpenEdit()}
            className="bg-brand-gold text-navy-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-gold-glow hover:bg-amber-400 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Service Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading services...
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service._id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-navy-900">{service.displayOrder}</td>
                    <td className="p-4 font-bold text-slate-800">{service.title}</td>
                    <td className="p-4 font-semibold text-brand-blue">{service.category || 'General'}</td>
                    <td className="p-4 font-black text-emerald-700">{service.price || 'N/A'}</td>
                    <td className="p-4">
                      {service.published ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          Published
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(service)}
                        className="p-1.5 text-brand-blue hover:bg-blue-50 rounded-lg transition"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Service"
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

      {/* Service Editor Modal */}
      {isModalOpen && editingService && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingService._id ? `Edit Service: ${editingService.title}` : 'Add New Service'}
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slug (URL string)</label>
                <input
                  type="text"
                  value={editingService.slug || ''}
                  onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                  placeholder="e.g. gst-registration"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={editingService.category || ''}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                  placeholder="e.g. GOODS AND SERVICES TAX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Price / Fee (e.g. ₹2,500.00)</label>
                <input
                  type="text"
                  value={editingService.price || ''}
                  onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                  placeholder="e.g. ₹2,500.00"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-blue font-bold text-emerald-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Short Description *</label>
              <textarea
                rows={2}
                required
                value={editingService.shortDescription || ''}
                onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Overview Description</label>
              <textarea
                rows={5}
                value={editingService.description || ''}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lucide Icon Name</label>
                <input
                  type="text"
                  value={editingService.icon || 'FileText'}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                  placeholder="Building2, ReceiptCheck, etc."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={editingService.displayOrder || 1}
                  onChange={(e) => setEditingService({ ...editingService, displayOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={editingService.published ? 'true' : 'false'}
                  onChange={(e) => setEditingService({ ...editingService, published: e.target.value === 'true' })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
              </div>
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
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

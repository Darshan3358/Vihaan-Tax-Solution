import React, { useState, useEffect } from 'react';
import { Save, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { settingApi } from '../../services/api';
import { ISetting } from '../../types';
import { SEO } from '../../components/common/SEO';
import { toast } from 'sonner';

export const AdminSettings: React.FC = () => {
  const { settings, refreshSettings } = useCMS();
  const [formData, setFormData] = useState<Partial<ISetting>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(JSON.parse(JSON.stringify(settings)));
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingApi.updateAdminSettings(formData);
      await refreshSettings();
      toast.success('Website Settings updated successfully!');
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <SEO title="Website Settings" />

      <div className="space-y-8 max-w-4xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-navy-900">Global Website Settings</h1>
            <p className="text-xs text-slate-500">Update company contact info, phone, email, WhatsApp, and SEO meta tags.</p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-navy-900 hover:bg-brand-blue text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-brand-gold" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Contact Info Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-2">
              Branding & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Number (with country code)</label>
                <input
                  type="text"
                  value={formData.whatsapp || ''}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="e.g. 917861096198"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-emerald-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Office Address</label>
              <textarea
                rows={2}
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Office Timings</label>
                <input
                  type="text"
                  value={formData.officeHours || ''}
                  onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Google Maps Embed URL</label>
                <input
                  type="text"
                  value={formData.mapEmbedUrl || ''}
                  onChange={(e) => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Global SEO Settings Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-2">
              Global SEO Metadata
            </h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Meta Title Tag</label>
              <input
                type="text"
                value={formData.globalSeo?.metaTitle || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    globalSeo: { ...formData.globalSeo!, metaTitle: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Meta Description Tag</label>
              <textarea
                rows={3}
                value={formData.globalSeo?.metaDescription || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    globalSeo: { ...formData.globalSeo!, metaDescription: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Image, Eye } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { settingApi } from '../../services/api';
import { ISetting } from '../../types';
import { SEO } from '../../components/common/SEO';
import { toast } from 'sonner';

export const AdminHomepageCMS: React.FC = () => {
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
      toast.success('Homepage CMS content saved and published!');
    } catch (err) {
      toast.error('Failed to save homepage CMS content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <SEO title="Homepage CMS" />

      <div className="space-y-8 max-w-4xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-navy-900">Homepage Content CMS</h1>
            <p className="text-xs text-slate-500">Edit hero headlines, consultant profile bio, images, and trust counters.</p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-navy-900 hover:bg-brand-blue text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-brand-gold" />
            <span>{isSaving ? 'Publishing...' : 'Publish Changes'}</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8 text-xs">
          {/* Hero Section Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-2">
              Hero Section CMS
            </h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Eyebrow Badge Text</label>
              <input
                type="text"
                value={formData.hero?.eyebrow || ''}
                onChange={(e) =>
                  setFormData({ ...formData, hero: { ...formData.hero!, eyebrow: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Main Heading (H1)</label>
              <input
                type="text"
                value={formData.hero?.heading || ''}
                onChange={(e) =>
                  setFormData({ ...formData, hero: { ...formData.hero!, heading: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-sm focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Supporting Description</label>
              <textarea
                rows={3}
                value={formData.hero?.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, hero: { ...formData.hero!, description: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary CTA Button Label</label>
                <input
                  type="text"
                  value={formData.hero?.ctaPrimary || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, hero: { ...formData.hero!, ctaPrimary: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Secondary CTA Button Label</label>
                <input
                  type="text"
                  value={formData.hero?.ctaSecondary || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, hero: { ...formData.hero!, ctaSecondary: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hero Image URL</label>
              <input
                type="text"
                value={formData.hero?.heroImage || ''}
                onChange={(e) =>
                  setFormData({ ...formData, hero: { ...formData.hero!, heroImage: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Consultant Profile Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-2">
              Consultant Profile CMS (Mr. Vilas Joshi)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Consultant Name</label>
                <input
                  type="text"
                  value={formData.consultant?.name || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      consultant: { ...formData.consultant!, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={formData.consultant?.designation || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      consultant: { ...formData.consultant!, designation: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Consultant Portrait Image URL</label>
              <input
                type="text"
                value={formData.consultant?.image || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    consultant: { ...formData.consultant!, image: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Biography</label>
              <textarea
                rows={3}
                value={formData.consultant?.bio || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    consultant: { ...formData.consultant!, bio: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Core Business Philosophy Quote</label>
              <textarea
                rows={2}
                value={formData.consultant?.philosophy || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    consultant: { ...formData.consultant!, philosophy: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-brand-blue"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

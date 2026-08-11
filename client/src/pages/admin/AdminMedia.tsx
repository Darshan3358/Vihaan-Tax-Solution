import React, { useState, useEffect } from 'react';
import { Upload, Copy, Trash2, Check, Image as ImageIcon } from 'lucide-react';
import { mediaApi } from '../../services/api';
import { IMedia } from '../../types';
import { SEO } from '../../components/common/SEO';
import { toast } from 'sonner';

export const AdminMedia: React.FC = () => {
  const [mediaList, setMediaList] = useState<IMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const data = await mediaApi.getMediaList();
      setMediaList(data);
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setIsUploading(true);
    try {
      const uploaded = await mediaApi.uploadMedia(file, file.name);
      setMediaList((prev) => [uploaded, ...prev]);
      toast.success('Image uploaded successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = url.startsWith('/') ? window.location.origin + url : url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success('Image URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteMedia = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await mediaApi.deleteMedia(id);
      setMediaList((prev) => prev.filter((m) => m._id !== id));
      toast.success('Image deleted');
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  return (
    <>
      <SEO title="Media Library" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-navy-900">Media Library</h1>
            <p className="text-xs text-slate-500">Upload and manage website images, logos, and consultant photos.</p>
          </div>

          <label className="bg-brand-blue hover:bg-navy-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4 text-brand-gold" />
            <span>{isUploading ? 'Uploading Image...' : 'Upload New Image'}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Media Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-200 animate-shimmer" />
            ))}
          </div>
        ) : mediaList.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold">No media uploaded yet.</p>
            <p className="text-xs mt-1">Upload images to use them across website services and CMS sections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {mediaList.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between"
              >
                <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={item.url}
                    alt={item.altText || item.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="p-3 bg-white space-y-2 text-xs">
                  <p className="font-bold text-navy-900 truncate" title={item.fileName}>
                    {item.fileName}
                  </p>
                  <p className="text-[10px] text-slate-400">{(item.size / 1024).toFixed(1)} KB</p>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleCopyUrl(item.url, item._id)}
                      className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 transition"
                    >
                      {copiedId === item._id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === item._id ? 'Copied!' : 'Copy URL'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteMedia(item._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

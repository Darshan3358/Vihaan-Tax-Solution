import axios from 'axios';
import {
  IUser,
  IService,
  ILead,
  ITestimonial,
  IFAQ,
  IMedia,
  ISetting,
  IDashboardStats,
} from '../types';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vts_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post<{ status: string; token: string; data: { user: IUser } }>('/auth/login', { email, password });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get<{ status: string; data: { user: IUser } }>('/auth/me');
    return res.data.data.user;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.post('/auth/change-password', { currentPassword, newPassword });
    return res.data;
  },
};

// Public Services API
export const serviceApi = {
  getServices: async () => {
    const res = await api.get<{ status: string; results: number; data: { services: IService[] } }>('/services');
    return res.data.data.services;
  },
  getServiceBySlug: async (slug: string) => {
    const res = await api.get<{ status: string; data: { service: IService } }>(`/services/${slug}`);
    return res.data.data.service;
  },
  getAdminServices: async () => {
    const res = await api.get<{ status: string; data: { services: IService[] } }>('/services/admin/all');
    return res.data.data.services;
  },
  createService: async (serviceData: Partial<IService>) => {
    const res = await api.post<{ status: string; data: { service: IService } }>('/services/admin', serviceData);
    return res.data.data.service;
  },
  updateService: async (id: string, serviceData: Partial<IService>) => {
    const res = await api.patch<{ status: string; data: { service: IService } }>(`/services/admin/${id}`, serviceData);
    return res.data.data.service;
  },
  deleteService: async (id: string) => {
    await api.delete(`/services/admin/${id}`);
  },
};

// Lead API
export const leadApi = {
  submitLead: async (leadData: Partial<ILead> & { website_url?: string }) => {
    const res = await api.post<{ status: string; message: string; data?: { leadNumber: string } }>('/leads', leadData);
    return res.data;
  },
  getAdminLeads: async (params?: { status?: string; service?: string; search?: string }) => {
    const res = await api.get<{ status: string; results: number; data: { leads: ILead[] } }>('/leads/admin', { params });
    return res.data.data.leads;
  },
  updateLeadStatus: async (id: string, status: string) => {
    const res = await api.patch<{ status: string; data: { lead: ILead } }>(`/leads/admin/${id}/status`, { status });
    return res.data.data.lead;
  },
  addLeadNote: async (id: string, note: string) => {
    const res = await api.post<{ status: string; data: { lead: ILead } }>(`/leads/admin/${id}/notes`, { note });
    return res.data.data.lead;
  },
  deleteLead: async (id: string) => {
    await api.delete(`/leads/admin/${id}`);
  },
  exportCSVUrl: `${API_BASE_URL}/leads/admin/export`,
};

// Testimonials API
export const testimonialApi = {
  getTestimonials: async () => {
    const res = await api.get<{ status: string; data: { testimonials: ITestimonial[] } }>('/testimonials');
    return res.data.data.testimonials;
  },
  getAdminTestimonials: async () => {
    const res = await api.get<{ status: string; data: { testimonials: ITestimonial[] } }>('/testimonials/admin/all');
    return res.data.data.testimonials;
  },
  createTestimonial: async (data: Partial<ITestimonial>) => {
    const res = await api.post<{ status: string; data: { testimonial: ITestimonial } }>('/testimonials/admin', data);
    return res.data.data.testimonial;
  },
  updateTestimonial: async (id: string, data: Partial<ITestimonial>) => {
    const res = await api.patch<{ status: string; data: { testimonial: ITestimonial } }>(`/testimonials/admin/${id}`, data);
    return res.data.data.testimonial;
  },
  deleteTestimonial: async (id: string) => {
    await api.delete(`/testimonials/admin/${id}`);
  },
};

// FAQ API
export const faqApi = {
  getFAQs: async (category?: string) => {
    const res = await api.get<{ status: string; data: { faqs: IFAQ[] } }>('/faqs', { params: { category } });
    return res.data.data.faqs;
  },
  getAdminFAQs: async () => {
    const res = await api.get<{ status: string; data: { faqs: IFAQ[] } }>('/faqs/admin/all');
    return res.data.data.faqs;
  },
  createFAQ: async (data: Partial<IFAQ>) => {
    const res = await api.post<{ status: string; data: { faq: IFAQ } }>('/faqs/admin', data);
    return res.data.data.faq;
  },
  updateFAQ: async (id: string, data: Partial<IFAQ>) => {
    const res = await api.patch<{ status: string; data: { faq: IFAQ } }>(`/faqs/admin/${id}`, data);
    return res.data.data.faq;
  },
  deleteFAQ: async (id: string) => {
    await api.delete(`/faqs/admin/${id}`);
  },
};

// Media API
export const mediaApi = {
  uploadMedia: async (file: File, altText?: string) => {
    const formData = new FormData();
    formData.append('image', file);
    if (altText) formData.append('altText', altText);

    const res = await api.post<{ status: string; data: { media: IMedia } }>('/media/admin', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.media;
  },
  getMediaList: async () => {
    const res = await api.get<{ status: string; data: { media: IMedia[] } }>('/media/admin');
    return res.data.data.media;
  },
  deleteMedia: async (id: string) => {
    await api.delete(`/media/admin/${id}`);
  },
};

// Settings API
export const settingApi = {
  getPublicSettings: async () => {
    const res = await api.get<{ status: string; data: { settings: ISetting } }>('/settings/public');
    return res.data.data.settings;
  },
  updateAdminSettings: async (data: Partial<ISetting>) => {
    const res = await api.patch<{ status: string; data: { settings: ISetting } }>('/settings/admin', data);
    return res.data.data.settings;
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    const res = await api.get<{ status: string; data: IDashboardStats }>('/dashboard/stats');
    return res.data.data;
  },
};

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CMSProvider } from './context/CMSContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileStickyBar } from './components/layout/MobileStickyBar';
import { AdminLayout } from './components/layout/AdminLayout';
import { Toaster } from 'sonner';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Contact } from './pages/Contact';
import { FAQPage } from './pages/FAQPage';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { Disclaimer } from './pages/Disclaimer';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLeads } from './pages/admin/AdminLeads';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminHomepageCMS } from './pages/admin/AdminHomepageCMS';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminMedia } from './pages/admin/AdminMedia';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminFAQs } from './pages/admin/AdminFAQs';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center font-bold">
        Loading Admin CMS...
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const PublicLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-brand-bg text-brand-textDark font-sans">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileStickyBar />
    </div>
  );
};

export const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/"
        element={
          <PublicLayoutWrapper>
            <Home />
          </PublicLayoutWrapper>
        }
      />
      <Route
        path="/about"
        element={
          <PublicLayoutWrapper>
            <About />
          </PublicLayoutWrapper>
        }
      />
      <Route
        path="/services"
        element={
          <PublicLayoutWrapper>
            <Services />
          </PublicLayoutWrapper>
        }
      />
      <Route
        path="/services/:slug"
        element={
          <PublicLayoutWrapper>
            <ServiceDetail />
          </PublicLayoutWrapper>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicLayoutWrapper>
            <Contact />
          </PublicLayoutWrapper>
        }
      />
      <Route
        path="/faq"
        element={
          <PublicLayoutWrapper>
            <FAQPage />
          </PublicLayoutWrapper>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <PublicLayoutWrapper>
            <PrivacyPolicy />
          </PublicLayoutWrapper>
        }
      />
      <Route
        path="/terms-conditions"
        element={
          <PublicLayoutWrapper>
            <TermsConditions />
          </PublicLayoutWrapper>
        }
      />
      <Route
        path="/disclaimer"
        element={
          <PublicLayoutWrapper>
            <Disclaimer />
          </PublicLayoutWrapper>
        }
      />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin CMS */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="homepage-cms" element={<AdminHomepageCMS />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="faqs" element={<AdminFAQs />} />
      </Route>

      {/* Fallback 404 */}
      <Route
        path="*"
        element={
          <PublicLayoutWrapper>
            <NotFound />
          </PublicLayoutWrapper>
        }
      />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CMSProvider>
        <Toaster position="top-right" richColors />
        <AppContent />
      </CMSProvider>
    </AuthProvider>
  );
};

export default App;

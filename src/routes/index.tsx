import React from 'react';
import { Routes, Route, useLocation, Location, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { TrainingPage } from '../pages/TrainingPage';
import { ManagementSystemPage } from '../pages/ManagementSystemPage';
import { ManagementStandardDetailPage } from '../pages/ManagementStandardDetailPage';
import { ManagementStandardRouteModal } from '../components/management-system/ManagementStandardRouteModal';
import { ESGPage } from '../pages/ESGPage';
import { AssociationsPage } from '../pages/AssociationsPage';
import { AssociationDetailPage } from '../pages/AssociationDetailPage';
import { AssociationRouteModal } from '../components/associations/AssociationRouteModal';
import { ContactPage } from '../pages/ContactPage';
import { ProductCertificationPage } from '../pages/ProductCertificationPage';
import { InspectionPage } from '../pages/InspectionPage';
import { CBAMVerificationPage } from '../pages/CBAMVerificationPage';
import { NewsPage } from '../pages/NewsPage';
import { NewsArticleDetailPage } from '../pages/NewsArticleDetailPage';
import { VerifyCertificatePage } from '../pages/VerifyCertificatePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { DesignSystemPage } from '../pages/DesignSystemPage';

// Admin CMS Components & Pages
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminProtectedRoute } from '../components/admin/AdminProtectedRoute';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminCertificatesRegistryPage } from '../pages/admin/AdminCertificatesRegistryPage';
import { AdminCertificateFormPage } from '../pages/admin/AdminCertificateFormPage';
import { AdminEnquiriesRegistryPage } from '../pages/admin/AdminEnquiriesRegistryPage';
import { AdminESGEditorPage } from '../pages/admin/AdminESGEditorPage';
import { AdminHomeEditorPage } from '../pages/admin/AdminHomeEditorPage';
import { AdminAboutEditorPage } from '../pages/admin/AdminAboutEditorPage';
import { AdminAssociationsEditorPage } from '../pages/admin/AdminAssociationsEditorPage';
import { AdminProductCertificationEditorPage } from '../pages/admin/AdminProductCertificationEditorPage';
import { AdminManagementSystemsEditorPage } from '../pages/admin/AdminManagementSystemsEditorPage';
import { AdminInspectionEditorPage } from '../pages/admin/AdminInspectionEditorPage';
import { AdminCbamVerificationEditorPage } from '../pages/admin/AdminCbamVerificationEditorPage';
import { AdminTrainingAcademyEditorPage } from '../pages/admin/AdminTrainingAcademyEditorPage';
import { AdminNewsListPage } from '../pages/admin/AdminNewsListPage';
import { AdminNewsEditorPage } from '../pages/admin/AdminNewsEditorPage';
import { AdminSiteSettingsPage } from '../pages/admin/AdminSiteSettingsPage';
import { AdminAccountsRegistryPage } from '../pages/admin/AdminAccountsRegistryPage';

/**
 * ECASEURO Application Route Definitions
 * - Top-level routes: /, /about, /services, /associations, /contact, /verify-certificate
 * - Service routes: /services/esg, /services/management-system-certification, /services/inspection, /services/training, /services/product-certification
 * - Route-backed modals with background location support for /services/management-system-certification/:slug and /associations/:slug
 * - Standalone crawlable pages when accessed directly
 * - Isolated Admin Portal: /admin/* (Certificate Registry, Add/Edit Certificate, Enquiries Registry, Login)
 */
export const AppRoutes: React.FC = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | undefined;

  return (
    <>
      {/* Primary Routes (or Background Route if modal is active) */}
      <Routes location={state?.backgroundLocation || location}>
        {/* Admin Login Route (Unprotected standalone screen) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Portal Routes (Isolated Administrative Shell) */}
        <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/certificates" replace />} />
            <Route path="certificates" element={<AdminCertificatesRegistryPage />} />
            <Route path="certificates/new" element={<AdminCertificateFormPage />} />
            <Route path="certificates/:id" element={<AdminCertificateFormPage />} />
            <Route path="certificates/:id/edit" element={<AdminCertificateFormPage />} />
            <Route path="enquiries" element={<AdminEnquiriesRegistryPage />} />
            <Route path="content/home" element={<AdminHomeEditorPage />} />
            <Route path="pages/home" element={<AdminHomeEditorPage />} />
            <Route path="content/about" element={<AdminAboutEditorPage />} />
            <Route path="pages/about" element={<AdminAboutEditorPage />} />
            <Route path="network/associations-partners" element={<AdminAssociationsEditorPage />} />
            <Route path="content/associations" element={<AdminAssociationsEditorPage />} />
            <Route path="pages/associations" element={<AdminAssociationsEditorPage />} />
            <Route path="news" element={<AdminNewsListPage />} />
            <Route path="news/new" element={<AdminNewsEditorPage />} />
            <Route path="news/:id" element={<AdminNewsEditorPage />} />
            <Route path="services/product-certification" element={<AdminProductCertificationEditorPage />} />
            <Route path="services/management-systems" element={<AdminManagementSystemsEditorPage />} />
            <Route path="services/management-system" element={<AdminManagementSystemsEditorPage />} />
            <Route path="services/inspection" element={<AdminInspectionEditorPage />} />
            <Route path="services/cbam-verification" element={<AdminCbamVerificationEditorPage />} />
            <Route path="services/cbam" element={<AdminCbamVerificationEditorPage />} />
            <Route path="services/esg-verification" element={<AdminESGEditorPage />} />
            <Route path="services/esg" element={<AdminESGEditorPage />} />
            <Route path="services/training-academy" element={<AdminTrainingAcademyEditorPage />} />
            <Route path="services/training" element={<AdminTrainingAcademyEditorPage />} />
            <Route path="settings" element={<AdminSiteSettingsPage />} />
            <Route path="site-settings" element={<AdminSiteSettingsPage />} />
            <Route path="content/settings" element={<AdminSiteSettingsPage />} />
            <Route path="settings/accounts" element={<AdminAccountsRegistryPage />} />
            <Route path="accounts" element={<AdminAccountsRegistryPage />} />
            <Route path="*" element={<Navigate to="/admin/certificates" replace />} />
          </Route>
        </Route>

        {/* Public Homepage */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Six Approved Service Routes */}
        <Route path="/services/esg" element={<ESGPage />} />
        <Route
          path="/services/management-system-certification"
          element={<ManagementSystemPage />}
        />
        {/* Direct standalone view for standard detail */}
        <Route
          path="/services/management-system-certification/:slug"
          element={<ManagementStandardDetailPage />}
        />
        <Route path="/services/inspection" element={<InspectionPage />} />
        <Route path="/services/training" element={<TrainingPage />} />
        <Route path="/services/training-academy" element={<TrainingPage />} />
        <Route path="/services/product-certification" element={<ProductCertificationPage />} />
        <Route path="/services/product-certification/:schemeSlug" element={<ProductCertificationPage />} />
        <Route path="/services/cbam-verification" element={<CBAMVerificationPage />} />
        <Route path="/services/cbam" element={<CBAMVerificationPage />} />
        <Route path="/services/:slug" element={<PlaceholderPage />} />

        {/* Associations Route */}
        <Route path="/associations" element={<AssociationsPage />} />
        {/* Direct standalone view for association partner profile */}
        <Route path="/associations/:slug" element={<AssociationDetailPage />} />

        {/* News & Insights Routes */}
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsArticleDetailPage />} />

        {/* Contact Route */}
        <Route path="/contact" element={<ContactPage />} />

        {/* Certificate Verification Route */}
        <Route path="/verify-certificate" element={<VerifyCertificatePage />} />


        {/* Internal Development & Verification Route */}
        <Route path="/design-system" element={<DesignSystemPage />} />

        {/* Fallback for unconfigured routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Route-backed Modal Overlays (Active during in-app navigation) */}
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path="/services/management-system-certification/:slug"
            element={<ManagementStandardRouteModal />}
          />
          <Route
            path="/associations/:slug"
            element={<AssociationRouteModal />}
          />
        </Routes>
      )}
    </>
  );
};


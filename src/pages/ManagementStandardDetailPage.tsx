import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { Navbar } from '../components/common/Navbar';
import { ConsultingCTA } from '../components/common/ConsultingCTA';
import { Footer } from '../components/common/Footer';
import { ManagementStandardDetailContent } from '../components/management-system/ManagementStandardDetailContent';
import {
  defaultManagementStandardsSectionContent,
  defaultManagementSystemConsultingCTAContent,
} from '../cms/managementSystemContent';

export const ManagementStandardDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const standard = defaultManagementStandardsSectionContent.standards.find(
    (s) => s.slug === slug || s.id === slug
  );

  useEffect(() => {
    if (standard) {
      document.title =
        standard.seo?.title || `${standard.title} Certification | ECASEURO`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && standard.seo?.description) {
        metaDescription.setAttribute('content', standard.seo.description);
      }
    } else {
      document.title = 'Standard Not Found | ECASEURO';
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [standard]);

  return (
    <main id="main-content" className="min-h-screen bg-[#EEEEEE] flex flex-col pt-24 sm:pt-28">
      <Navbar />

      <div className="flex-1 w-full max-w-[1380px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumbs & Back link */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <Link
            to="/services/management-system-certification"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#082046] hover:text-[#1F3D78] transition-colors"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>All Management System Standards</span>
          </Link>
        </div>

        {standard ? (
          <article className="w-full max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-slate-200">
            <ManagementStandardDetailContent standard={standard} isStandalone={true} />

            {/* Bottom action row */}
            <div className="mt-10 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/services/management-system-certification"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#082046] bg-slate-100 hover:bg-slate-200 transition-colors shadow-2xs"
              >
                <ArrowLeft size={16} weight="bold" />
                <span>Back to Standards Listing</span>
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#0F1B4A] via-[#1C3372] to-[#5983BD] hover:opacity-95 shadow-2xs transition-all"
              >
                <span>Inquire About This Standard</span>
              </Link>
            </div>
          </article>
        ) : (
          <div className="w-full max-w-xl mx-auto bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-200">
            <h1 className="text-2xl font-bold text-[#082046] mb-3">
              Standard Not Found
            </h1>
            <p className="text-sm text-[#475569] mb-6">
              The requested certification standard could not be found or may have been moved.
            </p>
            <Link
              to="/services/management-system-certification"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#082046] hover:bg-[#102A56] transition-colors"
            >
              <ArrowLeft size={16} weight="bold" />
              <span>View All Standards</span>
            </Link>
          </div>
        )}
      </div>

      {/* Shared CTA & Footer */}
      <div className="relative w-full overflow-hidden mt-12 sm:mt-16">
        <ConsultingCTA content={defaultManagementSystemConsultingCTAContent} id="standard-detail-cta" />
        <Footer withGlobe={true} />
      </div>
    </main>
  );
};

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RouteDetailModal } from '../common/RouteDetailModal';
import { AssociationDetailContent } from './AssociationDetailContent';
import { defaultAssociationsPageContent } from '../../cms/associationsContent';
import { getAssociationsContent } from '../../cms/queries';
import { useCMSPage } from '../../cms/useCMS';

export const AssociationRouteModal: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const content = useCMSPage(getAssociationsContent, defaultAssociationsPageContent);

  const partner = content.partners?.find((p) => p.slug === slug || p.id === slug);

  const handleClose = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/associations', { replace: true });
    }
  };

  if (!partner) {
    return null;
  }

  return (
    <RouteDetailModal
      isOpen={true}
      onClose={handleClose}
      titleId="partner-modal-title"
      descId="partner-modal-summary"
      maxWidthClass="max-w-2xl"
    >
      <AssociationDetailContent partner={partner} isStandalone={false} />

      {/* Modal bottom action / Fixed Footer */}
      <div className="shrink-0 p-4 sm:p-5 sm:px-8 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end z-10">
        <button
          type="button"
          onClick={handleClose}
          className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#082046] bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#082046]/30 active:scale-[0.98]"
        >
          Close
        </button>
      </div>
    </RouteDetailModal>
  );
};

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RouteDetailModal } from '../common/RouteDetailModal';
import { ManagementStandardDetailContent } from './ManagementStandardDetailContent';
import { defaultManagementStandardsSectionContent } from '../../cms/managementSystemContent';

export const ManagementStandardRouteModal: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const standard = defaultManagementStandardsSectionContent.standards.find(
    (s) => s.slug === slug || s.id === slug
  );

  const handleClose = () => {
    // If browser history exists, go back cleanly; otherwise navigate to base listing
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/services/management-system-certification', { replace: true });
    }
  };

  if (!standard) {
    return null;
  }

  return (
    <RouteDetailModal
      isOpen={true}
      onClose={handleClose}
      titleId="standard-modal-title"
      descId="standard-modal-summary"
      maxWidthClass="max-w-2xl"
    >
      <ManagementStandardDetailContent standard={standard} isStandalone={false} />

      {/* Modal bottom action */}
      <div className="p-4 sm:p-6 pt-3 sm:pt-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
        <button
          type="button"
          onClick={handleClose}
          className="px-5 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#082046] bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#082046]/30"
        >
          Close
        </button>
      </div>
    </RouteDetailModal>
  );
};

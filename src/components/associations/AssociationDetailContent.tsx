import React, { useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import type { AssociationPartner } from '../../cms/types';

export interface AssociationDetailContentProps {
  partner: AssociationPartner;
  isStandalone?: boolean;
}

export const AssociationDetailContent: React.FC<AssociationDetailContentProps> = ({
  partner,
  isStandalone = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const profile = partner.profile;
  const hasServices = Boolean(profile?.services && profile.services.length > 0);
  const hasSpecialties = Boolean(profile?.specialties && profile.specialties.length > 0);

  return (
    <div
      className={`flex flex-col text-[#082046] ${
        isStandalone ? 'w-full' : 'flex-1 min-h-0 overflow-hidden'
      }`}
    >
      {/* Header bar */}
      <div
        className={`shrink-0 flex items-start justify-between gap-3 sm:gap-4 border-b border-slate-100 bg-white ${
          isStandalone
            ? 'pb-6 mb-6'
            : 'p-5 sm:p-7 md:p-8 pb-4 sm:pb-5 pr-14 sm:pr-16'
        }`}
      >
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          {/* Logo or Badge */}
          <div className="h-12 sm:h-14 md:h-16 max-w-[140px] sm:max-w-[180px] md:max-w-[200px] flex items-center justify-start shrink-0">
            {partner.logo && !imgError ? (
              <img
                src={partner.logo}
                alt={partner.logoAlt || `${partner.name} logo`}
                onError={() => setImgError(true)}
                className="max-h-12 sm:max-h-14 md:max-h-16 w-auto max-w-full object-contain object-left"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-11 px-3.5 rounded-lg bg-slate-100 border border-slate-200 text-[#082046] flex items-center justify-center font-bold text-sm">
                {partner.name}
              </div>
            )}
          </div>

          {/* Name & Location */}
          <div className="min-w-0">
            {isStandalone ? (
              <h1
                id="partner-detail-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#082046] leading-snug"
              >
                {partner.name}
              </h1>
            ) : (
              <h2
                id="partner-modal-title"
                className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#082046] leading-snug"
              >
                {partner.name}
              </h2>
            )}

            {partner.location && (
              <p className="text-xs sm:text-sm text-[#64748B] font-medium mt-0.5">
                {partner.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div
        className={`space-y-5 sm:space-y-6 ${
          isStandalone
            ? 'py-2'
            : 'flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 md:p-8 overscroll-contain'
        }`}
      >
        {/* Short summary */}
        {partner.shortDescription && (
          <div>
            <p
              id={isStandalone ? 'partner-detail-summary' : 'partner-modal-summary'}
              className="text-sm sm:text-base text-[#475569] leading-relaxed font-normal"
            >
              {partner.shortDescription}
            </p>
          </div>
        )}

        {/* Comprehensive Overview */}
        {profile?.overview && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-slate-500 mb-2">
              Organisation Profile
            </h3>
            <p className="text-sm sm:text-[15px] text-[#082046] leading-relaxed font-normal">
              {profile.overview}
            </p>
          </div>
        )}

        {/* Services & Conformity Scope */}
        {hasServices && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-slate-500 mb-2.5">
              Service Scope & Technical Capabilities
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#082046]">
              {profile?.services?.map((service, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#032E64] mt-1.5 shrink-0" />
                  <span className="leading-snug font-normal">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Specialties */}
        {hasSpecialties && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-slate-500 mb-2.5">
              Accreditation & Competence Focus
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#082046]">
              {profile?.specialties?.map((spec, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F3D78] mt-1.5 shrink-0" />
                  <span className="leading-snug font-normal">{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Official Website Link */}
        {partner.websiteUrl && (
          <div className="pt-4 border-t border-slate-100">
            <a
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#082046] hover:text-[#1F3D78] transition-colors group"
            >
              <span>Visit official organisation website</span>
              <ArrowUpRight
                size={16}
                weight="bold"
                className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

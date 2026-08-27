import React from 'react';
import { MapPin, Phone, EnvelopeSimple } from '@phosphor-icons/react';
import type { ContactIntroContent, ContactOffice } from '../../cms/types';

export interface ContactOfficesListProps {
  intro: ContactIntroContent;
  offices: ContactOffice[];
}

/**
 * Editorial Contact Information & Offices List
 *
 * Requirements:
 * - Clean editorial styling (NOT wrapped in boxes/cards)
 * - Three office sections separated by thin, low-contrast horizontal dividers
 * - Semantic <address>, <a href="tel:...">, and <a href="mailto:..."> markup
 * - Phosphor icons (MapPin, Phone, EnvelopeSimple)
 */
export const ContactOfficesList: React.FC<ContactOfficesListProps> = ({
  intro,
  offices,
}) => {
  const sortedOffices = [...offices].sort((a, b) => a.order - b.order);

  const formatAddress = (office: ContactOffice) => {
    if (!office.address) return null;
    const parts = [
      office.address.street,
      office.address.postalCode
        ? `${office.address.postalCode} ${office.address.city}`
        : office.address.city,
      office.address.country,
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Editorial Intro */}
      <div className="contact-intro-block">
        <h2
          id="contact-team-heading"
          className="text-2xl sm:text-3xl lg:text-[34px] font-normal leading-[1.15] tracking-tight text-[#082046]"
        >
          {intro.heading}
        </h2>
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-[15px] text-[#475569] leading-relaxed font-normal max-w-xl">
          {intro.description}
        </p>
      </div>

      {/* Offices list with thin dividers */}
      <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col">
        {sortedOffices.map((office, index) => {
          const addressString = formatAddress(office);

          return (
            <div key={office.id} className="contact-office-item">
              <div className="py-6 sm:py-7 first:pt-0">
                {/* Office Title */}
                <h3 className="text-lg sm:text-xl font-medium text-[#082046] tracking-tight">
                  {office.title}
                </h3>

                {office.region && (
                  <p className="text-xs font-medium uppercase tracking-wider text-[#64748B] mt-1 mb-3">
                    {office.region}
                  </p>
                )}

                {/* Contact details */}
                <div className="mt-3 space-y-2.5">
                  {/* Address */}
                  {addressString && (
                    <address className="not-italic text-xs sm:text-sm text-[#475569] flex items-start gap-2.5">
                      <MapPin
                        size={18}
                        weight="regular"
                        className="text-[#032E64] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{addressString}</span>
                    </address>
                  )}

                  {/* Phone */}
                  {office.phone && (
                    <div>
                      <a
                        href={`tel:${office.phone.replace(/[^0-9+]/g, '')}`}
                        className="inline-flex items-center gap-2.5 text-xs sm:text-sm text-[#475569] hover:text-[#032E64] transition-colors focus:outline-none focus:underline"
                        aria-label={`Call ${office.title} at ${office.phone}`}
                      >
                        <Phone
                          size={18}
                          weight="regular"
                          className="text-[#032E64] shrink-0"
                          aria-hidden="true"
                        />
                        <span>{office.phone}</span>
                      </a>
                    </div>
                  )}

                  {/* Email */}
                  {office.email && (
                    <div>
                      <a
                        href={`mailto:${office.email}`}
                        className="inline-flex items-center gap-2.5 text-xs sm:text-sm text-[#475569] hover:text-[#032E64] transition-colors focus:outline-none focus:underline"
                        aria-label={`Email ${office.title} at ${office.email}`}
                      >
                        <EnvelopeSimple
                          size={18}
                          weight="regular"
                          className="text-[#032E64] shrink-0"
                          aria-hidden="true"
                        />
                        <span>{office.email}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Thin horizontal divider (not after the last item) */}
              {index < sortedOffices.length - 1 && (
                <hr className="border-t border-[#CBD5E1]/60 w-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

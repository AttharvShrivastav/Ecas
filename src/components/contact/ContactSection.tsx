import React, { useRef, useLayoutEffect } from 'react';
import { ContactOfficesList } from './ContactOfficesList';
import { ContactEnquiryForm } from './ContactEnquiryForm';
import { gsap, prefersReducedMotion } from '../../animations/gsap';
import type { ContactIntroContent, ContactOffice, ContactFormConfig } from '../../cms/types';

export interface ContactSectionProps {
  intro: ContactIntroContent;
  offices: ContactOffice[];
  form: ContactFormConfig;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  intro,
  offices,
  form,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const section = sectionRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;

    const ctx = gsap.context(() => {
      const introBlock = leftCol?.querySelector('.contact-intro-block');
      const officeItems = leftCol?.querySelectorAll('.contact-office-item');
      const formCard = rightCol?.querySelector('#enquiry-form-card');

      if (introBlock && formCard) {
        // Set initial opacity states
        gsap.set([introBlock, officeItems, formCard].filter(Boolean), {
          opacity: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
          },
        });

        // 1. Contact heading / copy fades in
        tl.to(introBlock, {
          opacity: 1,
          duration: 0.35,
          ease: 'power1.out',
        });

        // 2. Office details fade in
        if (officeItems && officeItems.length > 0) {
          tl.to(
            officeItems,
            {
              opacity: 1,
              duration: 0.3,
              stagger: 0.08,
              ease: 'power1.out',
            },
            '-=0.15'
          );
        }

        // 3. Form fades in
        tl.to(
          formCard,
          {
            opacity: 1,
            duration: 0.35,
            ease: 'power1.out',
          },
          '-=0.2'
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact-main-section"
      aria-labelledby="contact-team-heading"
      className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-12 sm:py-16 lg:py-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-12 xl:gap-16 items-start">
        {/* Left Column (5 cols on lg): Editorial Contact Information & 3 Offices */}
        <div ref={leftColRef} className="lg:col-span-5 w-full">
          <ContactOfficesList intro={intro} offices={offices} />
        </div>

        {/* Right Column (7 cols on lg): Dominant Enquiry Form */}
        <div ref={rightColRef} className="lg:col-span-7 w-full">
          <ContactEnquiryForm config={form} />
        </div>
      </div>
    </section>
  );
};

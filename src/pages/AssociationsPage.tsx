import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { PageHero } from '../components/common/PageHero';
import { ConsultingCTA } from '../components/common/ConsultingCTA';
import { Footer } from '../components/common/Footer';
import { AssociationPartnerCard } from '../components/associations/AssociationPartnerCard';
import { gsap, prefersReducedMotion } from '../animations/gsap';
import { getAssociationsContent } from '../cms/queries';
import { defaultAssociationsPageContent } from '../cms/associationsContent';
import { useCMSPage } from '../cms/useCMS';
import type { AssociationsPageContent } from '../cms/types';

export interface AssociationsPageProps {
  content?: AssociationsPageContent;
}

export const AssociationsPage: React.FC<AssociationsPageProps> = ({
  content: initialContent,
}) => {
  const content = useCMSPage(
    getAssociationsContent,
    defaultAssociationsPageContent,
    initialContent
  );

  const introSectionRef = useRef<HTMLElement | null>(null);
  const introHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const introDescRef = useRef<HTMLParagraphElement | null>(null);

  const gridSectionRef = useRef<HTMLElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = content.seo.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && content.seo.description) {
      metaDescription.setAttribute('content', content.seo.description);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [content.seo]);

  // Restrained GSAP entrance motion (opacity only)
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const introSection = introSectionRef.current;
    const introHeading = introHeadingRef.current;
    const introDesc = introDescRef.current;
    const gridSection = gridSectionRef.current;
    const cards = cardsContainerRef.current?.querySelectorAll('.partner-card');

    const ctx = gsap.context(() => {
      // Intro section animation
      if (introSection && introHeading && introDesc) {
        gsap.set([introHeading, introDesc], { opacity: 0 });
        const tlIntro = gsap.timeline({
          scrollTrigger: {
            trigger: introSection,
            start: 'top 82%',
            once: true,
          },
        });
        tlIntro
          .to(introHeading, { opacity: 1, duration: 0.35, ease: 'power1.out' })
          .to(introDesc, { opacity: 1, duration: 0.3, ease: 'power1.out' }, '-=0.15');
      }

      // Partner cards stagger animation (opacity only)
      if (gridSection && cards && cards.length > 0) {
        gsap.set(cards, { opacity: 0 });
        const tlGrid = gsap.timeline({
          scrollTrigger: {
            trigger: gridSection,
            start: 'top 80%',
            once: true,
          },
        });
        tlGrid.to(cards, {
          opacity: 1,
          duration: 0.28,
          stagger: 0.06,
          ease: 'power1.out',
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main id="main-content" className="min-h-screen bg-[#EEEEEE] flex flex-col">
      {/* Hero Section */}
      <PageHero
        headingLines={content.hero.headingLines}
        description={content.hero.description}
        ariaLabel="Associations Hero"
        visualSrc="/images/associations/associations-hero.webp"
        visualAlt="Global associations and professional network"
        visualPosition="home-globe"
      />

      {/* Intro & Contextual Statement */}
      <section
        ref={introSectionRef}
        id="associations-intro"
        aria-labelledby="associations-intro-heading"
        className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 py-10 sm:py-14"
      >
        <div className="max-w-3xl">
          <h2
            ref={introHeadingRef}
            id="associations-intro-heading"
            className="text-2xl sm:text-3xl lg:text-[36px] font-normal leading-[1.15] tracking-tight text-[#082046]"
          >
            {content.intro.heading}
          </h2>
          <p
            ref={introDescRef}
            className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-[15px] text-[#475569] leading-relaxed font-normal"
          >
            {content.intro.description}
          </p>
        </div>
      </section>

      {/* Partner Organisations Grid Section */}
      <section
        ref={gridSectionRef}
        id="associations-grid-section"
        aria-label="Partner organisations directory"
        className="w-full max-w-[1380px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-10 pb-16 sm:pb-20 lg:pb-24"
      >
        <div
          ref={cardsContainerRef}
          role="list"
          aria-label="List of partner organisations"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {content.partners.map((partner) => (
            <AssociationPartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      </section>

      {/* Shared CTA & Footer */}
      <div className="relative w-full overflow-hidden">
        <ConsultingCTA content={content.consultingCta} id="associations-cta" />
        <Footer withGlobe={true} />
      </div>
    </main>
  );
};

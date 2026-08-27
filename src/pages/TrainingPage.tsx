import React, { useEffect } from 'react';
import { TrainingHero } from '../components/training/TrainingHero';
import { TrainingCoursesSection } from '../components/training/TrainingCoursesSection';
import { TrainingFlexibleLearningSection } from '../components/training/TrainingFlexibleLearningSection';
import { FAQSection } from '../components/common/FAQSection';
import { ConsultingCTA } from '../components/common/ConsultingCTA';
import { Footer } from '../components/common/Footer';
import { getTrainingContent } from '../cms/queries';
import { defaultTrainingPageContent } from '../cms/trainingContent';
import { useCMSPage } from '../cms/useCMS';
import type { TrainingPageContent } from '../cms/types';

export interface TrainingPageProps {
  content?: TrainingPageContent;
}

/**
 * ECASEURO Training Service Page (/services/training)
 *
 * Source of Truth: Approved Figma Desktop References & Requirements
 * 1. Hero: Reusable shared PageHero with no decorative asset (visual area left clean)
 * 2. Courses Section: "Courses based on recognised standards." with frontend search,
 *    highlighting matching rows in pale lavender/blue (#E8EEFC), subduing non-matches,
 *    informational only (no fake buttons/links)
 * 3. Flexible Learning Strip: "Flexible learning, designed around your needs." with
 *    pale gradient background, 3 delivery format columns with white circular icon holders
 * 4. FAQ: Reusable accordion FAQ section with training-specific questions
 * 5. Consulting CTA: Reusable ConsultingCTA banner ("Need Expert Help? / Get free consulting")
 * 6. Footer: Reusable Footer with centered globe composition
 */
export const TrainingPage: React.FC<TrainingPageProps> = ({
  content: initialContent,
}) => {
  const content = useCMSPage(
    getTrainingContent,
    defaultTrainingPageContent,
    initialContent
  );

  useEffect(() => {
    document.title = content.seo.title;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [content.seo.title]);

  return (
    <main id="main-content" className="min-h-screen bg-[#EEEEEE] flex flex-col">
      {/* 1. Shared Hero without decorative asset */}
      <TrainingHero content={content.hero} />

      {/* 2. Courses based on recognised standards with search */}
      <TrainingCoursesSection content={content.courses} />

      {/* 3. Flexible learning information strip */}
      <TrainingFlexibleLearningSection content={content.flexibleLearning} />

      {/* 4. Commonly Asked Questions FAQ */}
      <FAQSection content={content.faq} />

      {/* 5. End-of-Page Coordinated Composition: Final CTA -> Globe -> White Footer Card */}
      <div className="relative w-full overflow-hidden">
        <ConsultingCTA
          content={content.consultingCta}
          id="training-consulting-cta"
        />
        <Footer withGlobe={true} />
      </div>
    </main>
  );
};

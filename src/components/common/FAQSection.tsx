import React from 'react';
import { HomeFAQSection, HomeFAQSectionProps } from '../home/HomeFAQSection';

export type FAQSectionProps = HomeFAQSectionProps;

/**
 * Reusable FAQSection component for Homepage, Service pages, and other pages.
 */
export const FAQSection: React.FC<FAQSectionProps> = (props) => {
  return <HomeFAQSection {...props} />;
};

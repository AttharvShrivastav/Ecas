import React from 'react';
import { ConsultingCTA } from '../common/ConsultingCTA';
import { defaultConsultingCTAContent } from '../../cms/homeContent';
import type { ConsultingCTAContent } from '../../cms/types';

export interface HomeConsultingCTAProps {
  content?: ConsultingCTAContent;
}

/**
 * HomeConsultingCTA Component
 * Thin wrapper / alias around the shared ConsultingCTA component.
 */
export const HomeConsultingCTA: React.FC<HomeConsultingCTAProps> = ({
  content = defaultConsultingCTAContent,
}) => {
  return <ConsultingCTA content={content} id="home-consulting-cta" />;
};


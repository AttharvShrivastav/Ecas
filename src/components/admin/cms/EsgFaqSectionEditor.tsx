import React from 'react';
import { CMSFAQEditor, CMSFAQEditorProps } from './CMSFAQEditor';
import type { HomeFAQContent } from '../../../cms/types';

export interface EsgFaqSectionEditorProps {
  content: HomeFAQContent;
  onChange: (updated: HomeFAQContent) => void;
  errors?: Record<string, string>;
}

export const EsgFaqSectionEditor: React.FC<EsgFaqSectionEditorProps> = ({
  content,
  onChange,
  errors,
}) => {
  return (
    <CMSFAQEditor
      id="section-faq"
      title="Frequently Asked Questions"
      subtitle="Public accordion items addressing common client questions on ESG verification"
      badge="Accordion"
      defaultCategory="ESG Assurance"
      content={content}
      onChange={onChange}
      errors={errors}
      errorPrefix="faq"
    />
  );
};

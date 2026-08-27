import React from 'react';
import { Info } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import type { AssociationsIntroContent } from '../../../cms/types';

export interface AssociationsIntroSectionEditorProps {
  content: AssociationsIntroContent;
  onChange: (updated: AssociationsIntroContent) => void;
  errors?: Record<string, string>;
}

export const AssociationsIntroSectionEditor: React.FC<AssociationsIntroSectionEditorProps> = ({
  content,
  onChange,
  errors = {},
}) => {
  const heading = content?.heading ?? '';
  const description = content?.description ?? '';

  const handleHeadingChange = (val: string) => {
    onChange({ ...content, heading: val });
  };

  const handleDescriptionChange = (val: string) => {
    onChange({ ...content, description: val });
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith('intro.')).length;

  return (
    <CMSSectionCard
      id="section-intro"
      title="Network Introduction"
      subtitle="Section headline and overview explaining the collaborative network structure"
      icon={Info}
      badge="Intro"
      errorCount={errorCount}
    >
      <div className="space-y-5">
        <CMSField
          id="intro-heading"
          label="Intro Section Title"
          value={heading}
          onChange={handleHeadingChange}
          placeholder="Collaborative Technical & Accreditation Network"
          required={true}
          maxLength={150}
          error={errors['intro.heading']}
          description="Main introductory heading above the partner organization grid."
        />

        <CMSTextarea
          id="intro-description"
          label="Network Description"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Operating in accordance with ISO/IEC 17021 and ISO/IEC 17020 conformity assessment principles..."
          required={true}
          maxLength={500}
          rows={3}
          error={errors['intro.description']}
          description="Paragraph describing the accreditation partnerships and conformity standards."
        />
      </div>
    </CMSSectionCard>
  );
};

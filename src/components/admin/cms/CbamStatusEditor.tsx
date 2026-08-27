import React from 'react';
import { Certificate } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSIconSelect } from './CMSIconSelect';
import type { CbamVerifierStatusContent } from '../../../cms/types';

export interface CbamStatusEditorProps {
  id?: string;
  content: CbamVerifierStatusContent;
  onChange: (updated: CbamVerifierStatusContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const CbamStatusEditor: React.FC<CbamStatusEditorProps> = ({
  id = 'section-status',
  content,
  onChange,
  errors = {},
  errorPrefix = 'status',
}) => {
  const heading = content?.heading || '';
  const description = content?.description || '';
  const supportingNote = content?.supportingNote || '';
  const iconKey = content?.iconKey || 'certificate';

  const handleHeadingChange = (value: string) => {
    onChange({
      ...content,
      heading: value,
    });
  };

  const handleDescriptionChange = (value: string) => {
    onChange({
      ...content,
      description: value,
    });
  };

  const handleSupportingNoteChange = (value: string) => {
    onChange({
      ...content,
      supportingNote: value,
    });
  };

  const handleIconChange = (value: string) => {
    onChange({
      ...content,
      iconKey: value,
    });
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Accreditation & Verifier Status Banner"
      subtitle="Authoritative statement describing verifier eligibility under EU Regulation 2023/956 and NAB accreditation"
      icon={Certificate}
      badge="Accreditation"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        <CMSField
          id={`${id}-heading`}
          label="Status Headline"
          value={heading}
          onChange={handleHeadingChange}
          required
          maxLength={100}
          placeholder="e.g. Verifier Status & Accreditation"
          error={errors[`${errorPrefix}.heading`]}
        />

        <CMSTextarea
          id={`${id}-description`}
          label="Primary Accreditation Statement"
          value={description}
          onChange={handleDescriptionChange}
          rows={3}
          maxLength={500}
          required
          placeholder="Explain the legal standing, accreditation body recognition, and ISO 14065 / EU ETS verification qualifications..."
          error={errors[`${errorPrefix}.description`]}
        />

        <CMSTextarea
          id={`${id}-note`}
          label="Supporting Legal / Guidance Note"
          value={supportingNote}
          onChange={handleSupportingNoteChange}
          rows={2}
          maxLength={400}
          placeholder="e.g. For guidance regarding specific scope sectors, transitional periods, or accredited body recognition, contact our emissions team."
          error={errors[`${errorPrefix}.supportingNote`]}
        />

        <CMSIconSelect
          id={`${id}-icon`}
          label="Status Badge Icon"
          value={iconKey}
          onChange={handleIconChange}
          helperText="Icon featured prominently inside the accreditation callout block."
        />
      </div>
    </CMSSectionCard>
  );
};

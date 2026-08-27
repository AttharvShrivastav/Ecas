import React, { useState } from 'react';
import { Compass, Plus, Trash, SealCheck, ListNumbers } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSRepeater } from './CMSRepeater';
import { CMSRouteSelect } from './CMSRouteSelect';
import type {
  ProductCertificationExplorerContent,
  ProductCertificationScheme,
  ProductCertificationTopic,
} from '../../../cms/types';

export interface ProductCertExplorerEditorProps {
  id?: string;
  content: ProductCertificationExplorerContent;
  onChange: (updated: ProductCertificationExplorerContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const ProductCertExplorerEditor: React.FC<ProductCertExplorerEditorProps> = ({
  id = 'section-explorer',
  content,
  onChange,
  errors = {},
  errorPrefix = 'explorer',
}) => {
  const heading = content.heading || '';
  const description = content.description || '';
  const schemes = content.schemes || [];

  const handleHeadingChange = (value: string) => {
    onChange({ ...content, heading: value });
  };

  const handleDescriptionChange = (value: string) => {
    onChange({ ...content, description: value });
  };

  const handleSchemesChange = (updatedSchemes: ProductCertificationScheme[]) => {
    onChange({ ...content, schemes: updatedSchemes });
  };

  const handleAddScheme = (): ProductCertificationScheme => {
    const uniqueId = `scheme-${Date.now()}`;
    return {
      id: uniqueId,
      slug: `new-scheme-${schemes.length + 1}`,
      name: 'New Product Certification Scheme',
      region: 'International',
      badgeLabel: 'Conformity Route',
      summary: 'Comprehensive certification and technical assessment route.',
      topics: [
        {
          id: `topic-${Date.now()}-1`,
          number: '01',
          title: 'Scope & Requirements',
          content: 'Detailed description of regulatory scope and compliance prerequisites.',
        },
      ],
      ctaLabel: 'Request Assessment',
      ctaUrl: '/contact?service=product-certification',
    };
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Certification Route Explorer"
      subtitle="Interactive 2-column selector displaying product certification schemes, regulatory scopes, and step-by-step topics"
      icon={Compass}
      badge="Core Explorer"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Section Intro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CMSField
            id={`${id}-heading`}
            label="Section Heading"
            value={heading}
            onChange={handleHeadingChange}
            required
            maxLength={100}
            error={errors[`${errorPrefix}.heading`]}
          />
          <CMSTextarea
            id={`${id}-description`}
            label="Section Supporting Description"
            value={description}
            onChange={handleDescriptionChange}
            rows={2}
            maxLength={250}
            error={errors[`${errorPrefix}.description`]}
          />
        </div>

        {/* Schemes Repeater */}
        <CMSRepeater<ProductCertificationScheme>
          id={`${id}-schemes-repeater`}
          title="Product Certification Schemes"
          subtitle="Manage active certification schemes, regulatory territories, and topic breakdowns"
          items={schemes}
          onChange={handleSchemesChange}
          onAdd={handleAddScheme}
          addButtonLabel="Add Certification Scheme"
          minItems={1}
          getItemKey={(scheme, idx) => scheme.id || scheme.slug || `scheme-${idx}`}
          renderItemSummary={(scheme, idx) => (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E6F4F8] text-[#00607A] flex items-center justify-center font-bold text-xs shrink-0">
                <SealCheck size={18} weight="fill" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#082046] truncate">
                    {scheme.name || `Scheme #${idx + 1}`}
                  </span>
                  {scheme.region && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#F1F5F9] text-[#475569] rounded">
                      {scheme.region}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748B] truncate">
                  Slug: /{scheme.slug} • {scheme.topics?.length || 0} topic groups
                </p>
              </div>
            </div>
          )}
          renderItemForm={(scheme, index, updateScheme) => {
            const schemeErrorKey = `${errorPrefix}.schemes.${index}`;

            const handleTopicsChange = (updatedTopics: ProductCertificationTopic[]) => {
              updateScheme({
                ...scheme,
                topics: updatedTopics,
              });
            };

            const handleAddTopic = (): ProductCertificationTopic => {
              const nextNum = String((scheme.topics?.length || 0) + 1).padStart(2, '0');
              return {
                id: `topic-${Date.now()}`,
                number: nextNum,
                title: 'New Topic Group',
                content: 'Describe the assessment process, requirements, or documentation guidelines.',
              };
            };

            return (
              <div className="space-y-6 pt-2">
                {/* Scheme Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <CMSField
                    id={`${scheme.id}-name`}
                    label="Scheme Name"
                    value={scheme.name}
                    onChange={(val) => updateScheme({ ...scheme, name: val })}
                    required
                    maxLength={100}
                    error={errors[`${schemeErrorKey}.name`]}
                  />
                  <CMSField
                    id={`${scheme.id}-slug`}
                    label="URL Slug"
                    value={scheme.slug}
                    onChange={(val) =>
                      updateScheme({
                        ...scheme,
                        slug: val.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                      })
                    }
                    required
                    description="Used in deep links (e.g. ce-marking)"
                    error={errors[`${schemeErrorKey}.slug`]}
                  />
                  <CMSField
                    id={`${scheme.id}-region`}
                    label="Region / Territory"
                    value={scheme.region || ''}
                    onChange={(val) => updateScheme({ ...scheme, region: val })}
                    placeholder="e.g. European Union, United Kingdom"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CMSField
                    id={`${scheme.id}-badge`}
                    label="Badge / Tag Label"
                    value={scheme.badgeLabel || ''}
                    onChange={(val) => updateScheme({ ...scheme, badgeLabel: val })}
                    placeholder="e.g. EU Directive Compliance"
                  />
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                      CTA Destination Route
                    </label>
                    <CMSRouteSelect
                      id={`${scheme.id}-cta-url`}
                      value={scheme.ctaUrl || '/contact'}
                      onChange={(val) => updateScheme({ ...scheme, ctaUrl: val })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CMSTextarea
                    id={`${scheme.id}-summary`}
                    label="Scheme Executive Summary"
                    value={scheme.summary}
                    onChange={(val) => updateScheme({ ...scheme, summary: val })}
                    rows={3}
                    required
                    maxLength={350}
                    error={errors[`${schemeErrorKey}.summary`]}
                  />
                  <CMSField
                    id={`${scheme.id}-cta-label`}
                    label="CTA Button Label"
                    value={scheme.ctaLabel || ''}
                    onChange={(val) => updateScheme({ ...scheme, ctaLabel: val })}
                    placeholder="e.g. Request CE Marking Assessment"
                  />
                </div>

                {/* Topics / Sections Repeater within Scheme */}
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#082046] uppercase tracking-wider flex items-center gap-1.5">
                        <ListNumbers size={16} />
                        Topic / Process Groups
                      </h4>
                      <p className="text-xs text-[#64748B]">
                        Step-by-step reading modules displayed on the right active panel.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTopicsChange([...(scheme.topics || []), handleAddTopic()])}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#00607A] bg-white border border-[#CBD5E1] rounded-md hover:bg-[#F1F5F9] transition-colors"
                    >
                      <Plus size={14} weight="bold" />
                      <span>Add Topic Group</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(scheme.topics || []).map((topic, tIdx) => (
                      <div
                        key={topic.id || `topic-${tIdx}`}
                        className="bg-white p-3.5 rounded-lg border border-[#CBD5E1] shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={topic.number || String(tIdx + 1).padStart(2, '0')}
                              onChange={(e) => {
                                const nextTopics = [...(scheme.topics || [])];
                                nextTopics[tIdx] = { ...topic, number: e.target.value };
                                handleTopicsChange(nextTopics);
                              }}
                              placeholder="01"
                              className="w-14 px-2 py-1 text-xs font-bold text-center bg-[#F1F5F9] border border-[#CBD5E1] rounded"
                              title="Topic step number"
                            />
                            <input
                              type="text"
                              value={topic.title}
                              onChange={(e) => {
                                const nextTopics = [...(scheme.topics || [])];
                                nextTopics[tIdx] = { ...topic, title: e.target.value };
                                handleTopicsChange(nextTopics);
                              }}
                              placeholder="Topic group title..."
                              className="flex-1 px-3 py-1 text-xs font-semibold text-[#082046] bg-white border border-[#CBD5E1] rounded focus:outline-none focus:ring-1 focus:ring-[#082046]"
                            />
                          </div>
                          {(scheme.topics?.length || 0) > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const nextTopics = (scheme.topics || []).filter((_, i) => i !== tIdx);
                                handleTopicsChange(nextTopics);
                              }}
                              className="p-1.5 text-[#94A3B8] hover:text-[#B42318] hover:bg-[#FEF3F2] rounded transition-colors"
                              title="Delete topic group"
                            >
                              <Trash size={15} />
                            </button>
                          )}
                        </div>
                        <textarea
                          value={topic.content}
                          onChange={(e) => {
                            const nextTopics = [...(scheme.topics || [])];
                            nextTopics[tIdx] = { ...topic, content: e.target.value };
                            handleTopicsChange(nextTopics);
                          }}
                          rows={3}
                          placeholder="Topic group detailed narrative content..."
                          className="w-full px-3 py-2 text-xs text-[#334155] bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#082046]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
    </CMSSectionCard>
  );
};

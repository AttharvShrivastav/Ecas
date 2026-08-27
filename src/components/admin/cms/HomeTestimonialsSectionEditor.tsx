import React from 'react';
import { Quotes } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSRepeater } from './CMSRepeater';
import { CMSImageField } from './CMSImageField';
import { CMSCharacterCounter } from './CMSCharacterCounter';
import type { HomeTestimonialsContent, TestimonialItem } from '../../../cms/types';

export interface HomeTestimonialsSectionEditorProps {
  id?: string;
  content: HomeTestimonialsContent;
  onChange: (updated: HomeTestimonialsContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const HomeTestimonialsSectionEditor: React.FC<HomeTestimonialsSectionEditorProps> = ({
  id = 'section-home-testimonials',
  content,
  onChange,
  errors = {},
  errorPrefix = 'testimonials',
}) => {
  const heading = content.heading ?? '';
  const description = content.description ?? '';
  const testimonials = content.testimonials || [];

  const handleHeadingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...content,
      heading: e.target.value,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...content,
      description: e.target.value,
    });
  };

  const handleTestimonialsChange = (newTestimonials: TestimonialItem[]) => {
    onChange({
      ...content,
      testimonials: newTestimonials,
    });
  };

  const handleAddTestimonial = (): TestimonialItem => {
    const nextIdx = testimonials.length + 1;
    return {
      id: `testimonial-${Date.now()}`,
      quote: 'ECAS EURO provided exceptional professionalism and valuable insights during our annual audit cycle.',
      personName: `Client Representative ${nextIdx}`,
      organisation: 'Leading Enterprise',
    };
  };

  const headingError = errors[`${errorPrefix}.heading`];
  const descError = errors[`${errorPrefix}.description`];
  const testimonialsError = errors[`${errorPrefix}.items`];
  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Testimonials & Client Feedback Section"
      subtitle="Homepage 4-card client reviews grid with verified quotes and client credentials"
      icon={Quotes}
      badge="Social Proof"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Section Header Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          {/* Heading */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`${id}-heading`}
                className="block text-xs font-bold text-[#082046] uppercase tracking-wider select-none"
              >
                Section Heading <span className="text-[#B42318]">*</span>
              </label>
              <CMSCharacterCounter current={heading.length} max={100} />
            </div>
            <p className="text-xs text-[#64748B] mb-1.5">
              Use a line break to match the editorial layout.
            </p>
            <textarea
              id={`${id}-heading`}
              rows={2}
              value={heading}
              onChange={handleHeadingChange}
              placeholder="See what our clients&#10;say about us"
              className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                headingError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
              } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
            />
            {headingError && (
              <p className="mt-1 text-xs font-semibold text-[#B42318]">{headingError}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`${id}-description`}
                className="block text-xs font-bold text-[#082046] uppercase tracking-wider select-none"
              >
                Supporting Description <span className="text-[#B42318]">*</span>
              </label>
              <CMSCharacterCounter current={description.length} max={250} />
            </div>
            <textarea
              id={`${id}-description`}
              rows={3}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="We focus on clear communication, professional assessments..."
              className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                descError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
              } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
            />
            {descError && (
              <p className="mt-1 text-xs font-semibold text-[#B42318]">{descError}</p>
            )}
          </div>
        </div>

        {/* Testimonials Repeater */}
        <div>
          {testimonialsError && (
            <div className="p-3 mb-3 text-xs font-semibold text-[#B42318] bg-[#FEF3F2] border border-[#FECDCA] rounded-lg">
              {testimonialsError}
            </div>
          )}

          <CMSRepeater<TestimonialItem>
            id="testimonials-repeater"
            title="Client Testimonials"
            subtitle="Fixed 4-card editorial review layout. Configure client quotes, representative names, organizations, and optional portrait avatars."
            items={testimonials}
            onChange={handleTestimonialsChange}
            fixedItems={4}
            getItemKey={(item, idx) => item.id || `test-${idx}`}
            getItemNumber={(_, idx) => String(idx + 1).padStart(2, '0')}
            renderItemSummary={(item) => (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm text-[#082046] truncate">
                  {item.personName || 'Unnamed Client'}
                </span>
                {item.organisation && (
                  <span className="text-xs text-[#64748B] font-medium truncate">
                    ({item.organisation})
                  </span>
                )}
                <span className="text-xs text-[#94A3B8] italic truncate max-w-[240px]">
                  &ldquo;{item.quote}&rdquo;
                </span>
              </div>
            )}
            renderItemForm={(item, idx, updateItem) => {
              const quoteError = errors[`${errorPrefix}.testimonials.${idx}.quote`];
              const nameError = errors[`${errorPrefix}.testimonials.${idx}.personName`];

              return (
                <div className="space-y-4">
                  {/* Quote Content */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                        Client Quote / Feedback <span className="text-[#B42318]">*</span>
                      </label>
                      <CMSCharacterCounter current={item.quote.length} max={300} />
                    </div>
                    <textarea
                      rows={3}
                      value={item.quote}
                      onChange={(e) => updateItem({ ...item, quote: e.target.value })}
                      placeholder="Enter verified quote text..."
                      className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                        quoteError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
                      } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
                    />
                    {quoteError && (
                      <p className="mt-1 text-xs font-semibold text-[#B42318]">{quoteError}</p>
                    )}
                  </div>

                  {/* Person Name & Organisation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                          Representative Name <span className="text-[#B42318]">*</span>
                        </label>
                        <CMSCharacterCounter current={item.personName.length} max={60} />
                      </div>
                      <input
                        type="text"
                        value={item.personName}
                        onChange={(e) => updateItem({ ...item, personName: e.target.value })}
                        placeholder="e.g. Mr Rahul Mehta"
                        className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                          nameError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
                        } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
                      />
                      {nameError && (
                        <p className="mt-1 text-xs font-semibold text-[#B42318]">{nameError}</p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                          Organisation / Company
                        </label>
                        <CMSCharacterCounter current={(item.organisation || '').length} max={60} />
                      </div>
                      <input
                        type="text"
                        value={item.organisation || ''}
                        onChange={(e) => updateItem({ ...item, organisation: e.target.value })}
                        placeholder="e.g. ADPICO"
                        className="w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border border-[#CBD5E1] focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]"
                      />
                    </div>
                  </div>

                  {/* Optional Avatar Image */}
                  <div className="pt-2 border-t border-[#E2E8F0]">
                    <CMSImageField
                      label="Client Portrait / Avatar (Optional)"
                      value={item.image || { src: '', alt: item.personName }}
                      onChange={(img) => updateItem({ ...item, image: img })}
                      defaultSrcPlaceholder="/images/avatars/client.webp"
                      defaultAltPlaceholder={`${item.personName} Portrait`}
                    />
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </CMSSectionCard>
  );
};

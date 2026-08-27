import React from 'react';
import { SquaresFour } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSRepeater } from './CMSRepeater';
import { CMSRouteSelect } from './CMSRouteSelect';
import { CMSCharacterCounter } from './CMSCharacterCounter';
import type {
  HomeServicesSectionContent,
  FeaturedServiceItem,
  CTA,
} from '../../../cms/types';

export interface HomeServicesSectionEditorProps {
  id?: string;
  content: HomeServicesSectionContent;
  onChange: (updated: HomeServicesSectionContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const HomeServicesSectionEditor: React.FC<HomeServicesSectionEditorProps> = ({
  id = 'section-home-services',
  content,
  onChange,
  errors = {},
  errorPrefix = 'services',
}) => {
  const heading = content.heading ?? '';
  const description = content.description ?? '';
  const cta: CTA = content.cta || {
    label: 'EXPLORE ALL SERVICES',
    href: '/services',
    variant: 'primary',
  };
  const services = content.services || [];

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

  const handleCtaLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...content,
      cta: {
        ...cta,
        label: e.target.value,
      },
    });
  };

  const handleCtaHrefChange = (newHref: string) => {
    onChange({
      ...content,
      cta: {
        ...cta,
        href: newHref,
      },
    });
  };

  const handleCtaVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...content,
      cta: {
        ...cta,
        variant: e.target.value as 'primary' | 'secondary',
      },
    });
  };

  const handleServicesListChange = (newServices: FeaturedServiceItem[]) => {
    onChange({
      ...content,
      services: newServices,
    });
  };

  const handleAddService = (): FeaturedServiceItem => {
    const nextIndex = services.length + 1;
    return {
      id: `service-custom-${Date.now()}`,
      title: `Service #${nextIndex}`,
      description: 'Comprehensive certification and technical conformity support for global standards.',
      href: '/services',
    };
  };

  const sectionHeadingError = errors[`${errorPrefix}.heading`];
  const sectionDescError = errors[`${errorPrefix}.description`];
  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Featured Services Section"
      subtitle="Homepage highlighted services cards and section call-to-action button"
      icon={SquaresFour}
      badge="Core Services"
      errorCount={errorCount}
    >
      <div className="space-y-8">
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
              <CMSCharacterCounter current={heading.length} max={120} />
            </div>
            <p className="text-xs text-[#64748B] mb-1.5">
              Use a line break to match the editorial desktop styling.
            </p>
            <textarea
              id={`${id}-heading`}
              rows={3}
              value={heading}
              onChange={handleHeadingChange}
              placeholder="Certification and&#10;compliance support&#10;for your organisation"
              className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                sectionHeadingError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
              } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
            />
            {sectionHeadingError && (
              <p className="mt-1 text-xs font-semibold text-[#B42318]">{sectionHeadingError}</p>
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
              placeholder="ECAS EURO provides certification, inspection and training services..."
              className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                sectionDescError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
              } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
            />
            {sectionDescError && (
              <p className="mt-1 text-xs font-semibold text-[#B42318]">{sectionDescError}</p>
            )}
          </div>

          {/* Inset CTA Configuration */}
          <div className="md:col-span-2 pt-4 border-t border-[#E2E8F0] space-y-4">
            <h4 className="text-xs font-bold text-[#082046] uppercase tracking-wider">
              Section Header Action Button
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider mb-1.5">
                  Button Label
                </label>
                <input
                  type="text"
                  value={cta.label}
                  onChange={handleCtaLabelChange}
                  placeholder="EXPLORE ALL SERVICES"
                  className="w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border border-[#CBD5E1] focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]"
                />
              </div>

              <div>
                <CMSRouteSelect
                  label="Button Destination"
                  value={cta.href}
                  onChange={handleCtaHrefChange}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider mb-1.5">
                  Button Variant
                </label>
                <select
                  value={cta.variant || 'primary'}
                  onChange={handleCtaVariantChange}
                  className="w-full h-10 px-3 py-2 text-sm rounded bg-white text-[#082046] border border-[#CBD5E1] focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]"
                >
                  <option value="primary">Primary (Navy Gradient)</option>
                  <option value="secondary">Secondary (Outline)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Service Cards Repeater */}
        <div>
          <CMSRepeater<FeaturedServiceItem>
            id="services-items-repeater"
            title="Featured Service Cards"
            subtitle="Configure the primary service cards featured on the homepage."
            items={services}
            onChange={handleServicesListChange}
            onAdd={handleAddService}
            addButtonLabel="Add Service Card"
            minItems={1}
            maxItems={6}
            getItemKey={(item) => item.id}
            getItemNumber={(_, idx) => String(idx + 1).padStart(2, '0')}
            renderItemSummary={(item) => (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm text-[#082046] truncate">{item.title}</span>
                <span className="text-xs text-[#64748B] truncate max-w-[200px]">{item.href}</span>
              </div>
            )}
            renderItemForm={(item, idx, updateItem) => {
              const titleError = errors[`${errorPrefix}.services.${idx}.title`];
              const descError = errors[`${errorPrefix}.services.${idx}.description`];

              return (
                <div className="space-y-4">
                  {/* Card Title & Link */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                          Service Title <span className="text-[#B42318]">*</span>
                        </label>
                        <CMSCharacterCounter current={item.title.length} max={80} />
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem({ ...item, title: e.target.value })}
                        placeholder="e.g. Management System Certification"
                        className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                          titleError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
                        } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
                      />
                      {titleError && (
                        <p className="mt-1 text-xs font-semibold text-[#B42318]">{titleError}</p>
                      )}
                    </div>

                    <div>
                      <CMSRouteSelect
                        label="Service Route Link"
                        value={item.href}
                        onChange={(newHref) => updateItem({ ...item, href: newHref })}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#082046] uppercase tracking-wider">
                        Service Summary Description <span className="text-[#B42318]">*</span>
                      </label>
                      <CMSCharacterCounter current={item.description.length} max={200} />
                    </div>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => updateItem({ ...item, description: e.target.value })}
                      placeholder="Summary of certification scope and services..."
                      className={`w-full px-3 py-2 text-sm rounded bg-white text-[#082046] border ${
                        descError ? 'border-[#B42318] ring-1 ring-[#B42318]' : 'border-[#CBD5E1]'
                      } focus:outline-none focus:border-[#00607A] focus:ring-1 focus:ring-[#00607A]`}
                    />
                    {descError && (
                      <p className="mt-1 text-xs font-semibold text-[#B42318]">{descError}</p>
                    )}
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

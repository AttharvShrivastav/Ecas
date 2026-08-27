import React from 'react';
import { GlobeHemisphereWest } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSTextarea } from './CMSTextarea';
import { CMSRepeater } from './CMSRepeater';
import type {
  InternationalMarketsSectionContent,
  InternationalMarketSummary,
} from '../../../cms/types';

export interface ProductCertMarketsEditorProps {
  id?: string;
  content: InternationalMarketsSectionContent;
  onChange: (updated: InternationalMarketsSectionContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const ProductCertMarketsEditor: React.FC<ProductCertMarketsEditorProps> = ({
  id = 'section-international-markets',
  content,
  onChange,
  errors = {},
  errorPrefix = 'internationalMarkets',
}) => {
  const heading = content.heading || '';
  const items = content.items || [];

  const handleHeadingChange = (value: string) => {
    onChange({ ...content, heading: value });
  };

  const handleItemsChange = (updatedItems: InternationalMarketSummary[]) => {
    onChange({ ...content, items: updatedItems });
  };

  const handleAddItem = (): InternationalMarketSummary => {
    return {
      id: `market-${Date.now()}`,
      schemeSlug: 'ce-marking',
      name: 'Market Certification',
      marketLabel: 'Global Territory',
      summary: 'Accredited product assessment and market conformity route.',
      badgeLabel: 'Market Entry',
      iconKey: 'globe',
    };
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="International Market Summaries"
      subtitle="5-card grid summarizing key international market access certifications (EQM, ECAS, G Mark, SASO, UKCA) linking back into the explorer"
      icon={GlobeHemisphereWest}
      badge="Global Routes"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Section Heading */}
        <CMSField
          id={`${id}-heading`}
          label="Section Heading"
          value={heading}
          onChange={handleHeadingChange}
          required
          maxLength={100}
          error={errors[`${errorPrefix}.heading`]}
        />

        {/* Markets Repeater */}
        <CMSRepeater<InternationalMarketSummary>
          id={`${id}-items-repeater`}
          title="Market Summaries"
          subtitle="Configure market summary cards and target explorer tab slugs"
          items={items}
          onChange={handleItemsChange}
          onAdd={handleAddItem}
          addButtonLabel="Add Market Summary"
          minItems={1}
          getItemKey={(market, idx) => market.id || `market-${idx}`}
          renderItemSummary={(market) => (
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-[#082046]">{market.name}</span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#E6F4F8] text-[#00607A] rounded">
                {market.marketLabel}
              </span>
              <span className="text-[11px] text-[#64748B]">→ /{market.schemeSlug}</span>
            </div>
          )}
          renderItemForm={(market, index, updateMarket) => (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <CMSField
                  id={`market-${index}-name`}
                  label="Scheme / Program Name"
                  value={market.name}
                  onChange={(val) => updateMarket({ ...market, name: val })}
                  required
                  maxLength={60}
                />
                <CMSField
                  id={`market-${index}-label`}
                  label="Territory / Market Label"
                  value={market.marketLabel}
                  onChange={(val) => updateMarket({ ...market, marketLabel: val })}
                  required
                  maxLength={60}
                  placeholder="e.g. United Arab Emirates"
                />
                <CMSField
                  id={`market-${index}-slug`}
                  label="Target Scheme Slug"
                  value={market.schemeSlug}
                  onChange={(val) => updateMarket({ ...market, schemeSlug: val })}
                  required
                  description="Slug of tab in Route Explorer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CMSField
                  id={`market-${index}-badge`}
                  label="Badge Label"
                  value={market.badgeLabel || ''}
                  onChange={(val) => updateMarket({ ...market, badgeLabel: val })}
                  placeholder="e.g. National Quality Mark"
                />
                <CMSTextarea
                  id={`market-${index}-summary`}
                  label="Summary Description"
                  value={market.summary}
                  onChange={(val) => updateMarket({ ...market, summary: val })}
                  rows={2}
                  required
                  maxLength={200}
                />
              </div>
            </div>
          )}
        />
      </div>
    </CMSSectionCard>
  );
};

import React from 'react';
import {
  TreeStructure,
  Plus,
  Trash,
  Leaf,
  Globe,
  Users,
  Handshake,
  Scales,
  ShieldCheck,
} from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSRepeater } from './CMSRepeater';
import { CMSCharacterCounter } from './CMSCharacterCounter';
import type { ESGSectionContent, ESGPillar, ESGPillarIconKey } from '../../../cms/types';

export interface EsgPillarsSectionEditorProps {
  content: ESGSectionContent;
  onChange: (updated: ESGSectionContent) => void;
  errors?: Record<string, string>;
}

const AVAILABLE_ICONS: {
  key: ESGPillarIconKey;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; weight?: any }>;
}[] = [
  { key: 'leaf', label: 'Leaf', icon: Leaf },
  { key: 'globe', label: 'Globe', icon: Globe },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'handshake', label: 'Handshake', icon: Handshake },
  { key: 'scales', label: 'Scales', icon: Scales },
  { key: 'shield', label: 'Shield', icon: ShieldCheck },
];

export const EsgPillarsSectionEditor: React.FC<EsgPillarsSectionEditorProps> = ({
  content,
  onChange,
  errors = {},
}) => {
  const heading = content.heading ?? '';
  const description = content.description ?? '';
  const pillars = content.pillars ?? [];

  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handlePillarsChange = (newPillars: ESGPillar[]) => {
    const reordered = newPillars.map((p, idx) => ({
      ...p,
      order: idx + 1,
      number: p.number?.trim() ? p.number : String(idx + 1).padStart(2, '0'),
    }));
    onChange({
      ...content,
      pillars: reordered,
    });
  };

  const handleAddPillar = (): ESGPillar => {
    const nextNumber = String(pillars.length + 1).padStart(2, '0');
    return {
      id: `pillar-${Date.now()}`,
      number: nextNumber,
      title: 'NEW PILLAR',
      iconKey: 'leaf',
      order: pillars.length + 1,
      topics: ['Topic 1', 'Topic 2', 'Topic 3'],
    };
  };

  const handleAddTopic = (pillar: ESGPillar, updatePillar: (updated: ESGPillar) => void) => {
    const updatedTopics = [...(pillar.topics || []), ''];
    updatePillar({ ...pillar, topics: updatedTopics });
  };

  const handleUpdateTopic = (
    pillar: ESGPillar,
    topicIndex: number,
    value: string,
    updatePillar: (updated: ESGPillar) => void
  ) => {
    const updatedTopics = [...(pillar.topics || [])];
    updatedTopics[topicIndex] = value;
    updatePillar({ ...pillar, topics: updatedTopics });
  };

  const handleRemoveTopic = (
    pillar: ESGPillar,
    topicIndex: number,
    updatePillar: (updated: ESGPillar) => void
  ) => {
    const updatedTopics = (pillar.topics || []).filter((_, i) => i !== topicIndex);
    updatePillar({ ...pillar, topics: updatedTopics });
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith('esgSection.')).length;

  return (
    <CMSSectionCard
      id="section-pillars"
      title="ESG Verification Pillars"
      subtitle="Section overview narrative and the 3 pillar verification cards"
      icon={TreeStructure}
      badge="Core Content"
      errorCount={errorCount}
    >
      <div className="space-y-6">
        {/* Section Heading & Description */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="pillars-heading"
                className="block text-xs font-bold text-[#082046] uppercase tracking-wider"
              >
                Section Heading <span className="text-[#B42318]">*</span>
              </label>
              <CMSCharacterCounter current={heading.length} max={120} />
            </div>
            <input
              id="pillars-heading"
              type="text"
              value={heading}
              maxLength={120}
              onChange={handleHeadingChange}
              placeholder="e.g. Simple Steps to Access Trusted Care Anytime"
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors['esgSection.heading']
                  ? 'border-[#FDA29B] focus:ring-[#FDA29B]/30'
                  : 'border-[#CBD5E1] focus:ring-[#082046]/20 focus:border-[#082046]'
              }`}
            />
            {errors['esgSection.heading'] && (
              <p className="text-xs text-[#B42318] mt-1 font-medium">
                {errors['esgSection.heading']}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="pillars-desc"
                className="block text-xs font-bold text-[#082046] uppercase tracking-wider"
              >
                Section Narrative Description <span className="text-[#B42318]">*</span>
              </label>
              <CMSCharacterCounter current={description.length} max={1000} />
            </div>
            <textarea
              id="pillars-desc"
              rows={4}
              value={description}
              maxLength={1000}
              onChange={handleDescriptionChange}
              placeholder="Enter comprehensive paragraph explaining ESG market demands and ECAS EURO verification..."
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-y ${
                errors['esgSection.description']
                  ? 'border-[#FDA29B] focus:ring-[#FDA29B]/30'
                  : 'border-[#CBD5E1] focus:ring-[#082046]/20 focus:border-[#082046]'
              }`}
            />
            {errors['esgSection.description'] && (
              <p className="text-xs text-[#B42318] mt-1 font-medium">
                {errors['esgSection.description']}
              </p>
            )}
          </div>
        </div>

        {/* Pillars Repeater (Fixed 3 Pillars) */}
        <CMSRepeater<ESGPillar>
          id="section-pillars-list"
          title="Pillar Cards"
          subtitle="Fixed 3-pillar structure (Environmental, Social, Governance). Each pillar card appears in the grid layout on the public ESG page."
          items={pillars}
          onChange={handlePillarsChange}
          fixedItems={3}
          error={errors['esgSection.pillars']}
          getItemKey={(pillar, idx) => pillar.id || `pillar-${idx}`}
          getItemNumber={(pillar, idx) => pillar.number || String(idx + 1).padStart(2, '0')}
          renderItemSummary={(pillar) => {
            const IconComponent =
              AVAILABLE_ICONS.find((i) => i.key === pillar.iconKey)?.icon || Leaf;
            return (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-md bg-[#E6F4F8] text-[#00607A] flex items-center justify-center shrink-0">
                  <IconComponent size={15} weight="bold" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#082046] tracking-tight truncate">
                    {pillar.title ? pillar.title : <span className="text-slate-400 italic">(Untitled Pillar)</span>}
                  </h4>
                  <span className="text-[11px] text-[#64748B]">
                    {(pillar.topics || []).filter(Boolean).length} topics
                  </span>
                </div>
              </div>
            );
          }}
          renderItemForm={(pillar, _idx, updatePillar) => (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Pillar Number */}
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-[#082046] uppercase mb-1">
                    Number
                  </label>
                  <input
                    type="text"
                    value={pillar.number ?? ''}
                    maxLength={10}
                    onChange={(e) => updatePillar({ ...pillar, number: e.target.value })}
                    placeholder="e.g. 01"
                    className="w-full px-3 py-1.5 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082046]/20 font-bold"
                  />
                </div>

                {/* Pillar Title */}
                <div className="sm:col-span-9">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-[#082046] uppercase">
                      Pillar Title <span className="text-[#B42318]">*</span>
                    </label>
                    <CMSCharacterCounter current={(pillar.title ?? '').length} max={80} />
                  </div>
                  <input
                    type="text"
                    value={pillar.title ?? ''}
                    maxLength={80}
                    onChange={(e) => updatePillar({ ...pillar, title: e.target.value })}
                    placeholder="e.g. ENVIRONMENTAL"
                    className="w-full px-3 py-1.5 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082046]/20 font-bold uppercase"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#082046] uppercase mb-1.5">
                  Icon Symbol
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVAILABLE_ICONS.map((iconOpt) => {
                    const IconOptComponent = iconOpt.icon;
                    const isSelected = pillar.iconKey === iconOpt.key;
                    return (
                      <button
                        key={iconOpt.key}
                        type="button"
                        onClick={() =>
                          updatePillar({
                            ...pillar,
                            iconKey: iconOpt.key,
                          })
                        }
                        className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#082046] bg-[#082046] text-white shadow-2xs'
                            : 'border-[#E2E8F0] bg-white text-[#475467] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <IconOptComponent
                          size={20}
                          weight={isSelected ? 'fill' : 'bold'}
                          className="mb-1"
                        />
                        <span className="text-[11px]">{iconOpt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topics Array Editor */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#082046] uppercase">
                      Verification Topics ({pillar.topics?.length || 0})
                    </label>
                    <p className="text-[11px] text-[#64748B]">
                      Items displayed within this pillar card.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddTopic(pillar, updatePillar)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#082046] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-md transition-colors border border-[#CBD5E1] cursor-pointer"
                  >
                    <Plus size={12} weight="bold" />
                    <span>Add Topic</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(pillar.topics || []).map((topic, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2">
                      <span className="w-5 text-center text-xs font-bold text-[#94A3B8]">
                        •
                      </span>
                      <input
                        type="text"
                        value={topic}
                        maxLength={100}
                        onChange={(e) =>
                          handleUpdateTopic(pillar, tIdx, e.target.value, updatePillar)
                        }
                        placeholder="e.g. Climate Change or GHG Emissions"
                        className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#082046]/20"
                      />
                      {(pillar.topics || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(pillar, tIdx, updatePillar)}
                          className="p-1.5 text-[#94A3B8] hover:text-[#B42318] hover:bg-[#FEF3F2] rounded-md transition-colors cursor-pointer"
                          title="Remove Topic"
                          aria-label="Remove topic"
                        >
                          <Trash size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </CMSSectionCard>
  );
};

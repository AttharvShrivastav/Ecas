import React from 'react';
import { SquaresFour } from '@phosphor-icons/react';
import { CMSSectionCard } from './CMSSectionCard';
import { CMSField } from './CMSField';
import { CMSRepeater } from './CMSRepeater';
import { CMSIconSelect } from './CMSIconSelect';
import type { ProductCategoriesSectionContent, ProductCategory } from '../../../cms/types';

export interface ProductCertCategoriesEditorProps {
  id?: string;
  content: ProductCategoriesSectionContent;
  onChange: (updated: ProductCategoriesSectionContent) => void;
  errors?: Record<string, string>;
  errorPrefix?: string;
}

export const ProductCertCategoriesEditor: React.FC<ProductCertCategoriesEditorProps> = ({
  id = 'section-categories',
  content,
  onChange,
  errors = {},
  errorPrefix = 'categories',
}) => {
  const heading = content.heading || '';
  const items = content.items || [];

  const handleHeadingChange = (value: string) => {
    onChange({ ...content, heading: value });
  };

  const handleItemsChange = (updatedItems: ProductCategory[]) => {
    onChange({ ...content, items: updatedItems });
  };

  const handleAddItem = (): ProductCategory => {
    return {
      id: `category-${Date.now()}`,
      name: 'New Industrial Category',
      iconKey: 'gear',
    };
  };

  const errorCount = Object.keys(errors).filter((k) => k.startsWith(`${errorPrefix}.`)).length;

  return (
    <CMSSectionCard
      id={id}
      title="Product Categories"
      subtitle="3x3 informative grid of equipment and manufactured product categories subject to CE marking"
      icon={SquaresFour}
      badge="3x3 Grid"
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

        {/* Categories Repeater */}
        <CMSRepeater<ProductCategory>
          id={`${id}-items-repeater`}
          title="Product Categories"
          subtitle="Define product category cards and semantic Phosphor icons"
          items={items}
          onChange={handleItemsChange}
          onAdd={handleAddItem}
          addButtonLabel="Add Product Category"
          minItems={1}
          getItemKey={(cat, idx) => cat.id || `category-${idx}`}
          renderItemSummary={(cat) => (
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-[#082046]">{cat.name || 'Untitled Category'}</span>
              <span className="text-[11px] text-[#64748B]">({cat.iconKey})</span>
            </div>
          )}
          renderItemForm={(cat, index, updateCat) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <CMSField
                id={`cat-${index}-name`}
                label="Category Name"
                value={cat.name}
                onChange={(val) => updateCat({ ...cat, name: val })}
                required
                maxLength={80}
              />
              <CMSIconSelect
                id={`cat-${index}-icon`}
                label="Category Icon"
                value={cat.iconKey}
                onChange={(val) => updateCat({ ...cat, iconKey: val })}
              />
            </div>
          )}
        />
      </div>
    </CMSSectionCard>
  );
};

import React, { useState } from 'react';
import { Plus, Trash, ArrowUp, ArrowDown, CaretDown, CaretUp, Lock } from '@phosphor-icons/react';

export interface CMSRepeaterProps<T> {
  id?: string;
  title: string;
  subtitle?: string;
  items: T[];
  onChange: (items: T[]) => void;
  onAdd?: () => T;
  addButtonLabel?: string;
  minItems?: number;
  maxItems?: number;
  fixedItems?: number;
  allowReorder?: boolean;
  error?: string;
  defaultExpandedIndex?: number | null;
  getItemKey?: (item: T, index: number) => string;
  getItemNumber?: (item: T, index: number) => string;
  renderItemSummary: (item: T, index: number) => React.ReactNode;
  renderItemForm: (
    item: T,
    index: number,
    updateItem: (updated: T) => void
  ) => React.ReactNode;
  className?: string;
}

export function CMSRepeater<T>({
  id,
  title,
  subtitle,
  items = [],
  onChange,
  onAdd,
  addButtonLabel = 'Add Item',
  minItems = 0,
  maxItems,
  fixedItems,
  allowReorder = true,
  error,
  defaultExpandedIndex = 0,
  getItemKey,
  getItemNumber,
  renderItemSummary,
  renderItemForm,
  className = '',
}: CMSRepeaterProps<T>) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(defaultExpandedIndex);

  const isFixed = typeof fixedItems === 'number' && fixedItems > 0;
  const effectiveMinItems = isFixed ? fixedItems : minItems;
  const effectiveMaxItems = isFixed ? fixedItems : maxItems;
  const canAdd = !isFixed && Boolean(onAdd) && (!effectiveMaxItems || items.length < effectiveMaxItems);
  const canDelete = !isFixed && items.length > effectiveMinItems;

  const handleAddItem = () => {
    if (!canAdd || !onAdd) return;
    const newItem = onAdd();
    const nextItems = [...items, newItem];
    onChange(nextItems);
    setExpandedIndex(nextItems.length - 1);
  };

  const handleUpdateItem = (index: number, updatedItem: T) => {
    const nextItems = [...items];
    nextItems[index] = updatedItem;
    onChange(nextItems);
  };

  const handleRemoveItem = (index: number) => {
    if (!canDelete) return;
    const nextItems = items.filter((_, i) => i !== index);
    onChange(nextItems);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (!allowReorder) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const nextItems = [...items];
    const [moved] = nextItems.splice(index, 1);
    nextItems.splice(targetIndex, 0, moved);

    onChange(nextItems);
    setExpandedIndex(targetIndex);
  };

  return (
    <div id={id} className={`pt-4 border-t border-[#F1F5F9] space-y-4 ${className}`}>
      {/* Header with Title and Optional Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-[#082046] uppercase tracking-wider">
              {title} ({items.length})
            </h3>
            {isFixed && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E6F4F8] text-[#00607A] border border-[#00607A]/20">
                <Lock size={10} weight="bold" /> Fixed ({fixedItems} items)
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>
          )}
        </div>

        {canAdd && (
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#082046] hover:bg-[#0F1B4A] rounded-lg transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
          >
            <Plus size={14} weight="bold" />
            <span>{addButtonLabel}</span>
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-[#B42318] font-medium">{error}</p>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-[#E2E8F0] rounded-xl text-slate-400 text-xs">
            {isFixed
              ? `This collection requires exactly ${fixedItems} items.`
              : `No items added yet. Click "${addButtonLabel}" above to create the first item.`}
          </div>
        ) : (
          items.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            const itemKey = getItemKey ? getItemKey(item, idx) : `item-${idx}`;
            const itemNum = getItemNumber
              ? getItemNumber(item, idx)
              : String(idx + 1).padStart(2, '0');

            return (
              <div
                key={itemKey}
                className={`border rounded-xl transition-all duration-200 ${
                  isExpanded
                    ? 'border-[#082046] bg-[#F8FAFC]/40 shadow-2xs'
                    : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                }`}
              >
                {/* Item Row Bar (Clickable) */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setExpandedIndex(isExpanded ? null : idx);
                    }
                  }}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] text-[#082046] flex items-center justify-center font-bold text-xs shrink-0">
                      {itemNum}
                    </div>
                    <div className="min-w-0 flex-1">
                      {renderItemSummary(item, idx)}
                    </div>
                  </div>

                  {/* Actions & Chevron */}
                  <div
                    className="flex items-center gap-1 shrink-0 ml-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {allowReorder && (
                      <>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveItem(idx, 'up')}
                          className={`p-1.5 rounded-md transition-colors ${
                            idx === 0
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-[#64748B] hover:text-[#082046] hover:bg-[#F1F5F9]'
                          }`}
                          title="Move Up"
                          aria-label="Move item up"
                        >
                          <ArrowUp size={15} weight="bold" />
                        </button>

                        <button
                          type="button"
                          disabled={idx === items.length - 1}
                          onClick={() => handleMoveItem(idx, 'down')}
                          className={`p-1.5 rounded-md transition-colors ${
                            idx === items.length - 1
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-[#64748B] hover:text-[#082046] hover:bg-[#F1F5F9]'
                          }`}
                          title="Move Down"
                          aria-label="Move item down"
                        >
                          <ArrowDown size={15} weight="bold" />
                        </button>
                      </>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#B42318] hover:bg-[#FEF3F2] rounded-md transition-colors"
                        title="Delete Item"
                        aria-label="Delete item"
                      >
                        <Trash size={15} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="p-1.5 text-[#64748B] hover:text-[#082046] hover:bg-[#F1F5F9] rounded-md transition-colors ml-1"
                      aria-label={isExpanded ? 'Collapse item' : 'Expand item'}
                    >
                      {isExpanded ? (
                        <CaretUp size={15} weight="bold" />
                      ) : (
                        <CaretDown size={15} weight="bold" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Form Container */}
                {isExpanded && (
                  <div className="p-4 pt-0 sm:p-5 sm:pt-0 border-t border-[#F1F5F9] mt-2">
                    <div className="pt-3">
                      {renderItemForm(item, idx, (updated) =>
                        handleUpdateItem(idx, updated)
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

import React from 'react';

export interface CMSCharacterCounterProps {
  current: number;
  max: number;
  optimalMin?: number;
  optimalMax?: number;
  className?: string;
}

export const CMSCharacterCounter: React.FC<CMSCharacterCounterProps> = ({
  current,
  max,
  optimalMin,
  optimalMax,
  className = '',
}) => {
  const isOverMax = current > max;
  const isOptimal =
    optimalMin !== undefined &&
    optimalMax !== undefined &&
    current >= optimalMin &&
    current <= optimalMax;
  const isNearLimit = !isOptimal && !isOverMax && max > 0 && current >= max * 0.88;

  let colorClass = 'text-[#64748B]';
  if (isOverMax) {
    colorClass = 'text-[#B42318] font-bold';
  } else if (isOptimal) {
    colorClass = 'text-[#027A48] font-semibold';
  } else if (isNearLimit) {
    colorClass = 'text-[#B54708] font-medium';
  }

  const optimalText =
    optimalMin !== undefined && optimalMax !== undefined
      ? ` (Optimal: ${optimalMin}-${optimalMax})`
      : '';

  return (
    <span
      className={`text-xs tabular-nums select-none ${colorClass} ${className}`.trim()}
      aria-label={`${current} of ${max} characters used`}
    >
      {current} / {max} chars{optimalText}
    </span>
  );
};

/**
 * Content Adapters
 *
 * Normalizes and formats CMS raw documents into component-ready presentation props.
 */

import type { PageHeroContent, CTA, ImageAsset } from '../types';

export function normalizeImage(rawImage: unknown): ImageAsset | undefined {
  if (!rawImage || typeof rawImage !== 'object') return undefined;
  const img = rawImage as Record<string, unknown>;
  if (typeof img.src === 'string' || typeof img.url === 'string') {
    return {
      src: (img.src || img.url) as string,
      alt: (img.alt as string) || '',
      width: typeof img.width === 'number' ? img.width : undefined,
      height: typeof img.height === 'number' ? img.height : undefined,
      caption: typeof img.caption === 'string' ? img.caption : undefined,
    };
  }
  return undefined;
}

export function normalizeCTA(rawCta: unknown): CTA | undefined {
  if (!rawCta || typeof rawCta !== 'object') return undefined;
  const cta = rawCta as Record<string, unknown>;
  if (typeof cta.label === 'string' && typeof cta.href === 'string') {
    return {
      label: cta.label,
      href: cta.href,
      variant: (cta.variant as CTA['variant']) || 'primary',
      isExternal: Boolean(cta.isExternal),
      target: (cta.target as string) || undefined,
    };
  }
  return undefined;
}

export function normalizePageHero(raw: unknown): PageHeroContent | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  return {
    eyebrow: typeof r.eyebrow === 'string' ? r.eyebrow : undefined,
    title: typeof r.title === 'string' ? r.title : '',
    description: typeof r.description === 'string' ? r.description : undefined,
    primaryCta: normalizeCTA(r.primaryCta),
    secondaryCta: normalizeCTA(r.secondaryCta),
    backgroundImage: normalizeImage(r.backgroundImage),
  };
}

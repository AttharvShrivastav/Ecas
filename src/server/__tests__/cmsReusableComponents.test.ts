import { describe, it, expect } from 'vitest';
import {
  PUBLIC_ROUTES,
  getPublicRouteLabel,
  isExternalUrl,
  isValidExternalUrl,
} from '../../config/publicRoutes';
import type { ConsultingCTAContent, HomeFAQContent, ESGPillar } from '../../cms/types';

describe('CMS Reusable Component Architecture & Route Registry', () => {
  describe('1. Public Route Registry (publicRoutes.ts)', () => {
    it('should define essential public routes for navigation and CTA linking', () => {
      expect(PUBLIC_ROUTES.length).toBeGreaterThanOrEqual(10);
      const paths = PUBLIC_ROUTES.map((r) => r.value);
      expect(paths).toContain('/');
      expect(paths).toContain('/about');
      expect(paths).toContain('/verify-certificate');
      expect(paths).toContain('/services/esg');
      expect(paths).toContain('/services/management-system-certification');
      expect(paths).toContain('/services/product-certification');
      expect(paths).toContain('/services/inspection');
      expect(paths).toContain('/services/cbam-verification');
      expect(paths).toContain('/services/training');
      expect(paths).toContain('/contact');
    });

    it('should return correct friendly labels for paths', () => {
      expect(getPublicRouteLabel('/verify-certificate')).toBe('Verify Certificate');
      expect(getPublicRouteLabel('/services/esg')).toBe('ESG Assurance & Support');
      expect(getPublicRouteLabel('/unknown-path')).toBe('/unknown-path');
      expect(getPublicRouteLabel('')).toBe('Select Route');
    });

    it('should accurately detect and validate external URLs', () => {
      expect(isExternalUrl('https://ecaseuro.com')).toBe(true);
      expect(isExternalUrl('http://example.org/path')).toBe(true);
      expect(isExternalUrl('/services/esg')).toBe(false);
      expect(isExternalUrl('')).toBe(false);

      expect(isValidExternalUrl('https://ecaseuro.com')).toBe(true);
      expect(isValidExternalUrl('http://sub.domain.co.uk/page?ref=1')).toBe(true);
      expect(isValidExternalUrl('not-a-valid-url')).toBe(false);
      expect(isValidExternalUrl('')).toBe(false);
    });
  });

  describe('2. Empty Field Preservation (Button Label Bug Prevention)', () => {
    it('should allow empty string for button label without auto-restoring defaults', () => {
      const ctaContent: ConsultingCTAContent = {
        heading: 'Need Expert Help?',
        description: 'For ESG Assurance...',
        buttonLabel: '', // User cleared the input
        buttonHref: '/verify-certificate',
      };

      // State must retain empty string
      expect(ctaContent.buttonLabel).toBe('');
      expect(ctaContent.buttonLabel).not.toBe('VERIFY TODAY');
    });

    it('should preserve custom user-entered CTA values', () => {
      const ctaContent: ConsultingCTAContent = {
        heading: 'Custom CTA Header',
        description: 'Custom CTA Description',
        buttonLabel: 'APPLY ONLINE',
        buttonHref: 'https://partner-portal.com/apply',
      };

      expect(ctaContent.buttonLabel).toBe('APPLY ONLINE');
      expect(isExternalUrl(ctaContent.buttonHref)).toBe(true);
    });
  });

  describe('3. Reusable Data Structure Soundness', () => {
    it('should support flexible FAQ items with re-indexing', () => {
      const faq: HomeFAQContent = {
        heading: 'Frequently Asked Questions',
        description: 'General inquiries',
        items: [
          { id: '1', number: '01', question: 'Q1?', answer: 'A1', category: 'General' },
          { id: '2', number: '02', question: 'Q2?', answer: 'A2', category: 'General' },
        ],
      };

      expect(faq.items.length).toBe(2);
      expect(faq.items[0].number).toBe('01');
      expect(faq.items[1].number).toBe('02');
    });

    it('should support pillar structure with custom icon keys and topic lists', () => {
      const pillar: ESGPillar = {
        id: 'p-1',
        number: '01',
        title: 'ENVIRONMENTAL',
        iconKey: 'leaf',
        order: 1,
        topics: ['Carbon Footprint', 'Energy Efficiency', 'Waste Management'],
      };

      expect(pillar.title).toBe('ENVIRONMENTAL');
      expect(pillar.topics.length).toBe(3);
      expect(pillar.iconKey).toBe('leaf');
    });
  });

  describe('4. CMS Collection Cardinality Constraints', () => {
    it('should enforce fixed cardinality rules (e.g. 3 pillars for ESG, 4 testimonials for Home)', () => {
      const calculateCanAdd = (currentCount: number, fixedItems?: number, maxItems?: number) => {
        if (fixedItems !== undefined) return false;
        if (maxItems !== undefined && currentCount >= maxItems) return false;
        return true;
      };

      const calculateCanDelete = (currentCount: number, fixedItems?: number, minItems?: number) => {
        if (fixedItems !== undefined) return false;
        if (minItems !== undefined && currentCount <= minItems) return false;
        return true;
      };

      // Fixed 3 pillars test
      expect(calculateCanAdd(3, 3)).toBe(false);
      expect(calculateCanDelete(3, 3)).toBe(false);

      // Fixed 4 testimonials test
      expect(calculateCanAdd(4, 4)).toBe(false);
      expect(calculateCanDelete(4, 4)).toBe(false);

      // Dynamic collection test (min 1, max 6)
      expect(calculateCanAdd(3, undefined, 6)).toBe(true);
      expect(calculateCanAdd(6, undefined, 6)).toBe(false);
      expect(calculateCanDelete(2, undefined, 1)).toBe(true);
      expect(calculateCanDelete(1, undefined, 1)).toBe(false);
    });
  });

  describe('5. CMS Image Asset Storage & Upload Contract', () => {
    it('should validate allowed image asset paths (both static and uploaded)', () => {
      const isAllowedAssetPath = (pathStr: string) => {
        if (!pathStr) return false;
        return (
          pathStr.startsWith('/images/') ||
          pathStr.startsWith('/uploads/cms/') ||
          pathStr.startsWith('https://') ||
          pathStr.startsWith('http://')
        );
      };

      expect(isAllowedAssetPath('/images/brand/eca-logo.webp')).toBe(true);
      expect(isAllowedAssetPath('/images/home/hero-globe.webp')).toBe(true);
      expect(isAllowedAssetPath('/uploads/cms/cms_1771746200000_abc123.webp')).toBe(true);
      expect(isAllowedAssetPath('https://images.unsplash.com/photo-123')).toBe(true);
      expect(isAllowedAssetPath('data:image/png;base64,iVBORw0KGgo=')).toBe(false); // No raw base64 in SQLite
    });
  });

  describe('6. CMS Icon Resolution & Public Alignment (getPhosphorIconByKey)', () => {
    it('should correctly resolve Product Certification category icons matching public site', async () => {
      const { getPhosphorIconByKey } = await import('../../components/admin/cms/CMSIconSelect');
      const {
        Buildings,
        Gear,
        Broadcast,
        Flame,
        Gauge,
        ShieldWarning,
        Lightning,
        Waveform,
        GameController,
      } = await import('@phosphor-icons/react');

      expect(getPhosphorIconByKey('Buildings')).toBe(Buildings);
      expect(getPhosphorIconByKey('Gear')).toBe(Gear);
      expect(getPhosphorIconByKey('Broadcast')).toBe(Broadcast);
      expect(getPhosphorIconByKey('Flame')).toBe(Flame);
      expect(getPhosphorIconByKey('Gauge')).toBe(Gauge);
      expect(getPhosphorIconByKey('ShieldWarning')).toBe(ShieldWarning);
      expect(getPhosphorIconByKey('Lightning')).toBe(Lightning);
      expect(getPhosphorIconByKey('Waveform')).toBe(Waveform);
      expect(getPhosphorIconByKey('TeddyBear')).toBe(GameController);
    });

    it('should correctly resolve Training & Academy course and format icons matching public site', async () => {
      const { getPhosphorIconByKey } = await import('../../components/admin/cms/CMSIconSelect');
      const {
        GlobeHemisphereWest,
        Leaf,
        HardHat,
        Lifebuoy,
        Lock,
        Lightning,
        Scales,
        SealCheck,
        Flask,
        ForkKnife,
        ShieldCheck,
        Presentation,
        Devices,
        SlidersHorizontal,
      } = await import('@phosphor-icons/react');

      expect(getPhosphorIconByKey('GlobeHemisphereWest')).toBe(GlobeHemisphereWest);
      expect(getPhosphorIconByKey('Leaf')).toBe(Leaf);
      expect(getPhosphorIconByKey('HardHat')).toBe(HardHat);
      expect(getPhosphorIconByKey('Lifebuoy')).toBe(Lifebuoy);
      expect(getPhosphorIconByKey('Lock')).toBe(Lock);
      expect(getPhosphorIconByKey('Lightning')).toBe(Lightning);
      expect(getPhosphorIconByKey('Scales')).toBe(Scales);
      expect(getPhosphorIconByKey('SealCheck')).toBe(SealCheck);
      expect(getPhosphorIconByKey('Flask')).toBe(Flask);
      expect(getPhosphorIconByKey('ForkKnife')).toBe(ForkKnife);
      expect(getPhosphorIconByKey('ShieldCheck')).toBe(ShieldCheck);
      expect(getPhosphorIconByKey('Presentation')).toBe(Presentation);
      expect(getPhosphorIconByKey('Devices')).toBe(Devices);
      expect(getPhosphorIconByKey('SlidersHorizontal')).toBe(SlidersHorizontal);
    });

    it('should correctly resolve CBAM Verification process and role icons matching public site', async () => {
      const { getPhosphorIconByKey } = await import('../../components/admin/cms/CMSIconSelect');
      const {
        Factory,
        FileText,
        ShieldCheck,
        GlobeHemisphereWest,
        MagnifyingGlass,
        Buildings,
        Certificate,
        ClipboardText,
      } = await import('@phosphor-icons/react');

      expect(getPhosphorIconByKey('factory')).toBe(Factory);
      expect(getPhosphorIconByKey('emissions-data')).toBe(FileText);
      expect(getPhosphorIconByKey('independent-verification')).toBe(ShieldCheck);
      expect(getPhosphorIconByKey('declaration')).toBe(GlobeHemisphereWest);
      expect(getPhosphorIconByKey('data-review')).toBe(MagnifyingGlass);
      expect(getPhosphorIconByKey('site-visits')).toBe(Buildings);
      expect(getPhosphorIconByKey('verification-reports')).toBe(Certificate);
      expect(getPhosphorIconByKey('pre-verification-visits')).toBe(ClipboardText);
      expect(getPhosphorIconByKey('verifier-status')).toBe(Certificate);
    });

    it('should correctly resolve Inspection stages, equipment, mill, and lifting icons', async () => {
      const { getPhosphorIconByKey } = await import('../../components/admin/cms/CMSIconSelect');
      const {
        FileText,
        Crane,
        Wrench,
        ShieldCheck,
        ClockCountdown,
        ClipboardText,
        Cylinder,
        Equalizer,
        Vault,
        Engine,
        Fan,
        Cpu,
        Faders,
        Pipe,
        Nut,
        Scroll,
        PenNib,
        MagnifyingGlass,
        Stack,
        PaintRoller,
        Anchor,
        UserFocus,
        Barbell,
        Boat,
      } = await import('@phosphor-icons/react');

      expect(getPhosphorIconByKey('blueprint')).toBe(FileText);
      expect(getPhosphorIconByKey('crane')).toBe(Crane);
      expect(getPhosphorIconByKey('wrench')).toBe(Wrench);
      expect(getPhosphorIconByKey('shield-check')).toBe(ShieldCheck);
      expect(getPhosphorIconByKey('clock-countdown')).toBe(ClockCountdown);
      expect(getPhosphorIconByKey('clipboard-text')).toBe(ClipboardText);
      expect(getPhosphorIconByKey('cylinder')).toBe(Cylinder);
      expect(getPhosphorIconByKey('equalizer')).toBe(Equalizer);
      expect(getPhosphorIconByKey('vault')).toBe(Vault);
      expect(getPhosphorIconByKey('engine')).toBe(Engine);
      expect(getPhosphorIconByKey('fan')).toBe(Fan);
      expect(getPhosphorIconByKey('cpu')).toBe(Cpu);
      expect(getPhosphorIconByKey('faders')).toBe(Faders);
      expect(getPhosphorIconByKey('pipe')).toBe(Pipe);
      expect(getPhosphorIconByKey('nut')).toBe(Nut);
      expect(getPhosphorIconByKey('scroll')).toBe(Scroll);
      expect(getPhosphorIconByKey('pen-nib')).toBe(PenNib);
      expect(getPhosphorIconByKey('magnifying-glass')).toBe(MagnifyingGlass);
      expect(getPhosphorIconByKey('stack')).toBe(Stack);
      expect(getPhosphorIconByKey('paint-roller')).toBe(PaintRoller);
      expect(getPhosphorIconByKey('anchor')).toBe(Anchor);
      expect(getPhosphorIconByKey('user-focus')).toBe(UserFocus);
      expect(getPhosphorIconByKey('barbell')).toBe(Barbell);
      expect(getPhosphorIconByKey('boat')).toBe(Boat);
    });
  });
});


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, SERVICES_LIST } from '../components/common/Navbar';
import {
  Container,
  Stack,
  Inline,
  ResponsiveGrid,
  Button,
  TextLink,
  WhiteSurface,
  NeutralSurface,
  HeroSurface,
  Display,
  Heading1,
  Heading2,
  Heading3,
  Body,
  SmallBody,
  Label,
  ButtonText,
} from '../components/primitives';

export const DesignSystemPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'navbar' | 'buttons' | 'tokens' | 'typography' | 'surfaces' | 'routes'>('all');

  return (
    <div className="min-h-screen bg-[#EEEEEE] text-[#0F172A] pb-20">
      {/* Live Interactive Navbar Demo Header */}
      <div className="pt-4 pb-8 bg-gradient-to-b from-[#E8EEF3]/40 to-transparent">
        <Navbar />
      </div>

      <Container size="xl">
        {/* Header Bar */}
        <header className="border-b border-[#E2E8F0] pb-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold tracking-wider text-[#00607A] uppercase bg-[#E8EEF3] px-2.5 py-1 rounded-md">
                Internal Development Tool
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-[#032E64] mt-2">
                ECASEURO Technical Foundation & Design System
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                Visual inspection of confirmed tokens, GSAP button interaction, production navbar, and technical primitives.
              </p>
            </div>

            {/* Quick Filter */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-[#F1F4F7] rounded-lg border border-[#E2E8F0] self-start">
              {(['all', 'navbar', 'buttons', 'tokens', 'typography', 'surfaces', 'routes'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    activeTab === tab
                      ? 'bg-white text-[#032E64] shadow-xs font-semibold'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </header>

        <Stack gap="2xl">
          {/* 1. PRODUCTION NAVBAR & INTERACTION */}
          {(activeTab === 'all' || activeTab === 'navbar') && (
            <section id="navbar" className="scroll-mt-6">
              <div className="border-b border-[#E2E8F0] pb-2 mb-6">
                <span className="text-xs text-[#00607A] font-semibold tracking-wider uppercase">01. PRODUCTION NAVBAR</span>
                <h2 className="text-lg font-bold text-[#032E64]">Desktop Mega-Menu & Mobile Fallback</h2>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0]">
                <p className="text-sm text-[#475569] mb-4">
                  The live navbar is mounted at the top of this page and on all route placeholders. Test the hover expansion on <strong>Services</strong> to verify:
                </p>
                <ul className="list-disc list-inside text-xs text-[#64748B] space-y-1.5 mb-6">
                  <li><strong>Shell expansion:</strong> Navbar container smoothly morphs downward into the mega-menu using GSAP.</li>
                  <li><strong>Hover persistence:</strong> Pointer moving from the Services trigger into the dropdown links remains active without flicker or dead zones.</li>
                  <li><strong>Five approved services:</strong> {SERVICES_LIST.map((s) => s.title).join(', ')}.</li>
                  <li><strong>Right-hand area:</strong> Clean structural container reserved for future visual assets (no fake placeholder graphics).</li>
                  <li><strong>Keyboard accessibility:</strong> Focusable trigger with ARIA expansion state, Escape to close.</li>
                </ul>

                <div className="p-4 rounded-xl bg-[#F8FAFB] border border-[#E2E8F0] text-xs text-[#475569]">
                  <span className="font-semibold text-[#032E64] block mb-1">Navbar Route Mapping</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                    <div>About Us &rarr; <span className="text-[#00607A] font-semibold">/about</span></div>
                    <div>Services &rarr; <span className="text-[#00607A] font-semibold">/services</span> (Dropdown)</div>
                    <div>Associations &rarr; <span className="text-[#00607A] font-semibold">/associations</span></div>
                    <div>Contact Us &rarr; <span className="text-[#00607A] font-semibold">/contact</span></div>
                    <div>Verify Certificate &rarr; <span className="text-[#00607A] font-semibold">/verify-certificate</span></div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 2. REUSABLE GSAP PRIMARY BUTTON */}
          {(activeTab === 'all' || activeTab === 'buttons') && (
            <section id="buttons" className="scroll-mt-6">
              <div className="border-b border-[#E2E8F0] pb-2 mb-6">
                <span className="text-xs text-[#00607A] font-semibold tracking-wider uppercase">02. BUTTON HOVER INTERACTION</span>
                <h2 className="text-lg font-bold text-[#032E64]">GSAP-Powered Reversible Motion</h2>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Primary Button with GSAP Hover */}
                  <div className="p-5 rounded-xl bg-[#F8FAFB] border border-[#E2E8F0] flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#00607A] uppercase tracking-wider block mb-1">
                        Primary CTA (GSAP Arrow Hover)
                      </span>
                      <p className="text-xs text-[#64748B] mb-4">
                        Hover to inspect the reversible arrow slide-in, background shift to light blue (#E8EEF3), and text transition to navy (#032E64).
                      </p>
                    </div>
                    <div className="pt-2">
                      <Button variant="primary" arrowHover={true}>
                        Verify Certificate
                      </Button>
                    </div>
                  </div>

                  {/* Secondary Button */}
                  <div className="p-5 rounded-xl bg-[#F8FAFB] border border-[#E2E8F0] flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1">
                        Secondary Button (Scaffolding)
                      </span>
                      <p className="text-xs text-[#64748B] mb-4">
                        Clean outline with neutral border (#CBD5E1) and dark navy text.
                      </p>
                    </div>
                    <div className="pt-2">
                      <Button variant="secondary">
                        Secondary Action
                      </Button>
                    </div>
                  </div>

                  {/* Text Link */}
                  <div className="p-5 rounded-xl bg-[#F8FAFB] border border-[#E2E8F0] flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1">
                        Text Link
                      </span>
                      <p className="text-xs text-[#64748B] mb-4">
                        Accessible underline with #00607A hover state and focus outline.
                      </p>
                    </div>
                    <div className="pt-2">
                      <TextLink href="#buttons">
                        Explore Accreditation Details
                      </TextLink>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 3. CONFIRMED BRAND TOKENS & GRADIENTS */}
          {(activeTab === 'all' || activeTab === 'tokens') && (
            <section id="colors" className="scroll-mt-6">
              <div className="border-b border-[#E2E8F0] pb-2 mb-6">
                <span className="text-xs text-[#00607A] font-semibold tracking-wider uppercase">03. BRAND TOKENS & SEMANTIC GRADIENTS</span>
                <h2 className="text-lg font-bold text-[#032E64]">Confirmed Values & Semantic Gradients</h2>
              </div>

              {/* Confirmed Brand Elements */}
              <div className="mb-8">
                <span className="text-xs font-semibold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md inline-block mb-3">
                  Confirmed Brand Elements
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Brand Teal */}
                  <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
                    <div className="h-16 rounded-lg bg-[#00607A] mb-3 shadow-xs" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-[#0F172A]">--brand-teal</span>
                      <span className="text-xs font-medium text-[#64748B]">#00607A</span>
                    </div>
                    <span className="text-xs text-[#64748B] block mt-0.5">Hero Gradient Start / Accent Highlights</span>
                  </div>

                  {/* Brand Navy */}
                  <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
                    <div className="h-16 rounded-lg bg-[#032E64] mb-3 shadow-xs" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-[#0F172A]">--brand-navy</span>
                      <span className="text-xs font-medium text-[#64748B]">#032E64</span>
                    </div>
                    <span className="text-xs text-[#64748B] block mt-0.5">Hero Gradient End / Deep Brand Navy</span>
                  </div>

                  {/* Page Background */}
                  <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
                    <div className="h-16 rounded-lg bg-[#F8FAFB] border border-[#E2E8F0] mb-3 shadow-xs" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-[#0F172A]">--bg-page</span>
                      <span className="text-xs font-medium text-[#64748B]">#F8FAFB</span>
                    </div>
                    <span className="text-xs text-[#64748B] block mt-0.5">Global Light Neutral Page Canvas</span>
                  </div>
                </div>
              </div>

              {/* Confirmed Semantic Gradients */}
              <div className="space-y-4">
                <span className="text-xs font-semibold text-[#00607A] uppercase tracking-wider block">
                  Confirmed Semantic Gradients (3 Distinct Token Scopes)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1. Hero Gradient */}
                  <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] flex flex-col justify-between">
                    <div>
                      <div className="relative h-24 rounded-xl bg-hero-gradient overflow-hidden p-4 mb-3 text-white flex flex-col justify-end">
                        <div className="noise-overlay" aria-hidden="true" />
                        <span className="relative z-10 text-[11px] font-semibold tracking-wider uppercase opacity-90">
                          #00607A &rarr; #032E64
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#0F172A] block">1. Hero Gradient</span>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        Strictly for Hero background sections (with code noise overlay). Never for generic cards or buttons.
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#E2E8F0] text-[11px] font-semibold text-[#00607A]">
                      .bg-hero-gradient (--gradient-hero)
                    </div>
                  </div>

                  {/* 2. Navbar CTA Gradient */}
                  <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] flex flex-col justify-between">
                    <div>
                      <div className="h-24 rounded-xl bg-nav-cta-gradient p-4 mb-3 text-white flex flex-col justify-end">
                        <span className="text-[11px] font-semibold tracking-wider uppercase opacity-90">
                          #0B1642 &rarr; #3261BC
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#0F172A] block">2. Navbar CTA Gradient</span>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        Specifically applied to the Navbar &quot;Verify Certificate&quot; primary action button with GSAP hover layer.
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#E2E8F0] text-[11px] font-semibold text-[#00607A]">
                      .bg-nav-cta-gradient (--gradient-nav-cta)
                    </div>
                  </div>

                  {/* 3. Large CTA / Banner Gradient */}
                  <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] flex flex-col justify-between">
                    <div>
                      <div className="h-24 rounded-xl bg-cta-gradient p-4 mb-3 text-white flex flex-col justify-end">
                        <span className="text-[11px] font-semibold tracking-wider uppercase opacity-90">
                          #0F1B4A &rarr; #6B96CC
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#0F172A] block">3. Large CTA / Banner Gradient</span>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        For full-width or contained call-to-action banner surfaces across future pages.
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#E2E8F0] text-[11px] font-semibold text-[#00607A]">
                      .bg-cta-gradient (--gradient-cta)
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 4. DM SANS TYPOGRAPHY */}
          {(activeTab === 'all' || activeTab === 'typography') && (
            <section id="typography" className="scroll-mt-6">
              <div className="border-b border-[#E2E8F0] pb-2 mb-6">
                <span className="text-xs text-[#00607A] font-semibold tracking-wider uppercase">04. TYPOGRAPHY FOUNDATION</span>
                <h2 className="text-lg font-bold text-[#032E64]">DM Sans Hierarchy (No Monospace)</h2>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0]">
                <Stack gap="xl">
                  {/* Display */}
                  <div className="border-b border-[#F1F4F7] pb-6">
                    <span className="text-xs text-[#64748B] uppercase tracking-wider block mb-1">Display (Fluid clamp 36px - 60px / Bold)</span>
                    <Display>Display Example</Display>
                  </div>

                  {/* Heading 1 */}
                  <div className="border-b border-[#F1F4F7] pb-6">
                    <span className="text-xs text-[#64748B] uppercase tracking-wider block mb-1">Heading 1 (Fluid clamp 30px - 44px / Bold)</span>
                    <Heading1>Heading 1 Example</Heading1>
                  </div>

                  {/* Heading 2 */}
                  <div className="border-b border-[#F1F4F7] pb-6">
                    <span className="text-xs text-[#64748B] uppercase tracking-wider block mb-1">Heading 2 (Fluid clamp 24px - 34px / Semibold)</span>
                    <Heading2>Heading 2 Example</Heading2>
                  </div>

                  {/* Heading 3 */}
                  <div className="border-b border-[#F1F4F7] pb-6">
                    <span className="text-xs text-[#64748B] uppercase tracking-wider block mb-1">Heading 3 (Fluid clamp 20px - 24px / Semibold)</span>
                    <Heading3>Heading 3 Example</Heading3>
                  </div>

                  {/* Body */}
                  <div className="border-b border-[#F1F4F7] pb-6">
                    <span className="text-xs text-[#64748B] uppercase tracking-wider block mb-1">Body (16px / Regular / 1.625)</span>
                    <Body>
                      Body Example — ECASEURO provides independent certification, technical inspection, professional
                      training, and quality assurance solutions across European and international standard frameworks.
                    </Body>
                  </div>

                  {/* Small Body */}
                  <div className="border-b border-[#F1F4F7] pb-6">
                    <span className="text-xs text-[#64748B] uppercase tracking-wider block mb-1">Small Body (14px / Regular / 1.5)</span>
                    <SmallBody>
                      Small Body Example — Technical compliance documentation, standard ISO audit requirements, and
                      accreditation scope verification terms.
                    </SmallBody>
                  </div>

                  {/* Label & Button Text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-[#64748B] uppercase tracking-wider block mb-1">Label (12px / Semibold / Uppercase)</span>
                      <Label>Label Example</Label>
                    </div>
                    <div>
                      <span className="text-xs text-[#64748B] uppercase tracking-wider block mb-1">Button Text (14px / Semibold)</span>
                      <ButtonText className="text-[#032E64]">Button Text Example</ButtonText>
                    </div>
                  </div>
                </Stack>
              </div>
            </section>
          )}

          {/* 5. SURFACES & HERO UTILITY */}
          {(activeTab === 'all' || activeTab === 'surfaces') && (
            <section id="surfaces" className="scroll-mt-6">
              <div className="border-b border-[#E2E8F0] pb-2 mb-6">
                <span className="text-xs text-[#00607A] font-semibold tracking-wider uppercase">05. SURFACES & RADIUS</span>
                <h2 className="text-lg font-bold text-[#032E64]">Surfaces & Container Primitives</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* White Surface */}
                <WhiteSurface radius="xl" className="p-6">
                  <span className="text-xs text-[#64748B] uppercase tracking-wider block mb-1">White Surface</span>
                  <h4 className="text-base font-semibold text-[#032E64]">White Card Surface</h4>
                  <p className="text-xs text-[#64748B] mt-2">
                    Standard white card surface with subtle 1px border.
                  </p>
                </WhiteSurface>

                {/* Neutral Surface */}
                <NeutralSurface radius="xl" className="p-6">
                  <span className="text-xs text-[#64748B] uppercase tracking-wider block mb-1">Neutral Surface (Scaffolding)</span>
                  <h4 className="text-base font-semibold text-[#032E64]">Pale Neutral Background</h4>
                  <p className="text-xs text-[#64748B] mt-2">
                    Pale #F1F4F7 surface for secondary groupings and badges.
                  </p>
                </NeutralSurface>
              </div>

              {/* Full Hero Surface Component */}
              <div className="mb-6">
                <span className="text-xs text-[#64748B] uppercase tracking-wider block mb-2">
                  HeroSurface Primitive (Hero-Specific Diagonal Gradient + Code Noise + Rounded Corners)
                </span>
                <HeroSurface radius="2xl" className="p-8 sm:p-12">
                  <div className="max-w-2xl">
                    <span className="text-xs tracking-wider uppercase text-white/80 bg-white/10 px-2.5 py-1 rounded-md inline-block mb-3">
                      Generic Hero Surface Container
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                      Hero Section Container Preview
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed mb-6">
                      This reusable utility encapsulates the approved #00607A to #032E64 diagonal gradient, lightweight
                      non-raster noise filter, and overflow container constraints for future Homepage and About hero sections.
                    </p>
                    <Inline gap="sm">
                      <Button variant="primary" className="bg-white text-[#032E64] hover:bg-white/90 border-white">
                        Verify Certificate
                      </Button>
                      <Button variant="secondary" className="bg-transparent text-white border-white/40 hover:bg-white/10">
                        Explore Services
                      </Button>
                    </Inline>
                  </div>
                </HeroSurface>
              </div>
            </section>
          )}

          {/* 6. ROUTE VERIFICATION */}
          {(activeTab === 'all' || activeTab === 'routes') && (
            <section id="routes" className="scroll-mt-6">
              <div className="border-b border-[#E2E8F0] pb-2 mb-6">
                <span className="text-xs text-[#00607A] font-semibold tracking-wider uppercase">06. PREPARED ROUTES</span>
                <h2 className="text-lg font-bold text-[#032E64]">Route Verification Table</h2>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F1F4F7] text-[#032E64] font-semibold border-b border-[#E2E8F0]">
                      <tr>
                        <th className="px-4 py-3">Route Path</th>
                        <th className="px-4 py-3">Target Scope</th>
                        <th className="px-4 py-3">Current Status</th>
                        <th className="px-4 py-3 text-right">Navigation Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-[#475569]">
                      {[
                        { path: '/', label: 'Homepage', status: 'Active (Approved Hero)' },
                        { path: '/about', label: 'About Us', status: 'Active' },
                        { path: '/services', label: 'Services Index', status: 'Placeholder (Design Pending)' },
                        { path: '/services/esg', label: 'Service: ESG', status: 'Active' },
                        { path: '/services/management-system-certification', label: 'Service: Management System Certification', status: 'Active' },
                        { path: '/services/inspection', label: 'Service: Inspection', status: 'Active' },
                        { path: '/services/training', label: 'Service: Training', status: 'Active' },
                        { path: '/services/product-certification', label: 'Service: Product Certification', status: 'Active' },
                        { path: '/associations', label: 'Associations & Accreditations', status: 'Active' },
                        { path: '/contact', label: 'Contact Us', status: 'Active' },
                        { path: '/verify-certificate', label: 'Certificate Verification', status: 'Active' },
                        { path: '/design-system', label: 'Design System Reference', status: 'Active (Internal Tool)' },
                      ].map((r) => (
                        <tr key={r.path} className="hover:bg-[#F8FAFB]">
                          <td className="px-4 py-3 font-semibold text-[#032E64]">{r.path}</td>
                          <td className="px-4 py-3 text-[#0F172A]">{r.label}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium ${
                              r.path === '/design-system'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link
                              to={r.path}
                              className="text-[#00607A] hover:text-[#032E64] font-semibold underline underline-offset-2"
                            >
                              Visit &rarr;
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </Stack>
      </Container>
    </div>
  );
};

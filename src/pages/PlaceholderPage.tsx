import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export interface PlaceholderPageProps {
  pageName?: string;
}

/**
 * Minimal development placeholder for unapproved production routes.
 * Renders the production Navbar at top, placeholder in body, and production Footer at bottom.
 * Reads and preserves incoming query parameters (e.g., ?certificate=) for test verification.
 */
export const PlaceholderPage: React.FC<PlaceholderPageProps> = () => {
  const [searchParams] = useSearchParams();
  const certParam = searchParams.get('certificate');

  return (
    <div className="min-h-screen flex flex-col bg-[#EEEEEE]">
      <div className="pt-4 pb-2">
        <Navbar />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center py-20">
        <p className="text-xs font-semibold tracking-widest text-[#64748B] uppercase">
          PAGE DESIGN PENDING
        </p>

        {certParam && (
          <div className="mt-3 px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] shadow-2xs text-xs text-[#0F172A]">
            <span className="font-semibold text-[#00607A]">Certificate Query: </span>
            <span>{certParam}</span>
          </div>
        )}

        <Link
          to="/design-system"
          className="mt-4 text-xs font-medium text-[#00607A] hover:text-[#032E64] underline underline-offset-4 focus-ring"
        >
          View Internal Design System Reference &rarr;
        </Link>
      </main>

      <Footer withGlobe={false} />
    </div>
  );
};


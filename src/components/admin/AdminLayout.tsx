import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { List } from '@phosphor-icons/react';

export const AdminLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-[#1E293B] font-['DM_Sans'] antialiased">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isMobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Mobile Header Bar */}
        <header className="lg:hidden h-14 bg-white border-b border-[#E2E8F0] px-4 flex items-center justify-between sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-[#475467] hover:text-[#082046] hover:bg-[#F1F5F9] rounded-md focus:outline-none"
            aria-label="Open sidebar"
          >
            <List size={20} weight="bold" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#082046]">ECAS EURO</span>
            <span className="text-[10px] font-semibold bg-[#E6F4F8] text-[#00607A] px-1.5 py-0.5 rounded border border-[#00607A]/20">
              Admin
            </span>
          </div>
          <div className="w-8" />
        </header>

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

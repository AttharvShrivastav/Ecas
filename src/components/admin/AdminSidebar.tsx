import React, { useState } from 'react';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { useSession, signOut } from '../../lib/auth-client';
import {
  House,
  Info,
  Certificate,
  FileText,
  MagnifyingGlass,
  TreeStructure,
  Leaf,
  GraduationCap,
  Handshake,
  SealCheck,
  EnvelopeSimple,
  Newspaper,
  Gear,
  Users,
  ArrowSquareOut,
  SignOut
} from '@phosphor-icons/react';

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItemConfig {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string; weight?: any }>;
  enabled: boolean;
  badge?: string;
  external?: boolean;
}

interface NavSectionConfig {
  title: string;
  items: NavItemConfig[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [logoError, setLogoError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userName = session?.user?.name || 'Administrator';
  const userEmail = session?.user?.email || 'admin@ecaseuro.com';
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AD';

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate('/admin/login', { replace: true });
    } catch (err) {
      console.error('[Sign Out Error]', err);
      navigate('/admin/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const sections: NavSectionConfig[] = [
    {
      title: 'REGISTRY',
      items: [
        {
          label: 'Certificates',
          path: '/admin/certificates',
          icon: Certificate,
          enabled: true
        }
      ]
    },
    {
      title: 'MAIN WEBSITE',
      items: [
        {
          label: 'Home',
          path: '/admin/content/home',
          icon: House,
          enabled: true,
          badge: 'CMS'
        },
        {
          label: 'About Us',
          path: '/admin/content/about',
          icon: Info,
          enabled: true,
          badge: 'CMS'
        }
      ]
    },
    {
      title: 'SERVICES',
      items: [
        {
          label: 'Product Certification',
          path: '/admin/services/product-certification',
          icon: SealCheck,
          enabled: true,
          badge: 'CMS'
        },
        {
          label: 'Management Systems',
          path: '/admin/services/management-systems',
          icon: TreeStructure,
          enabled: true,
          badge: 'CMS'
        },
        {
          label: 'Inspection',
          path: '/admin/services/inspection',
          icon: MagnifyingGlass,
          enabled: true,
          badge: 'CMS'
        },
        {
          label: 'CBAM Verification',
          path: '/admin/services/cbam-verification',
          icon: FileText,
          enabled: true,
          badge: 'CMS'
        },
        {
          label: 'ESG Verification',
          path: '/admin/services/esg-verification',
          icon: Leaf,
          enabled: true,
          badge: 'CMS'
        },
        {
          label: 'Training & Academy',
          path: '/admin/services/training-academy',
          icon: GraduationCap,
          enabled: true,
          badge: 'CMS'
        }
      ]
    },
    {
      title: 'NETWORK',
      items: [
        {
          label: 'Associations & Partners',
          path: '/admin/network/associations-partners',
          icon: Handshake,
          enabled: true,
          badge: 'CMS'
        }
      ]
    },
    {
      title: 'VERIFICATION',
      items: [
        {
          label: 'Certificate Verification',
          path: '/verify-certificate',
          icon: SealCheck,
          enabled: true,
          badge: 'Public',
          external: true
        }
      ]
    },
    {
      title: 'BUSINESS',
      items: [
        {
          label: 'Enquiries',
          path: '/admin/enquiries',
          icon: EnvelopeSimple,
          enabled: true
        }
      ]
    },
    {
      title: 'CONTENT',
      items: [
        {
          label: 'News & Insights',
          path: '/admin/news',
          icon: Newspaper,
          enabled: true,
          badge: 'CMS'
        }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        {
          label: 'Admin Accounts',
          path: '/admin/settings/accounts',
          icon: Users,
          enabled: true,
          badge: 'Security'
        },
        {
          label: 'Site Settings',
          path: '/admin/settings',
          icon: Gear,
          enabled: true,
          badge: 'CMS'
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#082046]/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Persistent Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E2E8F0] flex flex-col transition-transform duration-200 ease-in-out font-['DM_Sans'] lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 sm:px-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white shrink-0">
          <Link
            to="/admin/certificates"
            className="flex items-center gap-2.5 group focus:outline-none min-w-0"
            onClick={onCloseMobile}
            aria-label="ECAS EURO Admin & Registry"
          >
            {!logoError ? (
              <img
                src="/images/brand/eca-logo.webp"
                alt="ECAS EURO"
                className="h-8 sm:h-9 w-auto max-h-[36px] object-contain shrink-0"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-md bg-[#082046] flex items-center justify-center text-white font-bold text-xs shrink-0">
                ECA
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm text-[#082046] tracking-tight truncate">
                  ECAS EURO
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#E6F4F8] text-[#00607A] rounded border border-[#00607A]/20 uppercase tracking-wider shrink-0">
                  Admin
                </span>
              </div>
              <span className="text-[10px] text-[#64748B] font-medium leading-none mt-0.5 truncate">
                Admin / Registry
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
                {section.title}
              </div>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isCertificates = item.path === '/admin/certificates';
                  const isActive =
                    isCertificates &&
                    (location.pathname === '/admin/certificates' ||
                      location.pathname.startsWith('/admin/certificates/'));

                  if (item.external) {
                    return (
                      <a
                        key={item.label}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onCloseMobile}
                        className="flex items-center justify-between px-3 py-1.5 text-xs font-medium text-[#475467] hover:bg-[#F8FAFC] hover:text-[#082046] rounded-md transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={15} className="text-[#64748B] shrink-0" weight="regular" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-medium text-[#00607A] bg-[#E6F4F8] px-1.5 py-0.2 rounded border border-[#00607A]/20">
                            {item.badge} ↗
                          </span>
                        )}
                      </a>
                    );
                  }

                  if (!item.enabled) {
                    return (
                      <div
                        key={item.label}
                        className="group flex items-center justify-between px-3 py-1.5 text-xs font-medium text-[#94A3B8] rounded-md select-none transition-colors"
                        title={`${item.label} (Controlled CMS editing module)`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={15} className="text-[#CBD5E1] shrink-0" weight="regular" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-semibold text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.2 rounded border border-[#E2E8F0] uppercase tracking-wide">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onCloseMobile}
                      className={({ isActive: isExactActive }) => {
                        const active = isActive || isExactActive;
                        return `flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                          active
                            ? 'bg-[#082046] text-white shadow-xs font-semibold'
                            : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#082046]'
                        }`;
                      }}
                    >
                      {({ isActive: isExactActive }) => {
                        const active = isActive || isExactActive;
                        return (
                          <>
                            <div className="flex items-center gap-2.5">
                              <Icon
                                size={15}
                                className={`shrink-0 ${active ? 'text-white' : 'text-[#64748B]'}`}
                                weight={active ? 'fill' : 'regular'}
                              />
                              <span>{item.label}</span>
                            </div>
                            {active && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                            )}
                          </>
                        );
                      }}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-2 shrink-0">
          {/* Public Link */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-[#475467] hover:text-[#082046] hover:bg-white rounded-md border border-[#E2E8F0] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowSquareOut size={14} className="text-[#64748B]" />
              Public Website
            </span>
            <span className="text-[10px] text-[#94A3B8]">Live ↗</span>
          </Link>

          {/* User Session Bar & Sign Out */}
          <div className="p-2.5 bg-white rounded-md border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-[#082046] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {initials}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-[#1E293B] truncate leading-tight">
                    {userName}
                  </p>
                  <p className="text-[10px] text-[#64748B] truncate leading-tight">
                    {userEmail}
                  </p>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#12B76A] shrink-0" title="Session Active" />
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] font-medium text-[#B42318] hover:text-[#912018] hover:bg-[#FEF3F2] rounded border border-[#FECDCA] transition-colors cursor-pointer disabled:opacity-60"
            >
              <SignOut size={13} weight="bold" />
              <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

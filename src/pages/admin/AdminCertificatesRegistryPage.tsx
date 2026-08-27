import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MagnifyingGlass,
  Plus,
  DownloadSimple,
  CaretUp,
  CaretDown,
  DotsThreeVertical,
  PencilSimple,
  WarningCircle,
  XCircle,
  Eye,
  ClockCounterClockwise,
  X
} from '@phosphor-icons/react';
import {
  fetchAdminCertificates,
  fetchAdminCertificateStandards,
  changeAdminCertificateStatus
} from '../../services/adminCertificateService';
import { CertificateStatusPill } from '../../components/admin/CertificateStatusPill';
import { CertificateDetailDrawer } from '../../components/admin/CertificateDetailDrawer';
import { CertificateStatusModal } from '../../components/admin/CertificateStatusModal';
import type {
  DbCertificate,
  CertificateStatus,
  CertificateListParams
} from '../../types/adminCertificate';

type SortField =
  | 'id'
  | 'certificate_number'
  | 'company_name'
  | 'standard'
  | 'status'
  | 'issue_date'
  | 'expiry_date';

export const AdminCertificatesRegistryPage: React.FC = () => {
  const navigate = useNavigate();

  // Data State
  const [certificates, setCertificates] = useState<DbCertificate[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available Standards
  const [availableStandards, setAvailableStandards] = useState<string[]>([]);

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [standardFilter, setStandardFilter] = useState<string>('ALL');
  const [expiryFilter, setExpiryFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');

  // Interactive Selection State (Drawer & Modals)
  const [selectedCert, setSelectedCert] = useState<DbCertificate | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [statusModalOpen, setStatusModalOpen] = useState<boolean>(false);
  const [statusModalCert, setStatusModalCert] = useState<DbCertificate | null>(null);
  const [targetStatus, setTargetStatus] = useState<CertificateStatus | null>(null);

  const [activeMenuCertId, setActiveMenuCertId] = useState<number | null>(null);

  // Fetch available standards once on mount
  useEffect(() => {
    fetchAdminCertificateStandards()
      .then((stds) => {
        if (Array.isArray(stds) && stds.length > 0) {
          setAvailableStandards(stds);
        }
      })
      .catch((err) => {
        console.warn('Could not load dynamic standards list:', err);
      });
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // reset to page 1 on new search
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load certificates from backend API
  const loadCertificates = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const params: CertificateListParams = {
        search: debouncedSearch,
        status: statusFilter !== 'ALL' ? (statusFilter as CertificateStatus) : undefined,
        standard: standardFilter !== 'ALL' ? standardFilter : undefined,
        expiry: expiryFilter !== 'ALL' ? expiryFilter : undefined,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortField,
        sortDir: sortDirection
      };

      const res = await fetchAdminCertificates(params);
      const list = res.data || [];

      setCertificates(list);
      setTotalCount(res.pagination?.total ?? list.length);
      setTotalPages(res.pagination?.totalPages ?? Math.max(1, Math.ceil((res.pagination?.total || 1) / itemsPerPage)));
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load certificate registry records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, [
    debouncedSearch,
    statusFilter,
    standardFilter,
    expiryFilter,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection
  ]);

  // Handle Sort Click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortDirection('ASC');
    }
    setCurrentPage(1);
  };

  // Open Detail Drawer
  const handleRowClick = (cert: DbCertificate) => {
    setSelectedCert(cert);
    setIsDrawerOpen(true);
  };

  // Status Change Modal
  const handleOpenStatusModal = (cert: DbCertificate, status: CertificateStatus) => {
    setStatusModalCert(cert);
    setTargetStatus(status);
    setStatusModalOpen(true);
    setActiveMenuCertId(null);
  };

const handleConfirmStatusChange = async (
  certId: number,
  status: CertificateStatus
) => {
  await changeAdminCertificateStatus(certId, status);
  await loadCertificates();

  // If updated cert is currently in drawer, refresh its state
  if (selectedCert && selectedCert.id === certId) {
    setSelectedCert((prev) =>
      prev ? { ...prev, status, effectiveStatus: status } : null
    );
  }
};


  // CSV Export handler
  const handleExportCSV = () => {
    if (certificates.length === 0) return;

    const headers = [
      'Sr. No.',
      'Certificate Number',
      'Company Name',
      'Standard',
      'Address',
      'Other Address',
      'Scope',
      'Issue Date',
      'Expiry Date',
      'Status',
      'Accreditation Body',
      'Original Registration Date',
      'Surveillance Audit Date'
    ];

    const rows = certificates.map((c) => [
      c.id,
      `"${c.certificate_number.replace(/"/g, '""')}"`,
      `"${c.company_name.replace(/"/g, '""')}"`,
      `"${c.standard.replace(/"/g, '""')}"`,
      `"${(c.address || '').replace(/"/g, '""')}"`,
      `"${(c.other_address || '').replace(/"/g, '""')}"`,
      `"${(c.scope || '').replace(/"/g, '""')}"`,
      c.issue_date,
      c.expiry_date,
      c.effectiveStatus || c.status,
      `"${(c.accreditation_body || '').replace(/"/g, '""')}"`,
      c.original_registration_date || '',
      c.surveillance_audit_date || ''
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `eCAS_Euro_Certificates_Registry_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startRecord = (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="w-full space-y-5 font-['DM_Sans']">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
            <span>Certificates</span>
            <span>&gt;</span>
            <span className="text-[#082046] font-semibold">Certificate Registry</span>
          </div>

          <h1 className="text-2xl font-bold text-[#082046] tracking-tight">
            Certificate Registry
          </h1>
          <p className="text-xs text-[#64748B]">
            Manage, verify, and maintain all registered certification records
          </p>
        </div>

        {/* Quick Add Certificate Button */}
        <Link
          to="/admin/certificates/new"
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-semibold text-white bg-[#082046] hover:bg-[#0E2C5B] rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus size={14} weight="bold" />
          <span>Add Certificate</span>
        </Link>
      </div>

      {/* Control Bar: Search, Filters & Export */}
      <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Search Input */}
        <div className="relative flex-1 min-w-[260px] max-w-lg">
          <input
            type="text"
            placeholder="Search by certificate number, company name, scope, standard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-8 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all placeholder:text-[#94A3B8]"
          />
          <MagnifyingGlass
            size={15}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475467]"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Right Controls: Filters & Export Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-[#475467]">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Valid">Valid</option>
              <option value="Suspended">Suspended</option>
              <option value="Expired">Expired</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          {/* Standard Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-[#475467]">Standard</label>
            <select
              value={standardFilter}
              onChange={(e) => {
                setStandardFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] cursor-pointer max-w-[150px] truncate"
            >
              <option value="ALL">All Standards</option>
              {availableStandards.map((std) => (
                <option key={std} value={std}>
                  {std}
                </option>
              ))}
            </select>
          </div>

          {/* Expiry Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-[#475467]">Expiry</label>
            <select
              value={expiryFilter}
              onChange={(e) => {
                setExpiryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] cursor-pointer"
            >
              <option value="ALL">All Expiry</option>
              <option value="ACTIVE">Active Only</option>
              <option value="EXPIRING_30">Expiring in 30 Days</option>
              <option value="EXPIRING_90">Expiring in 90 Days</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold text-[#082046] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-md transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Export CSV"
          >
            <DownloadSimple size={14} weight="bold" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WarningCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={loadCertificates}
            className="underline hover:no-underline font-semibold text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* Primary Certificate Registry Table */}
      <div className="w-full bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* Table Header */}
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475467] select-none uppercase tracking-wider text-[11px]">
              <tr>
                {/* Sr. No. */}
                <th
                  onClick={() => handleSort('id')}
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#F1F5F9] transition-colors whitespace-nowrap w-20"
                >
                  <div className="flex items-center gap-1">
                    <span>Sr. No.</span>
                    {sortField === 'id' && (
                      sortDirection === 'ASC' ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />
                    )}
                  </div>
                </th>

                {/* Certificate Number */}
                <th
                  onClick={() => handleSort('certificate_number')}
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#F1F5F9] transition-colors whitespace-nowrap min-w-[150px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Certificate Number</span>
                    {sortField === 'certificate_number' && (
                      sortDirection === 'ASC' ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />
                    )}
                  </div>
                </th>

                {/* Company Name */}
                <th
                  onClick={() => handleSort('company_name')}
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#F1F5F9] transition-colors whitespace-nowrap min-w-[200px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Company Name</span>
                    {sortField === 'company_name' && (
                      sortDirection === 'ASC' ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />
                    )}
                  </div>
                </th>

                {/* Standard */}
                <th
                  onClick={() => handleSort('standard')}
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#F1F5F9] transition-colors whitespace-nowrap min-w-[130px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Standard</span>
                    {sortField === 'standard' && (
                      sortDirection === 'ASC' ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />
                    )}
                  </div>
                </th>

                {/* Status */}
                <th
                  onClick={() => handleSort('status')}
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#F1F5F9] transition-colors whitespace-nowrap min-w-[110px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    {sortField === 'status' && (
                      sortDirection === 'ASC' ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />
                    )}
                  </div>
                </th>

                {/* Issue Date */}
                <th
                  onClick={() => handleSort('issue_date')}
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#F1F5F9] transition-colors whitespace-nowrap min-w-[110px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Issue Date</span>
                    {sortField === 'issue_date' && (
                      sortDirection === 'ASC' ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />
                    )}
                  </div>
                </th>

                {/* Expiry Date */}
                <th
                  onClick={() => handleSort('expiry_date')}
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#F1F5F9] transition-colors whitespace-nowrap min-w-[110px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Expiry Date</span>
                    {sortField === 'expiry_date' && (
                      sortDirection === 'ASC' ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />
                    )}
                  </div>
                </th>

                {/* Actions */}
                <th className="px-4 py-3 font-semibold text-center whitespace-nowrap w-20">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#E2E8F0] text-[#1E293B]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#64748B]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#082046] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Loading certificate registry records...</span>
                    </div>
                  </td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#64748B]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-xs font-semibold text-[#1E293B]">
                        No certificates found
                      </p>
                      <p className="text-[11px] text-[#64748B]">
                        Try modifying your search keywords or resetting active filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                certificates.map((cert, index) => {
                  const effectiveStatus = cert.effectiveStatus || cert.status;
                  const isMenuOpen = activeMenuCertId === cert.id;
                  const shouldOpenUp = index >= certificates.length - 4;

                  return (
                    <tr
                      key={cert.id}
                      onClick={() => handleRowClick(cert)}
                      className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                    >
                      {/* Sr. No. */}
                      <td className="px-4 py-3.5 text-[#64748B] font-medium whitespace-nowrap">
                        {cert.id}
                      </td>

                      {/* Certificate Number */}
                      <td className="px-4 py-3.5 text-[#082046] font-semibold whitespace-nowrap font-mono">
                        {cert.certificate_number}
                      </td>

                      {/* Company Name */}
                      <td className="px-4 py-3.5 font-semibold text-[#082046] group-hover:text-[#00607A] transition-colors">
                        {cert.company_name}
                      </td>

                      {/* Standard */}
                      <td className="px-4 py-3.5 text-[#334155] whitespace-nowrap font-medium">
                        {cert.standard}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <CertificateStatusPill status={effectiveStatus} size="sm" />
                      </td>

                      {/* Issue Date */}
                      <td className="px-4 py-3.5 text-[#334155] whitespace-nowrap font-mono text-xs">
                        {cert.issue_date}
                      </td>

                      {/* Expiry Date */}
                      <td className="px-4 py-3.5 text-[#334155] whitespace-nowrap font-mono text-xs">
                        {cert.expiry_date}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3.5 text-center whitespace-nowrap relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuCertId(isMenuOpen ? null : cert.id)
                            }
                            className="p-1.5 text-[#64748B] hover:text-[#082046] hover:bg-[#E2E8F0] rounded transition-colors"
                            aria-label="Actions"
                          >
                            <DotsThreeVertical size={18} weight="bold" />
                          </button>

                          {/* Dropdown Action Menu */}
                          {isMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-20"
                                onClick={() => setActiveMenuCertId(null)}
                              />
                              <div
  className={`absolute right-0 w-44 bg-white rounded-md shadow-lg border border-[#E2E8F0] py-1 z-30 font-['DM_Sans'] text-left ${
    shouldOpenUp ? 'bottom-full mb-1' : 'top-full mt-1'
  }`}
>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCert(cert);
                                    setIsDrawerOpen(true);
                                    setActiveMenuCertId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-[#334155] hover:bg-[#F8FAFC] flex items-center gap-2"
                                >
                                  <Eye size={14} />
                                  <span>View Details</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    navigate(`/admin/certificates/${cert.id}`);
                                    setActiveMenuCertId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-[#334155] hover:bg-[#F8FAFC] flex items-center gap-2"
                                >
                                  <PencilSimple size={14} />
                                  <span>Edit Certificate</span>
                                </button>

                                {effectiveStatus === 'Suspended' ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenStatusModal(cert, 'Valid')
                                    }
                                    className="w-full px-3 py-1.5 text-xs text-[#0E7044] hover:bg-[#E8F8F0] flex items-center gap-2"
                                  >
                                    <ClockCounterClockwise size={14} />
                                    <span>Reactivate</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenStatusModal(cert, 'Suspended')
                                    }
                                    disabled={
                                      effectiveStatus === 'Withdrawn' ||
                                      effectiveStatus === 'Expired'
                                    }
                                    className="w-full px-3 py-1.5 text-xs text-[#D97706] hover:bg-[#FFF6ED] flex items-center gap-2 disabled:opacity-40"
                                  >
                                    <WarningCircle size={14} />
                                    <span>Suspend</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenStatusModal(cert, 'Withdrawn')
                                  }
                                  disabled={effectiveStatus === 'Withdrawn'}
                                  className="w-full px-3 py-1.5 text-xs text-[#DC2626] hover:bg-[#FEF3F2] flex items-center gap-2 disabled:opacity-40"
                                >
                                  <XCircle size={14} />
                                  <span>Withdraw</span>
                                </button>

                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-[#E2E8F0] bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <div>
            Showing <span className="font-semibold text-[#1E293B]">{totalCount > 0 ? startRecord : 0}</span> to{' '}
            <span className="font-semibold text-[#1E293B]">{endRecord}</span> of{' '}
            <span className="font-semibold text-[#1E293B]">{totalCount}</span> records
          </div>

          <div className="flex items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value, 10));
                  setCurrentPage(1);
                }}
                className="text-xs px-2 py-1 bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#082046]"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            </div>

            {/* Page Navigation Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 text-[#475467] hover:bg-[#F1F5F9] rounded border border-[#CBD5E1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                &lt;
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 3 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
                const isActive = pageNum === currentPage;

                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[28px] h-7 text-xs font-semibold rounded border transition-colors ${
                      isActive
                        ? 'bg-[#EFF6FF] text-[#082046] border-[#3B82F6]'
                        : 'bg-white text-[#475467] border-[#CBD5E1] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 text-[#475467] hover:bg-[#F1F5F9] rounded border border-[#CBD5E1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Detail Drawer */}
      <CertificateDetailDrawer
        certificate={selectedCert}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenStatusModal={handleOpenStatusModal}
      />

      {/* Certificate Status Modal */}
      <CertificateStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        certificate={statusModalCert}
        targetStatus={targetStatus}
        onConfirm={handleConfirmStatusChange}
      />

    </div>
  );
};

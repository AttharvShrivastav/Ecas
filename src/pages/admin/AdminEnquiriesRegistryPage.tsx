import React, { useEffect, useState, useMemo } from 'react';
import {
  MagnifyingGlass,
  DownloadSimple,
  CaretUp,
  CaretDown,
  Eye,
  ArrowClockwise,
  EnvelopeSimple,
  Buildings,
  CheckCircle,
  Clock,
  Funnel,
  XCircle,
  WarningCircle,
  ChatCircleDots
} from '@phosphor-icons/react';
import {
  fetchAdminEnquiries,
  fetchAdminEnquiryStats,
  updateAdminEnquiryStatus
} from '../../services/adminEnquiryService';
import { EnquiryStatusPill } from '../../components/admin/EnquiryStatusPill';
import { EnquiryDetailModal } from '../../components/admin/EnquiryDetailModal';
import type {
  EnquiryRecord,
  EnquiryStatus,
  EnquiryStats,
  EnquiryListParams
} from '../../types/adminEnquiry';

type SortField = 'id' | 'name' | 'company' | 'email' | 'enquiry_type' | 'status' | 'created_at';

export const AdminEnquiriesRegistryPage: React.FC = () => {
  // Data State
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [stats, setStats] = useState<EnquiryStats | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [enquiryTypeFilter, setEnquiryTypeFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

  // Interactive Selection State (Modal)
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load operational stats
  const loadStats = async () => {
    try {
      setIsStatsLoading(true);
      const data = await fetchAdminEnquiryStats();
      setStats(data);
    } catch (err: any) {
      console.warn('Could not load enquiry stats:', err);
    } finally {
      setIsStatsLoading(false);
    }
  };

  // Load enquiries from backend API
  const loadEnquiries = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const params: EnquiryListParams = {
        search: debouncedSearch,
        status: statusFilter !== 'ALL' ? (statusFilter as EnquiryStatus) : undefined,
        enquiryType: enquiryTypeFilter !== 'ALL' ? enquiryTypeFilter : undefined,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortField,
        sortDir: sortDirection
      };

      const res = await fetchAdminEnquiries(params);
      setEnquiries(res.data || []);
      setTotalCount(res.pagination?.total || (res.data || []).length);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load enquiry records from database');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial stats load
  useEffect(() => {
    loadStats();
  }, []);

  // Reload data when filters/sorting/page change
  useEffect(() => {
    loadEnquiries();
  }, [debouncedSearch, statusFilter, enquiryTypeFilter, currentPage, itemsPerPage, sortField, sortDirection]);

  // Handle Sort Click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortDirection(field === 'created_at' ? 'DESC' : 'ASC');
    }
    setCurrentPage(1);
  };

  // Open Detail Modal
  const handleRowClick = (enquiry: EnquiryRecord) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  // Status Change Handler from Modal
  const handleStatusChange = async (
    id: number,
    newStatus: EnquiryStatus
  ) => {
    const updated = await updateAdminEnquiryStatus(id, newStatus);
    
    // Update locally in table
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? updated : e))
    );

    // If currently selected in modal, update reference
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry(updated);
    }

    // Refresh operational stats
    loadStats();
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (enquiries.length === 0) return;

    const headers = [
      'ID',
      'Name',
      'Company',
      'Email',
      'Phone',
      'Country',
      'Enquiry Type',
      'Status',
      'Submitted At',
      'Message'
    ];

    const rows = enquiries.map((e) => [
      e.id,
      `"${(e.name || '').replace(/"/g, '""')}"`,
      `"${(e.company || '').replace(/"/g, '""')}"`,
      `"${(e.email || '').replace(/"/g, '""')}"`,
      `"${(e.phone || '').replace(/"/g, '""')}"`,
      `"${(e.country || '').replace(/"/g, '""')}"`,
      `"${(e.enquiryType || '').replace(/"/g, '""')}"`,
      e.status,
      e.createdAt,
      `"${(e.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `eCAS_Euro_Enquiries_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Available unique service categories from stats or fallback standard list
  const availableEnquiryTypes = useMemo(() => {
    const defaultTypes = [
      'Management System Certification',
      'Product Certification',
      'Inspection Services',
      'CBAM Verification',
      'ESG Verification',
      'Training & Academy',
      'General Enquiry'
    ];

    if (stats?.byEnquiryType && stats.byEnquiryType.length > 0) {
      const fromStats = stats.byEnquiryType.map((t) => t.enquiryType);
      return Array.from(new Set([...fromStats, ...defaultTypes]));
    }
    return defaultTypes;
  }, [stats]);

  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="space-y-5 font-['DM_Sans']">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
            <span>Admin</span>
            <span>&gt;</span>
            <span className="text-[#082046] font-semibold">Enquiries</span>
          </div>

          <h1 className="text-2xl font-bold text-[#082046] tracking-tight">
            Enquiries
          </h1>
          <p className="text-xs text-[#64748B]">
            Manage and respond to enquiries submitted through the ECAS EURO website.
          </p>
        </div>

        {/* Top Right Quick Search Bar */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search enquiries, emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all placeholder:text-[#94A3B8]"
          />
          <MagnifyingGlass
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
        </div>
      </div>

      {/* Compact Operational Summary Cards (Section 6) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Card */}
        <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-medium mb-1">
            <span>Total Enquiries</span>
            <EnvelopeSimple size={15} className="text-[#082046]" />
          </div>
          <p className="text-xl font-bold text-[#082046] tracking-tight">
            {stats ? stats.total : totalCount}
          </p>
        </div>

        {/* New Card */}
        <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-medium mb-1">
            <span>New</span>
            <span className="w-2 h-2 rounded-full bg-[#2E90FA]" />
          </div>
          <p className="text-xl font-bold text-[#175CD3] tracking-tight">
            {stats ? stats.new : '-'}
          </p>
        </div>

        {/* In Progress Card */}
        <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-medium mb-1">
            <span>In Progress</span>
            <span className="w-2 h-2 rounded-full bg-[#F79009]" />
          </div>
          <p className="text-xl font-bold text-[#C4320A] tracking-tight">
            {stats ? stats.inProgress : '-'}
          </p>
        </div>

        {/* Closed Card */}
        <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-medium mb-1">
            <span>Closed</span>
            <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
          </div>
          <p className="text-xl font-bold text-[#475467] tracking-tight">
            {stats ? stats.closed : '-'}
          </p>
        </div>

        {/* Last 24 Hours Card */}
        <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-medium mb-1">
            <span>Last 24 Hours</span>
            <Clock size={15} className="text-[#00607A]" />
          </div>
          <p className="text-xl font-bold text-[#00607A] tracking-tight">
            {stats ? stats.recentCount24h : '-'}
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Refresh, Export */}
      <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Main Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <input
            type="text"
            placeholder="Search by name, company, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all placeholder:text-[#94A3B8]"
          />
          <MagnifyingGlass
            size={15}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
        </div>

        {/* Right Controls: Filters & Actions */}
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
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Enquiry Type / Service Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-[#475467]">Service</label>
            <select
              value={enquiryTypeFilter}
              onChange={(e) => {
                setEnquiryTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] cursor-pointer max-w-[180px] truncate"
            >
              <option value="ALL">All Services</option>
              {availableEnquiryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => {
              loadEnquiries();
              loadStats();
            }}
            className="p-1.5 text-xs font-semibold text-[#475467] hover:text-[#082046] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-md transition-colors shadow-2xs cursor-pointer"
            title="Refresh Enquiries"
          >
            <ArrowClockwise size={15} />
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold text-[#082046] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-md transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Export CSV"
          >
            <DownloadSimple size={14} weight="bold" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WarningCircle size={16} weight="fill" className="text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={loadEnquiries}
            className="font-semibold underline hover:no-underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Data Table Surface */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475467] font-semibold select-none">
                {/* ID */}
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-3.5 cursor-pointer hover:bg-[#F1F5F9] transition-colors w-16"
                >
                  <div className="flex items-center gap-1">
                    <span>#</span>
                    {sortField === 'id' && (
                      sortDirection === 'ASC' ? <CaretUp size={12} /> : <CaretDown size={12} />
                    )}
                  </div>
                </th>

                {/* Name */}
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Name</span>
                    {sortField === 'name' && (
                      sortDirection === 'ASC' ? <CaretUp size={12} /> : <CaretDown size={12} />
                    )}
                  </div>
                </th>

                {/* Company */}
                <th
                  onClick={() => handleSort('company')}
                  className="py-3 px-4 cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Company</span>
                    {sortField === 'company' && (
                      sortDirection === 'ASC' ? <CaretUp size={12} /> : <CaretDown size={12} />
                    )}
                  </div>
                </th>

                {/* Email */}
                <th
                  onClick={() => handleSort('email')}
                  className="py-3 px-4 cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Email</span>
                    {sortField === 'email' && (
                      sortDirection === 'ASC' ? <CaretUp size={12} /> : <CaretDown size={12} />
                    )}
                  </div>
                </th>

                {/* Enquiry Type */}
                <th
                  onClick={() => handleSort('enquiry_type')}
                  className="py-3 px-4 cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Enquiry Type / Service</span>
                    {sortField === 'enquiry_type' && (
                      sortDirection === 'ASC' ? <CaretUp size={12} /> : <CaretDown size={12} />
                    )}
                  </div>
                </th>

                {/* Status */}
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    {sortField === 'status' && (
                      sortDirection === 'ASC' ? <CaretUp size={12} /> : <CaretDown size={12} />
                    )}
                  </div>
                </th>

                {/* Submitted */}
                <th
                  onClick={() => handleSort('created_at')}
                  className="py-3 px-4 cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Submitted</span>
                    {sortField === 'created_at' && (
                      sortDirection === 'ASC' ? <CaretUp size={12} /> : <CaretDown size={12} />
                    )}
                  </div>
                </th>

                {/* Actions */}
                <th className="py-3 px-4 text-right w-24">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E2E8F0]">
              {isLoading ? (
                // Skeleton loading state
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-3 px-3.5"><div className="h-4 bg-slate-100 rounded w-8" /></td>
                    <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-28" /></td>
                    <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                    <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-36" /></td>
                    <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-40" /></td>
                    <td className="py-3 px-4"><div className="h-5 bg-slate-100 rounded-md w-16" /></td>
                    <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                    <td className="py-3 px-4 text-right"><div className="h-6 bg-slate-100 rounded w-12 ml-auto" /></td>
                  </tr>
                ))
              ) : enquiries.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={8} className="py-12 px-4 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] mx-auto">
                        <ChatCircleDots size={20} />
                      </div>
                      <p className="text-sm font-bold text-[#082046]">No enquiries found</p>
                      <p className="text-xs text-[#64748B]">
                        {debouncedSearch || statusFilter !== 'ALL' || enquiryTypeFilter !== 'ALL'
                          ? 'No results match your active search and filter criteria.'
                          : 'Customer enquiries submitted via the public contact form will appear here.'}
                      </p>
                      {(debouncedSearch || statusFilter !== 'ALL' || enquiryTypeFilter !== 'ALL') && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setDebouncedSearch('');
                            setStatusFilter('ALL');
                            setEnquiryTypeFilter('ALL');
                            setCurrentPage(1);
                          }}
                          className="mt-2 text-xs font-semibold text-[#00607A] hover:underline cursor-pointer"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                // Enquiries list rows
                enquiries.map((enquiry) => {
                  const formattedDate = new Date(enquiry.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr
                      key={enquiry.id}
                      onClick={() => handleRowClick(enquiry)}
                      className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                    >
                      {/* ID */}
                      <td className="py-3 px-3.5 font-mono text-[11px] text-[#64748B] font-semibold">
                        ENQ-{enquiry.id}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-bold text-[#082046]">
                        {enquiry.name}
                      </td>

                      {/* Company */}
                      <td className="py-3 px-4 text-[#334155]">
                        {enquiry.company || <span className="text-[#94A3B8] italic">—</span>}
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-[#00607A] font-medium">
                        {enquiry.email}
                      </td>

                      {/* Enquiry Type */}
                      <td className="py-3 px-4 text-[#334155] font-medium">
                        {enquiry.enquiryType}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <EnquiryStatusPill status={enquiry.status} size="sm" />
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3 px-4 text-[#64748B] whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleRowClick(enquiry)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#082046] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded transition-colors inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span>
              Showing <span className="font-semibold text-[#1E293B]">{startRecord}</span> to{' '}
              <span className="font-semibold text-[#1E293B]">{endRecord}</span> of{' '}
              <span className="font-semibold text-[#1E293B]">{totalCount}</span> results
            </span>

            <span className="hidden sm:inline text-[#CBD5E1]">|</span>

            {/* Page Size Selector */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span>Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-[#CBD5E1] rounded px-1.5 py-0.5 text-xs text-[#1E293B] cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Pagination Navigation */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 bg-white border border-[#CBD5E1] rounded text-xs font-semibold text-[#1E293B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              Previous
            </button>

            <span className="px-2 font-medium text-[#1E293B]">
              Page {currentPage} of {Math.max(1, totalPages)}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 bg-white border border-[#CBD5E1] rounded text-xs font-semibold text-[#1E293B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      <EnquiryDetailModal
        enquiry={selectedEnquiry}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

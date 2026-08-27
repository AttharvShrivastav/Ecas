import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FloppyDisk,
  WarningCircle,
  CheckCircle,
  Calendar,
  Building,
  Certificate
} from '@phosphor-icons/react';
import {
  createAdminCertificate,
  updateAdminCertificate,
  fetchAdminCertificateById
} from '../../services/adminCertificateService';
import type {
  CertificateStatus,
  CreateCertificateInput,
  UpdateCertificateInput
} from '../../types/adminCertificate';

const STANDARD_OPTIONS = [
  'Iso 9001',
  'ISO 9001:2015',
  'ISO 14001:2015',
  'ISO 45001:2018',
  'ISO 22000:2018',
  'ISO 27001:2022',
  'ISO 50001:2018',
  'ISO 13485:2016',
  'ISO 37001:2016',
  'CBAM Verification',
  'CE Marking Compliance',
  'Integrated Management System (IMS)'
];

export const AdminCertificateFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [standard, setStandard] = useState('ISO 9001:2015');
  const [customStandard, setCustomStandard] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState<CertificateStatus>('Valid');
  const [address, setAddress] = useState('');
  const [otherAddress, setOtherAddress] = useState('');
  const [scope, setScope] = useState('');
  // Status & Validation
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // If in edit mode, fetch existing certificate details
  useEffect(() => {
    if (isEditMode && id) {
      const certId = parseInt(id, 10);
      if (isNaN(certId)) {
        setErrorMessage('Invalid certificate identifier');
        return;
      }

      setIsFetchingData(true);
      fetchAdminCertificateById(certId)
        .then((cert) => {
          setCompanyName(cert.company_name || '');
          if (STANDARD_OPTIONS.includes(cert.standard)) {
            setStandard(cert.standard);
          } else {
            setStandard('CUSTOM');
            setCustomStandard(cert.standard);
          }
          setCertificateNumber(cert.certificate_number || '');
          setIssueDate(cert.issue_date || '');
          setExpiryDate(cert.expiry_date || '');
          setStatus(cert.status || 'Valid');
          setAddress(cert.address || '');
          setOtherAddress(cert.other_address || '');
          setScope(cert.scope || '');
        })
        .catch((err) => {
          setErrorMessage(err.message || 'Failed to retrieve certificate data');
        })
        .finally(() => setIsFetchingData(false));
    } else {
      // Default dates for new certificates: today and 3 years ahead
      const today = new Date();
      const in3Years = new Date();
      in3Years.setFullYear(today.getFullYear() + 3);

      setIssueDate(today.toISOString().split('T')[0]);
      setExpiryDate(in3Years.toISOString().split('T')[0]);
    }
  }, [isEditMode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Client-side validations
    const finalStandard = standard === 'CUSTOM' ? customStandard.trim() : standard;

    if (!companyName.trim()) {
      setErrorMessage('Company Name is required.');
      return;
    }
    if (!finalStandard) {
      setErrorMessage('Standard is required.');
      return;
    }
    if (!certificateNumber.trim()) {
      setErrorMessage('Certificate Number is required.');
      return;
    }
    if (!issueDate) {
      setErrorMessage('Issue Date is required.');
      return;
    }
    if (!expiryDate) {
      setErrorMessage('Expiry Date is required.');
      return;
    }
    if (new Date(expiryDate) <= new Date(issueDate)) {
      setErrorMessage('Expiry Date must be later than the Issue Date.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Primary registered address is required.');
      return;
    }
    if (!scope.trim()) {
      setErrorMessage('Certified Scope or Product/s description is required.');
      return;
    }

    try {
      setIsLoading(true);

      if (isEditMode && id) {
        const certId = parseInt(id, 10);
        const updatePayload: UpdateCertificateInput = {
          companyName: companyName.trim(),
          standard: finalStandard,
          address: address.trim(),
          otherAddress: otherAddress.trim() || null,
          scope: scope.trim(),
          issueDate,
          expiryDate,
          status,
        };

        await updateAdminCertificate(certId, updatePayload);
        setSuccessMessage('Certificate updated successfully!');
      } else {
        const createPayload: CreateCertificateInput = {
          certificateNumber: certificateNumber.trim(),
          companyName: companyName.trim(),
          standard: finalStandard,
          address: address.trim(),
          otherAddress: otherAddress.trim() || null,
          scope: scope.trim(),
          issueDate,
          expiryDate,
          status,
        };

        await createAdminCertificate(createPayload);
        setSuccessMessage('Certificate created and registered successfully!');
      }

     navigate('/admin/certificates', { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Operation failed. Please verify input data.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#64748B] font-['DM_Sans']">
        <div className="w-8 h-8 border-3 border-[#082046] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs">Loading certificate record...</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 font-['DM_Sans']">
      {/* Top Header & Breadcrumbs */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
          <Link to="/admin/certificates" className="hover:text-[#082046] transition-colors">
            Certificates
          </Link>
          <span>&gt;</span>
          <Link to="/admin/certificates" className="hover:text-[#082046] transition-colors">
            Certificate Registry
          </Link>
          <span>&gt;</span>
          <span className="text-[#082046] font-semibold">
            {isEditMode ? 'Edit Certificate' : 'Add Certificate'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <div>
            <h1 className="text-2xl font-bold text-[#082046] tracking-tight">
              {isEditMode ? `Edit Certificate: ${certificateNumber}` : 'Add Certificate'}
            </h1>
            <p className="text-xs text-[#64748B]">
              {isEditMode
                ? 'Update registered certificate record and accreditation details'
                : 'Issue and register a new certification record in the ECAS EURO database'}
            </p>
          </div>

          <Link
            to="/admin/certificates"
            className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold text-[#475467] hover:text-[#082046] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <ArrowLeft size={14} />
            <span>Back to Registry</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center gap-2">
          <WarningCircle size={18} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle size={18} className="shrink-0" weight="fill" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-5 sm:p-6 lg:p-8 space-y-8">
        {/* Section 1: Certificate & Company Identification */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#082046]" />
              <h2 className="text-sm font-bold text-[#082046] uppercase tracking-wider">
                1. Identification & Standard
              </h2>
            </div>
            <span className="text-[11px] text-[#64748B]">Required fields marked with *</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
            {/* Sr. No. (ID Preview) */}
            <div className="sm:col-span-1 lg:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">Sr. No.</label>
              <input
                type="text"
                readOnly
                value={id || 'Auto-Assigned'}
                className="w-full text-xs px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#64748B] cursor-not-allowed font-medium"
              />
            </div>

            {/* Certificate Number */}
            <div className="sm:col-span-1 lg:col-span-3 space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Certificate Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                readOnly={isEditMode}
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                placeholder="e.g. IND/02/5362023"
                className={`w-full text-xs px-3 py-2 border border-[#CBD5E1] rounded-md text-[#1E293B] font-mono transition-all ${
                  isEditMode
                    ? 'bg-[#F8FAFC] text-[#64748B] cursor-not-allowed'
                    : 'bg-white focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046]'
                }`}
              />
            </div>

            {/* Company Name */}
            <div className="sm:col-span-2 lg:col-span-4 space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Ravi Engineers Private Limited"
                className="w-full text-xs px-3 py-2 bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all"
              />
            </div>

            {/* Status */}
            <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CertificateStatus)}
                className="w-full text-xs px-3 py-2 bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all cursor-pointer font-medium"
              >
                <option value="Valid">Valid</option>
                <option value="Suspended">Suspended</option>
                <option value="Expired">Expired</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            {/* Standard */}
            <div className="sm:col-span-2 lg:col-span-6 space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Certification Standard <span className="text-red-500">*</span>
              </label>
              <select
                value={standard}
                onChange={(e) => setStandard(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all cursor-pointer font-medium"
              >
                {STANDARD_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
                <option value="CUSTOM">+ Other Custom Standard...</option>
              </select>

              {standard === 'CUSTOM' && (
                <input
                  type="text"
                  placeholder="Enter custom certification standard"
                  value={customStandard}
                  onChange={(e) => setCustomStandard(e.target.value)}
                  className="w-full mt-2 text-xs px-3 py-2 bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:border-[#082046]"
                  required
                />
              )}
            </div>

          </div>
        </div>

        {/* Section 2: Audit Dates & Milestones */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
            <span className="w-2 h-2 rounded-full bg-[#082046]" />
            <h2 className="text-sm font-bold text-[#082046] uppercase tracking-wider">
              2. Lifecycle
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Issue Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all"
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all"
              />
            </div>

          </div>
        </div>

        {/* Section 3: Scope of Certification */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
            <span className="w-2 h-2 rounded-full bg-[#082046]" />
            <h2 className="text-sm font-bold text-[#082046] uppercase tracking-wider">
              3. Scope & Activities
            </h2>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#334155]">
              Scope or Product/s <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="e.g. Manufacture & Supply of Hot Dip Galvanized Bolts, Nuts, Step Bolts, Spring Washers, Pack Washers, Anti Climbing Devices, Special Bolts As Per Customer Requirements."
              className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all resize-y leading-relaxed"
            />
            <p className="text-[11px] text-[#64748B]">
              Provide complete operational boundaries, products, processes, or industry service definitions covered under this certificate.
            </p>
          </div>
        </div>

        {/* Section 4: Physical Operating Locations & Address */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
            <span className="w-2 h-2 rounded-full bg-[#082046]" />
            <h2 className="text-sm font-bold text-[#082046] uppercase tracking-wider">
              4. Certified Locations & Address
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Primary Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Primary / Registered Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Unit:-01: 179-183, Industrial Area, Focal Point, Amritsar, Punjab, India"
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all resize-y"
              />
            </div>

            {/* Other Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#334155]">
                Additional Site / Branch Office Address <span className="text-[#94A3B8] font-normal">(Optional)</span>
              </label>
              <textarea
                rows={3}
                value={otherAddress}
                onChange={(e) => setOtherAddress(e.target.value)}
                placeholder="Unit:-02: 426-C, Industrial Area, Focal Point, Amritsar, Punjab, India"
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-md text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#082046]/20 focus:border-[#082046] transition-all resize-y"
              />
            </div>
          </div>
        </div>

        {/* Bottom Form Action Buttons */}
        <div className="pt-5 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/certificates')}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2 text-xs font-medium text-[#475467] hover:text-[#082046] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-md transition-colors"
          >
            Cancel
          </button>

          <div className="w-full sm:w-auto flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-[#082046] hover:bg-[#0E2C5B] rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FloppyDisk size={15} weight="bold" />
              <span>{isLoading ? 'Saving Certificate...' : isEditMode ? 'Update Certificate' : 'Save Certificate'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

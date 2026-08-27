import type { CertificateRecord } from '../types/verification';
import { formatDisplayDate } from '../data/mockCertificates';


export function sanitizeCertificateFilename(certNumber: string): string {
  const sanitized = certNumber.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-');
  return `ECASEURO-Certificate-${sanitized}.pdf`;
}

export function generateCertificatePdf(record: CertificateRecord): void {
  // Generate sanitized title/filename
  const fileName = sanitizeCertificateFilename(record.certificateNumber);
  const verificationUrl = `${window.location.origin}/verify-certificate?cert_no=${encodeURIComponent(
    record.certificateNumber
  )}`;
  const verifiedAt = new Date().toUTCString();

  // Status visual colors
  const statusColorMap = {
    valid: {
      bg: '#F0FDF4',
      border: '#16A34A',
      text: '#15803D',
      label: 'VALID',
    },
    expired: {
      bg: '#FEF2F2',
      border: '#DC2626',
      text: '#B91C1C',
      label: 'EXPIRED',
    },
    suspended: {
      bg: '#FFFBEB',
      border: '#D97706',
      text: '#B45309',
      label: 'SUSPENDED',
    },
    revoked: {
      bg: '#FEF2F2',
      border: '#991B1B',
      text: '#991B1B',
      label: 'REVOKED',
    },
  };

  const statusStyle = statusColorMap[record.status] || statusColorMap.valid;

  // Build clean self-contained HTML document for printing
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${fileName.replace('.pdf', '')}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 16mm 18mm 16mm 18mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.5;
      font-size: 13px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .container {
      width: 100%;
      max-width: 760px;
      margin: 0 auto;
      padding: 0;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 2px solid #032e64;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      color: #032e64;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-subtitle {
      font-size: 10px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-top: 2px;
    }
    .doc-type {
      text-align: right;
    }
    .doc-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      color: #032e64;
      background-color: #f0f5fa;
      padding: 4px 10px;
      border-radius: 6px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .status-section {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .org-name {
      font-size: 18px;
      font-weight: 700;
      color: #082046;
      margin-bottom: 4px;
    }
    .cert-no-tag {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
    .cert-no-val {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 700;
      color: #082046;
    }
    .status-badge {
      border: 2px solid ${statusStyle.border};
      background-color: ${statusStyle.bg};
      color: ${statusStyle.text};
      padding: 8px 18px;
      border-radius: 10px;
      text-align: center;
      min-width: 130px;
    }
    .status-badge-val {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .status-badge-lbl {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      display: block;
      margin-top: 1px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #032e64;
      margin-bottom: 12px;
      padding-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      margin-bottom: 20px;
    }
    .field-card {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
    }
    .field-label {
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      margin-bottom: 3px;
    }
    .field-value {
      font-size: 13px;
      font-weight: 700;
      color: #082046;
    }
    .field-value-mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .scope-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 16px;
      font-size: 12.5px;
      color: #334155;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .authority-note {
      background-color: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 11px;
      color: #475569;
      margin-bottom: 24px;
    }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #64748b;
    }
    .url-line {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 9.5px;
      color: #032e64;
      margin-top: 2px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header-bar">
      <div>
        <div class="brand-title">ECASEURO</div>
        <div class="brand-subtitle">Quality Registrar & Conformity Assessment Services</div>
      </div>
      <div class="doc-type">
        <span class="doc-badge">Official Registry Record</span>
      </div>
    </div>

    <!-- Status & Main Identity -->
    <div class="status-section">
      <div>
        <div class="org-name">${record.organisationName}</div>
        <div class="cert-no-tag">Certificate No. <span class="cert-no-val">${record.certificateNumber}</span></div>
      </div>
      <div class="status-badge">
        <div class="status-badge-val">${statusStyle.label}</div>
        <span class="status-badge-lbl">Certificate Status</span>
      </div>
    </div>

    <!-- Details Section -->
    <div class="section-title">Certificate Information</div>
    <div class="grid-4">
      <div class="field-card">
        <div class="field-label">Standard</div>
        <div class="field-value">${record.standard}</div>
      </div>
      <div class="field-card">
        <div class="field-label">Certificate No.</div>
        <div class="field-value field-value-mono">${record.certificateNumber}</div>
      </div>
      <div class="field-card">
        <div class="field-label">Issue Date</div>
        <div class="field-value">${formatDisplayDate(record.issueDate)}</div>
      </div>
      <div class="field-card">
        <div class="field-label">Expiry Date</div>
        <div class="field-value" style="${record.status === 'expired' ? 'color: #dc2626;' : ''}">${formatDisplayDate(record.expiryDate)}</div>
      </div>
    </div>

    <!-- Organisation Section -->
    <div class="section-title">Certified Organisation</div>
    <div class="grid-2">
      <div class="field-card">
        <div class="field-label">Legal Entity Name</div>
        <div class="field-value">${record.organisationName}</div>
      </div>
      <div class="field-card">
        <div class="field-label">Registered Facility Address</div>
        <div class="field-value" style="font-weight: 500; font-size: 12px; line-height: 1.4;">${record.organisationAddress}</div>
      </div>
    </div>

    <!-- Scope Section -->
    <div class="section-title">Certified Scope & Activities</div>
    <div class="scope-box">
      ${record.scope}
    </div>

    <!-- Registrar Accreditation Note -->
    ${
      record.accreditationBody
        ? `<div class="authority-note">
            Accredited Registrar Authority: <strong>${record.accreditationBody}</strong>
          </div>`
        : ''
    }

    <!-- Verification Metadata Footer -->
    <div class="footer">
      <div>
        <div>Generated from official ECASEURO online verification register.</div>
        <div class="url-line">${verificationUrl}</div>
      </div>
      <div style="text-align: right;">
        <div>Verified: ${verifiedAt}</div>
        <div>Registry Database Record</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 250);
    };
  </script>
</body>
</html>
`;

  // Open clean dedicated print window for instant, isolated PDF generation
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    // Fallback if popup blocker intercepts: create hidden iframe to trigger print
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 300);
    }
  }
}

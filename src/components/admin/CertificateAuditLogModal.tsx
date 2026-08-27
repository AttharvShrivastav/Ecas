// import React, { useEffect, useState } from 'react';
// import {
//   X,
//   ClockCounterClockwise,
//   User,
//   Calendar,
//   Tag,
//   ArrowRight
// } from '@phosphor-icons/react';
// import { fetchCertificateAuditLogs } from '../../services/adminCertificateService';
// import type { DbCertificate, CertificateAuditLog } from '../../types/adminCertificate';

// interface CertificateAuditLogModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   certificate: DbCertificate | null;
// }

// export const CertificateAuditLogModal: React.FC<CertificateAuditLogModalProps> = ({
//   isOpen,
//   onClose,
//   certificate
// }) => {
//   const [logs, setLogs] = useState<CertificateAuditLog[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (isOpen && certificate) {
//       setIsLoading(true);
//       setError(null);
//       fetchCertificateAuditLogs(certificate.id)
//         .then((data) => setLogs(data))
//         .catch((err) => setError(err.message || 'Failed to load audit history'))
//         .finally(() => setIsLoading(false));
//     }
//   }, [isOpen, certificate]);

//   if (!isOpen || !certificate) return null;

//   const getActionBadge = (action: string) => {
//     switch (action) {
//       case 'CREATE':
//       case 'IMPORT':
//         return 'bg-emerald-50 text-emerald-700 border-emerald-200';
//       case 'UPDATE':
//         return 'bg-blue-50 text-blue-700 border-blue-200';
//       case 'SUSPEND':
//         return 'bg-amber-50 text-amber-700 border-amber-200';
//       case 'REACTIVATE':
//         return 'bg-emerald-50 text-emerald-700 border-emerald-200';
//       case 'WITHDRAW':
//       case 'DELETE':
//         return 'bg-red-50 text-red-700 border-red-200';
//       default:
//         return 'bg-slate-50 text-slate-700 border-slate-200';
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div
//         className="fixed inset-0 bg-[#082046]/40 backdrop-blur-sm transition-opacity"
//         onClick={onClose}
//         aria-hidden="true"
//       />

//       <div className="relative bg-white rounded-lg shadow-xl border border-[#E2E8F0] max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden z-10 font-['DM_Sans']">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-md bg-white border border-[#E2E8F0] flex items-center justify-center text-[#082046] shadow-xs">
//               <ClockCounterClockwise size={20} weight="bold" />
//             </div>
//             <div>
//               <h3 className="text-base font-bold text-[#082046]">System Audit Trail</h3>
//               <p className="text-xs text-[#64748B]">
//                 Certificate <span className="font-mono font-semibold text-[#082046]">{certificate.certificate_number}</span> &bull; {certificate.company_name}
//               </p>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={onClose}
//             className="p-1.5 text-[#64748B] hover:text-[#082046] hover:bg-[#E2E8F0] rounded-md transition-colors"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 overflow-y-auto flex-1 space-y-4">
//           {isLoading ? (
//             <div className="py-12 flex flex-col items-center justify-center text-[#64748B] gap-2">
//               <div className="w-6 h-6 border-2 border-[#082046] border-t-transparent rounded-full animate-spin" />
//               <span className="text-xs">Loading audit trail entries...</span>
//             </div>
//           ) : error ? (
//             <div className="p-4 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
//               {error}
//             </div>
//           ) : logs.length === 0 ? (
//             <div className="py-12 text-center text-xs text-[#64748B]">
//               No audit log entries recorded yet for this certificate.
//             </div>
//           ) : (
//             <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
//               {logs.map((log) => (
//                 <div key={log.id} className="relative group">
//                   {/* Timeline dot */}
//                   <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-white border-2 border-[#082046] group-hover:scale-110 transition-transform" />

//                   <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-2 hover:border-[#CBD5E1] transition-colors">
//                     <div className="flex flex-wrap items-center justify-between gap-2">
//                       <div className="flex items-center gap-2">
//                         <span
//                           className={`px-2 py-0.5 text-[11px] font-bold rounded border uppercase tracking-wider ${getActionBadge(
//                             log.action
//                           )}`}
//                         >
//                           {log.action}
//                         </span>
//                         <span className="text-xs font-semibold text-[#082046]">
//                           {log.performed_by}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
//                         <Calendar size={13} />
//                         <span>{log.performed_at}</span>
//                       </div>
//                     </div>

//                     {log.notes && (
//                       <p className="text-xs text-[#334155] bg-white p-2 rounded border border-[#E2E8F0]">
//                         <span className="font-semibold text-[#64748B]">Reason/Notes: </span>
//                         {log.notes}
//                       </p>
//                     )}

//                     {/* Diff Preview if available */}
//                     {log.new_values && (
//                       <div className="text-[11px] text-[#64748B] pt-1">
//                         <details className="cursor-pointer">
//                           <summary className="font-medium text-[#082046] hover:underline">
//                             View snapshot payload
//                           </summary>
//                           <pre className="mt-1.5 p-2 bg-slate-900 text-slate-200 rounded text-[10px] overflow-x-auto font-mono">
//                             {(() => {
//                               try {
//                                 return JSON.stringify(JSON.parse(log.new_values), null, 2);
//                               } catch {
//                                 return log.new_values;
//                               }
//                             })()}
//                           </pre>
//                         </details>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-1.5 text-xs font-medium text-[#475467] hover:text-[#082046] bg-white hover:bg-[#F1F5F9] rounded-md border border-[#CBD5E1] transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

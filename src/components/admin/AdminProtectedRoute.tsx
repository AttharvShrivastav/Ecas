import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '../../lib/auth-client';
import { CircleNotch } from '@phosphor-icons/react';

export const AdminProtectedRoute: React.FC = () => {
  const { data: session, isPending } = useSession();
  const location = useLocation();

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-['DM_Sans'] text-[#1E293B]">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center">
            <CircleNotch size={24} className="text-[#082046] animate-spin" weight="bold" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#082046]">ECAS EURO Admin Portal</h2>
            <p className="text-xs text-[#64748B] mt-1">Verifying administrative credentials & security session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session || !session.user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

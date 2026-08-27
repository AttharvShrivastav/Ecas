export type AdminAccountStatus = 'Active' | 'Disabled';

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  status: AdminAccountStatus;
  role: string;
  emailVerified: boolean;
  createdAt: string | number;
  updatedAt: string | number;
  lastActiveAt?: string | number | null;

  /**
   * Protected founder account.
   * Used by UI to display the Primary badge.
   */
  isPrimary?: boolean;
}

export interface AdminAccountStats {
  total: number;
  active: number;
  disabled: number;
}

export interface ProvisionAdminInput {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  status?: AdminAccountStatus;
}

export interface UpdateAdminInput {
  name: string;
  email: string;
  status?: AdminAccountStatus;
}

export interface ResetPasswordInput {
  newPassword: string;
  confirmPassword: string;
}

export interface AdminAccountsResponse {
  success: boolean;
  data: AdminAccount[];
  stats: AdminAccountStats;
  total: number;
}

export interface AdminAccountSingleResponse {
  success: boolean;
  message?: string;
  data: AdminAccount;
}
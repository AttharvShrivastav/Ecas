import type {
  AdminAccount,
  AdminAccountStats,
  AdminAccountsResponse,
  AdminAccountSingleResponse,
  ProvisionAdminInput,
  UpdateAdminInput,
  ResetPasswordInput
} from '../types/adminAccount';

/**
 * Fetch all administrator accounts with optional search and status filters
 */
export async function fetchAdminAccounts(params?: {
  search?: string;
  status?: string;
}): Promise<{ accounts: AdminAccount[]; stats: AdminAccountStats; total: number }> {
  const query = new URLSearchParams();
  if (params?.search && params.search.trim()) {
    query.set('search', params.search.trim());
  }
  if (params?.status && params.status !== 'All') {
    query.set('status', params.status);
  }

  const url = `/api/admin/accounts${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url);

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.error?.message || `Failed to fetch administrator accounts (${res.status})`);
  }

  const json: AdminAccountsResponse = await res.json();
  return {
    accounts: json.data || [],
    stats: json.stats || { total: 0, active: 0, disabled: 0 },
    total: json.total || 0
  };
}

/**
 * Fetch a single administrator account by ID
 */
export async function fetchAdminAccountById(id: string): Promise<AdminAccount> {
  const res = await fetch(`/api/admin/accounts/${encodeURIComponent(id)}`);
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.error?.message || `Administrator account not found (${res.status})`);
  }

  const json: AdminAccountSingleResponse = await res.json();
  if (!json.success || !json.data) {
    throw new Error('Administrator account data is missing.');
  }
  return json.data;
}

/**
 * Provision a new administrator account
 */
export async function provisionAdminAccountApi(
  data: ProvisionAdminInput
): Promise<AdminAccount> {
  const res = await fetch('/api/admin/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.error?.message || `Failed to provision administrator account (${res.status})`);
  }

  const json: AdminAccountSingleResponse = await res.json();
  if (!json.success || !json.data) {
    throw new Error('Administrator account provision failed.');
  }
  return json.data;
}

/**
 * Update an existing administrator account (Name, Email, Status)
 */
export async function updateAdminAccountApi(
  id: string,
  data: UpdateAdminInput
): Promise<AdminAccount> {
  const res = await fetch(`/api/admin/accounts/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.error?.message || `Failed to update administrator account (${res.status})`);
  }

  const json: AdminAccountSingleResponse = await res.json();
  if (!json.success || !json.data) {
    throw new Error('Administrator account update failed.');
  }
  return json.data;
}

/**
 * Disable an administrator account
 */
export async function disableAdminAccountApi(id: string): Promise<AdminAccount> {
  const res = await fetch(`/api/admin/accounts/${encodeURIComponent(id)}/disable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.error?.message || `Failed to disable administrator account (${res.status})`);
  }

  const json: AdminAccountSingleResponse = await res.json();
  return json.data;
}

/**
 * Enable an administrator account
 */
export async function enableAdminAccountApi(id: string): Promise<AdminAccount> {
  const res = await fetch(`/api/admin/accounts/${encodeURIComponent(id)}/enable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.error?.message || `Failed to enable administrator account (${res.status})`);
  }

  const json: AdminAccountSingleResponse = await res.json();
  return json.data;
}

/**
 * Reset administrator account password
 */
export async function resetAdminPasswordApi(
  id: string,
  data: ResetPasswordInput
): Promise<void> {
  const res = await fetch(`/api/admin/accounts/${encodeURIComponent(id)}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.error?.message || `Failed to reset password (${res.status})`);
  }
}

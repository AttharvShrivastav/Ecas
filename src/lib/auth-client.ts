import { createAuthClient } from 'better-auth/react';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
}

export interface AdminSession {
  id: string;
  userId: string;
  expiresAt: string | number | Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface SessionData {
  user: AdminUser;
  session: AdminSession;
}

export const authClient = createAuthClient();

export const { signIn, signOut } = authClient;

export function useSession(): {
  data: SessionData | null;
  isPending: boolean;
  error: any;
  refetch: () => Promise<void>;
} {
  const sessionResult = (authClient as any).useSession();
  return {
    data: (sessionResult?.data || null) as SessionData | null,
    isPending: Boolean(sessionResult?.isPending),
    error: sessionResult?.error || null,
    refetch: sessionResult?.refetch || (async () => {})
  };
}

export const getSession = authClient.getSession;


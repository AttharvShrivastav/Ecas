import { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth/auth';
import { getSqliteDatabase } from '../db/database';

/**
 * Middleware that verifies the active Better Auth session.
 * Protects all administrative API endpoints (/api/admin/*).
 */
export async function requireAdminSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });

    if (!session || !session.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.'
        }
      });
      return;
    }

    // Verify user is not disabled in database
    const db = getSqliteDatabase();
    const userRow = db.prepare('SELECT id, status, role FROM user WHERE id = ?').get(session.user.id) as { id: string; status?: string; role?: string } | undefined;

    if (userRow && userRow.status === 'Disabled') {
      res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_DISABLED',
          message: 'This administrator account has been disabled. Access is revoked.'
        }
      });
      return;
    }

    // Attach user and session to the express request
    (req as any).session = session;
    (req as any).user = {
      ...session.user,
      status: userRow?.status || 'Active',
      role: userRow?.role || 'admin'
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required.'
      }
    });
  }
}

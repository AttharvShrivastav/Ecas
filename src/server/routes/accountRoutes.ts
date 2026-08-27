import { Router, Request, Response } from 'express';
import {
  listAdminAccounts,
  getAdminAccountById,
  provisionAdminAccount,
  updateAdminAccount,
  disableAdminAccount,
  enableAdminAccount,
  resetAdminPassword
} from '../services/accountService';

export const adminAccountRouter = Router();

/**
 * GET /api/admin/accounts
 * Lists all administrator accounts with status filtering and search.
 */
adminAccountRouter.get('/', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;

    const result = await listAdminAccounts({ search, status });

    res.json({
      success: true,
      data: result.accounts,
      stats: result.stats,
      total: result.accounts.length
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message || 'Failed to list administrator accounts.' }
    });
  }
});

/**
 * GET /api/admin/accounts/stats
 * Summary statistics for administrator accounts.
 */
adminAccountRouter.get('/stats', async (_req: Request, res: Response) => {
  try {
    const result = await listAdminAccounts();
    res.json({
      success: true,
      stats: result.stats
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message || 'Failed to get administrator stats.' }
    });
  }
});

/**
 * GET /api/admin/accounts/:id
 * Retrieves a single administrator account by ID.
 */
adminAccountRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Administrator account ID is required.' }
      });
      return;
    }

    const account = await getAdminAccountById(id);
    if (!account) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Administrator account with ID "${id}" was not found.` }
      });
      return;
    }

    res.json({
      success: true,
      data: account
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message || 'Failed to retrieve administrator account.' }
    });
  }
});

/**
 * POST /api/admin/accounts
 * Provisions a new administrator account.
 */
adminAccountRouter.post('/', async (req: Request, res: Response) => {
  try {
    const actor = (req as any).user;
    const { name, email, password, confirmPassword, status } = req.body || {};

    const created = await provisionAdminAccount(
      {
        name,
        email,
        password,
        confirmPassword,
        status
      },
      actor ? { id: actor.id, email: actor.email } : undefined
    );

    res.status(201).json({
      success: true,
      message: 'Administrator account provisioned successfully.',
      data: created
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: {
        code: 'PROVISION_FAILED',
        message: err.message || 'Unable to provision administrator account. Please check your submission.'
      }
    });
  }
});

/**
 * PUT /api/admin/accounts/:id
 * Updates an administrator account's details (Name, Email, Status).
 */
adminAccountRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const actor = (req as any).user;

    if (!actor) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' }
      });
      return;
    }

    const { name, email, status } = req.body || {};

    const updated = await updateAdminAccount(
      id,
      { name, email, status },
      { id: actor.id, email: actor.email }
    );

    res.json({
      success: true,
      message: 'Administrator account updated successfully.',
      data: updated
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message: err.message || 'Failed to update administrator account.'
      }
    });
  }
});

/**
 * POST /api/admin/accounts/:id/disable
 * Disables an administrator account and revokes active sessions.
 */
adminAccountRouter.post('/:id/disable', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const actor = (req as any).user;

    if (!actor) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' }
      });
      return;
    }

    const disabled = await disableAdminAccount(id, {
      id: actor.id,
      email: actor.email
    });

    res.json({
      success: true,
      message: 'Administrator account disabled successfully. Active sessions revoked.',
      data: disabled
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: {
        code: 'DISABLE_FAILED',
        message: err.message || 'Failed to disable administrator account.'
      }
    });
  }
});

/**
 * POST /api/admin/accounts/:id/enable
 * Re-enables an administrator account.
 */
adminAccountRouter.post('/:id/enable', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const actor = (req as any).user;

    if (!actor) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' }
      });
      return;
    }

    const enabled = await enableAdminAccount(id, {
      id: actor.id,
      email: actor.email
    });

    res.json({
      success: true,
      message: 'Administrator account re-enabled successfully.',
      data: enabled
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: {
        code: 'ENABLE_FAILED',
        message: err.message || 'Failed to enable administrator account.'
      }
    });
  }
});

/**
 * POST /api/admin/accounts/:id/reset-password
 * Resets an administrator's password and revokes existing sessions.
 */
adminAccountRouter.post('/:id/reset-password', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const actor = (req as any).user;

    if (!actor) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' }
      });
      return;
    }

    const { newPassword, confirmPassword } = req.body || {};

    await resetAdminPassword(
      id,
      { newPassword, confirmPassword },
      { id: actor.id, email: actor.email }
    );

    res.json({
      success: true,
      message: 'Administrator password reset successfully. Active sessions have been revoked.'
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: {
        code: 'PASSWORD_RESET_FAILED',
        message: err.message || 'Failed to reset administrator password.'
      }
    });
  }
});

import path from 'path';

const cwd = process.cwd();

function readPathEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? path.resolve(value) : undefined;
}

/**
 * Central source of truth for runtime-persistent storage.
 *
 * Local development falls back to project-relative paths.
 * Production should set DATABASE_PATH and UPLOADS_DIR to directories
 * outside the versioned deployment folder.
 */
export const DATABASE_FILE =
  readPathEnv('DATABASE_PATH') ||
  path.resolve(cwd, 'data', 'ecaseuro.db');

export const DATABASE_DIR = path.dirname(DATABASE_FILE);

export const UPLOADS_DIR =
  readPathEnv('UPLOADS_DIR') ||
  path.resolve(cwd, 'public', 'uploads');

export const CMS_UPLOAD_DIR = path.join(UPLOADS_DIR, 'cms');

export const HAS_EXPLICIT_DATABASE_PATH = Boolean(
  process.env.DATABASE_PATH?.trim()
);

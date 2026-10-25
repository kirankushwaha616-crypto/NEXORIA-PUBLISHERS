import { Request, Response, NextFunction } from 'express';
import { CONFIG } from './config.ts';

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyAGvVMs8K6ggKjaQmzc9lIjCZYvtjodKIE";
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "daystory-8a10a";

// Default authorized admins list (can be overridden via environment variables)
const DEFAULT_AUTHORIZED_EMAILS = [
  'kirankushwaha616@gmail.com'
];

export interface AuthenticatedAdmin {
  uid: string;
  email: string;
  emailVerified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      adminUser?: AuthenticatedAdmin;
    }
  }
}

/**
 * Verify Firebase ID Token using Google Identity Toolkit REST API
 */
export async function verifyFirebaseToken(idToken: string): Promise<AuthenticatedAdmin | null> {
  if (!idToken || typeof idToken !== 'string') return null;

  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const message = errData?.error?.message || '';
      if (message.includes('TOKEN_EXPIRED')) {
        throw new Error('TOKEN_EXPIRED');
      }
      return null;
    }

    const data = await res.json();
    const user = data?.users?.[0];
    if (!user || !user.localId) {
      return null;
    }

    return {
      uid: user.localId,
      email: (user.email || '').toLowerCase(),
      emailVerified: Boolean(user.emailVerified)
    };
  } catch (err: any) {
    if (err?.message === 'TOKEN_EXPIRED') {
      throw err;
    }
    console.error('[FirebaseAuth] Verification error:', err?.message || err);
    return null;
  }
}

/**
 * Check if the verified user UID or email is an authorized administrator
 */
export function isAuthorizedAdmin(user: AuthenticatedAdmin): boolean {
  if (!user || !user.email) return false;

  const envEmails = process.env.ADMIN_AUTHORIZED_EMAILS
    ? process.env.ADMIN_AUTHORIZED_EMAILS.split(',').map(e => e.trim().toLowerCase())
    : [];
  const authorizedEmails = new Set([...DEFAULT_AUTHORIZED_EMAILS.map(e => e.toLowerCase()), ...envEmails]);

  if (authorizedEmails.has(user.email.toLowerCase())) {
    return true;
  }

  const envUids = process.env.ADMIN_AUTHORIZED_UIDS
    ? process.env.ADMIN_AUTHORIZED_UIDS.split(',').map(u => u.trim())
    : [];
  if (envUids.includes(user.uid)) {
    return true;
  }

  return false;
}

/**
 * Express middleware to strictly require Firebase authenticated & authorized administrator
 */
export async function requireFirebaseAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access Denied.' });
  }

  const token = authHeader.slice(7).trim();

  // Support developer secret key for backend server utilities
  if (CONFIG.ADMIN_SECRET_KEY && token === CONFIG.ADMIN_SECRET_KEY) {
    req.adminUser = {
      uid: 'superadmin_console',
      email: 'kirankushwaha616@gmail.com',
      emailVerified: true
    };
    return next();
  }

  try {
    const verifiedUser = await verifyFirebaseToken(token);

    if (!verifiedUser) {
      return res.status(401).json({ error: 'Access Denied.' });
    }

    if (!isAuthorizedAdmin(verifiedUser)) {
      console.warn(`[FirebaseAuth] Unauthorized login attempt by: ${verifiedUser.email} (UID: ${verifiedUser.uid})`);
      return res.status(403).json({ error: 'Access Denied.' });
    }

    req.adminUser = verifiedUser;
    next();
  } catch (err: any) {
    if (err?.message === 'TOKEN_EXPIRED') {
      return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    }
    return res.status(401).json({ error: 'Access Denied.' });
  }
}

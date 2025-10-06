import { Request } from 'express';

/**
 * Extend Express Request interface to include user property
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: 'admin' | 'student' | null;
      };
    }
  }
}

export {};

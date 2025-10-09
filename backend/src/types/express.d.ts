import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

/**
 * Extend Express Request interface to include user property
 */
declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload ;
    }
  }
}

export {};

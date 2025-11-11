import 'express';

declare global {
  namespace Express {
    // Ajuste os campos conforme seu payload de auth/JWT
    interface UserPayload {
      id: number | string;
      email?: string;
      role?: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};

import { Request } from 'express';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request extends Request {
      user?: TokenPayload;
    }
  }
}

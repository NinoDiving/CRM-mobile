import { Request } from 'express';
import { JwtPayload } from '../jwt/payload';

export enum UserRole {
  ADMIN = 'admin',
  COMMERCIAL = 'commercial',
}

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}

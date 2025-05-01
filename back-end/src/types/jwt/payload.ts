import { UserRole } from '../employee/employee';

export type JwtPayload = {
  id: string;
  email: string;
  role: UserRole;
};

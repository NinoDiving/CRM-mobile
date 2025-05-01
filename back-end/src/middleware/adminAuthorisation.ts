import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';
import { VerifyToken } from './verifyToken';
import { RequestWithUser, UserRole } from 'src/types/employee/employee';

@Injectable()
export class AdminAuthorisation extends VerifyToken {
  constructor(jwtService: JwtService) {
    super(jwtService);
  }

  use(req: RequestWithUser, res: Response, next: NextFunction) {
    super.use(req, res, () => {
      if (!req.user) {
        throw new UnauthorizedException('Utilisateur non authentifié');
      }
      const isAdmin = req.user.role === UserRole.ADMIN;

      if (!isAdmin) {
        throw new UnauthorizedException(
          "Vous n'êtes pas autorisé à accéder à cette ressource",
        );
      }

      next();
    });
  }
}

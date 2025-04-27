import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

type JwtPayload = {
  id: string;
  email: string;
  lastname: string;
  firstname: string;
  role: string;
};

// Déclarer l'extension de Request pour les cookies

interface RequestWithToken extends Request {
  cookies: {
    token?: string;
  };
  user?: JwtPayload;
}

@Injectable()
export class VerifyToken implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: RequestWithToken, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.token;

      if (!token) {
        throw new UnauthorizedException('Token non fourni');
      }

      const decoded = this.jwtService.verify<JwtPayload>(token);
      req.user = decoded;

      next();
    } catch (error) {
      throw new UnauthorizedException('Token invalide', { cause: error });
    }
  }
}

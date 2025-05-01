import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';
import { JwtPayload } from 'src/types/jwt/payload';
import { RequestWithUser } from 'src/types/employee/employee';

@Injectable()
export class VerifyToken implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Token non fourni');
      }

      const token = authHeader.split(' ')[1];
      const decoded = this.jwtService.verify<JwtPayload>(token);

      req.user = decoded;

      next();
    } catch (error) {
      console.log('Token error:', error);
      throw new UnauthorizedException('Token invalide');
    }
  }
}

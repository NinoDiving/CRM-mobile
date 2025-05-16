import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: any; // You can replace 'any' with your user type if you have one
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Token manquant',
        error: 'Unauthorized',
      });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Format de token invalide',
        error: 'Unauthorized',
      });
    }

    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser(token);

      if (error) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Token invalide',
          error: 'Unauthorized',
        });
      }

      if (!user) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Utilisateur non trouvé',
          error: 'Unauthorized',
        });
      }

      request.user = user;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException({
        statusCode: 401,
        message: "Erreur d'authentification",
        error: 'Unauthorized',
      });
    }
  }
}

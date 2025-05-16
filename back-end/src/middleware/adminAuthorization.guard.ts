import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { Request } from 'express';

interface UserMetadata {
  role: string;
  email: string;
  lastname: string;
  firstname: string;
  email_verified: boolean;
  phone_verified: boolean;
}

interface RequestWithUser extends Request {
  user: User & { user_metadata: UserMetadata };
}

@Injectable()
export class AdminAuthorizationGuard implements CanActivate {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException({
        statusCode: 403,
        message: 'Utilisateur non authentifié',
        error: 'Forbidden',
      });
    }

    const userRole = user.user_metadata.role;

    if (!userRole || userRole !== 'admin') {
      throw new UnauthorizedException({
        statusCode: 403,
        message: 'Accès non autorisé. Rôle admin requis.',
        error: 'Forbidden',
      });
    }

    return Promise.resolve(true);
  }
}

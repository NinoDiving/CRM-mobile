import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport/dist/passport/passport.strategy';

import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: {
    id: string;
    email: string;
    lastname: string;
    firstname: string;
    role: string;
  }) {
    return {
      id: payload.id,
      email: payload.email,
      lastname: payload.lastname,
      firstname: payload.firstname,
      role: payload.role,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { TokenJwt } from '../models/tokenJwt.model';
import { CookieParam } from '../utils/CookieParam.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return request?.cookies?.[CookieParam.accessTokenName]; // Extract from 'jwt' cookie
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_TOKEN_KEY!,
    });
  }

  async validate(payload: TokenJwt) {
    //----> Send back the response.
    const user = await this.authService.getUserByEmail(payload.email);

    //----> Return the tokenJwt
    return this.authService.makeTokenJwt(user);
  }
}

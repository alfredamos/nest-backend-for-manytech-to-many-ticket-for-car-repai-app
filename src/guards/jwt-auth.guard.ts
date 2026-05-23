import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { CookieParam } from '../utils/CookieParam.util';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    //----> Get the request object.
    const req: Request = context.switchToHttp().getRequest<Request>(); //----> Retrieve all objects on request object.

    //----> Retrieve the token from the cookie on headers.
    const token = req?.cookies?.[CookieParam.accessTokenName];

    //----> Check for empty token.
    if (!token) {
      throw new UnauthorizedException(
        'Authentication token not found in cookies.',
      );
    }

    //----> Check for a valid user session.
    const session = await this.authService.getUserSession(req);

    //----> Valid token
    return session.isLoggedIn;
  }
}

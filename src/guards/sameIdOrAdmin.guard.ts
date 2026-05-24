import {
  CanActivate,
  ExecutionContext,
  ForbiddenException, Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from '../generated/prisma/enums';
import { AuthService } from '../auth/auth.service';
import {CookieParam} from "../utils/CookieParam.util";

@Injectable()
export class SameIdOrAdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService){}
  async canActivate(context: ExecutionContext) {
    //----> Get the request object.
    const req: Request = context.switchToHttp().getRequest<Request>(); //----> Retrieve all objects on request object.

    //----> Retrieve the token from the cookie on headers.
    const token = req?.cookies?.[CookieParam.accessTokenName];

    //----> get the user id from param.
    const session = await this.authService?.getUserSessionByToken(token);
    const userIdFromParam = req.params?.id as string;

    //----> Get the user id from the user object on a request object.
    const userIdFromContext = session?.id;
    const role = session?.role;

    //----> Check for the same user via equality of the two user-ids.
    const sameUser = this.isSameUser(userIdFromContext, userIdFromParam);

    //----> Check for admin privilege.
    const isAdmin = role === Role.Admin;
    if (!sameUser && !isAdmin) {
      throw new ForbiddenException(
        "You don't have permission to view or perform this action!",
      );
    }

    //----> different user and not admin.
    return true;
  }

  private isSameUser(userIdOne: string, userIdTwo: string) {
    return userIdOne?.normalize() === userIdTwo?.normalize();
  }
}

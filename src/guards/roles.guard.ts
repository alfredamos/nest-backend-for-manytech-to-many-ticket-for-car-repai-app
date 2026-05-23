/* eslint-disable prettier/prettier */
import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from '../generated/prisma/enums';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getClass(),
      context.getHandler(),
    ]);

    //----> Public resources.
    if (isPublic) return true;

    //----> Get the role of the user.
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    //----> Check for the existence of a role.
    if (!roles) return false;

    //----> Get the request object.
    const request : Request = context.switchToHttp().getRequest();

    //----> Get the role from session.
    const parsedToken = await this.authService.getUserSession(request);
    const tokenJwt = {id: parsedToken.id, email: parsedToken.email, name: parsedToken.name, role: parsedToken.role};

    if (!tokenJwt){
      throw new UnauthorizedException('Invalid or expired token.');
    }

    //----> Check if the user has the right role.
    const correctRole = this.matchRoles(roles, tokenJwt.role);

    //----> Wrong role.
    if (!correctRole) {
      throw new ForbiddenException('You are not permitted to view or perform this action.');
    }

    //----> Check if the roles match those who are permitted to view or use the available resources.
    return correctRole;
  }

  matchRoles(roles: string[], role: Role): boolean {
    return roles.includes(role); //----> Check that a role is one of the valid ones accepted.
  }
}

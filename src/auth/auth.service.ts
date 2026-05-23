import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import {ChangeUserPasswordDto} from './dto/change-user-password.dto';
import {PrismaService} from '../prisma/prisma.service';
import {ResponseMessage} from '../utils/responseMessage.util';
import {StatusCodes} from 'http-status-codes';
import {ChangeUserRoleDto} from './dto/change-user-role.dto';
import {EditUserProfileDto} from './dto/edit-user-profile.dto';
import {fromEditUserToUser} from '../utils/fromEditUserToUser';
import {SignupUserDto} from './dto/signupUserDto';
import {fromSignupToUser} from '../utils/fromSignupToUser.util';
import {LoginUserDto} from './dto/loginUserDto';
import {TokenJwt} from '../models/tokenJwt.model';
import {JwtService} from '@nestjs/jwt';
import {emptyJwtPayload} from '../utils/emptyJwtPayload.util';
import {JwtPayload} from '../models/jwtPayload.model';
import {Role, TokenType, User} from "../generated/prisma/client";
import {TokenUncheckedCreateInput} from "../generated/prisma/models/Token";
import {CookieParam} from "../utils/CookieParam.util";
import {UserSession} from "../models/UserSession.model";
import {emptyUserSession} from "../utils/emptyUserSession.util";
import {fromUserToUserDto} from "./dto/user.dto";
import {TokensService} from "../tokens/tokens.service";

@Injectable()
export class AuthService {
  constructor(
      private readonly prisma: PrismaService,
      private readonly jwtService: JwtService,
      private readonly tokenService: TokensService,
  ) {
  }

  async changeUserPassword(request: ChangeUserPasswordDto) {
    //----> Check for password match.
    if (this.passwordNotMatch(request.confirmPassword, request.newPassword)) {
      throw new BadRequestException('Passwords do not match.');
    }

    //----> Check for existence of user.
    const user = await this.getUserByEmail(request.email);

    //----> Check for valid password.
    if (await this.passwordNotValid(request.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Hash new password.
    const hashedPassword = await this.hashPassword(request.newPassword);

    //----> Save the changes in db.
    await this.prisma.user.update({
      where: {email: request.email},
      data: {...user, password: hashedPassword},
    });

    //----> Send back response.
    return new ResponseMessage(
        'Password has been changed successfully!',
        'Success',
        StatusCodes.OK,
    );
  }

  async changeUserRole(changeUserRole: ChangeUserRoleDto, req: Request) {
    //----> Get user session.
    const session = await this.getUserSession(req);

    //----> Check for null session.
    if (!session){
      throw new UnauthorizedException("Invalid credentials!");
    }

    //----> Only admin can change the role of another user.
    if (session.role !== Role.Admin) {
      throw new ForbiddenException("You are not authorized to change the role!");
    }

    //----> Check for existence of user.
    const user = await this.getUserByEmail(changeUserRole.email);

    //----> Change user role.
    const role = user.role === Role.Admin ? Role.User : Role.Admin;

    //----> Update the user role.
    await this.prisma.user.update({where: {email: user.email}, data: {...user, role}});

    //----> Send back response.
    return new ResponseMessage("Role has been changed successfully!", "Success", StatusCodes.OK);
  }

  async editUserProfile(request: EditUserProfileDto) {
    //----> Check for existence of user.
    const user = await this.getUserByEmail(request.email);

    //----> Check for password validity.
    if (await this.passwordNotValid(request.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Map edit-user to user.
    request.password = user.password;
    const userToEdit = fromEditUserToUser(request, user);

    //----> Update the changes in db.
    await this.prisma.user.update({
      where: {email: request.email},
      data: {...userToEdit},
    });

    //----> Send back response.
    return new ResponseMessage(
        'User profile has been updated successfully!',
        'Success',
        StatusCodes.OK,
    );
  }

  async getCurrentUser(req: Request) {
    //----> Get user session.
    const session = await this.getUserSession(req);

    //----> Check for null session.
    if (!session) {
      throw new UnauthorizedException("Invalid credentials!")
    }

    //----> Fetch the current user.
    const user = await this.getUserByEmail(session.email);

    //----> Send back response.
    return fromUserToUserDto(user);
  }

  async getUserSession(req: Request): Promise<UserSession> {
    //----> Get access-token
    const accessToken = this.getToken(CookieParam.accessTokenName, req);

    //----> Check for null token.
    if (!accessToken){
      return emptyUserSession;
    }

    //----> Verify token
    const jwtPayload = await this.validateUserToken(accessToken);

    //----> Map JwtPayload from TokenJwt.
    const tokenJwt = this.makeTokenJwtFromJwtPayload(jwtPayload);

    //----> Make session.
    return this.makeSession(tokenJwt, accessToken);
  }

  async loginUser(loginUser: LoginUserDto, response: Response) {
    //----> Check for existing of user.
    const user = await this.getUserByEmail(loginUser.email);

    //----> Check for valid password.
    if (await this.passwordNotValid(loginUser.password, user.password)){
      throw new UnauthorizedException("Invalid credentials!");
    }

    //----> Map user to tokenJwt.
    const tokenJwt = this.makeTokenJwt(user);

    //----> Generate access and refresh tokens and store them in cookies.
    return this.generateTokensAndStoreInCookies(tokenJwt, response)

    
  }

  async logoutUser(request: Request, response: Response) {
    //----> Delete all cookies.
    await this.deleteCookie(response, CookieParam.accessTokenName, CookieParam.accessTokenPath);
    await this.deleteCookie(response, CookieParam.refreshTokenName, CookieParam.refreshTokenPath);

    //----> Get user session.
    const session = await this.getUserSession(request);

    //----> Check for null session.
    if(!session){
      throw new UnauthorizedException("You have already logged out!");
    }

    //----> Revoke all valid token objects.
    await this.tokenService.revokeAllValidTokensByUserId(session.id);

    //----> Send back response.
    return emptyUserSession;

  }

  async refreshUserToken(request: Request, response: Response) {
    //----> Get the refresh token.
    const refreshToken = this.getToken(CookieParam.refreshTokenName, request);

    //----> Validate refresh-token.
    const jwtPayload = await this.validateUserToken(refreshToken);

    //----> Map JwtPayload from TokenJwt.
    const tokenJwt = this.makeTokenJwtFromJwtPayload(jwtPayload);

    //----> Generate access and refresh tokens and store them in cookies.
    return await this.generateTokensAndStoreInCookies(tokenJwt, response);
  }

  async signupUser(request: SignupUserDto) {
    //----> Check for password match.
    if (this.passwordNotMatch(request.confirmPassword, request.password)) {
      throw new BadRequestException('Passwords do not match.');
    }

    //----> Check for existence of user.
    const user = await this.prisma.user.findUnique({
      where: {email: request.email},
    });
    if (user) {
      throw new UnauthorizedException('User already exists.');
    }

    //----> Hash password and map signupUser to user.
    request.password = await this.hashPassword(request.password);
    const userToCreate = fromSignupToUser(request);

    //----> Insert the new user.
    await this.prisma.user.create({data: userToCreate});

    //----> Send back response.
    return new ResponseMessage(
        'User has been created successfully!',
        'Success',
        StatusCodes.CREATED,
    );
  }

  async generateTokensAndStoreInCookies(tokenJwt: TokenJwt, response: Response) {
    //----> Revoke all valid tokens.
    await this.tokenService.revokeAllValidTokensByUserId(tokenJwt.id);

    //----> Generate access-token and store in cookie.
    const accessToken = await this.generateToken(tokenJwt, CookieParam.accessTokenExpiresIn);
    this.setCookie(response, CookieParam.accessTokenName, accessToken, CookieParam.accessTokenPath, CookieParam.accessTokenMaxAge);

    //----> Generate refresh-token and store in cookie.
    const refreshToken = await this.generateToken(tokenJwt, CookieParam.refreshTokenExpiresIn);
    this.setCookie(response, CookieParam.refreshTokenName, refreshToken, CookieParam.refreshTokenPath, CookieParam.refreshTokenMaxAge);

    //----> Make token-object.
    const tokenObj = this.makeTokenObject(accessToken, refreshToken, tokenJwt.id);

    //----> create new token object and store in db.
    await this.tokenService.createToken(tokenObj);

    //----> Make new session and send back response.
    return this.makeSession(tokenJwt, accessToken);
  }

  async verifyJwtToken(req: Request) {
    //----> Get access-token
    const accessToken = this.getToken(CookieParam.accessTokenName, req);

    //----> Verify token
    const jwtPayload = await this.validateUserToken(accessToken);

    //----> Map JwtPayload from TokenJwt to TokenJwt and send back the result.
    return this.makeTokenJwtFromJwtPayload(jwtPayload);
  }

  async getUserByEmail(email: string) {
    //----> Check for existence of user.
    const user = await this.prisma.user.findUnique({where: {email}});

    //----> Check for existence of user.
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    //----> Send back response.
    return user;
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  private passwordNotMatch(passwordOne: string, passwordTwo: string) {
    return passwordOne.normalize() !== passwordTwo.normalize();
  }

  private async passwordNotValid(
      rawPassword: string,
      encryptedPassword: string,
  ) {
    return !(await bcrypt.compare(rawPassword, encryptedPassword));
  }

  private async generateToken(tokenJwt: TokenJwt, expiresIn: number) {
    return await this.jwtService.signAsync({...tokenJwt}, {expiresIn});
  }

  private async validateUserToken(token: string) {
    //----> Check for empty token.
    if (!token) {
      return emptyJwtPayload;
    }

    const jwtPayload = (await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_TOKEN_KEY,
    })) as JwtPayload;

    if (!jwtPayload || jwtPayload.expiration < Date.now()) {
      return emptyJwtPayload;
    }

    //----> Send back response.
    return jwtPayload;
  }

  makeTokenJwt(user: User): TokenJwt {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      userType: user.userType,
    };
  }

  private makeTokenJwtFromJwtPayload(payload: JwtPayload): TokenJwt {
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      userType: payload.userType
    }
  }

  private makeSession(tokenJwt: TokenJwt, accessToken: string): UserSession {
    return {
      ...tokenJwt,
      accessToken,
      isAdmin: tokenJwt.role === Role.Admin,
      isLoggedIn: !!tokenJwt,
    };
  }

  private getToken(cookieName: string, req: Request) {
    const token = req.cookies[cookieName] as string;
    //----> Check for null accessToken.
    if (!token) {
      throw new UnauthorizedException('You are not logged in!');
    }

    //----> Return accessToken.
    return token;
  }

  private setCookie(
      response: Response,
      cookieName: string,
      cookieValue: string,
      cookiePath: string,
      maxAge: number,
  ) {
    return response.cookie(cookieName, cookieValue, {
      httpOnly: true,
      path: cookiePath,
      maxAge,
      secure: process.env.NODE_ENV === 'production',
    });
  }

  async deleteCookie(response: Response, cookieName: string, cookiePath: string) {
    return response.clearCookie(cookieName, {
      httpOnly: true,
      path: cookiePath,
      secure: process.env.NODE_ENV === 'production',
    });
  }

  private makeTokenObject(
      accessToken: string,
      refreshToken: string,
      userId: string,
  ): TokenUncheckedCreateInput {
    return {
      accessToken,
      expired: false,
      revoked: false,
      refreshToken,
      tokenType: TokenType.Bearer,
      userId,
    };
  }

}

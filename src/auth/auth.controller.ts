import {Controller, Get, Post, Body, Patch, Req, Res} from '@nestjs/common';
import {type Request, type Response} from "express";
import { AuthService } from './auth.service';
import {ChangeUserPasswordDto} from "./dto/change-user-password.dto";
import {ChangeUserRoleDto} from "./dto/change-user-role.dto";
import {EditUserProfileDto} from "./dto/edit-user-profile.dto";
import {LoginUserDto} from "./dto/loginUserDto";
import {SignupUserDto} from "./dto/signupUserDto";
import {Roles} from "../decorators/role.decorator";
import {IsPublic} from "../decorators/is-public.decorator";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Patch('change-password')
  async changeUserPassword(@Body() changeUserPassword: ChangeUserPasswordDto){
    return await this.authService.changeUserPassword(changeUserPassword);
  }

  @Roles('Admin')
  @Patch('change-role')
  async changeUserRole(@Body() changeUserRole: ChangeUserRoleDto, @Req() request: Request){
    return await this.authService.changeUserRole(changeUserRole, request);
  }

  @Roles('Admin', 'User')
  @Patch('edit-profile')
  async editUserProfile(@Body() editUserProfile: EditUserProfileDto){
    return await this.authService.editUserProfile(editUserProfile);
  }

  @Roles('Admin', 'User')
  @Get('me')
  async getCurrentUser(@Req() request: Request){
    return await this.authService.getCurrentUser(request);
  }

  @IsPublic()
  @Post('login')
  async loginUser(@Body() loginUser: LoginUserDto, @Res({ passthrough: true }) response: Response){
    return await this.authService.loginUser(loginUser, response)
  }

  @IsPublic()
  @Post('logout')
  async logoutUser(@Req() request: Request, @Res({ passthrough: true }) response: Response){
    return await this.authService.logoutUser(request, response);
  }

  @IsPublic()
  @Post('refresh')
  async refreshUserToken(@Req() request: Request, @Res({ passthrough: true }) response: Response){
    return await this.authService.refreshUserToken(request, response);
  }

  @IsPublic()
  @Post('signup')
  async signupUser(@Body() signupUser: SignupUserDto){
    return await this.authService.signupUser(signupUser);
  }
}

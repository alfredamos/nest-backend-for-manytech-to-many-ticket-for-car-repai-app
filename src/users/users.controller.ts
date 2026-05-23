import {Controller, Get, Param, Delete, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import {Roles} from "../decorators/role.decorator";
import {Role} from "../generated/prisma/enums";
import {SameUserIdOrAdminGuard} from "../guards/sameUserIdOrAdmin.guard";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteUserById(@Param("id") id: string){
    return await this.usersService.deleteUserById(id)
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(SameUserIdOrAdminGuard)
  @Get(':id')
  async getUserById(@Param("id") id: string){
    return await this.usersService.getUserById(id)
  }

  @Roles(Role.Admin)
  @Get()
  async getAllUsers(){
    return await this.usersService.getAllUsers()
  }

}

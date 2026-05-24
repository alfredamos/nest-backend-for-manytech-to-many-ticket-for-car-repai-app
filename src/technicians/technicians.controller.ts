import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import {TechnicianUncheckedCreateInput, TechnicianUncheckedUpdateInput} from "../generated/prisma/models/Technician";
import {Role} from "../generated/prisma/enums";
import {Roles} from "../decorators/role.decorator";
import {SameUserIdOrAdminGuard} from "../guards/sameUserIdOrAdmin.guard";

@Controller('technicians')
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @Roles(Role.Admin)
  @Post()
  async createTech(@Body() tech: TechnicianUncheckedCreateInput){
    return await this.techniciansService.createTech(tech);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteTechById(@Param('id') id: string){
    return await this.techniciansService.deleteTechById(id)
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async editTechById(@Param('id') id: string, @Body() tech: TechnicianUncheckedUpdateInput){
    return await this.techniciansService.editTechById(id, tech);
  }

  @Roles(Role.Admin)
  @Get(':id')
  async getTechById(@Param('id') id: string){
    return await this.techniciansService.getTechId(id);
  }

  @Roles(Role.Admin)
  @Get()
  async getAllTechs(){
    return await this.techniciansService.getAllTechs();
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(SameUserIdOrAdminGuard)
  @Get('by-user-id/:userId')
  async getTechByUserId(@Param('userId') userId: string){
    return await this.techniciansService.getTechByUserId(userId);
  }

  @Roles(Role.Admin)
  @Get('by-specialty/:specialty')
  async getTechsBySpecialty(@Param('specialty') specialty: string){
    return await this.techniciansService.getTechsBySpecialty(specialty);
  }
}

import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { CustomersService } from './customers.service';
import {CustomerUncheckedCreateInput, CustomerUpdateInput} from "../generated/prisma/models/Customer";
import {Role} from "../generated/prisma/enums";
import {Roles} from "../decorators/role.decorator";
import {SameUserIdOrAdminGuard} from "../guards/sameUserIdOrAdmin.guard";

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Roles(Role.Admin)
  @Post()
  async createCustomer(@Body() customer: CustomerUncheckedCreateInput){
    return await this.customersService.createCustomer(customer);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteCustomerById(@Param('id') id: string){
    return await this.customersService.deleteCustomerById(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async editCustomerById(@Param('id') id: string, @Body() customer: CustomerUpdateInput){
    return await this.customersService.editCustomerById(id, customer);
  }

  @Roles(Role.Admin)
  @Get('all/active')
  async getActiveCustomers(){
    return await this.customersService.getActiveCustomers();
  }

  @Roles(Role.Admin)
  @Get()
  async getAllCustomers(){
    return await this.customersService.getAllCustomers();
  }

  @Roles(Role.Admin)
  @Get(':id')
  async getCustomerById(@Param('id') id: string){
    return await this.customersService.getCustomerById(id);
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(SameUserIdOrAdminGuard)
  @Get('by-user-id/:userId')
  async getCustomerByUserId(@Param('userId') userId: string){
    return await this.customersService.getCustomersByUserId(userId);
  }

  @Roles(Role.Admin)
  @Get('all/inactive')
  async getInactiveCustomers(){
    return await this.customersService.getInactiveCustomers();
  }

}

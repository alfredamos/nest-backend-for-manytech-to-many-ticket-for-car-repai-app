import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import {TicketUncheckedCreateInput, TicketUncheckedUpdateInput} from "../generated/prisma/models/Ticket";
import {Role} from "../generated/prisma/enums";
import {Roles} from "../decorators/role.decorator";

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Roles(Role.Admin)
  @Post()
  async createTicket(@Body() ticket: TicketUncheckedCreateInput) {
    return await this.ticketsService.createTicket(ticket);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteTicketById(@Param('id') id: string) {
    return await this.ticketsService.deleteTicketById(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async editTicketById(@Param('id') id: string, @Body() ticket: TicketUncheckedUpdateInput) {
    return await this.ticketsService.editTicketById(id, ticket);
  }

  @Roles(Role.Admin)
  @Get(':id')
  async getTicketById(@Param('id') id: string) {
    return await this.ticketsService.getTicketById(id);
  }

  @Roles(Role.Admin)
  @Get()
  async getAllTickets() {
    return await this.ticketsService.getAllTickets();
  }

  @Roles(Role.Admin)
  @Get('by-customer-id/:customerId')
  async getAllTicketsByCustomerId(@Param('customerId') customerId: string) {
    return await this.ticketsService.getAllTicketsByCustomerId(customerId);
  }

}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssignedTicketsService } from './assigned-tickets.service';
import {
    AssignedTicketUncheckedCreateInput,
    AssignedTicketUncheckedUpdateInput
} from "../generated/prisma/models/AssignedTicket";
import {Roles} from "../decorators/role.decorator";
import {Role} from "../generated/prisma/enums";

@Controller('assigned-tickets')
export class AssignedTicketsController {
    constructor(private readonly assignedTicketService: AssignedTicketsService) {}

    @Roles(Role.Admin)
    @Patch('change-status/:techId/:ticketId')
    async changeAssignedTicketStatus(@Param('techId') techId: string, @Param('ticketId') ticketId: string){
        return await this.assignedTicketService.changeAssignedTicketStatus(techId, ticketId);
    }

    @Roles(Role.Admin)
    @Post()
    async createAssignedTicket(@Body() ticket: AssignedTicketUncheckedCreateInput) {
        return await this.assignedTicketService.createAssignedTicket(ticket);
    }

    @Roles(Role.Admin)
    @Delete(':techId/:ticketId')
    async deleteAssignedTicketById(@Param('techId') techId: string, @Param('ticketId') ticketId: string) {
        return await this.assignedTicketService.deleteAssignedTicketById(techId, ticketId);
    }

    @Roles(Role.Admin)
    @Patch(':techId/:ticketId')
    async editAssignedTicketById(@Param('techId') techId: string, @Param('ticketId') ticketId: string, @Body() ticket: AssignedTicketUncheckedUpdateInput) {
        return await this.assignedTicketService.editAssignedTicketById(techId, ticketId, ticket);
    }

    @Roles(Role.Admin)
    @Get()
    async getAllAssignedTickets() {
        return await this.assignedTicketService.getAllAssignedTickets();
    }

    @Roles(Role.Admin)
    @Get('by-assign-by/:assignBy')
    async getAssignedTicketsByAssignBy(@Param('assignBy') assignBy: string) {
        return await this.assignedTicketService.getAssignedTicketsByAssignBy(assignBy);
    }

    @Roles(Role.Admin)
    @Get(':techId/:ticketId')
    async getAssignedTicketById(@Param('techId') techId: string, @Param('ticketId') ticketId: string) {
        return await this.assignedTicketService.getAssignedTicketById(techId, ticketId);
    }

    @Roles(Role.Admin)
    @Get('by-tech-id/:techId')
    async getAssignedTicketsByTechId(@Param('techId') techId: string) {
        return await this.assignedTicketService.getAssignedTicketsByTechId(techId);
    }

    @Roles(Role.Admin)
    @Get('by-ticket-id/:ticketId')
    async getAssignedTicketsByTicketId(@Param('ticketId') ticketId: string) {
        return await this.assignedTicketService.getAssignedTicketsByTicketId(ticketId);
    }

    @Roles(Role.Admin)
    @Get('all/completed')
    async getCompletedAssignedTickets() {
        return await this.assignedTicketService.getCompletedAssignedTickets();
    }

    @Get('all/incompleted')
    async getInCompletedAssignedTickets() {
        return await this.assignedTicketService.getInCompletedAssignedTickets();
    }

}

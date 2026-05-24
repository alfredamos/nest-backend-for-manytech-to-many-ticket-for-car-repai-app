import {Injectable, NotFoundException} from '@nestjs/common';
import {
    AssignedTicketUncheckedCreateInput,
    AssignedTicketUncheckedUpdateInput
} from "../generated/prisma/models/AssignedTicket";
import {PrismaService} from "../prisma/prisma.service";
import {AssignedTicketRequest, toAssignedTicketResponse} from "../models/assignedTicketResponse.model";
import {Status} from "../generated/prisma/enums";
import {AuthService} from "../auth/auth.service";
import {Request} from "express";

@Injectable()
export class AssignedTicketsService {
    constructor(private readonly prisma: PrismaService, private readonly authService: AuthService) {}

    async changeAssignedTicketStatus(techId: string, ticketId: string){
        //----> Fetch the ticket with the giving tech-id and ticket-id.
        const ticket = await this.getOneAssignedTicket(techId, ticketId);

        //----> Change the ticket status.
        const completed = !ticket.completed;
        const status = ticket.completed ? Status.Open : Status.Closed;

        //----> Update the assigned-ticket info in db.
        const updatedTicket = await this.prisma.assignedTicket.update({where: {techId_ticketId: {techId, ticketId}}, data: {status, completed}, include: {ticket: {include: {customer: {include: {user: true}}}}, tech: {include: {user: true}}}});

        //----> Send back the response.
        return toAssignedTicketResponse(updatedTicket as AssignedTicketRequest);
    }

    async createAssignedTicket(ticket: AssignedTicketUncheckedCreateInput, request: Request) {
        //----> Get user-session.
        const session = await this.authService.getUserSession(request);
        ticket.assignBy = session.name;

        //----> Create the ticket.
        const newTicket = await this.prisma.assignedTicket.create({data: ticket, include: {ticket: {include: {customer: {include: {user: true}}}}, tech: {include: {user: true}}}});

        //----> Send back the response.
        return toAssignedTicketResponse(newTicket as AssignedTicketRequest);
    }

    async deleteAssignedTicketById(techId: string, ticketId: string) {
        //----> Check for ticket existence.
        await this.getOneAssignedTicket(techId, ticketId);

        //----> Delete the ticket.
        const deletedTicket = await this.prisma.assignedTicket.delete({where: {techId_ticketId: {techId, ticketId}}});

        //----> Send back the response.
        return toAssignedTicketResponse(deletedTicket as AssignedTicketRequest);
    }

    async editAssignedTicketById(techId: string, ticketId: string, ticket: AssignedTicketUncheckedUpdateInput) {
        //----> Check for ticket existence.
        await this.getOneAssignedTicket(techId, ticketId);

        //----> Edit the ticket.
        const editedTicket = await this.prisma.assignedTicket.update({where: {techId_ticketId: {techId, ticketId}}, data: ticket, include: {ticket: {include: {customer: {include: {user: true}}}}, tech: {include: {user: true}}}});

        //----> Send back the response.
        return toAssignedTicketResponse(editedTicket as AssignedTicketRequest);
    }

    async getAllAssignedTickets() {
        //----> Fetch all tickets.
        const tickets = await this.prisma.assignedTicket.findMany({include: {ticket: {include: {customer: {include: {user: true}}}}, tech: {include: {user: true}}}});

        //----> Send back response.
        return tickets?.map(ticket => toAssignedTicketResponse(ticket as AssignedTicketRequest));
    }

    async getAssignedTicketsByAssignBy(assignBy: string) {
        //----> Fetch assigned-tickets by assign-by.
        const tickets = await this.prisma.assignedTicket.findMany({where: {assignBy}, include: {ticket: {include: {customer: {include: {user: true}}}}, tech: {include: {user: true}}}});

        //----> Send back response.
        return tickets?.map(ticket => toAssignedTicketResponse(ticket as AssignedTicketRequest));
    }

    async getAssignedTicketById(techId: string, ticketId: string) {
        //----> Fetch assigned-ticket by tech-id and ticket-id.
        const ticket = await this.getOneAssignedTicket(techId, ticketId);

        //----> Send back response.
        return toAssignedTicketResponse(ticket as AssignedTicketRequest);
    }

    async getAssignedTicketsByTechId(techId: string) {
        //----> Fetch assigned-tickets by tech-id.
        const tickets = await this.prisma.assignedTicket.findMany({where: {techId}, include: {ticket: {include: {customer: {include: {user: true}}}}, tech: {include: {user: true}}}});

        //----> Send back response.
        return tickets?.map(ticket => toAssignedTicketResponse(ticket as AssignedTicketRequest));

    }

    async getAssignedTicketsByTicketId(ticketId: string) {
        //----> Fetch assigned-tickets by ticket-id.
        const tickets = await this.prisma.assignedTicket.findMany({where: {ticketId}, include: {ticket: {include: {customer: {include: {user: true}}}}, tech: {include: {user: true}}}});

        //----> Send back response.
        return tickets?.map(ticket => toAssignedTicketResponse(ticket as AssignedTicketRequest));
    }

    async getCompletedAssignedTickets() {
        //----> Fetch completed assigned-tickets.
        const tickets = await this.prisma.assignedTicket.findMany({where: {completed: true}, include: {ticket: {include: {customer: {include: {user: true}}}}, tech: {include: {user: true}}}});

        //----> Send back response.
        return tickets?.map(ticket => toAssignedTicketResponse(ticket as AssignedTicketRequest));
    }

    async getInCompletedAssignedTickets() {
        //----> Fetch incompleted assigned-tickets by assign-by.
        const tickets = await this.prisma.assignedTicket.findMany({where: {completed: false}, include: {ticket: {include: {customer: {include: {user: true}}}}, tech: {include: {user: true}}}});

        //----> Send back response.
        return tickets?.map(ticket => toAssignedTicketResponse(ticket as AssignedTicketRequest));
    }

    private async getOneAssignedTicket(techId: string, ticketId: string) {
        const ticket = await this.prisma.assignedTicket.findUnique({where: {techId_ticketId: {techId, ticketId}}, include: {ticket: {include: {customer: {include: {user: true}}}}, tech: {include: {user: true}}}});

        //----> Check for null ticket.
        if (!ticket) {
            throw new NotFoundException("Ticket not found in db!");
        }

        //----> Return the ticket.
        return ticket;
    }

}

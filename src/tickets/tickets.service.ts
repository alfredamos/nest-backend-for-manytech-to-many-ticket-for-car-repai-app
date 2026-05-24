import {Injectable, NotFoundException} from '@nestjs/common';
import {TicketUncheckedCreateInput, TicketUncheckedUpdateInput} from "../generated/prisma/models/Ticket";
import {PrismaService} from "../prisma/prisma.service";
import {toTicketResponse} from "../models/ticketResponse.model";
import {TicketWithCustomer} from "../models/ticketWithCustomer";

@Injectable()
export class TicketsService {
    constructor(private readonly prisma: PrismaService) {}

    async createTicket(ticket: TicketUncheckedCreateInput) {
        //----> Create the ticket
        const newTicket = await this.prisma.ticket.create({data: ticket, include: {customer: {include: {user: true}}}});

        //----> Send back the response.
        return toTicketResponse(newTicket as TicketWithCustomer);
    }

    async deleteTicketById(id: string) {
        //----> Check for ticket existence.
        await this.getOneTicket(id);

        //----> Delete the ticket.
        const deletedTicket = await this.prisma.ticket.delete({where: {id}, include: {customer: {include: {user: true}}}});

        //----> Send back the response.
        return toTicketResponse(deletedTicket as TicketWithCustomer);
    }

    async editTicketById(id: string, ticket: TicketUncheckedUpdateInput) {
        //----> Check for ticket existence.
        await this.getOneTicket(id);

        //----> Edit the ticket.
        const editedTicket = await this.prisma.ticket.update({where: {id}, data: ticket, include: {customer: {include: {user: true}}}});

        //----> Send back the response.
        return toTicketResponse(editedTicket as TicketWithCustomer);
    }

    async getTicketById(id: string) {
        //----> Get the ticket by id.
        const ticket = await this.getOneTicket(id);

        //----> Send back response.
        return toTicketResponse(ticket as TicketWithCustomer);
    }

    async getAllTickets() {
        //----> Fetch all tickets.
        const tickets = await this.prisma.ticket.findMany({include: {customer: {include: {user: true}}}});

        //----> Send back response.
        return tickets?.map(ticket => toTicketResponse(ticket as TicketWithCustomer));
    }

    async getAllTicketsByCustomerId(customerId: string) {
        //----> Fetch all tickets by customer id.
        const tickets = await this.prisma.ticket.findMany({where: {customerId}, include: {customer: {include: {user: true}}}});

        //----> Send back response.
        return tickets?.map(ticket => toTicketResponse(ticket as TicketWithCustomer));
    }

    private async getOneTicket(id: string) {
        //----> Get the ticket by id
        const ticket = await this.prisma.ticket.findUnique({where: {id}, include: {customer: {include: {user: true}}}});

        //----> Check for null ticket.
        if (!ticket) {
            throw new NotFoundException("Ticket not found in db!");
        }

        //----> Return the ticket.
        return ticket;
    }
}

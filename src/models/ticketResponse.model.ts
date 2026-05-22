import {TicketWithCustomer} from "./ticketWithCustomer";

export class TicketResponse {
    id: string = "";
    title: string = "";
    description: string = "";
    customerId: string = "";
    customerName: string = "";
    customerEmail: string = "";
    customerPhone: string = "";
    customerImage: string = "";
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}

export function toTicketResponse(ticket: TicketWithCustomer): TicketResponse{
    return {
        id: ticket?.id,
        title: ticket?.title,
        description: ticket?.description,
        customerId: ticket?.customer?.id,
        customerName: ticket?.customer?.user?.name,
        customerEmail: ticket?.customer?.user?.email,
        customerPhone: ticket?.customer?.user?.phone,
        customerImage: ticket?.customer?.user?.image,
        createdAt: ticket?.createdAt,
        updatedAt: ticket?.updatedAt
    }
}


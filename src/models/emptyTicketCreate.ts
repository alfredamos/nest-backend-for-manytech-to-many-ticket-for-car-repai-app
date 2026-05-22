import {TicketCreate} from "../validations/ticket.validation";

export const emptyTicketCreate: TicketCreate = {
    title: "",
    description: "",
    customerId: "",
}
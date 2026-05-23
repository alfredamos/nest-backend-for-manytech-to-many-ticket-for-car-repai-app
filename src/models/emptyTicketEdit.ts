import {TicketUncheckedUpdateInput} from "../generated/prisma/models/Ticket";

export const emptyTicketEdit: TicketUncheckedUpdateInput = {
    id: "",
    title: "",
    description: "",
    customerId: "",
}
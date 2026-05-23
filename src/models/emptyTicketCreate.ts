import {TicketUncheckedCreateInput} from "../generated/prisma/models/Ticket";

export const emptyTicketCreate: TicketUncheckedCreateInput = {
    title: "",
    description: "",
    customerId: "",
}
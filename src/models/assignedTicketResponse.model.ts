import {TicketWithCustomer} from "./ticketWithCustomer";
import {TechnicianWithUser} from "./technicianWithUser";
import {Status} from "../generated/prisma/enums";


export class AssignedTicketRequest {
    techId!: string;
    ticketId!: string;
    status!: Status;
    completed!: boolean;
    assignBy!: string;
    assignAt!: Date;
    ticket!: TicketWithCustomer;
    tech!: TechnicianWithUser;
}

export class AssignedTicketResponse{
    techId!: string;
    ticketId!: string;
    status!: Status;
    completed!: boolean;
    assignBy!: string;
    assignAt!: Date;
    ticketTitle!: string;
    ticketNotes!: string;
    customerName!: string;
    customerEmail!: string;
    customerAddress!: string;
    customerPhone!: string;
    customerImage!: string;
    techName!: string;
    techEmail!: string;
    techPhone!: string;
    techSpecialty!: string;
    techImage!: string;

}

export function toAssignedTicketResponse(assignTicketReq: AssignedTicketRequest): AssignedTicketResponse {
    return {
        techId: assignTicketReq?.techId,
        ticketId: assignTicketReq?.ticketId,
        status: assignTicketReq?.status,
        completed: assignTicketReq?.completed,
        assignBy: assignTicketReq?.assignBy,
        assignAt: assignTicketReq?.assignAt,
        ticketTitle: assignTicketReq?.ticket?.title,
        ticketNotes: assignTicketReq?.ticket?.description,
        customerName: assignTicketReq?.ticket?.customer?.user?.name,
        customerEmail: assignTicketReq?.ticket?.customer?.user?.email,
        customerAddress: assignTicketReq?.ticket?.customer?.address,
        customerPhone: assignTicketReq?.ticket?.customer?.user?.phone,
        customerImage: assignTicketReq?.ticket?.customer?.user?.image,
        techName: assignTicketReq?.tech?.user?.name,
        techEmail: assignTicketReq?.tech?.user?.email,
        techPhone: assignTicketReq?.tech?.user?.phone,
        techSpecialty: assignTicketReq?.tech?.specialty,
        techImage: assignTicketReq?.tech?.user?.image
    }
}
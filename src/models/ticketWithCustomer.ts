import {User} from "../generated/prisma/client";

export class TicketWithCustomer {
    id: string = "";
    title: string = "";
    description: string = "";
    customerId: string = "";
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    customer!: {
        id: string;
        address: string;
        active: boolean;
        notes: string;
        user: User;
        userId: string;
    }



}
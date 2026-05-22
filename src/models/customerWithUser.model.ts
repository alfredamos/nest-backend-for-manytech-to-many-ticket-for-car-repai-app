import {User} from "../generated/prisma/client";

export class CustomerWithUser {
    id: string = "";
    address: string = "";
    active: boolean = true;
    notes: string = "";
    userId: string = "";
    user!: User
}
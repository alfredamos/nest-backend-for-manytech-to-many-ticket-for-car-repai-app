import {User} from "../generated/prisma/client";

export class TechnicianWithUser {
    id!: string;
    specialty!: string;
    userId!: string;
    user!: User;
}
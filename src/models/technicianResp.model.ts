import {TechnicianWithUser} from "./technicianWithUser";
import {Gender} from "../generated/prisma/enums";

export class TechnicianResponse {
    id!: string;
    specialty!: string;
    userId!: string;
    name!: string;
    email!: string;
    phone!: string;
    image!: string;
    dateOfBirth!: string;
    gender!: Gender;
}

export function toTechnicianResponse(technician: TechnicianWithUser): TechnicianResponse {
    return{
        id: technician?.id,
        specialty: technician?.specialty,
        userId: technician?.userId,
        name: technician?.user?.name,
        email: technician?.user?.email,
        phone: technician?.user?.phone,
        image: technician?.user?.image,
        dateOfBirth: technician?.user?.dateOfBirth.toString(),
        gender: technician?.user?.gender
    }
}
import {CustomerWithUser} from "./customerWithUser.model";
import {Gender} from "../generated/prisma/enums";

class User {
}

export class CustomerResponse {
    id!: string;
    address!: string;
    active!: boolean;
    notes?: string;
    userId!: string;
    name!: string;
    email!: string;
    phone!: string;
    image!: string;
    dateOfBirth!: string;
    gender!: Gender;
}

export  function toCustomerResponse(customer: CustomerWithUser): CustomerResponse {
    return {
        id: customer.id,
        address: customer.address,
        active: customer.active,
        notes: customer?.notes ,
        userId: customer.userId,
        name: customer?.user?.name,
        email: customer?.user?.email,
        phone: customer?.user?.phone,
        image: customer?.user?.image,
        dateOfBirth: customer?.user?.dateOfBirth.toString(),
        gender: customer?.user?.gender
    }
}
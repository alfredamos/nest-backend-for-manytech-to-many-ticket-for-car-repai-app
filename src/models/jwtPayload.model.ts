import {Role, UserType} from "../generated/prisma/enums";

export class JwtPayload {
    id: string = "";
    email: string = "";
    name: string = "";
    role: Role = Role.User;
    userType: UserType= UserType.Technician;
    issueAt: number = 0;
    expiration: number = 0;
}

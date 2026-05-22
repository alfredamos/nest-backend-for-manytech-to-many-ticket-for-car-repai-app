import {Role, UserType} from "../generated/prisma/enums";

export class UserSession {
    id: string = "";
    name: string = "";
    email: string = "";
    role: Role = Role.User;
    userType: UserType = UserType.Technician;
    accessToken: string = "";
    isLoggedIn: boolean = false;
    isAdmin: boolean = false;
}
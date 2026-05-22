import {Role, Gender, UserType} from "../generated/prisma/enums";
import type {User} from "../generated/prisma/client";

export class UserDto {
    id: string = "";
    name: string = "";
    email: string = "";
    phone: string = "";
    role: Role = Role.User;
    userType: UserType = UserType.Customer;
    image: string = "";
    gender: Gender = Gender.Male;
}

export function fromUserToUserDto(user: User): UserDto {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image: user.image,
        gender: user.gender,
        userType: user.userType
    };
}

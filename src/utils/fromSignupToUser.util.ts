import { SignupUserDto } from "../auth/dto/signupUserDto";
import {Role} from "../generated/prisma/enums";
import {UserCreateInput} from "../generated/prisma/models/User";


export function fromSignupToUser(signup: SignupUserDto): UserCreateInput {
    return {
        email: signup.email,
        password: signup.password,
        name: signup.name,
        role: Role.User,
        image: signup.image,
        phone: signup.phone,
        gender: signup.gender,
        dateOfBirth: signup.dateOfBirth,
    }
}
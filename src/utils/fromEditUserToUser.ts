import { User } from '../generated/prisma/client';
import { EditUserProfileDto } from '../auth/dto/edit-user-profile.dto';
import {UserUpdateInput} from "../generated/prisma/models/User";

export function fromEditUserToUser(request: EditUserProfileDto, user: User): UserUpdateInput {
  return {
    id: user.id,
    email: user.email,
    password: user.password,
    name: request.name,
    role: user.role,
    image: request.image,
    phone: request.phone,
    gender: request.gender,
    dateOfBirth: request.dateOfBirth,
  };
}

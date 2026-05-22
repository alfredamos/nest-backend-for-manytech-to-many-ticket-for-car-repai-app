import { Role, User } from '../generated/prisma/client';
import { EditUserProfileDto } from '../auth/dto/edit-user-profile.dto';

export function fromEditUserToUser(request: EditUserProfileDto, user: User): User {
  return {
    id: user.id,
    email: user.email,
    password: user.password,
    name: request.name,
    role: user.role,
    image: request.image,
    phone: request.phone,
    gender: request.gender,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

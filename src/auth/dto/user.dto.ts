import { User } from '../../generated/prisma/client';

export class UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  phone: string;
  gender: string;
}

export function fromUserToUserDto(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image,
    phone: user.phone,
    gender: user.gender,
  };
}

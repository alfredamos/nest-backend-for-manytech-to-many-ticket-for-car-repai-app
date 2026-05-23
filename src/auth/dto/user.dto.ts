import {User, UserType} from '../../generated/prisma/client';

export class UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  phone: string;
  gender: string;
  userType: UserType;
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
    userType: user.userType
  };
}

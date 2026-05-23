import { Role, UserType } from '../generated/prisma/enums';

export const emptyTokenJwt = {
  id: '',
  name: '',
  email: '',
  role: Role.User,
  userType: UserType.Technician,
};

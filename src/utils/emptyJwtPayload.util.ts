import { JwtPayload } from '../models/jwtPayload.model';
import { Role, UserType } from '../generated/prisma/enums';

export const emptyJwtPayload : JwtPayload = {
  id: '',
  name: '',
  email: '',
  expiration: 0,
  role: Role.User,
  userType: UserType.Technician,
  issueAt: 0,
};
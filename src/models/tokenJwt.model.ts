import { Role } from '../generated/prisma/enums';

export class TokenJwt {
  id: string = '';
  name: string = '';
  email: string = '';
  role: Role = Role.User;
}

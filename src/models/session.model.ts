import { Role } from '../generated/prisma/enums';

export class Session {
  id: string;
  name: string;
  email: string;
  role: Role;
  accessToken: string;
  isAdmin: boolean;
  isLoggedIn: boolean;
}
import { Role } from '../generated/prisma/enums';

export class ParsedTokenObject {
  id: string = "";
  email: string = "";
  name: string = "";
  role: Role = Role.User;
  issueAt: number = 0;
  expiration: number = 0;
}
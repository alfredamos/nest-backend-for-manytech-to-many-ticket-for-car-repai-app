import {Role, UserType} from "../generated/prisma/enums";

export const emptyUserSession = {
  id: '',
  name: '',
  email: '',
  role: Role.User,
  userType: UserType.Technician,
  accessToken: '',
  isAdmin: false,
  isLoggedIn: false,
};

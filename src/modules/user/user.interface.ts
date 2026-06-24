import { ActiveStatus, Role } from "../../../generated/prisma/enums";

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  bio?: string;
};

export interface IUpdateUserMe {
  name?: string;
  profilePhoto?: string;
  bio?: string;
}

export interface IUpdateUserAdmin {
  name?: string;
  profilePhoto?: string;
  bio?: string;
  activeStatus?: ActiveStatus;
  role?: Role;
}
import { UserRoles, UserStatus } from '@/common/constants/enums';

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface IUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRoles;
  status: UserStatus;
  phone: string;
  address?: IAddress;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

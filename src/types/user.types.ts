type RoleType = "CUSTOMER" | "ADMIN";

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: RoleType;
}

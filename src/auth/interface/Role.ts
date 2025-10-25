export enum Role {
  Admin = 'admin',
  User = 'user',
}

export type User = {
  id: string;
  username: string;
  password: string;
  // role: Role;
};

export interface IAuthenticate {
  token: string;
  user: User;
}

export const emptyUserAuthenticated: UserAuthenticated = {
  id: undefined,
  userName: undefined,
  fullName: undefined,
  email: undefined,
  emailVerified: false,
  roles: [],
  isAdmin: false
};

export interface UserAuthenticated {
  id?: string;
  userName?: string;
  fullName?: string;
  email?: string;
  emailVerified: boolean | undefined;
  roles: string[];
  isAdmin: boolean;
}
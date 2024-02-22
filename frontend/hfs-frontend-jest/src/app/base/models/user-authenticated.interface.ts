export const emptyUserAuthenticated: UserAuthenticated = {
  id: null,
  userName: null,
  fullName: null,
  email: null,
  emailVerified: false,
  roles: [],
  isAdmin: false
};

export interface UserAuthenticated {
  id?: string;
  userName?: string;
  fullName?: string;
  email?: string;
  emailVerified: boolean;
  roles?: string[];
  isAdmin: boolean;
}
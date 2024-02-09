export interface UserAuthenticated {
  id?: string;
  userName?: string;
  fullName?: string;
  email?: string;
  emailVerified: boolean;
  roles?: string[];
  isAdmin: boolean;
}
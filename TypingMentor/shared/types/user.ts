export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  token?: string;
}

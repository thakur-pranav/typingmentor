export interface AuthUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

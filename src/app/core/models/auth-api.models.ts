/**
 * Authentication API contracts strictly aligned with FastAPI schemas.
 * (backend/app/schemas/auth.py)
 */

export interface LoginApiRequest {
  email: string;
  password: string;
}

export interface UserApiResponse {
  id: number;
  name: string;
  email: string;
  role: 'Tourist' | 'Vendor' | 'Admin' | string;
}

export interface TokenApiResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserApiResponse;
}

// react/src/auth/types.ts

// Tipos e interfaces comuns para autenticação
export type AuthProvider = 'spotify' | 'google' | 'email';

export interface User {
  id: string;
  name: string;
  email?: string;
  provider: AuthProvider;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  provider: AuthProvider | null;
  loading: boolean;
  error: string | null;
}

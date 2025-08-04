// File: react/src/auth/types.ts

// Tipos e interfaces comuns para autenticação

/**
 * AuthProvider
 * Indica qual provedor de autenticação foi utilizado pelo usuário.
 * Pode ser 'spotify', 'google' ou 'email'.
 * Útil para saber de onde vieram os dados do usuário e para lógica condicional.
 */
export type AuthProvider = 'spotify' | 'google' | 'email';

/**
 * User
 * Representa um usuário autenticado no sistema.
 * - id: identificador único do usuário (pode ser do provedor ou do sistema)
 * - name: nome do usuário
 * - email: email do usuário
 * - provider: indica qual provedor foi usado para autenticação (ex: 'spotify')
 * - avatarUrl: (opcional) URL do avatar/foto do usuário
 */
export interface User {
  id: string;
  name: string;
  email: string;
  provider: AuthProvider; // Permite saber de onde veio o usuário (Spotify, Google, Email)
  avatarUrl?: string;
}

/**
 * AuthTokens
 * Representa os tokens de autenticação do usuário.
 * - accessToken: token de acesso (ex: OAuth)
 * - refreshToken: (opcional) token para renovar o accessToken
 * - expiresAt: (opcional) timestamp de expiração do accessToken
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

/**
 * AuthState
 * Estado global de autenticação do app.
 * - user: dados do usuário autenticado (ou null se não autenticado)
 * - tokens: tokens de autenticação (ou null)
 * - provider: provedor atualmente autenticado (útil para lógica condicional e UI)
 * - loading: indica se está processando login/logout
 * - error: mensagem de erro, se houver
 *
 * O campo provider em AuthState permite saber qual provedor está ativo no momento,
 * facilitando lógica condicional (ex: mostrar botão de logout do Spotify, Google, etc).
 */
export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  provider: AuthProvider | null; // Provedor atualmente autenticado
  loading: boolean;
  error: string | null;
}

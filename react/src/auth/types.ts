// src/auth/types.ts

// Define o formato do objeto de usuário que será armazenado no contexto de autenticação.
// Pode ser estendido para incluir mais informações do perfil.
export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

// Define o formato do objeto de sessão, que inclui o token de acesso,
// o refresh token, o tempo de expiração e as informações do usuário.
export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user: User | null;
}

// Define o contrato que todo provedor de autenticação (ex: Spotify, Google) deve seguir.
// Isso garante que o AuthContext possa interagir com qualquer provedor de forma consistente.
export interface AuthProvider {
  // Inicia o fluxo de login. Geralmente, redireciona o usuário para a página de autorização do provedor.
  login: () => Promise<void>;

  // Finaliza a sessão do usuário.
  logout: () => Promise<void>;

  // Manipula o callback do provedor após a autorização do usuário.
  // Recebe o código de autorização e o troca por um token de acesso.
  handleCallback: (code: string) => Promise<AuthSession>;

  // Renova um token de acesso expirado usando o refresh token.
  refreshAccessToken?: (refreshToken: string) => Promise<AuthSession>;
}
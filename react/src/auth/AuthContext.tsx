// react/src/auth/AuthContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthSession, AuthProvider } from './types';
import { SpotifyProvider } from './providers/SpotifyProvider'; // Importa o provedor específico

// Define o formato do valor do contexto de autenticação
interface AuthContextType {
  session: AuthSession | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  handleLoginCallback: (code: string) => Promise<void>; // Função para o callback
  loading: boolean;
}

// Cria o contexto com um valor padrão inicial
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define as props do provedor de autenticação
interface AuthProviderProps {
  children: ReactNode;
}

// Componente Provedor que encapsula a lógica de autenticação
export const AuthProviderComponent: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // O provedor específico (Spotify) é usado aqui
  const authProvider: AuthProvider = SpotifyProvider;

  // Efeito para carregar a sessão do localStorage ao iniciar
  useEffect(() => {
    const storedSession = localStorage.getItem('auth_session');
    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession));
      } catch (error) {
        console.error("Erro ao carregar a sessão do localStorage:", error);
        localStorage.removeItem('auth_session');
      }
    }
    setLoading(false);
  }, []);

  // Função de login
  const login = async () => {
    setLoading(true);
    await authProvider.login();
    // O redirecionamento é tratado pelo provedor
  };

  // Função de logout
  const logout = async () => {
    await authProvider.logout();
    localStorage.removeItem('auth_session');
    setSession(null);
  };

  const handleLoginCallback = async (code: string) => {
    setLoading(true);
    try {
      const newSession = await authProvider.handleCallback(code);
      setSession(newSession);
      localStorage.setItem('auth_session', JSON.stringify(newSession));
    } catch (error) {
      console.error("Falha no callback de login:", error);
      localStorage.removeItem('auth_session');
      setSession(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    login,
    logout,
    handleLoginCallback,
    loading,
  };

  

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

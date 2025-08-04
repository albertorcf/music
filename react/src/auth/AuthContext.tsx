// react/src/auth/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, User, AuthTokens, AuthProvider as AuthProviderType } from './types';

interface AuthContextProps extends AuthState {
  login: (provider: AuthProviderType, data?: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
}

const defaultState: AuthState = {
  user: null,
  tokens: null,
  provider: null,
  loading: false,
  error: null,
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProviderComponent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(defaultState);

  const login = async (_provider: AuthProviderType, _data?: any) => {
    setState(s => ({ ...s, loading: true, error: null }));
    // Implementar lógica de login por provedor
    // Exemplo: chamar função do provider correspondente
    setState(s => ({ ...s, loading: false }));
  };

  const logout = () => {
    setState(defaultState);
  };

  const setUser = (user: User | null) => setState(s => ({ ...s, user }));
  const setTokens = (tokens: AuthTokens | null) => setState(s => ({ ...s, tokens }));

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setUser, setTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProviderComponent');
  return ctx;
};

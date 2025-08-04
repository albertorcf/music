// react/src/auth/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Hook customizado para acessar o contexto de autenticação.
 *
 * Facilita o consumo do AuthContext, garantindo que ele seja usado
 * dentro de um AuthProviderComponent e fornecendo uma API clara e concisa
 * para os componentes da UI.
 *
 * @returns O valor do contexto de autenticação, que inclui a sessão,
 *          as funções de login e logout, e o estado de carregamento.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProviderComponent');
  }
  return context;
};

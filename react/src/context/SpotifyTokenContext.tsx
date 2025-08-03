// react/src/context/SpotifyTokenContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { getSpotifyToken } from "../utils/getSpotifyToken";

// 1. Cria o contexto para o token do Spotify
type SpotifyTokenContextType = {
  token: string | null;
  refreshToken: () => Promise<void>;
};

export const SpotifyTokenContext = createContext<SpotifyTokenContextType>({
  token: null,
  refreshToken: async () => {},
});

// 2. Provider que busca e fornece o token para toda a aplicação
export function SpotifyTokenProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  // Função para buscar/atualizar o token
  async function refreshToken() {
    const t = await getSpotifyToken();
    setToken(t);
  }

  // Busca o token ao montar o Provider
  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <SpotifyTokenContext.Provider value={{ token, refreshToken }}>
      {children}
    </SpotifyTokenContext.Provider>
  );
}

// 3. Hook para consumir o contexto facilmente
export function useSpotifyToken() {
  return useContext(SpotifyTokenContext);
}

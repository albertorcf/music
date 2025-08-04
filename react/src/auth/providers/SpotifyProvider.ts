// react/src/auth/providers/SpotifyProvider.ts
import type { AuthProvider, AuthSession } from "../types";

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = "http://127.0.0.1:5173/callback";



/**
 * Implementação do AuthProvider para o Spotify.
 *
 * Este objeto encapsula toda a lógica de autenticação específica do Spotify,
 * como a construção da URL de login, a troca do código de autorização por um
 * token de acesso e o logout.
 */
export const SpotifyProvider: AuthProvider = {
  /**
   * Redireciona o usuário para a página de autorização do Spotify.
   *
   * O usuário concede permissão à aplicação, e o Spotify o redireciona
   * de volta para a `SPOTIFY_REDIRECT_URI` com um código de autorização.
   */
  login: async () => {
    const scope = "user-read-private user-read-email user-read-playback-state user-read-currently-playing";
    const params = new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    });

    // Redireciona o navegador do usuário para a página de login do Spotify
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  },

  /**
   * Troca o código de autorização por um token de acesso.
   *
   * Este método é chamado na página de callback (`/callback`) após o usuário
   * ser redirecionado pelo Spotify. Ele envia o código para o backend,
   * que o troca por um token de acesso, refresh token e informações do usuário.
   *
   * @param code - O código de autorização retornado pelo Spotify.
   * @returns Uma promessa que resolve com a sessão de autenticação.
   */
  handleCallback: async (code: string): Promise<AuthSession> => {
    try {
      const response = await fetch(`http://localhost:3030/api/auth/callback?code=${encodeURIComponent(code)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || "Erro ao processar o callback no backend");
      }
      // O backend agora retorna o objeto AuthSession completo e formatado
      const session = await response.json();
      return session;
    } catch (error) {
      console.error("Erro no handleCallback do SpotifyProvider:", error);
      throw error;
    }
  },

  /**
   * Realiza o logout do usuário.
   *
   * No caso do Spotify, o logout real acontece no site do Spotify.
   * Para a nossa aplicação, limpamos os dados da sessão armazenados localmente.
   */
  logout: async () => {
    // Limpa os dados da sessão do localStorage ou de onde quer que estejam armazenados
    localStorage.removeItem("auth_session");
    // Idealmente, também invalidaria o token no backend se a API do Spotify permitisse.
  },
};
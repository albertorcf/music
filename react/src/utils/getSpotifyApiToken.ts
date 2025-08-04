// react/src/utils/getSpotifyApiToken.ts

/**
 * Busca um token de acesso da API do Spotify (Client Credentials).
 * Este token é usado para acessar dados públicos da API e não está associado a um usuário específico.
 * @returns Uma promessa que resolve com o token de acesso.
 */
export async function getSpotifyApiToken(): Promise<string> {
  try {
    const res = await fetch("http://localhost:3030/api/token");
    if (!res.ok) {
      throw new Error("Erro ao obter token da API do Spotify a partir do backend");
    }
    const data = await res.json();
    if (!data.access_token) {
      throw new Error("A resposta do backend não continha um access_token");
    }
    return data.access_token;
  } catch (error) {
    console.error("Falha ao buscar token da API do Spotify:", error);
    throw error;
  }
}

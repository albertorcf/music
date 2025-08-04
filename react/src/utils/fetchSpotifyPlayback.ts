// react/src/utils/fetchSpotifyPlayback.ts

/**
 * Busca o estado de playback atual do usuário no Spotify.
 * Requer um token de acesso de usuário válido.
 * @param accessToken - O token de acesso do usuário logado.
 * @returns Uma promessa que resolve com os dados do playback ou null se nada estiver tocando.
 */
export async function fetchSpotifyPlayback(accessToken: string): Promise<any> {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Um status 204 No Content significa que nada está tocando ou não há dispositivo ativo.
    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Erro ao buscar dados de playback do Spotify");
    }

    const playbackData = await response.json();
    return playbackData;

  } catch (error) {
    console.error("Falha ao buscar playback do Spotify:", error);
    // Retorna null em caso de erro para não quebrar a UI
    return null;
  }
}

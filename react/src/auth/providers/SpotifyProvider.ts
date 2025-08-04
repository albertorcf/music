// react/src/auth/providers/SpotifyProvider.ts

import type { AuthTokens, User } from '../types';

// Configurações do Spotify (ajuste conforme necessário)
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const SCOPES = 'user-read-email user-read-private';

/**
 * Inicia o fluxo OAuth do Spotify redirecionando o usuário para o login
 */
export function startSpotifyLogin() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'token',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    show_dialog: 'true',
  });
  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Extrai o accessToken da URL após o callback do Spotify
 */
export function extractTokenFromUrl(): string | null {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get('access_token');
}

/**
 * Busca os dados do usuário autenticado na API do Spotify
 */
export async function fetchSpotifyUser(accessToken: string): Promise<User> {
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Erro ao buscar dados do usuário Spotify');
  const data = await res.json();
  return {
    id: data.id,
    name: data.display_name || data.id,
    email: data.email,
    provider: 'spotify',
    avatarUrl: data.images?.[0]?.url,
  };
}

/**
 * Cria o objeto de tokens a partir do accessToken
 */
export function buildSpotifyTokens(accessToken: string): AuthTokens {
  // O fluxo implícito do Spotify não retorna refreshToken
  return {
    accessToken,
    // expiresAt pode ser calculado se "expires_in" estiver disponível na URL
  };
}

// src/utils/getSpotifyToken.ts

export async function getSpotifyToken(): Promise<string> {
  const res = await fetch("http://localhost:3030/api/token");
  if (!res.ok) throw new Error("Erro ao obter token do backend");
  const data = await res.json();
  return data.access_token;
}

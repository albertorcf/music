// src/utils/fetchSpotifyArtist.ts
export async function fetchSpotifyArtist(artistName: string, token: string) {
  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    artistName
  )}&type=artist&limit=1`;

  const response = await fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar artista no Spotify");
  }

  const data = await response.json();
  const artist = data.artists.items[0];
  return artist || null;
}

export async function fetchSpotifyAlbums(artistId: string, token: string) {
  const albumsUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&limit=5&market=BR`;

  const response = await fetch(albumsUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar álbuns no Spotify");
  }

  const data = await response.json();
  return data.items || [];
}

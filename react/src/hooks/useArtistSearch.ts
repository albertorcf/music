// react/src/hooks/useArtistSearch.ts
import { useState } from "react";
import { fetchSpotifyArtist, fetchSpotifyAlbums } from "../utils/fetchSpotifyArtist";
import { fetchWikipediaBio } from "../utils/fetchWikipediaBio";
import { getSpotifyToken } from "../utils/getSpotifyToken";

export function useArtistSearch() {
  const [searchedArtist, setSearchedArtist] = useState<any>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [bio, setBio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Handler: busca artista, álbuns e bio ---
  async function handleArtistSearch(artist: string) {
    setError(null);
    setLoading(true);
    setSearchedArtist(null);
    setAlbums([]);
    setBio(null);

    try {
      // Obtém token do backend
      const SPOTIFY_TOKEN = await getSpotifyToken();

      // Busca artista na API Spotify
      const artistData = await fetchSpotifyArtist(artist, SPOTIFY_TOKEN);
      if (!artistData) {
        setError("Artista não encontrado.");
        setLoading(false);
        return;
      }
      setSearchedArtist(artistData);

      // Busca álbuns recentes
      const albumsData = await fetchSpotifyAlbums(artistData.id, SPOTIFY_TOKEN);
      setAlbums(albumsData.slice(0, 3));

      // Busca biografia (Wikipedia)
      const wikiBio = await fetchWikipediaBio(artistData.name);
      setBio(wikiBio);
    } catch (err: any) {
      setError("Erro ao buscar dados no Spotify/Wikipedia.");
    } finally {
      setLoading(false);
    }
  }

  return { searchedArtist, albums, bio, loading, error, handleArtistSearch };
}

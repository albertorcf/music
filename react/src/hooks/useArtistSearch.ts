// react/src/hooks/useArtistSearch.ts
import { useState } from "react";
import { fetchSpotifyArtist, fetchSpotifyAlbums } from "../utils/fetchSpotifyArtist";
import { fetchWikipediaBio } from "../utils/fetchWikipediaBio";
// Importa o hook do contexto do token
import { useSpotifyToken } from "../context/SpotifyTokenContext";


export function useArtistSearch() {
  // Estados locais para busca
  const [searchedArtist, setSearchedArtist] = useState<any>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [bio, setBio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usa o contexto para obter o token do Spotify
  const { token: SPOTIFY_TOKEN } = useSpotifyToken();

  // Handler: busca artista, álbuns e bio
  async function handleArtistSearch(artist: string) {
    setError(null);
    setLoading(true);
    setSearchedArtist(null);
    setAlbums([]);
    setBio(null);

    try {
      // Garante que o token está disponível
      if (!SPOTIFY_TOKEN) {
        setError("Token do Spotify não disponível. Tente novamente mais tarde.");
        setLoading(false);
        return;
      }

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

// react/src/hooks/useArtistSearch.ts
import { useState, useEffect } from "react";
import { fetchSpotifyArtist, fetchSpotifyAlbums } from "../utils/fetchSpotifyArtist";
import { fetchWikipediaBio } from "../utils/fetchWikipediaBio";
import { getSpotifyApiToken } from "../utils/getSpotifyApiToken"; // Importa a função para obter o token da API

export function useArtistSearch() {
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [searchedArtist, setSearchedArtist] = useState<any>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [bio, setBio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca o token da API pública quando o hook é inicializado
  useEffect(() => {
    getSpotifyApiToken()
      .then(setApiToken)
      .catch(() => {
        setError("Não foi possível obter o token para pesquisar. Tente recarregar a página.");
      });
  }, []);

  async function handleArtistSearch(artist: string) {
    setError(null);
    setLoading(true);
    setSearchedArtist(null);
    setAlbums([]);
    setBio(null);

    try {
      // Garante que o token da API pública está disponível
      if (!apiToken) {
        setError("Token de API não disponível. A busca não pode ser realizada.");
        setLoading(false);
        return;
      }

      // Busca o artista usando o token da API
      const artistData = await fetchSpotifyArtist(artist, apiToken);
      if (!artistData) {
        setError("Artista não encontrado.");
        setLoading(false);
        return;
      }
      setSearchedArtist(artistData);

      // Busca os álbuns usando o mesmo token
      const albumsData = await fetchSpotifyAlbums(artistData.id, apiToken);
      setAlbums(albumsData.slice(0, 3));

      // A busca da biografia não requer autenticação
      const wikiBio = await fetchWikipediaBio(artistData.name);
      setBio(wikiBio);
    } catch (err: any) {
      setError("Erro ao buscar dados: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return { searchedArtist, albums, bio, loading, error, handleArtistSearch };
}

import React, { useState } from "react";
import { Header } from "./components/Header";
import { Banner } from "./components/Banner";
import { PlaylistCard } from "./components/PlaylistCard";
import { Footer } from "./components/Footer";
import { fetchSpotifyArtist, fetchSpotifyAlbums } from "./utils/fetchSpotifyArtist";

// Seu token de acesso do Spotify (válido por 1h, coloque aqui temporariamente)
const SPOTIFY_TOKEN = "BQC8mAnIdQCr4gpJ2KruBg-dC-VMOZE9tR4Ovu5SuMrVV8-3W7Q1mrtuq9MdQ-uwSau0fkCcIKFsJRXxa8QGUc_fz1su07bhxrk3cb2zNLZbjL6WavQ83aCTUJjHKM4OIOFU9h44No0";

// Mock playlists (pode manter ou remover)
const playlists = [
  {
    title: "Hits do Momento",
    image: "https://i.scdn.co/image/ab67706f000000029bb920f1adfae9f6a8b1b6f1",
    link: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
  },
  {
    title: "Indie Brasil",
    image: "https://i.scdn.co/image/ab67706f0000000295ec0eb2e6e1341e6ef43b6a",
    link: "https://open.spotify.com/playlist/37i9dQZF1DXb57FjYWz00c",
  },
];

export default function App() {
  const [searchedArtist, setSearchedArtist] = useState<any>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleArtistSearch(artist: string) {
    setError(null);
    setLoading(true);
    setSearchedArtist(null);
    setAlbums([]);

    try {
      const artistData = await fetchSpotifyArtist(artist, SPOTIFY_TOKEN);
      if (!artistData) {
        setError("Artista não encontrado.");
        setLoading(false);
        return;
      }
      setSearchedArtist(artistData);

      const albumsData = await fetchSpotifyAlbums(artistData.id, SPOTIFY_TOKEN);
      setAlbums(albumsData.slice(0, 3)); // mostra até 3 álbuns
    } catch (err: any) {
      setError("Erro ao buscar dados no Spotify.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#121212", color: "#fff" }}>
      <Header />
      <Banner userName="visitante" onSearch={handleArtistSearch} />
      <main style={{ maxWidth: 800, margin: "0 auto" }}>
        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: "#ff7272" }}>{error}</p>}
        {searchedArtist && (
          <section style={{ maxWidth: 700, margin: "0 auto", marginTop: 16 }}>
            <h3>
              {searchedArtist.name}
              {searchedArtist.external_urls?.spotify && (
                <a
                  href={searchedArtist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: 10, color: "#1db954", fontWeight: 600 }}
                >
                  Ver no Spotify
                </a>
              )}
            </h3>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
              {searchedArtist.images?.[0]?.url && (
                <img
                  src={searchedArtist.images[0].url}
                  alt={searchedArtist.name}
                  style={{ width: 180, borderRadius: 12 }}
                />
              )}
              <div>
                <h4 style={{ marginTop: 0 }}>Álbuns recentes:</h4>
                <ul style={{ paddingLeft: 20 }}>
                  {albums.map((album) => (
                    <li key={album.id} style={{ marginBottom: 8 }}>
                      <img
                        src={album.images[0]?.url}
                        alt={album.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 8,
                          marginRight: 8,
                          verticalAlign: "middle",
                        }}
                      />
                      <span style={{ verticalAlign: "middle" }}>{album.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Suas playlists (opcional) */}
        <section
          style={{
            marginTop: 48,
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {playlists.map((pl) => (
            <PlaylistCard key={pl.title} {...pl} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}

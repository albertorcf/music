import { useState } from "react";
import { Header } from "./components/Header";
import { Banner } from "./components/Banner";
import { Footer } from "./components/Footer";
import { fetchSpotifyArtist, fetchSpotifyAlbums } from "./utils/fetchSpotifyArtist";
import { fetchWikipediaBio } from "./utils/fetchWikipediaBio";
import { getSpotifyToken } from "./utils/getSpotifyToken";

//const SPOTIFY_TOKEN = await getSpotifyToken();

export default function App() {
  const [searchedArtist, setSearchedArtist] = useState<any>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [bio, setBio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleArtistSearch(artist: string) {
    setError(null);
    setLoading(true);
    setSearchedArtist(null);
    setAlbums([]);
    setBio(null);

    try {
      const SPOTIFY_TOKEN = await getSpotifyToken();

      const artistData = await fetchSpotifyArtist(artist, SPOTIFY_TOKEN);
      if (!artistData) {
        setError("Artista não encontrado.");
        setLoading(false);
        return;
      }
      setSearchedArtist(artistData);

      const albumsData = await fetchSpotifyAlbums(artistData.id, SPOTIFY_TOKEN);
      setAlbums(albumsData.slice(0, 3)); // mostra até 3 álbuns

      // Busca a biografia (Wiki)
      const wikiBio = await fetchWikipediaBio(artistData.name);
      setBio(wikiBio);
    
    } catch (err: any) {
      setError("Erro ao buscar dados no Spotify/Wikipedia.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#121212", color: "#fff" }}>
      <Header />
      
      <Banner userName="visitante" onSearch={handleArtistSearch} />
      <main style={{ maxWidth: 900, margin: "0 auto" }}>
        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: "#ff7272" }}>{error}</p>}
        {searchedArtist && (
          <section style={{ maxWidth: 900, margin: "0 auto", marginTop: 16 }}>
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
            <div style={{ display: "flex", alignItems: "flex-start", gap: 36 }}>
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
                      <span style={{ verticalAlign: "middle" }}>
                        {album.name}
                        {" "}
                        <span style={{ color: "#bbb", fontSize: "0.95em" }}>
                          ({album.release_date?.slice(0, 4) || "----"})
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {bio && (
                <div
                  style={{
                    marginLeft: 12,
                    maxWidth: 260,
                    background: "#222",
                    borderRadius: 12,
                    padding: "1rem",
                    fontSize: "1rem",
                    lineHeight: 1.4,
                  }}
                >
                  <strong>Biografia</strong>
                  <p style={{ margin: "0.5rem 0 0 0" }}>{bio}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

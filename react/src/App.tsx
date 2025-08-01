import { useState } from "react";
import { Header } from "./components/Header";
import { Banner } from "./components/Banner";
import { Footer } from "./components/Footer";
import { fetchSpotifyArtist, fetchSpotifyAlbums } from "./utils/fetchSpotifyArtist";
import { fetchWikipediaBio } from "./utils/fetchWikipediaBio";
import { getSpotifyToken } from "./utils/getSpotifyToken";

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
          <section
            style={{
              background: "linear-gradient(90deg, #191414 0%, #222 100%)",
              color: "#fff",
              borderRadius: 16,
              maxWidth: 600,
              margin: "1.5rem auto",
              boxShadow: "0 4px 24px #0004",
              padding: "2rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 24,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {/* Imagem do artista */}
              {searchedArtist.images?.[0]?.url && (
                <img
                  src={searchedArtist.images[0].url}
                  alt={searchedArtist.name}
                  style={{
                    width: 120,
                    minWidth: 100,
                    maxWidth: "40vw",
                    borderRadius: 12,
                    objectFit: "cover",
                    boxShadow: "0 2px 8px #19141480",
                    marginBottom: 0,
                  }}
                />
              )}

              {/* Álbuns recentes */}
              <div style={{ flex: 1, minWidth: 180 }}>
                <h3 style={{ margin: "0 0 0.7em 0" }}>
                  {searchedArtist.name}
                  {searchedArtist.external_urls?.spotify && (
                    <a
                      href={searchedArtist.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: 12,
                        color: "#1db954",
                        fontWeight: 600,
                        fontSize: "0.97em",
                      }}
                    >
                      Ver no Spotify
                    </a>
                  )}
                </h3>
                <h4 style={{ margin: "0 0 0.4em 0" }}>Álbuns recentes:</h4>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1.1em",
                  }}
                >
                  {albums.map((album) => (
                    <div
                      key={album.id}
                      style={{
                        background: "#232323",
                        borderRadius: 10,
                        padding: 8,
                        minWidth: 80,
                        maxWidth: 110,
                        textAlign: "center",
                        boxShadow: "0 2px 6px #0002",
                      }}
                    >
                      <img
                        src={album.images[0]?.url}
                        alt={album.name}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 6,
                          objectFit: "cover",
                          marginBottom: 6,
                        }}
                      />
                      <div style={{ fontSize: "0.97em", fontWeight: 500, marginBottom: 2 }}>
                        {album.name}
                      </div>
                      <div style={{ color: "#bbb", fontSize: "0.92em" }}>
                        {album.release_date?.slice(0, 4) || "----"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* BIOGRAFIA ABAIXO */}
            {bio && (
              <div
                style={{
                  marginTop: 6,
                  width: "100%",
                  background: "#181818cc",
                  borderRadius: 10,
                  padding: "1em 1em 0.8em 1em",
                  fontSize: "1.04em",
                  lineHeight: 1.45,
                  color: "#fff",
                  textAlign: "left",
                  boxShadow: "0 2px 6px #0001",
                }}
              >
                <strong>Biografia</strong>
                <p style={{ margin: "0.4em 0 0 0" }}>{bio}</p>
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

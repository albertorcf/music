// react/src/pages/Home.tsx
import { Banner } from "../components/Banner";
import { useArtistSearch } from "../hooks/useArtistSearch";
import { SpotifyStatus } from "../components/SpotifyStatus";
import { ArtistInfo } from "../components/ArtistInfo";
import { useAuth } from "../auth/useAuth"; // Importa o hook

export default function Home() {
  const { session } = useAuth(); // Usa o hook para obter a sessão
  const { searchedArtist, albums, bio, loading, error, handleArtistSearch } = useArtistSearch();

  return (
    <div style={{ minHeight: "100vh", background: "#121212", color: "#fff" }}>
      {/* O SpotifyStatus agora obtém o estado de autenticação por conta própria */}
      <SpotifyStatus />

      {/* Passa o nome do usuário para o Banner, se a sessão existir */}
      <Banner userName={session?.user?.name || "visitante"} onSearch={handleArtistSearch} />

      <main style={{ maxWidth: 900, margin: "0 auto" }}>
        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: "#ff7272" }}>{error}</p>}
        <ArtistInfo searchedArtist={searchedArtist} albums={albums} bio={bio} />
      </main>
    </div>
  );
}

// react/src/pages/Home.tsx

import { Banner } from "../components/Banner";
import { useArtistSearch } from "../hooks/useArtistSearch";

import { SpotifyStatus } from "../components/SpotifyStatus";
import { ArtistInfo } from "../components/ArtistInfo";

type HomeProps = {
  authInfo: any;
  checkingLogin: boolean;
};

export default function Home({ authInfo, checkingLogin }: HomeProps) {
  // --- Hook customizado para busca de artista, álbuns e bio ---
  const {
    searchedArtist,
    albums,
    bio,
    loading,
    error,
    handleArtistSearch,
  } = useArtistSearch();


  // --- Renderização ---
  return (
    <div style={{ minHeight: "100vh", background: "#121212", color: "#fff" }}>

      {/* --- Status do login do Spotify --- */}
      <SpotifyStatus authInfo={authInfo} checkingLogin={checkingLogin} />

      <Banner userName="visitante" onSearch={handleArtistSearch} />

      <main style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* --- Mensagens de carregamento e erro --- */}
        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: "#ff7272" }}>{error}</p>}

        {/* --- Resultado da busca --- */}
        <ArtistInfo searchedArtist={searchedArtist} albums={albums} bio={bio} />
      </main>
    </div>
  );
}
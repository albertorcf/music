import React, { useState } from "react";
import { Header } from "./components/Header";
import { Banner } from "./components/Banner";
import { PlaylistCard } from "./components/PlaylistCard";
import { Footer } from "./components/Footer";

// ...mock playlists array

export default function App() {
  const [searchedArtist, setSearchedArtist] = useState<string | null>(null);

  function handleArtistSearch(artist: string) {
    console.log(artist);
    setSearchedArtist(artist);
    // Aqui você vai chamar a função que consulta a API do Spotify futuramente!
  }

  return (
    <div style={{ minHeight: "100vh", background: "#121212", color: "#fff" }}>
      <Header />
      <Banner userName="visitante" onSearch={handleArtistSearch} />
      {/* O resto da sua home */}
      <main>
        {/* ...Playlists ou outra seção */}
      </main>
      <Footer />
    </div>
  );
}

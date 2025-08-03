// react/src/components/Banner.tsx
import React, { useState } from "react";
import { cardStyleGreen } from "../styles/sharedStyles";

type BannerProps = {
  userName?: string;
  onSearch: (artist: string) => void;
};

export const Banner: React.FC<BannerProps> = ({ userName = "visitante", onSearch }) => {
  const [artist, setArtist] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (artist.trim()) {
      onSearch(artist.trim());
    }
  };

  return (
    <section style={cardStyleGreen} aria-label="Banner de boas-vindas">
      <h2 style={{ marginBottom: 8 }}>Olá! Bem-vindo ao Music Social!</h2>

      <p style={{ marginBottom: 16, fontSize: "1.1rem" }}>
        Digite o nome do seu artista ou banda favorita:
      </p>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: 12,
        }}
      >
        <input
          type="text"
          placeholder="Digite o nome do artista ou banda"
          value={artist}
          onChange={e => setArtist(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: 8,
            border: "none",
            minWidth: 0,
            flex: 1,
            fontSize: "1rem",
            outline: "none",
          }}
          aria-label="Nome do artista ou banda"
        />
        <button
          type="submit"
          style={{
            background: "#1db954",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "0 1.25rem",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 8px #19141488",
            transition: "background .2s",
          }}
        >
          Pesquisar
        </button>
      </form>
    </section>
  );
};

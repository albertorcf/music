import React from "react";
import { SpotifyLoginButton } from "../components/SpotifyLoginButton";

export const Header: React.FC = () => (
  <header
    style={{
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "1rem 2rem",
      background: "#191414",
      color: "#fff",
    }}
  >
    <img
      src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
      alt="Spotify"
      style={{ height: 32 }}
    />
    <h1 style={{ fontWeight: 700, fontSize: "1.5rem" }}>Music Social</h1>
    <nav style={{ marginLeft: "auto" }}>
      <a href="#" style={{ color: "#fff", marginRight: 20 }}>
        Início
      </a>
      <a href="#" style={{ color: "#fff", marginRight: 20 }}>
        Pesquisar
      </a>
      <a href="#" style={{ color: "#fff" }}>
        Meu Perfil
      </a>
    </nav>

    <SpotifyLoginButton />
  </header>
);

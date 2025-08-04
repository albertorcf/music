import React from "react";
import { useAuth } from "../auth/useAuth";
import { SpotifyLoginButton } from "./SpotifyLoginButton";

export const Header: React.FC = () => {
  const { session, logout } = useAuth();

  return (
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

      {session ? (
        <button
          onClick={logout}
          style={{
            background: "#1db954",
            color: "#fff",
            border: "none",
            borderRadius: 20,
            padding: "0.5em 1.2em",
            fontWeight: 600,
            fontSize: "1em",
            marginLeft: 12,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      ) : (
        <SpotifyLoginButton
          style={{
            background: "#1db954",
            color: "#fff",
            border: "none",
            borderRadius: 20,
            padding: "0.5em 1.2em",
            fontWeight: 600,
            fontSize: "1em",
            marginLeft: 12,
            cursor: "pointer",
          }}
        />
      )}
    </header>
  );
};

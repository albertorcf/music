import React from "react";

export const Footer: React.FC = () => (
  <footer
    style={{
      background: "#191414",
      color: "#fff",
      textAlign: "center",
      padding: "1rem",
      marginTop: "2rem",
      fontSize: "0.95rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    }}
  >
    <span>Conteúdo fornecido por</span>
    <img
      src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
      alt="Spotify"
      style={{ height: 20 }}
    />
  </footer>
);

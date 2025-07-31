import React from "react";

type PlaylistCardProps = {
  title: string;
  image: string;
  link: string;
};

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ title, image, link }) => (
  <div
    style={{
      borderRadius: 16,
      background: "#282828",
      color: "#fff",
      width: 220,
      padding: 16,
      margin: 12,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: "0 2px 8px #0002",
    }}
    aria-label={`Playlist: ${title}`}
  >
    <img
      src={image}
      alt={`Capa da playlist ${title}`}
      style={{ width: 180, height: 180, borderRadius: 8, marginBottom: 8 }}
    />
    <div style={{ fontWeight: 500, marginBottom: 8 }}>{title}</div>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#1db954",
        fontWeight: 600,
        textDecoration: "none",
      }}
    >
      Ver no Spotify
    </a>
  </div>
);

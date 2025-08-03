// react/src/components/ArtistInfo.tsx

/**
 * Exibe informações do artista: nome, link Spotify, álbuns e biografia.
 */
type ArtistInfoProps = {
  searchedArtist: any;
  albums: any[];
  bio: string | null;
};

export function ArtistInfo({ searchedArtist, albums, bio }: ArtistInfoProps) {
  if (!searchedArtist) return null;

  return (
    <section
      style={{
        background: "linear-gradient(90deg, #292424 30%, #393434 100%)",
        color: "#fff",
        padding: "1.5rem 1rem 1.5rem 1rem",
        borderRadius: 16,
        maxWidth: 600,
        margin: "1rem auto 1rem auto",
        boxShadow: "0 4px 24px #0004",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Info artista e álbuns recentes */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 24,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Nome da banda e link para Spotify */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <h3 style={{ margin: "0 0 0.7em 0.5em" }}>
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

          {/* Álbuns recentes */}
          <h4 style={{ margin: "0 0 0.4em 0.5em" }}>Álbuns mais recentes:</h4>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.1em",
              margin: "0 0 0 0.5em"
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

      {/* Biografia: imagem à esquerda, texto ao redor (float) */}
      {bio && (
        <div
          style={{
            marginTop: 0,
            width: "100%",
            borderRadius: 10,
            padding: "1em 1em 0.8em 1em",
            fontSize: "1.04em",
            lineHeight: 1.45,
            color: "#fff",
            textAlign: "left",
            boxShadow: "0 2px 6px #0001",
            minHeight: 100,
          }}
        >
          <strong>Biografia</strong>
          <div style={{ margin: "0.7em 0 0 0", minHeight: 70 }}>
            {/* Imagem pequena do artista à esquerda da bio */}
            {searchedArtist.images?.[1]?.url && (
              <img
                src={searchedArtist.images[1]?.url || searchedArtist.images[0]?.url}
                alt={searchedArtist.name}
                style={{
                  float: "left",
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  marginRight: 16,
                  marginBottom: 4,
                  borderRadius: 8,
                  boxShadow: "0 1px 4px #1118",
                }}
              />
            )}
            {/* Texto da biografia "abraçando" a imagem */}
            <span>{bio}</span>
          </div>
          <div style={{ clear: "both" }} />
        </div>
      )}
    </section>
  );
}

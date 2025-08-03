// react/src/components/SpotifyStatus.tsx

/**
 * Exibe o status do login do Spotify, música tocando e dispositivos ativos.
 */
type SpotifyStatusProps = {
  authInfo: any;
  checkingLogin: boolean;
};


export function SpotifyStatus({ authInfo, checkingLogin }: SpotifyStatusProps) {
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
      }}
      aria-label="Status do Spotify"
    >
      {checkingLogin && (
        <div style={{ color: "#bbb" }}>
          <em>Checando login no Spotify...</em>
        </div>
      )}
      {authInfo && authInfo.loggedIn && (
        <div style={{ color: "#1db954", marginBottom: 8 }}>
          <strong>Você está logado no Spotify!</strong>

          {/* Música tocando */}
          <div style={{ marginTop: 8 }}>
            <b>Música tocando:</b>{" "}
            {authInfo.playing && authInfo.playing.item ? (
              <span style={{ color: "#fff" }}>
                {authInfo.playing.item.name}{" "}
                <span style={{ color: "#bbb" }}>
                  (por {authInfo.playing.item.artists.map((a: any) => a.name).join(", ")})
                </span>
              </span>
            ) : (
              <span style={{ color: "#bbb" }}>Nenhuma música tocando no momento.</span>
            )}
          </div>

          {/* Dispositivos */}
          <div style={{ marginTop: 8 }}>
            <b>Dispositivos ativos:</b>{" "}
            {authInfo.devices && authInfo.devices.length > 0 ? (
              <>
                <span style={{ color: "#fff" }}>
                  {authInfo.devices.map((d: any) => d.name).join(", ")}
                </span>
                <br />
                <span style={{ color: "#fff" }}>
                  {(() => {
                    const atual = authInfo.devices.find((d: any) => d.is_active);
                    return atual
                      ? <><b style={{ color: "#1db954" }}>Dispositivo atual:</b> {atual.name}</>
                      : <span style={{ color: "#bbb" }}>Nenhum dispositivo em uso agora</span>;
                  })()}
                </span>
              </>
            ) : (
              <span style={{ color: "#bbb" }}>Nenhum dispositivo encontrado.</span>
            )}
          </div>
        </div>
      )}
      {authInfo && !authInfo.loggedIn && (
        <div style={{ color: "#ff7272", marginBottom: 8 }}>
          Não está logado no Spotify: {authInfo.error}
        </div>
      )}
    </section>
  );
}

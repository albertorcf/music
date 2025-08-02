// react/src/components/SpotifyLoginButton.tsx

// Aqui lemos a variável de ambiente do Vite/React
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
console.log('CLIENT_ID=', CLIENT_ID)
const REDIRECT_URI = "http://127.0.0.1:5173/callback";
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state"
].join(" ");

type SpotifyLoginButtonProps = {
  onLoginChange?: () => void;
};

export function SpotifyLoginButton(props: SpotifyLoginButtonProps) {
  const handleLogin = () => {
    // Checagem extra para debug
    if (!CLIENT_ID) {
      alert("CLIENT_ID não encontrado! Confira seu .env e reinicie o servidor.");
      return;
    }

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      show_dialog: "true"
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  // Quando login for bem-sucedido, se props.onLoginChange existir, chame-a
  // Exemplo:
  // if (props.onLoginChange) props.onLoginChange();
  return (
    <button
      onClick={handleLogin}
      style={{
        background: "#1db954",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "0.8em 1.8em",
        fontWeight: 600,
        fontSize: "1em",
        margin: "1em 0",
        cursor: "pointer"
      }}
    >
      Login com Spotify
    </button>
  );
}

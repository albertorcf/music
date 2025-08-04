// react/src/components/SpotifyLoginButton.tsx
import { useAuth } from "../auth/useAuth"; // Importa o hook useAuth

type SpotifyLoginButtonProps = {
  style?: React.CSSProperties;
};

export function SpotifyLoginButton(props: SpotifyLoginButtonProps) {
  const { login } = useAuth(); // Usa o hook para obter a função de login

  return (
    <button
      onClick={login} // Chama a função de login do contexto
      style={props.style}
    >
      Login com Spotify
    </button>
  );
}

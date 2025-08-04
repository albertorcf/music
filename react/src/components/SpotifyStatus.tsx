// react/src/components/SpotifyStatus.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth";
import { fetchSpotifyPlayback } from "../utils/fetchSpotifyPlayback";
import { cardStyle } from "../styles/sharedStyles";

export function SpotifyStatus() {
  const { session, loading } = useAuth();
  const [playback, setPlayback] = useState<any>(null);

  useEffect(() => {
    const accessToken = session?.accessToken;

    // Se não há token, não faz nada e limpa o playback anterior.
    if (!accessToken) {
      setPlayback(null);
      return;
    }

    // Função para buscar os dados
    const fetchPlayback = () => {
      fetchSpotifyPlayback(accessToken).then(setPlayback);
    };

    // Busca imediatamente ao carregar o componente ou ao trocar de usuário
    fetchPlayback();

    // Cria um intervalo para verificar a música a cada 30 segundos
    const intervalId = setInterval(fetchPlayback, 30000);

    // Função de limpeza: remove o intervalo quando o componente é desmontado
    // ou quando o accessToken muda, para evitar vazamentos de memória.
    return () => clearInterval(intervalId);

  }, [session?.accessToken]); // O efeito só roda novamente se o token de acesso mudar

  if (loading) {
    return (
      <section style={cardStyle}>
        <em>Verificando autenticação...</em>
      </section>
    );
  }

  if (!session) {
    return null; // Não mostra nada se não estiver logado
  }

  return (
    <section style={cardStyle}>
      <div style={{ color: "#1db954", marginBottom: 8 }}>
        <strong>Logado como {session.user?.name || "Usuário"}!</strong>
      </div>
      <div>
        <b>Música tocando:</b>{" "}
        {playback?.item ? (
          <span>
            {playback.item.name} por{" "}
            {playback.item.artists.map((a: any) => a.name).join(", ")}
          </span>
        ) : (
          <span style={{ color: "#bbb" }}>Nenhuma música tocando.</span>
        )}
      </div>
    </section>
  );
}

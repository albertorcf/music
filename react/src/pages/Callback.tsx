// react/src/pages/Callback.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // IMPORTANTE: useNavigate vem do react-router-dom

/**
 * Página de callback do OAuth Spotify
 * - Lê o code da URL
 * - Chama o backend para trocar pelo access_token do usuário
 * - Mostra status, erros, e token (apenas para debug)
 */
type CallbackProps = {
  onLoginChange?: () => void;
};

export default function Callback({ onLoginChange }: CallbackProps) {
  const location = useLocation();
  const navigate = useNavigate(); // <-- Aqui você declara

  const [code, setCode] = useState<string | null>(null);
  const [token, setToken] = useState<any>(null);
  const [status, setStatus] = useState<"init" | "loading" | "ok" | "error">("init");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Lê o parâmetro "code" da URL
    const params = new URLSearchParams(location.search);
    const codeFromUrl = params.get("code");
    setCode(codeFromUrl);

    // Só chama o backend se houver code
    if (!codeFromUrl) {
      setStatus("init");
      setError(null);
      return;
    }

    setStatus("loading");
    setError(null);

    fetch(`http://localhost:3030/api/auth/callback?code=${encodeURIComponent(codeFromUrl)}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Erro ao autenticar");
        }
        return res.json();
      })
      .then((data) => {
        setToken(data);
        setStatus("ok");
        // Limpa o code da URL
        window.history.replaceState({}, document.title, "/callback");

        // Salva o token no localStorage!
        localStorage.setItem("spotify_token", JSON.stringify(data));
        
        console.log("[Callback] Token de usuário recebido:", data);
        // Chama onLoginChange se existir
        if (onLoginChange) onLoginChange();
        // Redireciona para home após 1s
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
      })
      .catch((err) => {
        setError(err.message || "Erro desconhecido");
        setStatus("error");
      });
  }, [location.search, navigate]);

  return (
    <div style={{ margin: "2em", color: "#fff", maxWidth: 600 }}>
      <h2>Login do Spotify em andamento...</h2>
      <p>
        Código de autorização: <code>{code || "Nenhum código na URL"}</code>
      </p>
      {status === "loading" && <p>Consultando o backend para obter access_token...</p>}
      

      {/* Só mostra erro se há code e status é error e não está em ok */}
      {status === "error" && code && !token && (
        <p style={{ color: "#ff7272" }}>
          Erro ao autenticar: {error}
        </p>
      )}

      {status === "ok" && (
        <div style={{ wordBreak: "break-all", background: "#222", borderRadius: 10, padding: 10, marginTop: 10 }}>
          <strong>Token de acesso recebido!</strong>
          <pre style={{ fontSize: "0.93em", marginTop: 6 }}>
            {JSON.stringify(token, null, 2)}
          </pre>
          {/* Aqui você pode redirecionar, salvar o token em context, etc */}
        </div>
      )}
    </div>
  );
}
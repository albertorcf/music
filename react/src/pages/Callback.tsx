// react/src/pages/Callback.tsx
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Callback() {
  const { handleLoginCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const effectRan = useRef(false); // Flag para lidar com o StrictMode do React

  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Executa apenas uma vez, mesmo no StrictMode
    if (effectRan.current === true) return;
    effectRan.current = true;

    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (!code) {
      setStatus("error");
      setError("Código de autorização não encontrado.");
      return;
    }

    handleLoginCallback(code)
      .then(() => {
        setStatus("ok");
        // Redireciona para a página inicial após o sucesso
        navigate("/", { replace: true });
      })
      .catch((err) => {
        setStatus("error");
        setError(err.message || "Ocorreu um erro desconhecido.");
      });
  }, [handleLoginCallback, location.search, navigate]);

  return (
    <div style={{ margin: "2em", color: "#fff", maxWidth: 600 }}>
      <h2>Autenticação em andamento...</h2>
      {status === "loading" && <p>Verificando autorização, por favor aguarde...</p>}
      {status === "error" && (
        <div style={{ color: "#ff7272" }}>
          <p>Erro ao autenticar:</p>
          <p><i>{error}</i></p>
          <button onClick={() => navigate("/")}>Voltar para a Home</button>
        </div>
      )}
      {status === "ok" && <p>Login realizado com sucesso! Redirecionando...</p>}
    </div>
  );
}


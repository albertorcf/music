// react/src/App.tsx

import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Callback from "./pages/Callback";
import { checkSpotifyAuth } from "./utils/checkSpotifyAuth";

/**
 * Componente principal do app
 */
export default function App() {
  // --- Estado global para status do Spotify login ---
  const [authInfo, setAuthInfo] = useState<any>(null);
  const [checkingLogin, setCheckingLogin] = useState(true);

  // --- Checa login do Spotify ao carregar ---
  useEffect(() => {
    const tokenStr = localStorage.getItem("spotify_token");
    console.log("[App] useEffect: tokenStr=", tokenStr);
    if (tokenStr) {
      const tk = JSON.parse(tokenStr);
      console.log("[App] useEffect: parsed token=", tk);
      checkSpotifyAuth(tk.access_token).then((info) => {
        console.log("[App] checkSpotifyAuth result=", info);
        setAuthInfo(info);
        setCheckingLogin(false);
      });
    } else {
      setCheckingLogin(false);
    }
  }, []);

  // ...outros estados e handlers globais podem ser adicionados aqui...

  return (
    <div style={{ minHeight: "100vh", background: "#121212", color: "#fff" }}>
      <Header onLoginChange={() => {
        // Força rechecagem do login ao logar/deslogar
        const tokenStr = localStorage.getItem("spotify_token");
        if (tokenStr) {
          const tk = JSON.parse(tokenStr);
          checkSpotifyAuth(tk.access_token).then((info) => {
            setAuthInfo(info);
            setCheckingLogin(false);
          });
        } else {
          setAuthInfo(null);
          setCheckingLogin(false);
        }
      }} />

      <Routes>
        <Route path="/" element={<Home authInfo={authInfo} checkingLogin={checkingLogin} />} />
        <Route path="/callback" element={<Callback onLoginChange={() => {
          // Força rechecagem do login ao logar/deslogar
          const tokenStr = localStorage.getItem("spotify_token");
          if (tokenStr) {
            const tk = JSON.parse(tokenStr);
            checkSpotifyAuth(tk.access_token).then((info) => {
              setAuthInfo(info);
              setCheckingLogin(false);
            });
          } else {
            setAuthInfo(null);
            setCheckingLogin(false);
          }
        }} />} />
      </Routes>

      <Footer />
    </div>
  );
}

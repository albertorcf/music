// react/src/App.tsx
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Callback from "./pages/Callback";
import { useAuth } from "./auth/useAuth";

/**
 * Componente principal do app
 */
export default function App() {
  // O hook useAuth é chamado aqui para que o App seja re-renderizado quando a sessão mudar,
  // mas a sessão não precisa ser passada como prop para os filhos.
  useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#121212", color: "#fff" }}>
      {/* Header agora usa o useAuth internamente */}
      <Header />

      <Routes>
        {/* Home e Callback também usam o useAuth internamente */}
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>

      <Footer />
    </div>
  );
}

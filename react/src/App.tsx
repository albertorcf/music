import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";

/**
 * Componente principal do app
 */
export default function App() {
  // --- Renderização ---
  return (
    <div style={{ minHeight: "100vh", background: "#121212", color: "#fff" }}>
      <Header />

      <Home />

      <Footer />
    </div>
  );
}

// react/src/App.tsx
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Callback from "./pages/Callback";

/**
 * Componente principal do app
 */
export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#121212", color: "#fff" }}>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>

      <Footer />
    </div>
  );
}

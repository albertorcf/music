
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.tsx'
import { SpotifyTokenProvider } from './context/SpotifyTokenContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpotifyTokenProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SpotifyTokenProvider>
  </StrictMode>,
)

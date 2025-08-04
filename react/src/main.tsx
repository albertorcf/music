
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { AuthProviderComponent } from './auth/AuthContext'; // Importa o novo provedor

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProviderComponent>
        <App />
      </AuthProviderComponent>
    </BrowserRouter>
  </StrictMode>
);

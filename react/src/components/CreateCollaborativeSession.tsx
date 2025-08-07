// react/src/components/CreateCollaborativeSession.tsx
import { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { cardStyle } from '../styles/sharedStyles';

export function CreateCollaborativeSession() {
  const { session } = useAuth();
  const [playlistName, setPlaylistName] = useState('Playlist21');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlistLink, setPlaylistLink] = useState('');

  const createSession = async () => {
    if (!session?.accessToken) {
      setError('Nenhum usuário logado');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      console.log('Criando playlist...'); // DEBUG

      // 1. Cria a playlist
      const createResponse = await fetch('https://api.spotify.com/v1/me/playlists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: playlistName,
          description: 'Playlist criada via app colaborativo',
          public: false,
          collaborative: true,
        })
      });

      console.log('---'); // DEBUG
      console.log('\nStatus da criação:', createResponse.status);

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error?.message || 'Falha ao criar playlist');
      }

      const playlist = await createResponse.json();
      console.log('---'); // DEBUG
      console.log('Playlist criada:', playlist);

      /*
      // Adicione um delay de 1 segundo entre as requisições
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. Ativa modo colaborativo
      const collaborativeResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
          // Remova o header 'If-None-Match' que estava causando o erro CORS
        },
        body: JSON.stringify({
          name: playlistName, // Mantém o nome original
          public: true,      // Mantém como pública
          collaborative: true // Ativa o modo colaborativo
        })
      });
      console.log('Status modo colaborativo:', collaborativeResponse.status); // DEBUG

      if (!collaborativeResponse.ok) {
        throw new Error('Falha ao ativar modo colaborativo');
      }
      */

      setPlaylistLink(playlist.external_urls.spotify);

      // Verificar o status colaborativo
      const verifyResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      const verifiedPlaylist = await verifyResponse.json();
      console.log('Status final colaborativo:', verifiedPlaylist.collaborative);

    } catch (error) {
      console.error('Erro completo:', error); // DEBUG
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section style={cardStyle}>
      <h3>Criar Sessão Colaborativa</h3>
      {error && <div style={{ color: '#ff7272', marginBottom: 0 }}>{error}</div>}

      <div style={{ margin: '4px' }}>
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          style={{ padding: 4, width: '100%' }}
        />
      </div>

      <button
        onClick={createSession}
        disabled={isCreating}
        style={{
          padding: '4px',
          background: '#1DB954',
          color: 'white',
          border: 'none',
          borderRadius: 4
        }}
      >
        {isCreating ? 'Criando...' : 'Criar Playlist'}
      </button>

      {playlistLink && (
        <div style={{ marginTop: 12 }}>
          <a href={playlistLink} target="_blank" rel="noopener noreferrer">
            Abrir Playlist no Spotify
          </a>
        </div>
      )}
    </section>
  );
}
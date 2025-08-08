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
  const [playlistId, setPlaylistId] = useState('');
  const [tracks, setTracks] = useState<any[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);

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

      setPlaylistLink(playlist.external_urls.spotify);
      setPlaylistId(playlist.id);

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

  const fetchPlaylistTracks = async () => {
    if (!session?.accessToken) {
      setError('Nenhum usuário logado');
      return;
    }

    if (!playlistId) {
      setError('Por favor, insira o ID ou URL da playlist');
      return;
    }

    setIsLoadingTracks(true);
    setError(null);
    setTracks([]);

    try {
      // Extrai o ID da URL se necessário
      const id = playlistId.includes('/') ? playlistId.split('/').pop()?.split('?')[0] : playlistId;

      const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Falha ao buscar as músicas da playlist');
      }

      const data = await response.json();
      setTracks(data.items);

    } catch (error) {
      console.error('Erro ao buscar músicas:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsLoadingTracks(false);
    }
  };

  return (
    <section style={cardStyle}>
      <h3>Criar Sessão Colaborativa</h3>
      {error && <div style={{ color: '#ff7272', fontSize: 14 }}>{error}</div>}

      <input
        type="text"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        style={{
          padding: '2px 6px',
          width: '100%',
          fontSize: 15,
          borderRadius: 4,
          border: '1px solid #444',
          background: '#222',
          color: '#fff',
          boxSizing: 'border-box',
          minWidth: 0
        }}
      />

      <button
        onClick={createSession}
        disabled={isCreating}
        style={{
          padding: '4px 10px',
          background: '#1DB954',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          fontSize: 15,
          marginTop: 2
        }}
      >
        {isCreating ? 'Criando...' : 'Criar Playlist'}
      </button>

      {playlistLink && (
        <div style={{ marginTop: 8 }}>
          <p style={{ margin: '8px 0' }}>ID da Playlist: {playlistId}</p>
          <a href={playlistLink} target="_blank" rel="noopener noreferrer">
            Abrir Playlist no Spotify
          </a>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="ID ou URL da Playlist"
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
          style={{
            padding: '2px 6px',
            width: 'calc(100% - 140px)',
            fontSize: 15,
            borderRadius: 4,
            border: '1px solid #444',
            background: '#222',
            color: '#fff',
            boxSizing: 'border-box',
            minWidth: 0,
            marginRight: 8
          }}
        />
        <button
          onClick={fetchPlaylistTracks}
          disabled={isLoadingTracks}
          style={{
            padding: '4px 10px',
            background: '#1DB954',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 15,
          }}
        >
          {isLoadingTracks ? 'Buscando...' : 'Buscar/Atualizar'}
        </button>
      </div>

      {tracks.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4>Músicas na Playlist:</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tracks.map((item, index) => (
              <li key={index} style={{ marginBottom: 4 }}>
                {item.track.name} - {item.track.artists.map((artist: any) => artist.name).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
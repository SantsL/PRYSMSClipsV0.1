import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Loadout {
  id: string;
  user_id: string;
  username: string;
  weapon_id: string;
  skin_id: string;
  stickers: string[];
  color: string;
  votes: number;
  created_at: string;
}

interface LoadoutVotingProps {
  onVote: (loadoutId: string) => void;
}

const LoadoutVoting: React.FC<LoadoutVotingProps> = ({ onVote }) => {
  const [loadouts, setLoadouts] = useState<Loadout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'top' | 'recent'>('all');

  useEffect(() => {
    const fetchLoadouts = async () => {
      try {
        setLoading(true);
        // Em um ambiente de produção, isso seria substituído pela chamada real à API
        // const response = await axios.get('/api/loadout/loadouts');
        
        // Usando dados mockados para desenvolvimento
        const mockLoadouts: Loadout[] = [
          {
            id: "loadout1",
            user_id: "user1",
            username: "ProGamer123",
            weapon_id: "weapon1",
            skin_id: "skin1",
            stickers: ["sticker1", "sticker3"],
            color: "#FF5500",
            votes: 120,
            created_at: "2025-05-20T14:30:00Z"
          },
          {
            id: "loadout2",
            user_id: "user2",
            username: "GameMaster",
            weapon_id: "weapon3",
            skin_id: "skin3",
            stickers: ["sticker2", "sticker5"],
            color: "#00AAFF",
            votes: 85,
            created_at: "2025-05-21T10:15:00Z"
          },
          {
            id: "loadout3",
            user_id: "user3",
            username: "NinjaStreamer",
            weapon_id: "weapon4",
            skin_id: "skin4",
            stickers: ["sticker4", "sticker6"],
            color: "#FFAA00",
            votes: 67,
            created_at: "2025-05-22T18:45:00Z"
          },
          {
            id: "loadout4",
            user_id: "user4",
            username: "GamerGirl",
            weapon_id: "weapon2",
            skin_id: "skin2",
            stickers: ["sticker1", "sticker2"],
            color: "#FF00AA",
            votes: 42,
            created_at: "2025-05-23T09:30:00Z"
          }
        ];
        
        setLoadouts(mockLoadouts);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar loadouts. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchLoadouts();
  }, []);

  const handleVote = async (loadoutId: string) => {
    try {
      // Em um ambiente de produção, isso seria substituído pela chamada real à API
      // await axios.post(`/api/loadout/loadouts/${loadoutId}/vote`);
      
      // Simulando o voto localmente
      setLoadouts(prevLoadouts => 
        prevLoadouts.map(loadout => 
          loadout.id === loadoutId 
            ? { ...loadout, votes: loadout.votes + 1 } 
            : loadout
        )
      );
      
      // Notificar o componente pai
      onVote(loadoutId);
    } catch (err) {
      setError('Erro ao votar. Tente novamente mais tarde.');
    }
  };

  // Filtrar e ordenar loadouts
  const getFilteredLoadouts = () => {
    let filtered = [...loadouts];
    
    switch (filter) {
      case 'top':
        // Ordenar por número de votos (decrescente)
        return filtered.sort((a, b) => b.votes - a.votes);
      case 'recent':
        // Ordenar por data de criação (mais recente primeiro)
        return filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        // Padrão: todos os loadouts
        return filtered;
    }
  };

  const filteredLoadouts = getFilteredLoadouts();

  return (
    <div className="loadout-voting">
      <h2>Loadouts da Comunidade</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="voting-filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          Todos
        </button>
        <button 
          className={filter === 'top' ? 'active' : ''} 
          onClick={() => setFilter('top')}
        >
          Mais Votados
        </button>
        <button 
          className={filter === 'recent' ? 'active' : ''} 
          onClick={() => setFilter('recent')}
        >
          Mais Recentes
        </button>
      </div>
      
      {loading ? (
        <div className="loading">Carregando loadouts...</div>
      ) : (
        <div className="loadouts-grid">
          {filteredLoadouts.map(loadout => (
            <div key={loadout.id} className="loadout-card">
              <div className="loadout-header">
                <h3>{loadout.username}</h3>
                <span className="votes-count">{loadout.votes} votos</span>
              </div>
              
              <div className="loadout-preview" style={{ borderColor: loadout.color }}>
                {/* Em uma implementação real, aqui seria exibida a imagem da arma com skin e stickers */}
                <div className="loadout-image-placeholder">
                  Visualização do Loadout
                </div>
              </div>
              
              <div className="loadout-actions">
                <button 
                  className="vote-button"
                  onClick={() => handleVote(loadout.id)}
                >
                  Votar
                </button>
                <button className="share-button">
                  Compartilhar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoadoutVoting;

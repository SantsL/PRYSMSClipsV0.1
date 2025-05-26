import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BombGameRanking.css';

interface RankingEntry {
  id: string;
  username: string;
  time: number;
  difficulty: string;
  date: string;
  cooperative: boolean;
}

const BombGameRanking: React.FC = () => {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'solo' | 'coop'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard' | 'extreme'>('all');

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        // Em um ambiente de produção, isso seria substituído pela chamada real à API
        // const response = await axios.get('/api/bomb_game/rankings');
        
        // Usando dados mockados para desenvolvimento
        const mockRankings: RankingEntry[] = [
          {
            id: "rank1",
            username: "ProGamer123",
            time: 12,
            difficulty: "hard",
            date: "2025-05-24T14:30:00Z",
            cooperative: false
          },
          {
            id: "rank2",
            username: "GameMaster",
            time: 15,
            difficulty: "extreme",
            date: "2025-05-23T10:15:00Z",
            cooperative: false
          },
          {
            id: "rank3",
            username: "NinjaStreamer",
            time: 18,
            difficulty: "medium",
            date: "2025-05-22T18:45:00Z",
            cooperative: true
          },
          {
            id: "rank4",
            username: "GamerGirl",
            time: 22,
            difficulty: "easy",
            date: "2025-05-21T09:30:00Z",
            cooperative: false
          },
          {
            id: "rank5",
            username: "EsportsLegend",
            time: 10,
            difficulty: "hard",
            date: "2025-05-20T16:20:00Z",
            cooperative: true
          }
        ];
        
        setRankings(mockRankings);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar ranking. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  // Filtrar rankings
  const getFilteredRankings = () => {
    let filtered = [...rankings];
    
    // Filtrar por modo de jogo
    if (filter === 'solo') {
      filtered = filtered.filter(entry => !entry.cooperative);
    } else if (filter === 'coop') {
      filtered = filtered.filter(entry => entry.cooperative);
    }
    
    // Filtrar por dificuldade
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(entry => entry.difficulty === difficultyFilter);
    }
    
    // Ordenar por tempo (mais rápido primeiro)
    return filtered.sort((a, b) => a.time - b.time);
  };

  const filteredRankings = getFilteredRankings();

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Obter classe CSS para dificuldade
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      case 'extreme': return 'difficulty-extreme';
      default: return '';
    }
  };

  return (
    <div className="bomb-game-ranking">
      <h2>Ranking de Desarme de Bomba</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="ranking-filters">
        <div className="filter-group">
          <span className="filter-label">Modo:</span>
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button 
            className={filter === 'solo' ? 'active' : ''} 
            onClick={() => setFilter('solo')}
          >
            Solo
          </button>
          <button 
            className={filter === 'coop' ? 'active' : ''} 
            onClick={() => setFilter('coop')}
          >
            Cooperativo
          </button>
        </div>
        
        <div className="filter-group">
          <span className="filter-label">Dificuldade:</span>
          <button 
            className={difficultyFilter === 'all' ? 'active' : ''} 
            onClick={() => setDifficultyFilter('all')}
          >
            Todas
          </button>
          <button 
            className={difficultyFilter === 'easy' ? 'active' : ''} 
            onClick={() => setDifficultyFilter('easy')}
          >
            Fácil
          </button>
          <button 
            className={difficultyFilter === 'medium' ? 'active' : ''} 
            onClick={() => setDifficultyFilter('medium')}
          >
            Médio
          </button>
          <button 
            className={difficultyFilter === 'hard' ? 'active' : ''} 
            onClick={() => setDifficultyFilter('hard')}
          >
            Difícil
          </button>
          <button 
            className={difficultyFilter === 'extreme' ? 'active' : ''} 
            onClick={() => setDifficultyFilter('extreme')}
          >
            Extremo
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Carregando ranking...</div>
      ) : (
        <div className="ranking-table-container">
          <table className="ranking-table">
            <thead>
              <tr>
                <th>Posição</th>
                <th>Jogador</th>
                <th>Tempo</th>
                <th>Dificuldade</th>
                <th>Modo</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredRankings.map((entry, index) => (
                <tr key={entry.id}>
                  <td className="position">{index + 1}</td>
                  <td className="username">{entry.username}</td>
                  <td className="time">{entry.time}s</td>
                  <td className={`difficulty ${getDifficultyClass(entry.difficulty)}`}>
                    {entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)}
                  </td>
                  <td className="mode">{entry.cooperative ? 'Cooperativo' : 'Solo'}</td>
                  <td className="date">{formatDate(entry.date)}</td>
                </tr>
              ))}
              
              {filteredRankings.length === 0 && (
                <tr>
                  <td colSpan={6} className="no-results">
                    Nenhum resultado encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BombGameRanking;

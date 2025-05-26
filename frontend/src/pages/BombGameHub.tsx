import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import BombDefusal from '../components/bomb_game/BombDefusal';
import BombGameRanking from '../components/bomb_game/BombGameRanking';
import './BombGameHub.css';

const BombGameHub: React.FC = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'extreme'>('medium');
  const [showCreateRoom, setShowCreateRoom] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>('');
  const [role, setRole] = useState<'instructor' | 'defuser'>('instructor');
  const [rewards, setRewards] = useState<{
    prysms: number;
    totalGames: number;
    successfulGames: number;
    bestTime: number | null;
  }>({
    prysms: 0,
    totalGames: 0,
    successfulGames: 0,
    bestTime: null
  });

  // Gerar ID de sala aleatório
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Criar nova sala
  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setShowCreateRoom(true);
  };

  // Entrar em sala existente
  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      alert('Por favor, insira um ID de sala válido.');
      return;
    }
    
    navigate(`/minigame/bomb/coop/${roomId}/${role}`);
  };

  // Jogar modo solo
  const handlePlaySolo = () => {
    navigate('/minigame/bomb/solo');
  };

  // Voltar ao menu principal
  const handleBackToMenu = () => {
    navigate('/minigame');
  };

  return (
    <div className="bomb-game-hub">
      <header className="bomb-game-header">
        <h1>Desarme de Bomba</h1>
        <p>Resolva puzzles sob tempo para desarmar a bomba e ganhe PRYSMS!</p>
      </header>

      <div className="hub-content">
        <div className="game-modes">
          <h2>Escolha um Modo de Jogo</h2>
          
          <div className="mode-cards">
            <div className="mode-card" onClick={handlePlaySolo}>
              <div className="mode-icon">🎮</div>
              <h3>Modo Solo</h3>
              <p>Desarme a bomba sozinho contra o tempo.</p>
              <button className="play-button">Jogar Solo</button>
            </div>
            
            <div className="mode-card" onClick={handleCreateRoom}>
              <div className="mode-icon">👥</div>
              <h3>Modo Cooperativo</h3>
              <p>Um jogador vê a sequência, outro desarma a bomba.</p>
              <button className="play-button">Jogar Cooperativo</button>
            </div>
            
            <div className="mode-card">
              <div className="mode-icon">🏆</div>
              <h3>Ranking</h3>
              <p>Veja os melhores tempos de desarme.</p>
              <Link to="/minigame/bomb/ranking" className="play-button">Ver Ranking</Link>
            </div>
          </div>
        </div>
        
        {showCreateRoom && (
          <div className="coop-setup">
            <h2>Configurar Sala Cooperativa</h2>
            
            <div className="room-info">
              <div className="room-id">
                <span>ID da Sala:</span>
                <strong>{roomId}</strong>
                <button 
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(roomId);
                    alert('ID da sala copiado para a área de transferência!');
                  }}
                >
                  Copiar
                </button>
              </div>
              
              <p className="room-instructions">
                Compartilhe este ID com seu parceiro para que ele possa entrar na sala.
              </p>
            </div>
            
            <div className="role-selection">
              <h3>Escolha seu papel:</h3>
              
              <div className="role-options">
                <div 
                  className={`role-option ${role === 'instructor' ? 'selected' : ''}`}
                  onClick={() => setRole('instructor')}
                >
                  <h4>Instrutor</h4>
                  <p>Você verá a sequência e dará instruções ao desarmador.</p>
                </div>
                
                <div 
                  className={`role-option ${role === 'defuser' ? 'selected' : ''}`}
                  onClick={() => setRole('defuser')}
                >
                  <h4>Desarmador</h4>
                  <p>Você não verá a sequência, mas controlará o teclado para desarmar a bomba.</p>
                </div>
              </div>
            </div>
            
            <div className="difficulty-selection">
              <h3>Dificuldade:</h3>
              
              <div className="difficulty-options">
                <button 
                  className={difficulty === 'easy' ? 'active' : ''} 
                  onClick={() => setDifficulty('easy')}
                >
                  Fácil
                </button>
                <button 
                  className={difficulty === 'medium' ? 'active' : ''} 
                  onClick={() => setDifficulty('medium')}
                >
                  Médio
                </button>
                <button 
                  className={difficulty === 'hard' ? 'active' : ''} 
                  onClick={() => setDifficulty('hard')}
                >
                  Difícil
                </button>
                <button 
                  className={difficulty === 'extreme' ? 'active' : ''} 
                  onClick={() => setDifficulty('extreme')}
                >
                  Extremo
                </button>
              </div>
            </div>
            
            <div className="coop-actions">
              <button className="start-game-button" onClick={handleJoinRoom}>
                Entrar na Sala
              </button>
              <button className="cancel-button" onClick={() => setShowCreateRoom(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}
        
        {!showCreateRoom && (
          <div className="join-room">
            <h3>Entrar em uma Sala Existente</h3>
            
            <div className="join-form">
              <input 
                type="text" 
                placeholder="Digite o ID da sala" 
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                maxLength={6}
              />
              
              <div className="role-buttons">
                <button 
                  className={role === 'instructor' ? 'active' : ''} 
                  onClick={() => setRole('instructor')}
                >
                  Instrutor
                </button>
                <button 
                  className={role === 'defuser' ? 'active' : ''} 
                  onClick={() => setRole('defuser')}
                >
                  Desarmador
                </button>
              </div>
              
              <button className="join-button" onClick={handleJoinRoom}>
                Entrar na Sala
              </button>
            </div>
          </div>
        )}
      </div>
      
      <button className="back-button" onClick={handleBackToMenu}>
        Voltar ao Menu Principal
      </button>
    </div>
  );
};

export default BombGameHub;

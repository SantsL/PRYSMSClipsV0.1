import React, { useState } from 'react';
import BombDefusal from '../components/bomb_game/BombDefusal';
import './BombGame.css';

const BombGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'extreme'>('medium');
  const [gameMode, setGameMode] = useState<'single' | 'coop'>('single');
  const [showGame, setShowGame] = useState<boolean>(false);
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

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard' | 'extreme') => {
    setDifficulty(newDifficulty);
  };

  const handleGameModeChange = (newMode: 'single' | 'coop') => {
    setGameMode(newMode);
  };

  const handleStartGame = () => {
    setShowGame(true);
  };

  const handleBackToMenu = () => {
    setShowGame(false);
  };

  const handleGameSuccess = (time: number, gameDifficulty: string) => {
    // Calcular recompensa baseada na dificuldade e tempo
    let baseReward = 0;
    switch (gameDifficulty) {
      case 'easy':
        baseReward = 10;
        break;
      case 'medium':
        baseReward = 20;
        break;
      case 'hard':
        baseReward = 35;
        break;
      case 'extreme':
        baseReward = 50;
        break;
      default:
        baseReward = 20;
    }
    
    // Bônus por tempo rápido
    const timeBonus = Math.max(0, 30 - time) * 2;
    const totalReward = baseReward + timeBonus;
    
    // Atualizar estatísticas
    setRewards(prev => ({
      prysms: prev.prysms + totalReward,
      totalGames: prev.totalGames + 1,
      successfulGames: prev.successfulGames + 1,
      bestTime: prev.bestTime === null || time < prev.bestTime ? time : prev.bestTime
    }));
  };

  const handleGameFailure = () => {
    // Atualizar estatísticas
    setRewards(prev => ({
      ...prev,
      totalGames: prev.totalGames + 1
    }));
  };

  return (
    <div className="bomb-game">
      <header className="bomb-game-header">
        <h1>Desarme de Bomba</h1>
        <p>Resolva puzzles sob tempo para desarmar a bomba e ganhe PRYSMS!</p>
      </header>

      {!showGame ? (
        <div className="bomb-game-menu">
          <div className="game-stats">
            <div className="stat-item">
              <h3>{rewards.prysms}</h3>
              <p>PRYSMS Ganhos</p>
            </div>
            <div className="stat-item">
              <h3>{rewards.successfulGames}/{rewards.totalGames}</h3>
              <p>Bombas Desarmadas</p>
            </div>
            <div className="stat-item">
              <h3>{rewards.bestTime !== null ? `${rewards.bestTime}s` : '-'}</h3>
              <p>Melhor Tempo</p>
            </div>
          </div>

          <div className="game-options">
            <div className="option-section">
              <h2>Dificuldade</h2>
              <div className="option-buttons">
                <button 
                  className={difficulty === 'easy' ? 'active' : ''} 
                  onClick={() => handleDifficultyChange('easy')}
                >
                  Fácil
                </button>
                <button 
                  className={difficulty === 'medium' ? 'active' : ''} 
                  onClick={() => handleDifficultyChange('medium')}
                >
                  Médio
                </button>
                <button 
                  className={difficulty === 'hard' ? 'active' : ''} 
                  onClick={() => handleDifficultyChange('hard')}
                >
                  Difícil
                </button>
                <button 
                  className={difficulty === 'extreme' ? 'active' : ''} 
                  onClick={() => handleDifficultyChange('extreme')}
                >
                  Extremo
                </button>
              </div>
            </div>

            <div className="option-section">
              <h2>Modo de Jogo</h2>
              <div className="option-buttons">
                <button 
                  className={gameMode === 'single' ? 'active' : ''} 
                  onClick={() => handleGameModeChange('single')}
                >
                  Solo
                </button>
                <button 
                  className={gameMode === 'coop' ? 'active' : ''} 
                  onClick={() => handleGameModeChange('coop')}
                >
                  Cooperativo
                </button>
              </div>
            </div>

            <div className="difficulty-info">
              {difficulty === 'easy' && (
                <div className="info-card">
                  <h3>Modo Fácil</h3>
                  <ul>
                    <li>Sequência de 6 caracteres</li>
                    <li>60 segundos para completar</li>
                    <li>Apenas letras maiúsculas</li>
                    <li>Recompensa: 10 PRYSMS + bônus por tempo</li>
                  </ul>
                </div>
              )}
              {difficulty === 'medium' && (
                <div className="info-card">
                  <h3>Modo Médio</h3>
                  <ul>
                    <li>Sequência de 8 caracteres</li>
                    <li>45 segundos para completar</li>
                    <li>Letras maiúsculas e números</li>
                    <li>Recompensa: 20 PRYSMS + bônus por tempo</li>
                  </ul>
                </div>
              )}
              {difficulty === 'hard' && (
                <div className="info-card">
                  <h3>Modo Difícil</h3>
                  <ul>
                    <li>Sequência de 10 caracteres</li>
                    <li>30 segundos para completar</li>
                    <li>Letras maiúsculas, minúsculas e números</li>
                    <li>Recompensa: 35 PRYSMS + bônus por tempo</li>
                  </ul>
                </div>
              )}
              {difficulty === 'extreme' && (
                <div className="info-card">
                  <h3>Modo Extremo</h3>
                  <ul>
                    <li>Sequência de 12 caracteres</li>
                    <li>20 segundos para completar</li>
                    <li>Letras, números e caracteres especiais</li>
                    <li>Recompensa: 50 PRYSMS + bônus por tempo</li>
                  </ul>
                </div>
              )}
            </div>

            <button className="start-game-button" onClick={handleStartGame}>
              Iniciar Jogo
            </button>
          </div>
        </div>
      ) : (
        <div className="bomb-game-content">
          <button className="back-button" onClick={handleBackToMenu}>
            Voltar ao Menu
          </button>
          
          {gameMode === 'single' ? (
            <BombDefusal 
              difficulty={difficulty}
              onSuccess={handleGameSuccess}
              onFailure={handleGameFailure}
            />
          ) : (
            <div className="coop-mode-message">
              <h2>Modo Cooperativo</h2>
              <p>O modo cooperativo estará disponível em breve!</p>
              <p>Neste modo, um jogador verá a sequência e dará instruções, enquanto o outro jogador tentará desarmar a bomba sem ver a sequência.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BombGame;

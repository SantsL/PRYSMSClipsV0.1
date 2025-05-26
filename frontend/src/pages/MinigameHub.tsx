import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MinigameHub.css';

const MinigameHub: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [prysms, setPrysms] = useState<number>(0);
  
  // Simular carregamento de dados do usuário
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    setTimeout(() => {
      setUsername('Jogador123');
      setPrysms(500);
    }, 1000);
  }, []);

  return (
    <div className="minigame-hub">
      <header className="minigame-header">
        <h1>PRYSMSCLIPS Minigames</h1>
        <p>Jogue, divirta-se e ganhe PRYSMS!</p>
        
        <div className="user-info">
          <div className="username">
            <span>Olá, {username || 'Jogador'}</span>
          </div>
          <div className="prysms-balance">
            <span>{prysms} PRYSMS</span>
          </div>
        </div>
      </header>
      
      <div className="minigames-container">
        <div className="minigame-card">
          <div className="minigame-image arsenal"></div>
          <div className="minigame-content">
            <h2>PRYSMS Arsenal</h2>
            <p>Monte a melhor combinação de arma + acessório + skin. Personalize com stickers, cores e camuflagens.</p>
            <div className="minigame-features">
              <span className="feature">Personalização</span>
              <span className="feature">Votação</span>
              <span className="feature">Ranking</span>
            </div>
            <Link to="/minigame/arsenal" className="play-button">Jogar Agora</Link>
          </div>
        </div>
        
        <div className="minigame-card">
          <div className="minigame-image defuser"></div>
          <div className="minigame-content">
            <h2>PRYSMS Defuser</h2>
            <p>Desarme a bomba resolvendo puzzles contra o tempo. Jogue sozinho ou no modo cooperativo.</p>
            <div className="minigame-features">
              <span className="feature">Puzzles</span>
              <span className="feature">Cooperativo</span>
              <span className="feature">Ranking</span>
            </div>
            <Link to="/minigame/defuser" className="play-button">Jogar Agora</Link>
          </div>
        </div>
        
        <div className="minigame-card">
          <div className="minigame-image draw"></div>
          <div className="minigame-content">
            <h2>PRYSMS Draw</h2>
            <p>Desenhe e adivinhe para ganhar pontos. Um jogador desenha enquanto os outros tentam adivinhar.</p>
            <div className="minigame-features">
              <span className="feature">Multiplayer</span>
              <span className="feature">Criatividade</span>
              <span className="feature">Diversão</span>
            </div>
            <Link to="/minigame/draw" className="play-button">Jogar Agora</Link>
          </div>
        </div>
      </div>
      
      <div className="hub-footer">
        <Link to="/" className="back-button">Voltar para PRYSMSCLIPS</Link>
      </div>
    </div>
  );
};

export default MinigameHub;

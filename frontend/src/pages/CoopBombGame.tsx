import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CoopBombDefusal from '../components/bomb_game/CoopBombDefusal';
import './CoopBombGame.css';

interface CoopBombGameProps {
  onSuccess?: (time: number, difficulty: string) => void;
  onFailure?: () => void;
}

const CoopBombGame: React.FC<CoopBombGameProps> = ({ onSuccess, onFailure }) => {
  const { roomId, role } = useParams<{ roomId: string; role: string }>();
  const navigate = useNavigate();
  
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'extreme'>('medium');
  const [validRole, setValidRole] = useState<boolean>(true);
  
  useEffect(() => {
    // Validar o papel do jogador
    if (role !== 'instructor' && role !== 'defuser') {
      setValidRole(false);
    }
  }, [role]);
  
  const handleBackToMenu = () => {
    navigate('/minigame/bomb');
  };
  
  if (!roomId || !role) {
    return (
      <div className="coop-bomb-game error">
        <h2>Erro</h2>
        <p>Sala ou papel não especificado.</p>
        <button onClick={handleBackToMenu}>Voltar ao Menu</button>
      </div>
    );
  }
  
  if (!validRole) {
    return (
      <div className="coop-bomb-game error">
        <h2>Erro</h2>
        <p>Papel inválido. Escolha entre 'instructor' ou 'defuser'.</p>
        <button onClick={handleBackToMenu}>Voltar ao Menu</button>
      </div>
    );
  }
  
  return (
    <div className="coop-bomb-game">
      <button className="back-button" onClick={handleBackToMenu}>
        Voltar ao Menu
      </button>
      
      <CoopBombDefusal 
        difficulty={difficulty}
        roomId={roomId}
        role={role as 'instructor' | 'defuser'}
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
      
      <div className="coop-instructions">
        <h3>Instruções do Modo Cooperativo</h3>
        {role === 'instructor' ? (
          <div className="role-instructions">
            <h4>Papel: INSTRUTOR</h4>
            <p>Você pode ver a sequência, mas não pode interagir com o teclado.</p>
            <p>Sua missão é guiar o desarmador, fornecendo instruções claras sobre quais teclas pressionar.</p>
            <p>Use o chat para enviar dicas e orientações ao seu parceiro.</p>
          </div>
        ) : (
          <div className="role-instructions">
            <h4>Papel: DESARMADOR</h4>
            <p>Você não pode ver a sequência, mas pode interagir com o teclado.</p>
            <p>Sua missão é seguir as instruções do instrutor para desarmar a bomba.</p>
            <p>Preste atenção às dicas e orientações que aparecem no chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoopBombGame;

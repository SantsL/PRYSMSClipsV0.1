import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import PrysmsDrawCanvas from '../components/prysms_draw/PrysmsDrawCanvas';
import './PrysmsDraw.css';

interface Player {
  id: string;
  username: string;
  score: number;
  isDrawing: boolean;
}

interface WordOption {
  id: string;
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GameState {
  status: 'waiting' | 'selecting' | 'drawing' | 'roundEnd' | 'gameEnd';
  currentDrawer: string | null;
  currentWord: string | null;
  wordOptions: WordOption[] | null;
  timeLeft: number;
  round: number;
  totalRounds: number;
  hints: string[];
}

const PrysmsDraw: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    status: 'waiting',
    currentDrawer: null,
    currentWord: null,
    wordOptions: null,
    timeLeft: 0,
    round: 0,
    totalRounds: 0,
    hints: []
  });
  const [roomId, setRoomId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<{text: string, sender: string, isCorrect?: boolean}[]>([]);
  const [drawingData, setDrawingData] = useState<string>('');
  const [prysmsEarned, setPrysmsEarned] = useState<number>(0);
  
  // Conectar ao Socket.IO
  useEffect(() => {
    // Em um ambiente de produção, isso seria o endereço do servidor
    const newSocket = io('http://localhost:5000');
    
    newSocket.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO');
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Configurar listeners do Socket.IO
  useEffect(() => {
    if (!socket) return;
    
    // Atualização de jogadores
    socket.on('players_update', (data: { players: Player[] }) => {
      setPlayers(data.players);
    });
    
    // Atualização do estado do jogo
    socket.on('game_state_update', (data: GameState) => {
      setGameState(data);
    });
    
    // Receber mensagens
    socket.on('chat_message', (data: { sender: string, text: string, isCorrect?: boolean }) => {
      setMessages(prev => [...prev, data]);
    });
    
    // Receber dados de desenho
    socket.on('drawing_update', (data: { drawingData: string }) => {
      setDrawingData(data.drawingData);
    });
    
    // Receber recompensas
    socket.on('prysms_earned', (data: { amount: number }) => {
      setPrysmsEarned(prev => prev + data.amount);
    });
    
    return () => {
      socket.off('players_update');
      socket.off('game_state_update');
      socket.off('chat_message');
      socket.off('drawing_update');
      socket.off('prysms_earned');
    };
  }, [socket]);
  
  // Criar ou entrar em uma sala
  const handleJoinRoom = () => {
    if (!socket || !username.trim()) return;
    
    if (roomId) {
      // Entrar em sala existente
      socket.emit('join_draw_room', { room: roomId, username });
    } else {
      // Criar nova sala
      socket.emit('create_draw_room', { username });
    }
  };
  
  // Iniciar o jogo
  const handleStartGame = () => {
    if (!socket) return;
    
    socket.emit('start_draw_game', { rounds: 3 });
  };
  
  // Selecionar palavra para desenhar
  const handleSelectWord = (wordOption: WordOption) => {
    if (!socket) return;
    
    socket.emit('select_word', { wordId: wordOption.id });
  };
  
  // Enviar mensagem/palpite
  const handleSendMessage = () => {
    if (!socket || !message.trim()) return;
    
    socket.emit('send_guess', { text: message });
    setMessage('');
  };
  
  // Enviar dados de desenho
  const handleSendDrawing = (imageData: string) => {
    if (!socket) return;
    
    socket.emit('send_drawing', { drawingData: imageData });
  };
  
  // Verificar se o jogador atual é o desenhista
  const isCurrentPlayerDrawing = () => {
    if (!socket || !gameState.currentDrawer) return false;
    
    return socket.id === gameState.currentDrawer;
  };
  
  // Renderizar tela de espera
  const renderWaitingRoom = () => (
    <div className="waiting-room">
      <h2>PRYSMS Draw</h2>
      <p>Desenhe e adivinhe para ganhar PRYSMS!</p>
      
      {!socket?.connected ? (
        <div className="connecting-message">
          <p>Conectando ao servidor...</p>
        </div>
      ) : (
        <>
          {!roomId ? (
            <div className="join-form">
              <input 
                type="text" 
                placeholder="Seu nome" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="room-buttons">
                <button 
                  className="create-room-button"
                  onClick={handleJoinRoom}
                  disabled={!username.trim()}
                >
                  Criar Sala
                </button>
                <div className="or-divider">ou</div>
                <div className="join-existing">
                  <input 
                    type="text" 
                    placeholder="ID da Sala" 
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  />
                  <button 
                    className="join-room-button"
                    onClick={handleJoinRoom}
                    disabled={!username.trim() || !roomId.trim()}
                  >
                    Entrar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="room-info">
              <h3>Sala: {roomId}</h3>
              <div className="players-list">
                <h4>Jogadores ({players.length}):</h4>
                <ul>
                  {players.map(player => (
                    <li key={player.id}>
                      {player.username} {player.id === socket.id ? '(Você)' : ''}
                    </li>
                  ))}
                </ul>
              </div>
              
              {players.length > 0 && players[0].id === socket.id && (
                <button 
                  className="start-game-button"
                  onClick={handleStartGame}
                  disabled={players.length < 2}
                >
                  Iniciar Jogo
                </button>
              )}
              
              {players.length > 0 && players[0].id !== socket.id && (
                <p className="waiting-message">Aguardando o anfitrião iniciar o jogo...</p>
              )}
              
              {players.length < 2 && (
                <p className="waiting-message">Aguardando mais jogadores entrarem...</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
  
  // Renderizar seleção de palavra
  const renderWordSelection = () => {
    if (!gameState.wordOptions) return null;
    
    return (
      <div className="word-selection">
        <h3>Escolha uma palavra para desenhar:</h3>
        <div className="word-options">
          {gameState.wordOptions.map(option => (
            <button 
              key={option.id}
              className={`word-option difficulty-${option.difficulty}`}
              onClick={() => handleSelectWord(option)}
            >
              {option.word}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  // Renderizar área de jogo
  const renderGameArea = () => {
    const isDrawing = isCurrentPlayerDrawing();
    
    return (
      <div className="game-area">
        <div className="game-header">
          <div className="round-info">
            <span>Rodada {gameState.round}/{gameState.totalRounds}</span>
          </div>
          <div className="time-display">
            <span>{gameState.timeLeft}s</span>
          </div>
          <div className="word-display">
            {isDrawing ? (
              <span>Palavra: <strong>{gameState.currentWord}</strong></span>
            ) : (
              <span>
                {gameState.hints.map((hint, index) => (
                  <span key={index} className="hint-letter">{hint}</span>
                ))}
              </span>
            )}
          </div>
        </div>
        
        <div className="game-content">
          <div className="canvas-container">
            <PrysmsDrawCanvas 
              isDrawing={isDrawing}
              onSendDrawing={handleSendDrawing}
              readOnly={!isDrawing}
              receivedDrawingData={!isDrawing ? drawingData : undefined}
            />
          </div>
          
          <div className="game-sidebar">
            <div className="players-scoreboard">
              <h3>Pontuação</h3>
              <ul>
                {players
                  .sort((a, b) => b.score - a.score)
                  .map(player => (
                    <li key={player.id} className={player.isDrawing ? 'drawing' : ''}>
                      <span className="player-name">
                        {player.username} {player.id === socket?.id ? '(Você)' : ''}
                      </span>
                      <span className="player-score">{player.score}</span>
                    </li>
                  ))
                }
              </ul>
            </div>
            
            <div className="chat-container">
              <div className="messages-container">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message ${msg.sender === username ? 'own' : ''} ${msg.isCorrect ? 'correct' : ''}`}
                  >
                    <span className="sender">{msg.sender}:</span>
                    <span className="text">{msg.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="message-input">
                <input 
                  type="text" 
                  placeholder={isDrawing ? "Você está desenhando..." : "Digite seu palpite..."}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isDrawing}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isDrawing || !message.trim()}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Renderizar fim da rodada
  const renderRoundEnd = () => (
    <div className="round-end">
      <h3>Fim da Rodada!</h3>
      <p>A palavra era: <strong>{gameState.currentWord}</strong></p>
      
      <div className="round-results">
        <h4>Pontuação:</h4>
        <ul>
          {players
            .sort((a, b) => b.score - a.score)
            .map(player => (
              <li key={player.id}>
                <span className="player-name">
                  {player.username} {player.id === socket?.id ? '(Você)' : ''}
                </span>
                <span className="player-score">{player.score}</span>
              </li>
            ))
          }
        </ul>
      </div>
      
      <p className="next-round-message">Próxima rodada em breve...</p>
    </div>
  );
  
  // Renderizar fim do jogo
  const renderGameEnd = () => (
    <div className="game-end">
      <h2>Fim de Jogo!</h2>
      
      <div className="final-results">
        <h3>Classificação Final:</h3>
        <ul>
          {players
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <li key={player.id} className={index === 0 ? 'winner' : ''}>
                <span className="position">{index + 1}º</span>
                <span className="player-name">
                  {player.username} {player.id === socket?.id ? '(Você)' : ''}
                </span>
                <span className="player-score">{player.score}</span>
              </li>
            ))
          }
        </ul>
      </div>
      
      <div className="prysms-earned">
        <h3>PRYSMS Ganhos:</h3>
        <p className="prysms-amount">{prysmsEarned}</p>
      </div>
      
      <div className="game-end-actions">
        <button className="play-again-button" onClick={handleStartGame}>
          Jogar Novamente
        </button>
        <button className="back-to-lobby-button" onClick={() => window.location.reload()}>
          Voltar ao Lobby
        </button>
      </div>
    </div>
  );
  
  // Renderizar conteúdo com base no estado do jogo
  const renderContent = () => {
    switch (gameState.status) {
      case 'waiting':
        return renderWaitingRoom();
      case 'selecting':
        return isCurrentPlayerDrawing() ? renderWordSelection() : (
          <div className="waiting-for-selection">
            <h3>Aguardando {players.find(p => p.isDrawing)?.username} escolher uma palavra...</h3>
          </div>
        );
      case 'drawing':
        return renderGameArea();
      case 'roundEnd':
        return renderRoundEnd();
      case 'gameEnd':
        return renderGameEnd();
      default:
        return renderWaitingRoom();
    }
  };
  
  return (
    <div className="prysms-draw">
      <header className="prysms-draw-header">
        <h1>PRYSMS Draw</h1>
        <p>Desenhe, adivinhe e ganhe PRYSMS!</p>
      </header>
      
      <div className="prysms-draw-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default PrysmsDraw;

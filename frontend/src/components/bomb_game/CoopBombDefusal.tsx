import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import './CoopBombDefusal.css';

interface CoopBombDefusalProps {
  difficulty?: 'easy' | 'medium' | 'hard' | 'extreme';
  roomId: string;
  role: 'instructor' | 'defuser';
  onSuccess?: (time: number, difficulty: string) => void;
  onFailure?: () => void;
}

const CoopBombDefusal: React.FC<CoopBombDefusalProps> = ({
  difficulty = 'medium',
  roomId,
  role,
  onSuccess,
  onFailure
}) => {
  // Configurações baseadas na dificuldade
  const getDifficultySettings = () => {
    switch (difficulty) {
      case 'easy':
        return { length: 6, time: 60, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' };
      case 'medium':
        return { length: 8, time: 45, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' };
      case 'hard':
        return { length: 10, time: 30, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' };
      case 'extreme':
        return { length: 12, time: 20, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()' };
      default:
        return { length: 8, time: 45, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' };
    }
  };

  const settings = getDifficultySettings();
  
  // Estados
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sequence, setSequence] = useState<string>('');
  const [input, setInput] = useState<string[]>(Array(settings.length).fill(''));
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(settings.time);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'success' | 'failure'>('waiting');
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [partnerConnected, setPartnerConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<{text: string, sender: 'me' | 'partner'}[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');

  // Conectar ao Socket.IO
  useEffect(() => {
    // Em um ambiente de produção, isso seria o endereço do servidor
    const newSocket = io('http://localhost:5000');
    
    newSocket.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO');
      
      // Entrar na sala
      newSocket.emit('join_bomb_room', { room: roomId });
    });
    
    newSocket.on('room_joined', (data) => {
      console.log(`Entrou na sala: ${data.room}`);
    });
    
    newSocket.on('partner_joined', () => {
      setPartnerConnected(true);
      setMessages(prev => [...prev, {
        text: 'Seu parceiro entrou na sala!',
        sender: 'partner'
      }]);
    });
    
    newSocket.on('partner_left', () => {
      setPartnerConnected(false);
      setMessages(prev => [...prev, {
        text: 'Seu parceiro saiu da sala.',
        sender: 'partner'
      }]);
    });
    
    newSocket.on('game_started', (data) => {
      if (role === 'instructor') {
        setSequence(data.sequence);
      } else {
        // O desarmador não vê a sequência
        setSequence('?'.repeat(data.sequence.length));
      }
      setTimeLeft(data.time_limit);
      setGameState('playing');
      setStartTime(Date.now());
      setInput(Array(settings.length).fill(''));
      setCurrentPosition(0);
    });
    
    newSocket.on('input_received', (data) => {
      if (role === 'defuser') {
        return; // O desarmador já vê sua própria entrada
      }
      
      const newInput = [...input];
      newInput[data.position] = data.input;
      setInput(newInput);
      setCurrentPosition(data.position + 1);
    });
    
    newSocket.on('hint_received', (data) => {
      setMessages(prev => [...prev, {
        text: data.hint,
        sender: 'partner'
      }]);
    });
    
    newSocket.on('game_result', (data) => {
      if (data.success) {
        setGameState('success');
        if (onSuccess) {
          onSuccess(data.time_taken, difficulty);
        }
      } else {
        setGameState('failure');
        if (onFailure) {
          onFailure();
        }
      }
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.emit('leave_bomb_room', { room: roomId });
      newSocket.disconnect();
    };
  }, [roomId, role, difficulty, input, settings.length, onSuccess, onFailure]);

  // Efeito para temporizador
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState('failure');
            if (socket) {
              socket.emit('bomb_game_result', {
                room: roomId,
                success: false,
                time_taken: settings.time
              });
            }
            if (onFailure) {
              onFailure();
            }
            return 0;
          }
          return prev - 1;
        });
        
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [gameState, onFailure, startTime, roomId, socket, settings.time]);

  // Iniciar jogo
  const startGame = () => {
    if (!partnerConnected) {
      alert('Aguarde seu parceiro entrar na sala para iniciar o jogo.');
      return;
    }
    
    if (socket) {
      // Gerar sequência no servidor
      socket.emit('bomb_game_start', {
        room: roomId,
        difficulty: difficulty,
        time_limit: settings.time
      });
    }
  };

  // Lidar com entrada de tecla (apenas para o desarmador)
  const handleKeyInput = (key: string) => {
    if (gameState !== 'playing' || role !== 'defuser') return;
    
    if (currentPosition < settings.length) {
      const newInput = [...input];
      newInput[currentPosition] = key;
      setInput(newInput);
      
      if (socket) {
        socket.emit('bomb_game_input', {
          room: roomId,
          input: key,
          position: currentPosition
        });
      }
      
      setCurrentPosition(currentPosition + 1);
      
      // Verificar se completou a sequência
      if (currentPosition === settings.length - 1) {
        // A verificação é feita no servidor
        if (socket) {
          socket.emit('bomb_game_verify', {
            room: roomId,
            input_sequence: [...newInput, key].join(''),
            time_taken: settings.time - timeLeft
          });
        }
      }
    }
  };

  // Lidar com clique no botão
  const handleButtonClick = (key: string) => {
    handleKeyInput(key);
  };

  // Enviar dica (apenas para o instrutor)
  const handleSendHint = () => {
    if (!messageInput.trim() || !socket) return;
    
    socket.emit('bomb_game_cooperative_hint', {
      room: roomId,
      hint: messageInput
    });
    
    setMessages(prev => [...prev, {
      text: messageInput,
      sender: 'me'
    }]);
    
    setMessageInput('');
  };

  // Renderizar teclado virtual (apenas para o desarmador)
  const renderVirtualKeyboard = () => {
    if (role !== 'defuser') return null;
    
    // Para simplificar, vamos mostrar apenas um subconjunto de teclas baseado na dificuldade
    let keys: string[] = [];
    
    if (difficulty === 'easy') {
      keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    } else if (difficulty === 'medium') {
      keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    } else {
      // Para hard e extreme, mostramos um teclado reduzido
      keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    }
    
    return (
      <div className="virtual-keyboard">
        {keys.map((key) => (
          <button 
            key={key} 
            className="key-button"
            onClick={() => handleButtonClick(key)}
          >
            {key}
          </button>
        ))}
      </div>
    );
  };

  // Calcular progresso do tempo
  const timeProgress = (timeLeft / settings.time) * 100;

  return (
    <div className="coop-bomb-defusal">
      <div className="role-badge">{role === 'instructor' ? 'INSTRUTOR' : 'DESARMADOR'}</div>
      
      <div className="bomb-container">
        <div className="bomb-header">
          <h2>Desarme de Bomba Cooperativo</h2>
          <div className="difficulty-badge">{difficulty.toUpperCase()}</div>
        </div>
        
        {gameState === 'waiting' && (
          <div className="start-screen">
            <p>Modo Cooperativo</p>
            <p>Sala: {roomId}</p>
            <p>Seu papel: {role === 'instructor' ? 'INSTRUTOR' : 'DESARMADOR'}</p>
            <p>Status: {partnerConnected ? 'Parceiro conectado' : 'Aguardando parceiro...'}</p>
            
            {role === 'instructor' && (
              <button 
                className="start-button" 
                onClick={startGame}
                disabled={!partnerConnected}
              >
                Iniciar Jogo
              </button>
            )}
            
            {role === 'defuser' && (
              <p>Aguarde o instrutor iniciar o jogo...</p>
            )}
          </div>
        )}
        
        {gameState === 'playing' && (
          <div className="game-area">
            <div className="time-bar-container">
              <div 
                className="time-bar" 
                style={{ 
                  width: `${timeProgress}%`,
                  backgroundColor: timeProgress < 30 ? '#ff4d4d' : timeProgress < 60 ? '#ffcc00' : '#4caf50'
                }}
              ></div>
            </div>
            
            <div className="time-display">{timeLeft}s</div>
            
            <div className="game-content">
              <div className="game-panel">
                <div className="sequence-display">
                  <p>{role === 'instructor' ? 'Sequência a ser digitada:' : 'Aguarde instruções:'}</p>
                  <div className="sequence-container">
                    {sequence.split('').map((char, index) => (
                      <div key={index} className="sequence-char">{char}</div>
                    ))}
                  </div>
                </div>
                
                <div className="input-display">
                  {input.map((char, index) => (
                    <div 
                      key={index} 
                      className={`input-char ${index === currentPosition ? 'current' : ''} ${
                        char && role === 'instructor' && char === sequence[index] ? 'correct' : 
                        char && role === 'instructor' ? 'incorrect' : ''
                      }`}
                    >
                      {char || '_'}
                    </div>
                  ))}
                </div>
                
                {renderVirtualKeyboard()}
              </div>
              
              <div className="communication-panel">
                <div className="messages-container">
                  {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                
                {role === 'instructor' && (
                  <div className="message-input-container">
                    <input 
                      type="text" 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Digite uma dica para o desarmador..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendHint()}
                    />
                    <button onClick={handleSendHint}>Enviar</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {gameState === 'success' && (
          <div className="result-screen success">
            <h3>BOMBA DESARMADA!</h3>
            <p>Parabéns! Vocês desarmaram a bomba com sucesso.</p>
            <p>Tempo utilizado: {settings.time - timeLeft} segundos</p>
            {role === 'instructor' && (
              <button className="play-again-button" onClick={startGame}>
                Jogar Novamente
              </button>
            )}
            {role === 'defuser' && (
              <p>Aguarde o instrutor iniciar um novo jogo...</p>
            )}
          </div>
        )}
        
        {gameState === 'failure' && (
          <div className="result-screen failure">
            <h3>BOOM! A BOMBA EXPLODIU!</h3>
            <p>Vocês não conseguiram desarmar a bomba a tempo.</p>
            {role === 'instructor' && (
              <button className="play-again-button" onClick={startGame}>
                Tentar Novamente
              </button>
            )}
            {role === 'defuser' && (
              <p>Aguarde o instrutor iniciar um novo jogo...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoopBombDefusal;

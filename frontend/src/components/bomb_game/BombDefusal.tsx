import React, { useState, useEffect, useCallback } from 'react';
import './BombDefusal.css';

interface BombDefusalProps {
  difficulty?: 'easy' | 'medium' | 'hard' | 'extreme';
  onSuccess?: (time: number, difficulty: string) => void;
  onFailure?: () => void;
}

const BombDefusal: React.FC<BombDefusalProps> = ({
  difficulty = 'medium',
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
  const [sequence, setSequence] = useState<string>('');
  const [input, setInput] = useState<string[]>(Array(settings.length).fill(''));
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(settings.time);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'success' | 'failure'>('waiting');
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Gerar sequência aleatória
  const generateSequence = useCallback(() => {
    let result = '';
    const characters = settings.chars;
    const length = settings.length;
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  }, [settings.chars, settings.length]);

  // Iniciar jogo
  const startGame = () => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    setInput(Array(settings.length).fill(''));
    setCurrentPosition(0);
    setTimeLeft(settings.time);
    setGameState('playing');
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  // Parar jogo
  const stopGame = () => {
    setGameState('waiting');
  };

  // Verificar se a sequência está correta
  const checkSequence = useCallback(() => {
    const inputSequence = input.join('');
    if (inputSequence === sequence) {
      const timeSpent = settings.time - timeLeft;
      setGameState('success');
      if (onSuccess) {
        onSuccess(timeSpent, difficulty);
      }
    }
  }, [input, sequence, settings.time, timeLeft, difficulty, onSuccess]);

  // Lidar com entrada de tecla
  const handleKeyInput = useCallback((key: string) => {
    if (gameState !== 'playing') return;
    
    if (currentPosition < settings.length) {
      const newInput = [...input];
      newInput[currentPosition] = key;
      setInput(newInput);
      setCurrentPosition(currentPosition + 1);
      
      // Verificar se completou a sequência
      if (currentPosition === settings.length - 1) {
        setTimeout(() => {
          checkSequence();
        }, 300);
      }
    }
  }, [gameState, currentPosition, settings.length, input, checkSequence]);

  // Lidar com clique no botão
  const handleButtonClick = (key: string) => {
    handleKeyInput(key);
  };

  // Efeito para temporizador
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState('failure');
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
  }, [gameState, onFailure, startTime]);

  // Efeito para lidar com entrada de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      const key = e.key;
      if (settings.chars.includes(key) && key.length === 1) {
        handleKeyInput(key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, handleKeyInput, settings.chars]);

  // Renderizar teclado virtual
  const renderVirtualKeyboard = () => {
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
    <div className="bomb-defusal">
      <div className="bomb-container">
        <div className="bomb-header">
          <h2>Desarme de Bomba</h2>
          <div className="difficulty-badge">{difficulty.toUpperCase()}</div>
        </div>
        
        {gameState === 'waiting' && (
          <div className="start-screen">
            <p>Prepare-se para desarmar a bomba!</p>
            <p>Você terá {settings.time} segundos para digitar a sequência correta.</p>
            <button className="start-button" onClick={startGame}>Iniciar</button>
          </div>
        )}
        
        {gameState === 'playing' && (
          <>
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
            
            <div className="sequence-display">
              <p>Digite a sequência:</p>
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
                    char && char === sequence[index] ? 'correct' : char ? 'incorrect' : ''
                  }`}
                >
                  {char || '_'}
                </div>
              ))}
            </div>
            
            {renderVirtualKeyboard()}
            
            <button className="stop-button" onClick={stopGame}>Desistir</button>
          </>
        )}
        
        {gameState === 'success' && (
          <div className="result-screen success">
            <h3>BOMBA DESARMADA!</h3>
            <p>Parabéns! Você desarmou a bomba com sucesso.</p>
            <p>Tempo utilizado: {settings.time - timeLeft} segundos</p>
            <button className="play-again-button" onClick={startGame}>Jogar Novamente</button>
          </div>
        )}
        
        {gameState === 'failure' && (
          <div className="result-screen failure">
            <h3>BOOM! A BOMBA EXPLODIU!</h3>
            <p>Você não conseguiu desarmar a bomba a tempo.</p>
            <button className="play-again-button" onClick={startGame}>Tentar Novamente</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BombDefusal;

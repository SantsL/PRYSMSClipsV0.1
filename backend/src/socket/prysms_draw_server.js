import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

// Configuração do servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Em produção, limitar para domínios específicos
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Estruturas de dados para o jogo
interface Player {
  id: string;
  username: string;
  score: number;
  isDrawing: boolean;
}

interface Room {
  id: string;
  players: Player[];
  gameState: {
    status: 'waiting' | 'selecting' | 'drawing' | 'roundEnd' | 'gameEnd';
    currentDrawer: string | null;
    currentWord: string | null;
    wordOptions: WordOption[] | null;
    timeLeft: number;
    round: number;
    totalRounds: number;
    hints: string[];
  };
  drawingData: string;
  timer: NodeJS.Timeout | null;
}

interface WordOption {
  id: string;
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Banco de palavras por categoria
const wordBank = {
  easy: [
    'casa', 'gato', 'sol', 'bola', 'árvore', 'peixe', 'carro', 'flor', 'livro', 'mesa',
    'cadeira', 'porta', 'janela', 'telefone', 'computador', 'banana', 'maçã', 'cachorro'
  ],
  medium: [
    'guitarra', 'elefante', 'montanha', 'oceano', 'foguete', 'helicóptero', 'dinossauro',
    'castelo', 'astronauta', 'cachoeira', 'vulcão', 'pirâmide', 'unicórnio', 'dragão'
  ],
  hard: [
    'democracia', 'fotossíntese', 'gravitação', 'metamorfose', 'paleontologia',
    'criptografia', 'sustentabilidade', 'nanotecnologia', 'biodiversidade'
  ]
};

// Armazenamento de salas
const rooms: Map<string, Room> = new Map();

// Gerar opções de palavras
function generateWordOptions(): WordOption[] {
  const options: WordOption[] = [];
  
  // Uma palavra fácil
  const easyWord = wordBank.easy[Math.floor(Math.random() * wordBank.easy.length)];
  options.push({
    id: uuidv4(),
    word: easyWord,
    difficulty: 'easy'
  });
  
  // Uma palavra média
  const mediumWord = wordBank.medium[Math.floor(Math.random() * wordBank.medium.length)];
  options.push({
    id: uuidv4(),
    word: mediumWord,
    difficulty: 'medium'
  });
  
  // Uma palavra difícil
  const hardWord = wordBank.hard[Math.floor(Math.random() * wordBank.hard.length)];
  options.push({
    id: uuidv4(),
    word: hardWord,
    difficulty: 'hard'
  });
  
  return options;
}

// Gerar dicas para a palavra (letras escondidas)
function generateHints(word: string, revealPercentage: number = 0): string[] {
  const hints: string[] = [];
  const lettersToReveal = Math.floor(word.length * revealPercentage);
  
  // Criar array de índices a serem revelados
  const indices: number[] = [];
  for (let i = 0; i < lettersToReveal; i++) {
    let index;
    do {
      index = Math.floor(Math.random() * word.length);
    } while (indices.includes(index));
    indices.push(index);
  }
  
  // Criar array de dicas
  for (let i = 0; i < word.length; i++) {
    if (indices.includes(i) || word[i] === ' ') {
      hints.push(word[i]);
    } else {
      hints.push('_');
    }
  }
  
  return hints;
}

// Iniciar temporizador para a rodada
function startRoundTimer(roomId: string, duration: number) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  // Limpar temporizador existente
  if (room.timer) {
    clearInterval(room.timer);
  }
  
  // Definir tempo inicial
  room.gameState.timeLeft = duration;
  
  // Iniciar novo temporizador
  room.timer = setInterval(() => {
    const currentRoom = rooms.get(roomId);
    if (!currentRoom) {
      clearInterval(room.timer as NodeJS.Timeout);
      return;
    }
    
    // Decrementar tempo
    currentRoom.gameState.timeLeft--;
    
    // Atualizar dicas a cada 1/4 do tempo
    if (currentRoom.gameState.status === 'drawing' && currentRoom.gameState.currentWord) {
      const totalTime = duration;
      const elapsedTime = totalTime - currentRoom.gameState.timeLeft;
      const revealPercentage = Math.min(0.75, elapsedTime / totalTime);
      
      currentRoom.gameState.hints = generateHints(currentRoom.gameState.currentWord, revealPercentage);
      
      // Enviar atualização do estado do jogo
      io.to(roomId).emit('game_state_update', currentRoom.gameState);
    }
    
    // Verificar se o tempo acabou
    if (currentRoom.gameState.timeLeft <= 0) {
      clearInterval(currentRoom.timer as NodeJS.Timeout);
      
      // Fim da rodada
      if (currentRoom.gameState.status === 'drawing') {
        currentRoom.gameState.status = 'roundEnd';
        io.to(roomId).emit('game_state_update', currentRoom.gameState);
        
        // Iniciar próxima rodada após 5 segundos
        setTimeout(() => {
          startNextRound(roomId);
        }, 5000);
      }
    }
  }, 1000);
}

// Iniciar próxima rodada
function startNextRound(roomId: string) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  // Verificar se o jogo acabou
  if (room.gameState.round >= room.gameState.totalRounds) {
    room.gameState.status = 'gameEnd';
    io.to(roomId).emit('game_state_update', room.gameState);
    return;
  }
  
  // Incrementar rodada
  room.gameState.round++;
  
  // Selecionar próximo desenhista
  const currentDrawerIndex = room.players.findIndex(p => p.isDrawing);
  const nextDrawerIndex = (currentDrawerIndex + 1) % room.players.length;
  
  // Atualizar status de desenho
  room.players.forEach((player, index) => {
    player.isDrawing = index === nextDrawerIndex;
  });
  
  // Atualizar desenhista atual
  room.gameState.currentDrawer = room.players[nextDrawerIndex].id;
  
  // Gerar opções de palavras
  room.gameState.wordOptions = generateWordOptions();
  
  // Atualizar estado do jogo
  room.gameState.status = 'selecting';
  
  // Limpar dados de desenho
  room.drawingData = '';
  
  // Enviar atualização do estado do jogo
  io.to(roomId).emit('game_state_update', room.gameState);
  io.to(roomId).emit('players_update', { players: room.players });
  
  // Enviar opções de palavras apenas para o desenhista
  io.to(room.gameState.currentDrawer).emit('word_options', room.gameState.wordOptions);
  
  // Iniciar temporizador para seleção de palavra (15 segundos)
  startRoundTimer(roomId, 15);
}

// Configuração de Socket.IO
io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);
  
  // Criar sala
  socket.on('create_draw_room', (data: { username: string }) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Criar jogador
    const player: Player = {
      id: socket.id,
      username: data.username,
      score: 0,
      isDrawing: true // O criador da sala é o primeiro a desenhar
    };
    
    // Criar sala
    const room: Room = {
      id: roomId,
      players: [player],
      gameState: {
        status: 'waiting',
        currentDrawer: socket.id,
        currentWord: null,
        wordOptions: null,
        timeLeft: 0,
        round: 0,
        totalRounds: 0,
        hints: []
      },
      drawingData: '',
      timer: null
    };
    
    // Armazenar sala
    rooms.set(roomId, room);
    
    // Entrar na sala
    socket.join(roomId);
    
    // Enviar ID da sala
    socket.emit('room_created', { room: roomId });
    
    // Enviar atualização de jogadores
    io.to(roomId).emit('players_update', { players: room.players });
    
    console.log(`Sala criada: ${roomId}`);
  });
  
  // Entrar em sala
  socket.on('join_draw_room', (data: { room: string, username: string }) => {
    const roomId = data.room;
    const room = rooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Sala não encontrada' });
      return;
    }
    
    // Criar jogador
    const player: Player = {
      id: socket.id,
      username: data.username,
      score: 0,
      isDrawing: false
    };
    
    // Adicionar jogador à sala
    room.players.push(player);
    
    // Entrar na sala
    socket.join(roomId);
    
    // Enviar atualização de jogadores
    io.to(roomId).emit('players_update', { players: room.players });
    
    // Enviar estado atual do jogo
    socket.emit('game_state_update', room.gameState);
    
    // Enviar dados de desenho atuais
    if (room.drawingData) {
      socket.emit('drawing_update', { drawingData: room.drawingData });
    }
    
    console.log(`Jogador ${data.username} entrou na sala ${roomId}`);
  });
  
  // Iniciar jogo
  socket.on('start_draw_game', (data: { rounds: number }) => {
    // Encontrar sala do jogador
    let roomId: string | null = null;
    
    for (const [id, room] of rooms.entries()) {
      if (room.players.some(p => p.id === socket.id)) {
        roomId = id;
        break;
      }
    }
    
    if (!roomId) {
      socket.emit('error', { message: 'Sala não encontrada' });
      return;
    }
    
    const room = rooms.get(roomId);
    if (!room) return;
    
    // Verificar se o jogador é o primeiro (anfitrião)
    if (room.players[0].id !== socket.id) {
      socket.emit('error', { message: 'Apenas o anfitrião pode iniciar o jogo' });
      return;
    }
    
    // Configurar jogo
    room.gameState.totalRounds = data.rounds * room.players.length;
    room.gameState.round = 0;
    
    // Iniciar primeira rodada
    startNextRound(roomId);
    
    console.log(`Jogo iniciado na sala ${roomId}`);
  });
  
  // Selecionar palavra
  socket.on('select_word', (data: { wordId: string }) => {
    // Encontrar sala do jogador
    let roomId: string | null = null;
    let selectedRoom: Room | null = null;
    
    for (const [id, room] of rooms.entries()) {
      if (room.players.some(p => p.id === socket.id)) {
        roomId = id;
        selectedRoom = room;
        break;
      }
    }
    
    if (!roomId || !selectedRoom) {
      socket.emit('error', { message: 'Sala não encontrada' });
      return;
    }
    
    // Verificar se o jogador é o desenhista atual
    if (selectedRoom.gameState.currentDrawer !== socket.id) {
      socket.emit('error', { message: 'Você não é o desenhista atual' });
      return;
    }
    
    // Verificar se o jogo está na fase de seleção
    if (selectedRoom.gameState.status !== 'selecting') {
      socket.emit('error', { message: 'O jogo não está na fase de seleção' });
      return;
    }
    
    // Encontrar palavra selecionada
    const wordOption = selectedRoom.gameState.wordOptions?.find(option => option.id === data.wordId);
    if (!wordOption) {
      socket.emit('error', { message: 'Palavra não encontrada' });
      return;
    }
    
    // Atualizar palavra atual
    selectedRoom.gameState.currentWord = wordOption.word;
    
    // Gerar dicas iniciais (todas escondidas)
    selectedRoom.gameState.hints = generateHints(wordOption.word, 0);
    
    // Atualizar estado do jogo
    selectedRoom.gameState.status = 'drawing';
    selectedRoom.gameState.wordOptions = null;
    
    // Enviar atualização do estado do jogo
    io.to(roomId).emit('game_state_update', selectedRoom.gameState);
    
    // Iniciar temporizador para desenho (60 segundos)
    startRoundTimer(roomId, 60);
    
    console.log(`Palavra selecionada na sala ${roomId}: ${wordOption.word}`);
  });
  
  // Enviar desenho
  socket.on('send_drawing', (data: { drawingData: string }) => {
    // Encontrar sala do jogador
    let roomId: string | null = null;
    
    for (const [id, room] of rooms.entries()) {
      if (room.players.some(p => p.id === socket.id)) {
        roomId = id;
        break;
      }
    }
    
    if (!roomId) {
      socket.emit('error', { message: 'Sala não encontrada' });
      return;
    }
    
    const room = rooms.get(roomId);
    if (!room) return;
    
    // Verificar se o jogador é o desenhista atual
    if (room.gameState.currentDrawer !== socket.id) {
      socket.emit('error', { message: 'Você não é o desenhista atual' });
      return;
    }
    
    // Atualizar dados de desenho
    room.drawingData = data.drawingData;
    
    // Enviar atualização de desenho para todos os jogadores exceto o desenhista
    socket.to(roomId).emit('drawing_update', { drawingData: data.drawingData });
  });
  
  // Enviar palpite
  socket.on('send_guess', (data: { text: string }) => {
    // Encontrar sala do jogador
    let roomId: string | null = null;
    let selectedRoom: Room | null = null;
    let player: Player | null = null;
    
    for (const [id, room] of rooms.entries()) {
      const foundPlayer = room.players.find(p => p.id === socket.id);
      if (foundPlayer) {
        roomId = id;
        selectedRoom = room;
        player = foundPlayer;
        break;
      }
    }
    
    if (!roomId || !selectedRoom || !player) {
      socket.emit('error', { message: 'Sala não encontrada' });
      return;
    }
    
    // Verificar se o jogador não é o desenhista atual
    if (selectedRoom.gameState.currentDrawer === socket.id) {
      socket.emit('error', { message: 'O desenhista não pode enviar palpites' });
      return;
    }
    
    // Verificar se o jogo está na fase de desenho
    if (selectedRoom.gameState.status !== 'drawing') {
      // Enviar como mensagem normal
      io.to(roomId).emit('chat_message', {
        sender: player.username,
        text: data.text
      });
      return;
    }
    
    // Verificar se o palpite está correto
    const guess = data.text.trim().toLowerCase();
    const currentWord = selectedRoom.gameState.currentWord?.toLowerCase();
    
    if (guess === currentWord) {
      // Palpite correto
      
      // Calcular pontos com base no tempo restante
      const timeLeft = selectedRoom.gameState.timeLeft;
      const points = Math.max(100, 500 - Math.floor((60 - timeLeft) * 8.33));
      
      // Atualizar pontuação do jogador
      player.score += points;
      
      // Atualizar pontuação do desenhista
      const drawer = selectedRoom.players.find(p => p.id === selectedRoom.gameState.currentDrawer);
      if (drawer) {
        drawer.score += 50;
      }
      
      // Enviar mensagem de acerto
      io.to(roomId).emit('chat_message', {
        sender: player.username,
        text: data.text,
        isCorrect: true
      });
      
      // Enviar atualização de jogadores
      io.to(roomId).emit('players_update', { players: selectedRoom.players });
      
      // Enviar recompensa de PRYSMS
      socket.emit('prysms_earned', { amount: Math.floor(points / 10) });
      
      // Enviar recompensa de PRYSMS para o desenhista
      if (drawer) {
        io.to(drawer.id).emit('prysms_earned', { amount: 5 });
      }
      
      // Finalizar rodada
      if (selectedRoom.timer) {
        clearInterval(selectedRoom.timer);
      }
      
      // Atualizar estado do jogo
      selectedRoom.gameState.status = 'roundEnd';
      io.to(roomId).emit('game_state_update', selectedRoom.gameState);
      
      // Iniciar próxima rodada após 5 segundos
      setTimeout(() => {
        startNextRound(roomId);
      }, 5000);
      
      console.log(`Jogador ${player.username} acertou a palavra na sala ${roomId}`);
    } else {
      // Palpite incorreto, enviar como mensagem normal
      io.to(roomId).emit('chat_message', {
        sender: player.username,
        text: data.text
      });
    }
  });
  
  // Desconexão
  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`);
    
    // Encontrar sala do jogador
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        // Remover jogador da sala
        room.players.splice(playerIndex, 1);
        
        // Verificar se a sala está vazia
        if (room.players.length === 0) {
          // Limpar temporizador
          if (room.timer) {
            clearInterval(room.timer);
          }
          
          // Remover sala
          rooms.delete(roomId);
          console.log(`Sala removida: ${roomId}`);
        } else {
          // Verificar se o jogador era o desenhista atual
          if (room.gameState.currentDrawer === socket.id) {
            // Finalizar rodada atual
            if (room.timer) {
              clearInterval(room.timer);
            }
            
            // Iniciar próxima rodada
            startNextRound(roomId);
          }
          
          // Enviar atualização de jogadores
          io.to(roomId).emit('players_update', { players: room.players });
        }
        
        break;
      }
    }
  });
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor PRYSMS Draw funcionando!');
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

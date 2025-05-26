import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MinigameHub from './pages/MinigameHub';
import PrysmsDraw from './pages/PrysmsDraw';
import BuildYourLoadout from './pages/BuildYourLoadout';
import BombGameHub from './pages/BombGameHub';
import BombGame from './pages/BombGame';
import CoopBombGame from './pages/CoopBombGame';
import BombGameRanking from './components/bomb_game/BombGameRanking';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Rota principal */}
          <Route path="/" element={<Navigate to="/minigame" />} />
          
          {/* Hub de minigames */}
          <Route path="/minigame" element={<MinigameHub />} />
          
          {/* PRYSMS Arsenal (antigo Build Your Loadout) */}
          <Route path="/minigame/arsenal" element={<BuildYourLoadout />} />
          
          {/* PRYSMS Defuser (antigo Desarme de Bomba) */}
          <Route path="/minigame/defuser" element={<BombGameHub />} />
          <Route path="/minigame/defuser/solo" element={<BombGame />} />
          <Route path="/minigame/defuser/coop/:roomId/:role" element={<CoopBombGame />} />
          <Route path="/minigame/defuser/ranking" element={<BombGameRanking />} />
          
          {/* PRYSMS Draw (novo minigame) */}
          <Route path="/minigame/draw" element={<PrysmsDraw />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

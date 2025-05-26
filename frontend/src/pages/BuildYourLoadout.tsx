import React, { useState } from 'react';
import WeaponSelector from '../components/loadout/WeaponSelector';
import SkinCustomizer from '../components/loadout/SkinCustomizer';
import LoadoutVoting from '../components/loadout/LoadoutVoting';
import './BuildYourLoadout.css';

interface Weapon {
  id: string;
  name: string;
  type: string;
  image: string;
}

const BuildYourLoadout: React.FC = () => {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [customizationComplete, setCustomizationComplete] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<'select' | 'customize' | 'vote'>('select');
  const [loadoutData, setLoadoutData] = useState<{
    weaponId: string;
    skinId: string;
    stickers: string[];
    color: string;
  } | null>(null);

  const handleWeaponSelect = (weapon: Weapon) => {
    setSelectedWeapon(weapon);
    setActiveStep('customize');
  };

  const handleCustomizationComplete = (skinId: string, stickers: string[], color: string) => {
    if (selectedWeapon) {
      setLoadoutData({
        weaponId: selectedWeapon.id,
        skinId,
        stickers,
        color
      });
      setCustomizationComplete(true);
      setActiveStep('vote');
    }
  };

  const handleVote = (loadoutId: string) => {
    console.log(`Votado no loadout: ${loadoutId}`);
    // Em uma implementação real, aqui seria atualizado o estado ou feita uma chamada à API
  };

  const handleCreateNew = () => {
    setSelectedWeapon(null);
    setCustomizationComplete(false);
    setLoadoutData(null);
    setActiveStep('select');
  };

  const handleSaveLoadout = async () => {
    if (loadoutData) {
      try {
        // Em uma implementação real, isso seria uma chamada à API
        // await axios.post('/api/loadout/loadouts', loadoutData);
        alert('Loadout salvo com sucesso!');
      } catch (err) {
        alert('Erro ao salvar loadout. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="build-your-loadout">
      <header className="loadout-header">
        <h1>Build Your Loadout</h1>
        <p>Monte a melhor combinação de arma + acessório + skin e compartilhe com a comunidade!</p>
      </header>

      <div className="loadout-steps">
        <div className={`step ${activeStep === 'select' ? 'active' : ''} ${selectedWeapon ? 'completed' : ''}`}>
          1. Selecionar Arma
        </div>
        <div className={`step ${activeStep === 'customize' ? 'active' : ''} ${customizationComplete ? 'completed' : ''}`}>
          2. Personalizar
        </div>
        <div className={`step ${activeStep === 'vote' ? 'active' : ''}`}>
          3. Votar & Compartilhar
        </div>
      </div>

      <div className="loadout-content">
        {activeStep === 'select' && (
          <WeaponSelector onSelectWeapon={handleWeaponSelect} />
        )}

        {activeStep === 'customize' && selectedWeapon && (
          <SkinCustomizer 
            weaponId={selectedWeapon.id} 
            onCustomizationComplete={handleCustomizationComplete} 
          />
        )}

        {activeStep === 'vote' && (
          <>
            <div className="your-loadout-section">
              <h2>Seu Loadout</h2>
              {loadoutData && (
                <div className="loadout-summary">
                  <div className="loadout-preview" style={{ borderColor: loadoutData.color }}>
                    {/* Em uma implementação real, aqui seria exibida a imagem da arma com skin e stickers */}
                    <div className="loadout-image-placeholder">
                      Visualização do Seu Loadout
                    </div>
                  </div>
                  <div className="loadout-actions">
                    <button className="save-button" onClick={handleSaveLoadout}>
                      Salvar Loadout
                    </button>
                    <button className="share-button">
                      Compartilhar
                    </button>
                    <button className="new-button" onClick={handleCreateNew}>
                      Criar Novo
                    </button>
                  </div>
                </div>
              )}
            </div>
            <LoadoutVoting onVote={handleVote} />
          </>
        )}
      </div>
    </div>
  );
};

export default BuildYourLoadout;

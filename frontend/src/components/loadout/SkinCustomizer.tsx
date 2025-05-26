import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Skin {
  id: string;
  name: string;
  weapon_id: string;
  rarity: string;
  image: string;
}

interface Sticker {
  id: string;
  name: string;
  rarity: string;
  image: string;
}

interface SkinCustomizerProps {
  weaponId: string;
  onCustomizationComplete: (skinId: string, stickers: string[], color: string) => void;
}

const SkinCustomizer: React.FC<SkinCustomizerProps> = ({ 
  weaponId, 
  onCustomizationComplete 
}) => {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'skins' | 'stickers' | 'colors'>('skins');

  // Posições disponíveis para stickers
  const stickerPositions = [0, 1, 2, 3];

  useEffect(() => {
    const fetchSkins = async () => {
      try {
        setLoading(true);
        // Em um ambiente de produção, isso seria substituído pela chamada real à API
        // const response = await axios.get(`/api/loadout/skins?weapon_id=${weaponId}`);
        
        // Usando dados mockados para desenvolvimento
        const mockSkins: Skin[] = [
          {
            id: "skin1",
            name: "Neon Rider",
            weapon_id: "weapon1",
            rarity: "Covert",
            image: "/assets/skins/ak47_neon_rider.png"
          },
          {
            id: "skin2",
            name: "Asiimov",
            weapon_id: "weapon2",
            rarity: "Covert",
            image: "/assets/skins/m4a4_asiimov.png"
          },
          {
            id: "skin3",
            name: "Dragon Lore",
            weapon_id: "weapon3",
            rarity: "Covert",
            image: "/assets/skins/awp_dragon_lore.png"
          },
          {
            id: "skin4",
            name: "Blaze",
            weapon_id: "weapon4",
            rarity: "Restricted",
            image: "/assets/skins/deagle_blaze.png"
          },
          {
            id: "skin5",
            name: "Vulcan",
            weapon_id: "weapon1",
            rarity: "Covert",
            image: "/assets/skins/ak47_vulcan.png"
          },
          {
            id: "skin6",
            name: "Redline",
            weapon_id: "weapon1",
            rarity: "Classified",
            image: "/assets/skins/ak47_redline.png"
          }
        ];
        
        // Filtrar skins para a arma selecionada
        const filteredSkins = mockSkins.filter(skin => skin.weapon_id === weaponId);
        setSkins(filteredSkins);
        
        // Definir a primeira skin como selecionada por padrão
        if (filteredSkins.length > 0) {
          setSelectedSkin(filteredSkins[0]);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar skins. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    const fetchStickers = async () => {
      try {
        // Em um ambiente de produção, isso seria substituído pela chamada real à API
        // const response = await axios.get('/api/loadout/stickers');
        
        // Usando dados mockados para desenvolvimento
        const mockStickers: Sticker[] = [
          {
            id: "sticker1",
            name: "Miamo Flow (Holo)",
            rarity: "Exotic",
            image: "/assets/stickers/miamo_flow_holo.png"
          },
          {
            id: "sticker2",
            name: "Entropiq (Holo)",
            rarity: "Exotic",
            image: "/assets/stickers/entropiq_holo.png"
          },
          {
            id: "sticker3",
            name: "Lit (Holo)",
            rarity: "Exotic",
            image: "/assets/stickers/lit_holo.png"
          },
          {
            id: "sticker4",
            name: "Skull (Foil)",
            rarity: "Remarkable",
            image: "/assets/stickers/skull_foil.png"
          },
          {
            id: "sticker5",
            name: "Crown (Foil)",
            rarity: "Extraordinary",
            image: "/assets/stickers/crown_foil.png"
          },
          {
            id: "sticker6",
            name: "Flammable (Foil)",
            rarity: "Remarkable",
            image: "/assets/stickers/flammable_foil.png"
          }
        ];
        
        setStickers(mockStickers);
      } catch (err) {
        setError('Erro ao carregar stickers. Tente novamente mais tarde.');
      }
    };

    fetchSkins();
    fetchStickers();
  }, [weaponId]);

  // Inicializar array de stickers com posições vazias
  useEffect(() => {
    setSelectedStickers(Array(4).fill(''));
  }, []);

  const handleSkinSelect = (skin: Skin) => {
    setSelectedSkin(skin);
  };

  const handleStickerSelect = (stickerId: string, position: number) => {
    const newSelectedStickers = [...selectedStickers];
    
    // Se o mesmo sticker já estiver selecionado, remova-o
    if (newSelectedStickers[position] === stickerId) {
      newSelectedStickers[position] = '';
    } else {
      newSelectedStickers[position] = stickerId;
    }
    
    setSelectedStickers(newSelectedStickers);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };

  const handleSaveCustomization = () => {
    if (selectedSkin) {
      onCustomizationComplete(
        selectedSkin.id,
        selectedStickers,
        selectedColor
      );
    }
  };

  // Cores predefinidas para seleção rápida
  const predefinedColors = [
    '#FF0000', // Vermelho
    '#00FF00', // Verde
    '#0000FF', // Azul
    '#FFFF00', // Amarelo
    '#FF00FF', // Magenta
    '#00FFFF', // Ciano
    '#FFA500', // Laranja
    '#800080', // Roxo
    '#000000', // Preto
    '#FFFFFF'  // Branco
  ];

  return (
    <div className="skin-customizer">
      <h2>Personalize sua Arma</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="customizer-tabs">
        <button 
          className={activeTab === 'skins' ? 'active' : ''} 
          onClick={() => setActiveTab('skins')}
        >
          Skins
        </button>
        <button 
          className={activeTab === 'stickers' ? 'active' : ''} 
          onClick={() => setActiveTab('stickers')}
        >
          Stickers
        </button>
        <button 
          className={activeTab === 'colors' ? 'active' : ''} 
          onClick={() => setActiveTab('colors')}
        >
          Cores
        </button>
      </div>
      
      <div className="preview-area">
        {selectedSkin && (
          <div className="skin-preview" style={{ borderColor: selectedColor }}>
            <img src={selectedSkin.image} alt={selectedSkin.name} />
            
            {/* Posições dos stickers */}
            <div className="sticker-positions">
              {stickerPositions.map(position => {
                const stickerId = selectedStickers[position];
                const sticker = stickers.find(s => s.id === stickerId);
                
                return (
                  <div key={position} className={`sticker-position position-${position}`}>
                    {sticker && (
                      <img src={sticker.image} alt={sticker.name} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="customization-options">
          {activeTab === 'skins' && (
            <div className="skins-grid">
              {skins.map(skin => (
                <div 
                  key={skin.id} 
                  className={`skin-card ${selectedSkin?.id === skin.id ? 'selected' : ''}`}
                  onClick={() => handleSkinSelect(skin)}
                >
                  <div className="skin-image">
                    <img src={skin.image} alt={skin.name} />
                  </div>
                  <div className="skin-info">
                    <h3>{skin.name}</h3>
                    <span className={`skin-rarity rarity-${skin.rarity.toLowerCase()}`}>
                      {skin.rarity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'stickers' && (
            <div className="stickers-section">
              <div className="sticker-positions-selector">
                <h3>Selecione a posição</h3>
                <div className="position-buttons">
                  {stickerPositions.map(position => (
                    <button 
                      key={position} 
                      className={`position-button ${selectedStickers[position] ? 'has-sticker' : ''}`}
                    >
                      Posição {position + 1}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="stickers-grid">
                {stickers.map(sticker => (
                  <div 
                    key={sticker.id} 
                    className="sticker-card"
                    onClick={() => handleStickerSelect(sticker.id, 0)} // Posição 0 por padrão, em uma implementação real seria a posição selecionada
                  >
                    <div className="sticker-image">
                      <img src={sticker.image} alt={sticker.name} />
                    </div>
                    <div className="sticker-info">
                      <h3>{sticker.name}</h3>
                      <span className={`sticker-rarity rarity-${sticker.rarity.toLowerCase()}`}>
                        {sticker.rarity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'colors' && (
            <div className="colors-section">
              <div className="color-picker">
                <h3>Escolha uma cor</h3>
                <input 
                  type="color" 
                  value={selectedColor} 
                  onChange={handleColorChange} 
                />
                <span className="color-value">{selectedColor}</span>
              </div>
              
              <div className="predefined-colors">
                <h3>Cores predefinidas</h3>
                <div className="color-grid">
                  {predefinedColors.map(color => (
                    <div 
                      key={color} 
                      className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="customizer-actions">
        <button 
          className="save-button"
          onClick={handleSaveCustomization}
          disabled={!selectedSkin}
        >
          Salvar Customização
        </button>
      </div>
    </div>
  );
};

export default SkinCustomizer;

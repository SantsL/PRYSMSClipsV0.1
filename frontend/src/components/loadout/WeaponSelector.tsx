import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Weapon {
  id: string;
  name: string;
  type: string;
  image: string;
}

interface WeaponSelectorProps {
  onSelectWeapon: (weapon: Weapon) => void;
}

const WeaponSelector: React.FC<WeaponSelectorProps> = ({ onSelectWeapon }) => {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeapons = async () => {
      try {
        setLoading(true);
        // Em um ambiente de produção, isso seria substituído pela chamada real à API
        // const response = await axios.get('/api/loadout/weapons');
        // Usando dados mockados para desenvolvimento
        const mockWeapons: Weapon[] = [
          {
            id: "weapon1",
            name: "AK-47",
            type: "Rifle",
            image: "/assets/weapons/ak47.png"
          },
          {
            id: "weapon2",
            name: "M4A4",
            type: "Rifle",
            image: "/assets/weapons/m4a4.png"
          },
          {
            id: "weapon3",
            name: "AWP",
            type: "Sniper",
            image: "/assets/weapons/awp.png"
          },
          {
            id: "weapon4",
            name: "Desert Eagle",
            type: "Pistol",
            image: "/assets/weapons/deagle.png"
          },
          {
            id: "weapon5",
            name: "USP-S",
            type: "Pistol",
            image: "/assets/weapons/usps.png"
          },
          {
            id: "weapon6",
            name: "Glock-18",
            type: "Pistol",
            image: "/assets/weapons/glock.png"
          },
          {
            id: "weapon7",
            name: "M4A1-S",
            type: "Rifle",
            image: "/assets/weapons/m4a1s.png"
          },
          {
            id: "weapon8",
            name: "SSG 08",
            type: "Sniper",
            image: "/assets/weapons/ssg08.png"
          }
        ];
        
        setWeapons(mockWeapons);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar armas. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchWeapons();
  }, []);

  // Obter tipos únicos de armas para filtro
  const weaponTypes = [...new Set(weapons.map(weapon => weapon.type))];

  // Filtrar armas por tipo selecionado
  const filteredWeapons = selectedType 
    ? weapons.filter(weapon => weapon.type === selectedType)
    : weapons;

  return (
    <div className="weapon-selector">
      <h2>Selecione uma Arma</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="weapon-filters">
        <button 
          className={selectedType === null ? 'active' : ''} 
          onClick={() => setSelectedType(null)}
        >
          Todas
        </button>
        {weaponTypes.map(type => (
          <button 
            key={type} 
            className={selectedType === type ? 'active' : ''} 
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="loading">Carregando armas...</div>
      ) : (
        <div className="weapons-grid">
          {filteredWeapons.map(weapon => (
            <div 
              key={weapon.id} 
              className="weapon-card"
              onClick={() => onSelectWeapon(weapon)}
            >
              <div className="weapon-image">
                <img src={weapon.image} alt={weapon.name} />
              </div>
              <div className="weapon-info">
                <h3>{weapon.name}</h3>
                <span className="weapon-type">{weapon.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeaponSelector;

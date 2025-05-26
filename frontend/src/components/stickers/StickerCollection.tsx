import React, { useState, useEffect } from 'react';
import './StickerCollection.css';

interface StickerCollectionProps {
  favorites: string[];
  recent: string[];
  onFavoritesChange: (favorites: string[]) => void;
}

const StickerCollection: React.FC<StickerCollectionProps> = ({ favorites, recent, onFavoritesChange }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [allStickers, setAllStickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStickers, setFilteredStickers] = useState<any[]>([]);

  // Carregar stickers
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    const fetchStickers = async () => {
      try {
        // Simular carregamento de dados
        setTimeout(() => {
          // Dados simulados
          const mockStickers = Array.from({ length: 30 }, (_, i) => ({
            id: `sticker-${i + 1}`,
            name: `Sticker ${i + 1}`,
            imageUrl: `https://picsum.photos/id/${100 + i}/128/128`,
            category: ['gaming', 'emotes', 'memes', 'custom'][Math.floor(Math.random() * 4)],
            tags: ['funny', 'cool', 'epic', 'rage', 'gg', 'win', 'fail'].sort(() => 0.5 - Math.random()).slice(0, 3),
            createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            createdBy: i < 10 ? 'me' : `user-${i % 5 + 1}`,
            isPremium: i % 7 === 0
          }));
          
          setAllStickers(mockStickers);
          setFilteredStickers(mockStickers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar stickers:', error);
        setLoading(false);
      }
    };

    fetchStickers();
  }, []);

  // Filtrar stickers com base na aba ativa e busca
  useEffect(() => {
    let result = [...allStickers];
    
    // Filtrar por aba
    switch (activeTab) {
      case 'favorites':
        result = result.filter(sticker => favorites.includes(sticker.id));
        break;
      case 'recent':
        result = result.filter(sticker => recent.includes(sticker.id));
        break;
      case 'my':
        result = result.filter(sticker => sticker.createdBy === 'me');
        break;
      case 'gaming':
      case 'emotes':
      case 'memes':
      case 'custom':
        result = result.filter(sticker => sticker.category === activeTab);
        break;
      // 'all' não precisa de filtro
    }
    
    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(sticker => 
        sticker.name.toLowerCase().includes(query) ||
        sticker.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredStickers(result);
  }, [activeTab, searchQuery, allStickers, favorites, recent]);

  // Manipuladores de eventos
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleFavorite = (stickerId: string) => {
    if (favorites.includes(stickerId)) {
      // Remover dos favoritos
      onFavoritesChange(favorites.filter(id => id !== stickerId));
    } else {
      // Adicionar aos favoritos (limitado a 20)
      if (favorites.length < 20) {
        onFavoritesChange([...favorites, stickerId]);
      } else {
        alert('Você atingiu o limite de 20 stickers favoritos. Remova alguns para adicionar novos.');
      }
    }
  };

  if (loading) {
    return <div className="sticker-collection-loading">Carregando stickers...</div>;
  }

  return (
    <div className="sticker-collection">
      <div className="sticker-search">
        <input
          type="text"
          placeholder="Buscar stickers..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="sticker-tabs">
        <div 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleTabChange('all')}
        >
          Todos
        </div>
        <div 
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => handleTabChange('favorites')}
        >
          Favoritos
        </div>
        <div 
          className={`tab ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => handleTabChange('recent')}
        >
          Recentes
        </div>
        <div 
          className={`tab ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => handleTabChange('my')}
        >
          Meus
        </div>
        <div 
          className={`tab ${activeTab === 'gaming' ? 'active' : ''}`}
          onClick={() => handleTabChange('gaming')}
        >
          Gaming
        </div>
        <div 
          className={`tab ${activeTab === 'emotes' ? 'active' : ''}`}
          onClick={() => handleTabChange('emotes')}
        >
          Emotes
        </div>
        <div 
          className={`tab ${activeTab === 'memes' ? 'active' : ''}`}
          onClick={() => handleTabChange('memes')}
        >
          Memes
        </div>
      </div>
      
      <div className="stickers-grid">
        {filteredStickers.length > 0 ? (
          filteredStickers.map(sticker => (
            <div key={sticker.id} className="sticker-item">
              <div className="sticker-image-container">
                <img src={sticker.imageUrl} alt={sticker.name} className="sticker-image" />
                {sticker.isPremium && <div className="premium-badge">Premium</div>}
              </div>
              <div className="sticker-info">
                <div className="sticker-name">{sticker.name}</div>
                <button 
                  className={`favorite-button ${favorites.includes(sticker.id) ? 'favorited' : ''}`}
                  onClick={() => handleToggleFavorite(sticker.id)}
                >
                  <i className={`icon-${favorites.includes(sticker.id) ? 'star-filled' : 'star'}`}></i>
                </button>
              </div>
              <div className="sticker-tags">
                {sticker.tags.map((tag: string, index: number) => (
                  <span key={index} className="sticker-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-stickers">
            <p>Nenhum sticker encontrado.</p>
            {activeTab === 'my' && (
              <p>Crie seu primeiro sticker clicando no botão "Criar Novo Sticker".</p>
            )}
          </div>
        )}
      </div>
      
      <div className="sticker-collection-info">
        <p>
          {activeTab === 'favorites' ? (
            `${favorites.length}/20 stickers favoritos`
          ) : (
            `${filteredStickers.length} stickers encontrados`
          )}
        </p>
      </div>
    </div>
  );
};

export default StickerCollection;

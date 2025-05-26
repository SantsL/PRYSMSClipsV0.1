import React, { useState, useEffect } from 'react';
import './ServerTags.css';

interface ServerTagsProps {
  selectedTags?: string[];
  onChange?: (tags: string[]) => void;
  readOnly?: boolean;
  maxTags?: number;
}

const ServerTags: React.FC<ServerTagsProps> = ({ 
  selectedTags = [], 
  onChange, 
  readOnly = false,
  maxTags = 5
}) => {
  const [tags, setTags] = useState<string[]>(selectedTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lista de servidores populares de FiveM (RP e PVP)
  const popularServers = [
    // Servidores de RP
    { id: 'rp-1', name: 'Cidade Alta', type: 'rp', popularity: 98 },
    { id: 'rp-2', name: 'Complexo', type: 'rp', popularity: 95 },
    { id: 'rp-3', name: 'Eclipse RP', type: 'rp', popularity: 92 },
    { id: 'rp-4', name: 'Bahamas', type: 'rp', popularity: 90 },
    { id: 'rp-5', name: 'Vida Real', type: 'rp', popularity: 88 },
    { id: 'rp-6', name: 'Brasil Play', type: 'rp', popularity: 85 },
    { id: 'rp-7', name: 'Cidade do Crime', type: 'rp', popularity: 82 },
    { id: 'rp-8', name: 'Distrito RP', type: 'rp', popularity: 80 },
    { id: 'rp-9', name: 'Nova Era', type: 'rp', popularity: 78 },
    { id: 'rp-10', name: 'Horizonte RP', type: 'rp', popularity: 75 },
    
    // Servidores de PVP
    { id: 'pvp-1', name: 'Arena PVP', type: 'pvp', popularity: 96 },
    { id: 'pvp-2', name: 'Batalha Urbana', type: 'pvp', popularity: 93 },
    { id: 'pvp-3', name: 'Confronto', type: 'pvp', popularity: 89 },
    { id: 'pvp-4', name: 'Warzone', type: 'pvp', popularity: 87 },
    { id: 'pvp-5', name: 'Tiroteio', type: 'pvp', popularity: 84 },
    { id: 'pvp-6', name: 'Combate Total', type: 'pvp', popularity: 81 },
    { id: 'pvp-7', name: 'Zona de Guerra', type: 'pvp', popularity: 79 },
    { id: 'pvp-8', name: 'Duelo', type: 'pvp', popularity: 76 },
    { id: 'pvp-9', name: 'Caos Urbano', type: 'pvp', popularity: 74 },
    { id: 'pvp-10', name: 'Sobrevivência', type: 'pvp', popularity: 72 },
    
    // Categorias genéricas (para evitar problemas de copyright)
    { id: 'cat-1', name: 'Roleplay Urbano', type: 'category', popularity: 99 },
    { id: 'cat-2', name: 'Roleplay Criminal', type: 'category', popularity: 97 },
    { id: 'cat-3', name: 'Roleplay Policial', type: 'category', popularity: 94 },
    { id: 'cat-4', name: 'PVP Urbano', type: 'category', popularity: 91 },
    { id: 'cat-5', name: 'PVP Competitivo', type: 'category', popularity: 86 },
    { id: 'cat-6', name: 'Corridas', type: 'category', popularity: 83 },
    { id: 'cat-7', name: 'Economia', type: 'category', popularity: 77 },
    { id: 'cat-8', name: 'Mundo Aberto', type: 'category', popularity: 73 },
    { id: 'cat-9', name: 'Eventos Especiais', type: 'category', popularity: 70 },
    { id: 'cat-10', name: 'Mods', type: 'category', popularity: 68 }
  ];

  // Atualizar sugestões com base na busca
  useEffect(() => {
    if (!searchQuery.trim()) {
      // Mostrar servidores populares quando não há busca
      setSuggestions(
        popularServers
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 10)
      );
      return;
    }

    setLoading(true);

    // Simular busca (em um ambiente real, isso seria uma chamada à API)
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const filtered = popularServers.filter(server => 
        server.name.toLowerCase().includes(query)
      );
      
      setSuggestions(filtered);
      setLoading(false);
    }, 300);
  }, [searchQuery]);

  // Manipuladores de eventos
  const handleAddTag = (tag: string) => {
    if (readOnly) return;
    
    // Verificar se a tag já existe
    if (tags.includes(tag)) return;
    
    // Verificar limite de tags
    if (tags.length >= maxTags) {
      alert(`Você pode selecionar no máximo ${maxTags} tags.`);
      return;
    }
    
    const newTags = [...tags, tag];
    setTags(newTags);
    
    if (onChange) {
      onChange(newTags);
    }
    
    // Limpar busca
    setSearchQuery('');
  };

  const handleRemoveTag = (tag: string) => {
    if (readOnly) return;
    
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    
    if (onChange) {
      onChange(newTags);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Atraso para permitir cliques nas sugestões
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Renderizar tag com base no tipo
  const renderTag = (tag: string) => {
    const server = popularServers.find(s => s.name === tag);
    const tagType = server?.type || 'category';
    
    return (
      <div key={tag} className={`server-tag ${tagType}`}>
        <span className="tag-text">{tag}</span>
        {!readOnly && (
          <button 
            className="remove-tag-button"
            onClick={() => handleRemoveTag(tag)}
          >
            &times;
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="server-tags-container">
      <div className="selected-tags">
        {tags.map(tag => renderTag(tag))}
        
        {!readOnly && tags.length < maxTags && (
          <div className="tag-input-container">
            <input
              type="text"
              className="tag-input"
              placeholder="Adicionar servidor..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>
        )}
      </div>
      
      {showSuggestions && !readOnly && (
        <div className="tag-suggestions">
          {loading ? (
            <div className="suggestions-loading">Buscando...</div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map(server => (
                <li 
                  key={server.id}
                  className={`suggestion-item ${server.type}`}
                  onClick={() => handleAddTag(server.name)}
                >
                  <span className="suggestion-name">{server.name}</span>
                  <span className="suggestion-type">
                    {server.type === 'rp' ? 'Roleplay' : 
                     server.type === 'pvp' ? 'PVP' : 
                     'Categoria'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-suggestions">
              Nenhum servidor encontrado
            </div>
          )}
        </div>
      )}
      
      {readOnly && tags.length === 0 && (
        <div className="no-tags">
          Nenhuma tag de servidor selecionada
        </div>
      )}
      
      {!readOnly && (
        <div className="tags-info">
          <small>
            {tags.length}/{maxTags} tags selecionadas
          </small>
        </div>
      )}
    </div>
  );
};

export default ServerTags;

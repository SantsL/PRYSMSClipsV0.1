import React, { useState, useEffect } from 'react';
import './ProfileCustomization.css';

// Componentes
import AvatarUploader from './AvatarUploader';
import BannerUploader from './BannerUploader';
import ColorPicker from './ColorPicker';
import BadgeSelector from './BadgeSelector';
import StickerCollection from '../stickers/StickerCollection';

interface ProfileCustomizationProps {
  userId: string;
  onSave: (profileData: any) => void;
  initialData?: any;
}

const ProfileCustomization: React.FC<ProfileCustomizationProps> = ({ userId, onSave, initialData }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [profileData, setProfileData] = useState({
    basic: {
      displayName: '',
      tagline: '',
      avatar: '',
      banner: '',
    },
    visual: {
      themeColor: '#4f46e5',
      avatarFrame: 'default',
      nameFont: 'default',
      profileLayout: 'standard',
    },
    social: {
      status: '',
      favoriteGames: [],
      socialLinks: {
        twitch: '',
        youtube: '',
        twitter: '',
        instagram: '',
      },
      showStats: true,
    },
    badges: {
      selected: [],
      showcase: [],
    },
    stickers: {
      favorites: [],
      recent: [],
    }
  });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState({ status: '', message: '' });

  // Carregar dados do perfil
  useEffect(() => {
    if (initialData) {
      setProfileData(initialData);
      setLoading(false);
      return;
    }

    // Em um ambiente de produção, isso seria uma chamada à API
    const fetchProfileData = async () => {
      try {
        // Simular carregamento de dados
        setTimeout(() => {
          // Dados simulados
          setProfileData({
            basic: {
              displayName: 'Jogador123',
              tagline: 'Colecionador de clipes épicos',
              avatar: 'https://picsum.photos/id/237/512/512',
              banner: 'https://picsum.photos/id/1018/1200/300',
            },
            visual: {
              themeColor: '#4f46e5',
              avatarFrame: 'gold',
              nameFont: 'neon',
              profileLayout: 'gamer',
            },
            social: {
              status: 'Caçando clipes épicos',
              favoriteGames: ['CS2', 'GTA V', 'Valorant'],
              socialLinks: {
                twitch: 'jogador123',
                youtube: 'jogador123',
                twitter: '',
                instagram: 'jogador.123',
              },
              showStats: true,
            },
            badges: {
              selected: ['early_supporter', 'clip_master', 'event_winner'],
              showcase: ['clip_master'],
            },
            stickers: {
              favorites: ['sticker1', 'sticker2', 'sticker3'],
              recent: ['sticker4', 'sticker5'],
            }
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, initialData]);

  // Manipuladores de eventos
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section: string, parent: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [field]: value
        }
      }
    }));
  };

  const handleSaveProfile = () => {
    // Em um ambiente de produção, isso seria uma chamada à API
    setSaveStatus({ status: 'loading', message: 'Salvando perfil...' });
    
    // Simular salvamento
    setTimeout(() => {
      onSave(profileData);
      setSaveStatus({ status: 'success', message: 'Perfil salvo com sucesso!' });
      
      // Limpar status após alguns segundos
      setTimeout(() => {
        setSaveStatus({ status: '', message: '' });
      }, 3000);
    }, 1500);
  };

  // Renderizar conteúdo com base na aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="profile-tab-content">
            <h3>Informações Básicas</h3>
            
            <div className="form-group">
              <label htmlFor="displayName">Nome de Exibição</label>
              <input
                type="text"
                id="displayName"
                value={profileData.basic.displayName}
                onChange={(e) => handleInputChange('basic', 'displayName', e.target.value)}
                maxLength={20}
              />
              <small>Como seu nome aparecerá para outros usuários (máx. 20 caracteres)</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="tagline">Tagline</label>
              <input
                type="text"
                id="tagline"
                value={profileData.basic.tagline}
                onChange={(e) => handleInputChange('basic', 'tagline', e.target.value)}
                maxLength={50}
              />
              <small>Uma breve descrição sobre você (máx. 50 caracteres)</small>
            </div>
            
            <div className="form-group">
              <label>Avatar</label>
              <AvatarUploader
                currentAvatar={profileData.basic.avatar}
                onAvatarChange={(url) => handleInputChange('basic', 'avatar', url)}
              />
              <small>Imagem quadrada, recomendado 512x512px (máx. 1MB)</small>
            </div>
            
            <div className="form-group">
              <label>Banner</label>
              <BannerUploader
                currentBanner={profileData.basic.banner}
                onBannerChange={(url) => handleInputChange('basic', 'banner', url)}
              />
              <small>Imagem de cabeçalho, recomendado 1200x300px (máx. 2MB)</small>
            </div>
          </div>
        );
      
      case 'visual':
        return (
          <div className="profile-tab-content">
            <h3>Personalização Visual</h3>
            
            <div className="form-group">
              <label>Cor do Tema</label>
              <ColorPicker
                currentColor={profileData.visual.themeColor}
                onColorChange={(color) => handleInputChange('visual', 'themeColor', color)}
              />
              <small>Esta cor será usada em destaque no seu perfil</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="avatarFrame">Moldura do Avatar</label>
              <select
                id="avatarFrame"
                value={profileData.visual.avatarFrame}
                onChange={(e) => handleInputChange('visual', 'avatarFrame', e.target.value)}
              >
                <option value="default">Padrão</option>
                <option value="gold">Ouro</option>
                <option value="silver">Prata</option>
                <option value="bronze">Bronze</option>
                <option value="neon">Neon</option>
                <option value="fire">Fogo</option>
                <option value="ice">Gelo</option>
              </select>
              <div className="frame-preview">
                {/* Aqui seria exibida uma prévia da moldura */}
                <img 
                  src={profileData.basic.avatar} 
                  alt="Avatar Preview" 
                  className={`frame-${profileData.visual.avatarFrame}`} 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="nameFont">Estilo do Nome</label>
              <select
                id="nameFont"
                value={profileData.visual.nameFont}
                onChange={(e) => handleInputChange('visual', 'nameFont', e.target.value)}
              >
                <option value="default">Padrão</option>
                <option value="neon">Neon</option>
                <option value="retro">Retro</option>
                <option value="pixel">Pixel</option>
                <option value="script">Script</option>
              </select>
              <div className="font-preview">
                <span className={`font-${profileData.visual.nameFont}`}>
                  {profileData.basic.displayName || 'Seu Nome'}
                </span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="profileLayout">Layout do Perfil</label>
              <select
                id="profileLayout"
                value={profileData.visual.profileLayout}
                onChange={(e) => handleInputChange('visual', 'profileLayout', e.target.value)}
              >
                <option value="standard">Padrão</option>
                <option value="gamer">Gamer</option>
                <option value="streamer">Streamer</option>
                <option value="minimal">Minimalista</option>
              </select>
              <div className="layout-preview">
                {/* Aqui seria exibida uma prévia do layout */}
                <div className={`layout-preview-${profileData.visual.profileLayout}`}>
                  <div className="preview-banner"></div>
                  <div className="preview-avatar"></div>
                  <div className="preview-info"></div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'social':
        return (
          <div className="profile-tab-content">
            <h3>Informações Sociais</h3>
            
            <div className="form-group">
              <label htmlFor="status">Status Atual</label>
              <input
                type="text"
                id="status"
                value={profileData.social.status}
                onChange={(e) => handleInputChange('social', 'status', e.target.value)}
                maxLength={50}
              />
              <small>O que você está fazendo agora? (máx. 50 caracteres)</small>
            </div>
            
            <div className="form-group">
              <label>Jogos Favoritos</label>
              <div className="tags-input">
                <input
                  type="text"
                  placeholder="Adicionar jogo..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      const newGame = e.currentTarget.value;
                      if (!profileData.social.favoriteGames.includes(newGame)) {
                        handleInputChange('social', 'favoriteGames', [...profileData.social.favoriteGames, newGame]);
                      }
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <div className="tags-container">
                  {profileData.social.favoriteGames.map((game, index) => (
                    <div key={index} className="tag">
                      {game}
                      <button
                        onClick={() => {
                          const updatedGames = [...profileData.social.favoriteGames];
                          updatedGames.splice(index, 1);
                          handleInputChange('social', 'favoriteGames', updatedGames);
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <small>Adicione até 5 jogos favoritos</small>
            </div>
            
            <div className="form-group">
              <label>Links Sociais</label>
              
              <div className="social-link">
                <i className="icon-twitch"></i>
                <input
                  type="text"
                  placeholder="Seu nome de usuário na Twitch"
                  value={profileData.social.socialLinks.twitch}
                  onChange={(e) => handleNestedInputChange('social', 'socialLinks', 'twitch', e.target.value)}
                />
              </div>
              
              <div className="social-link">
                <i className="icon-youtube"></i>
                <input
                  type="text"
                  placeholder="Seu nome de usuário no YouTube"
                  value={profileData.social.socialLinks.youtube}
                  onChange={(e) => handleNestedInputChange('social', 'socialLinks', 'youtube', e.target.value)}
                />
              </div>
              
              <div className="social-link">
                <i className="icon-twitter"></i>
                <input
                  type="text"
                  placeholder="Seu nome de usuário no Twitter"
                  value={profileData.social.socialLinks.twitter}
                  onChange={(e) => handleNestedInputChange('social', 'socialLinks', 'twitter', e.target.value)}
                />
              </div>
              
              <div className="social-link">
                <i className="icon-instagram"></i>
                <input
                  type="text"
                  placeholder="Seu nome de usuário no Instagram"
                  value={profileData.social.socialLinks.instagram}
                  onChange={(e) => handleNestedInputChange('social', 'socialLinks', 'instagram', e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={profileData.social.showStats}
                  onChange={(e) => handleInputChange('social', 'showStats', e.target.checked)}
                />
                Mostrar estatísticas no perfil
              </label>
              <small>Exibe suas estatísticas de jogo e conquistas no seu perfil</small>
            </div>
          </div>
        );
      
      case 'badges':
        return (
          <div className="profile-tab-content">
            <h3>Badges e Conquistas</h3>
            
            <BadgeSelector
              selectedBadges={profileData.badges.selected}
              showcaseBadges={profileData.badges.showcase}
              onBadgesChange={(selected, showcase) => {
                setProfileData(prev => ({
                  ...prev,
                  badges: {
                    selected,
                    showcase
                  }
                }));
              }}
            />
            
            <div className="badges-info">
              <p>Badges são conquistas e marcos especiais que você pode exibir no seu perfil.</p>
              <p>Você pode ganhar badges participando de eventos, alcançando objetivos ou através de compras especiais.</p>
              <p>Selecione até 3 badges para destacar no seu perfil.</p>
            </div>
          </div>
        );
      
      case 'stickers':
        return (
          <div className="profile-tab-content">
            <h3>Meus Stickers</h3>
            
            <StickerCollection
              favorites={profileData.stickers.favorites}
              recent={profileData.stickers.recent}
              onFavoritesChange={(favorites) => {
                setProfileData(prev => ({
                  ...prev,
                  stickers: {
                    ...prev.stickers,
                    favorites
                  }
                }));
              }}
            />
            
            <div className="stickers-info">
              <p>Stickers podem ser usados em comentários, mensagens e para personalizar suas armas no PRYSMS Arsenal.</p>
              <p>Você pode criar seus próprios stickers ou colecionar stickers especiais de eventos.</p>
              <p>Favorite os stickers que você mais usa para acesso rápido.</p>
            </div>
            
            <button className="create-sticker-button">
              Criar Novo Sticker
            </button>
          </div>
        );
      
      default:
        return <div>Selecione uma aba para personalizar seu perfil.</div>;
    }
  };

  if (loading) {
    return <div className="profile-customization-loading">Carregando dados do perfil...</div>;
  }

  return (
    <div className="profile-customization">
      <div className="profile-customization-header">
        <h2>Personalizar Perfil</h2>
        <p>Personalize seu perfil para destacar sua identidade no PRYSMSCLIPS</p>
      </div>

      <div className="profile-preview">
        <div 
          className="preview-banner"
          style={{ backgroundImage: `url(${profileData.basic.banner})` }}
        >
          <div 
            className={`preview-avatar frame-${profileData.visual.avatarFrame}`}
            style={{ backgroundImage: `url(${profileData.basic.avatar})` }}
          ></div>
        </div>
        <div className="preview-info" style={{ borderColor: profileData.visual.themeColor }}>
          <h3 className={`font-${profileData.visual.nameFont}`} style={{ color: profileData.visual.themeColor }}>
            {profileData.basic.displayName || 'Seu Nome'}
          </h3>
          <p>{profileData.basic.tagline || 'Sua tagline'}</p>
          <div className="preview-badges">
            {profileData.badges.showcase.map((badge, index) => (
              <div key={index} className={`badge badge-${badge}`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <div 
          className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => handleTabChange('basic')}
        >
          <i className="icon-user"></i>
          <span>Básico</span>
        </div>
        <div 
          className={`tab ${activeTab === 'visual' ? 'active' : ''}`}
          onClick={() => handleTabChange('visual')}
        >
          <i className="icon-palette"></i>
          <span>Visual</span>
        </div>
        <div 
          className={`tab ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => handleTabChange('social')}
        >
          <i className="icon-share"></i>
          <span>Social</span>
        </div>
        <div 
          className={`tab ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => handleTabChange('badges')}
        >
          <i className="icon-award"></i>
          <span>Badges</span>
        </div>
        <div 
          className={`tab ${activeTab === 'stickers' ? 'active' : ''}`}
          onClick={() => handleTabChange('stickers')}
        >
          <i className="icon-sticker"></i>
          <span>Stickers</span>
        </div>
      </div>

      <div className="profile-content">
        {renderTabContent()}
      </div>

      <div className="profile-actions">
        <button 
          className="save-button"
          onClick={handleSaveProfile}
          disabled={saveStatus.status === 'loading'}
        >
          {saveStatus.status === 'loading' ? 'Salvando...' : 'Salvar Perfil'}
        </button>
        
        {saveStatus.message && (
          <div className={`save-status ${saveStatus.status}`}>
            {saveStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCustomization;

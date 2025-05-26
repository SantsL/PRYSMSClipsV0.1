import React, { useState, useEffect } from 'react';
import './ProfileSettings.css';

// Componentes
import ProfileCustomization from './ProfileCustomization';
import StickerCreator from '../stickers/StickerCreator';
import StickerCollection from '../stickers/StickerCollection';

interface ProfileSettingsProps {
  userId: string;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userId }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showStickerCreator, setShowStickerCreator] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ status: '', message: '' });

  // Carregar dados do perfil
  useEffect(() => {
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
              created: ['sticker6', 'sticker7']
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
  }, [userId]);

  // Manipuladores de eventos
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleSaveProfile = (updatedProfileData: any) => {
    // Em um ambiente de produção, isso seria uma chamada à API
    setSaveStatus({ status: 'loading', message: 'Salvando perfil...' });
    
    // Simular salvamento
    setTimeout(() => {
      setProfileData(updatedProfileData);
      setSaveStatus({ status: 'success', message: 'Perfil salvo com sucesso!' });
      
      // Limpar status após alguns segundos
      setTimeout(() => {
        setSaveStatus({ status: '', message: '' });
      }, 3000);
    }, 1500);
  };

  const handleStickerCreated = (stickerData: any) => {
    // Em um ambiente de produção, isso seria uma chamada à API
    console.log('Sticker criado:', stickerData);
    
    // Atualizar lista de stickers criados
    setProfileData(prev => ({
      ...prev,
      stickers: {
        ...prev.stickers,
        created: [stickerData.id, ...prev.stickers.created]
      }
    }));
    
    // Fechar criador de stickers
    setShowStickerCreator(false);
  };

  // Renderizar conteúdo com base na seção ativa
  const renderContent = () => {
    if (loading) {
      return <div className="profile-settings-loading">Carregando dados do perfil...</div>;
    }

    if (!profileData) {
      return <div className="profile-settings-error">Erro ao carregar dados do perfil.</div>;
    }

    switch (activeSection) {
      case 'profile':
        return (
          <ProfileCustomization
            userId={userId}
            onSave={handleSaveProfile}
            initialData={profileData}
          />
        );
      
      case 'stickers':
        return (
          <div className="stickers-management">
            <div className="stickers-header">
              <h2>Gerenciar Stickers</h2>
              <button 
                className="create-sticker-button"
                onClick={() => setShowStickerCreator(true)}
              >
                <i className="icon-plus"></i>
                Criar Novo Sticker
              </button>
            </div>
            
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
            
            {showStickerCreator && (
              <div className="sticker-creator-modal">
                <StickerCreator
                  onStickerCreated={handleStickerCreated}
                  onCancel={() => setShowStickerCreator(false)}
                />
              </div>
            )}
          </div>
        );
      
      case 'privacy':
        return (
          <div className="privacy-settings">
            <h2>Configurações de Privacidade</h2>
            
            <div className="settings-group">
              <h3>Visibilidade do Perfil</h3>
              
              <div className="setting-item">
                <label className="radio-label">
                  <input type="radio" name="profile-visibility" value="public" defaultChecked />
                  <span className="radio-text">
                    <strong>Público</strong>
                    <span className="description">Qualquer pessoa pode ver seu perfil</span>
                  </span>
                </label>
              </div>
              
              <div className="setting-item">
                <label className="radio-label">
                  <input type="radio" name="profile-visibility" value="registered" />
                  <span className="radio-text">
                    <strong>Apenas Usuários Registrados</strong>
                    <span className="description">Apenas usuários com conta podem ver seu perfil</span>
                  </span>
                </label>
              </div>
              
              <div className="setting-item">
                <label className="radio-label">
                  <input type="radio" name="profile-visibility" value="friends" />
                  <span className="radio-text">
                    <strong>Apenas Amigos</strong>
                    <span className="description">Apenas seus amigos podem ver seu perfil</span>
                  </span>
                </label>
              </div>
            </div>
            
            <div className="settings-group">
              <h3>Configurações de Conteúdo</h3>
              
              <div className="setting-item">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span className="checkbox-text">
                    <strong>Mostrar Estatísticas</strong>
                    <span className="description">Exibir suas estatísticas de jogo no perfil</span>
                  </span>
                </label>
              </div>
              
              <div className="setting-item">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span className="checkbox-text">
                    <strong>Mostrar Clipes</strong>
                    <span className="description">Exibir seus clipes no perfil</span>
                  </span>
                </label>
              </div>
              
              <div className="setting-item">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span className="checkbox-text">
                    <strong>Mostrar Arsenal</strong>
                    <span className="description">Exibir seus loadouts no perfil</span>
                  </span>
                </label>
              </div>
            </div>
            
            <div className="settings-group">
              <h3>Notificações</h3>
              
              <div className="setting-item">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span className="checkbox-text">
                    <strong>Notificações por E-mail</strong>
                    <span className="description">Receber notificações por e-mail</span>
                  </span>
                </label>
              </div>
              
              <div className="setting-item">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span className="checkbox-text">
                    <strong>Notificações no Site</strong>
                    <span className="description">Receber notificações no site</span>
                  </span>
                </label>
              </div>
            </div>
            
            <button className="save-button">Salvar Configurações</button>
          </div>
        );
      
      case 'account':
        return (
          <div className="account-settings">
            <h2>Configurações da Conta</h2>
            
            <div className="settings-group">
              <h3>Informações da Conta</h3>
              
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  defaultValue="usuario@exemplo.com"
                  disabled
                />
                <button className="change-button">Alterar E-mail</button>
              </div>
              
              <div className="form-group">
                <label htmlFor="username">Nome de Usuário</label>
                <input
                  type="text"
                  id="username"
                  defaultValue="jogador123"
                  disabled
                />
                <button className="change-button">Alterar Nome de Usuário</button>
              </div>
              
              <div className="form-group">
                <label>Senha</label>
                <input
                  type="password"
                  value="••••••••"
                  disabled
                />
                <button className="change-button">Alterar Senha</button>
              </div>
            </div>
            
            <div className="settings-group">
              <h3>Verificação em Duas Etapas</h3>
              
              <div className="setting-item">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span className="checkbox-text">
                    <strong>Ativar Verificação em Duas Etapas</strong>
                    <span className="description">Adiciona uma camada extra de segurança à sua conta</span>
                  </span>
                </label>
              </div>
            </div>
            
            <div className="settings-group danger-zone">
              <h3>Zona de Perigo</h3>
              
              <div className="setting-item">
                <button className="danger-button">Desativar Conta</button>
                <p className="description">Sua conta ficará invisível, mas seus dados serão mantidos</p>
              </div>
              
              <div className="setting-item">
                <button className="danger-button">Excluir Conta</button>
                <p className="description">Todos os seus dados serão excluídos permanentemente</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Selecione uma seção para configurar.</div>;
    }
  };

  return (
    <div className="profile-settings">
      <div className="profile-settings-header">
        <h1>Configurações</h1>
        <p>Gerencie seu perfil, stickers e configurações de conta</p>
      </div>
      
      <div className="profile-settings-container">
        <div className="profile-settings-sidebar">
          <div 
            className={`sidebar-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => handleSectionChange('profile')}
          >
            <i className="icon-user"></i>
            <span>Personalização de Perfil</span>
          </div>
          <div 
            className={`sidebar-item ${activeSection === 'stickers' ? 'active' : ''}`}
            onClick={() => handleSectionChange('stickers')}
          >
            <i className="icon-sticker"></i>
            <span>Gerenciar Stickers</span>
          </div>
          <div 
            className={`sidebar-item ${activeSection === 'privacy' ? 'active' : ''}`}
            onClick={() => handleSectionChange('privacy')}
          >
            <i className="icon-lock"></i>
            <span>Privacidade</span>
          </div>
          <div 
            className={`sidebar-item ${activeSection === 'account' ? 'active' : ''}`}
            onClick={() => handleSectionChange('account')}
          >
            <i className="icon-settings"></i>
            <span>Conta</span>
          </div>
        </div>
        
        <div className="profile-settings-content">
          {renderContent()}
        </div>
      </div>
      
      {saveStatus.message && (
        <div className={`save-status-global ${saveStatus.status}`}>
          {saveStatus.message}
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;

import React, { useState, useEffect } from 'react';
import './ProfileView.css';

interface ProfileViewProps {
  userId: string;
  isCurrentUser?: boolean;
  onEditProfile?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userId, isCurrentUser = false, onEditProfile }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clips');

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
            stats: {
              clipsUploaded: 87,
              clipsLiked: 342,
              totalViews: 12456,
              prysmsEarned: 5678,
              memberSince: '2024-12-15',
              lastActive: '2025-05-24',
              rank: 'Platina',
              rankPosition: 342
            },
            clan: {
              name: 'Predadores Noturnos',
              tag: 'PRD',
              role: 'Membro',
              emblem: 'https://picsum.photos/id/222/128/128'
            },
            content: {
              clips: [
                { id: 'clip1', title: 'Headshot incrível', thumbnail: 'https://picsum.photos/id/111/320/180', views: 1245, likes: 87, date: '2025-05-20' },
                { id: 'clip2', title: 'Clutch 1v5', thumbnail: 'https://picsum.photos/id/112/320/180', views: 876, likes: 54, date: '2025-05-18' },
                { id: 'clip3', title: 'Jogada épica', thumbnail: 'https://picsum.photos/id/113/320/180', views: 543, likes: 32, date: '2025-05-15' },
              ],
              loadouts: [
                { id: 'loadout1', name: 'AK-47 Neon', thumbnail: 'https://picsum.photos/id/211/320/180', votes: 87, date: '2025-05-19' },
                { id: 'loadout2', name: 'AWP Dragon', thumbnail: 'https://picsum.photos/id/212/320/180', votes: 65, date: '2025-05-17' },
              ],
              achievements: [
                { id: 'ach1', name: 'Primeiro Clipe', icon: 'trophy', date: '2024-12-16' },
                { id: 'ach2', name: '100 Likes', icon: 'heart', date: '2025-01-10' },
                { id: 'ach3', name: 'Vencedor do Evento de Verão', icon: 'medal', date: '2025-02-15' },
              ]
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
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Renderizar conteúdo com base na aba ativa
  const renderTabContent = () => {
    if (!profileData) return null;

    switch (activeTab) {
      case 'clips':
        return (
          <div className="profile-clips">
            <h3>Clipes</h3>
            {profileData.content.clips.length > 0 ? (
              <div className="clips-grid">
                {profileData.content.clips.map((clip: any) => (
                  <div key={clip.id} className="clip-card">
                    <div className="clip-thumbnail">
                      <img src={clip.thumbnail} alt={clip.title} />
                      <div className="clip-overlay">
                        <div className="clip-stats">
                          <span><i className="icon-eye"></i> {clip.views}</span>
                          <span><i className="icon-heart"></i> {clip.likes}</span>
                        </div>
                      </div>
                    </div>
                    <div className="clip-info">
                      <div className="clip-title">{clip.title}</div>
                      <div className="clip-date">{clip.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-content">
                <p>Nenhum clipe encontrado.</p>
                {isCurrentUser && (
                  <button className="upload-button">Fazer Upload de Clipe</button>
                )}
              </div>
            )}
          </div>
        );
      
      case 'loadouts':
        return (
          <div className="profile-loadouts">
            <h3>Arsenal</h3>
            {profileData.content.loadouts.length > 0 ? (
              <div className="loadouts-grid">
                {profileData.content.loadouts.map((loadout: any) => (
                  <div key={loadout.id} className="loadout-card">
                    <div className="loadout-thumbnail">
                      <img src={loadout.thumbnail} alt={loadout.name} />
                      <div className="loadout-overlay">
                        <div className="loadout-stats">
                          <span><i className="icon-thumbs-up"></i> {loadout.votes}</span>
                        </div>
                      </div>
                    </div>
                    <div className="loadout-info">
                      <div className="loadout-name">{loadout.name}</div>
                      <div className="loadout-date">{loadout.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-content">
                <p>Nenhum loadout encontrado.</p>
                {isCurrentUser && (
                  <button className="create-button">Criar Loadout</button>
                )}
              </div>
            )}
          </div>
        );
      
      case 'achievements':
        return (
          <div className="profile-achievements">
            <h3>Conquistas</h3>
            {profileData.content.achievements.length > 0 ? (
              <div className="achievements-list">
                {profileData.content.achievements.map((achievement: any) => (
                  <div key={achievement.id} className="achievement-item">
                    <div className={`achievement-icon icon-${achievement.icon}`}></div>
                    <div className="achievement-info">
                      <div className="achievement-name">{achievement.name}</div>
                      <div className="achievement-date">Conquistado em {achievement.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-content">
                <p>Nenhuma conquista encontrada.</p>
                <p>Participe de eventos e complete desafios para ganhar conquistas!</p>
              </div>
            )}
          </div>
        );
      
      case 'stats':
        return (
          <div className="profile-stats">
            <h3>Estatísticas</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{profileData.stats.clipsUploaded}</div>
                <div className="stat-label">Clipes Enviados</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{profileData.stats.clipsLiked}</div>
                <div className="stat-label">Clipes Curtidos</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{profileData.stats.totalViews.toLocaleString()}</div>
                <div className="stat-label">Visualizações Totais</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{profileData.stats.prysmsEarned.toLocaleString()}</div>
                <div className="stat-label">PRYSMS Ganhos</div>
              </div>
            </div>
            
            <div className="stats-details">
              <div className="stats-row">
                <div className="stats-label">Membro desde</div>
                <div className="stats-value">{profileData.stats.memberSince}</div>
              </div>
              <div className="stats-row">
                <div className="stats-label">Última atividade</div>
                <div className="stats-value">{profileData.stats.lastActive}</div>
              </div>
              <div className="stats-row">
                <div className="stats-label">Rank</div>
                <div className="stats-value rank-value">
                  <span className={`rank-${profileData.stats.rank.toLowerCase()}`}>{profileData.stats.rank}</span>
                  <span className="rank-position">#{profileData.stats.rankPosition}</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Selecione uma aba para ver o conteúdo.</div>;
    }
  };

  if (loading) {
    return <div className="profile-view-loading">Carregando perfil...</div>;
  }

  if (!profileData) {
    return <div className="profile-view-error">Erro ao carregar perfil.</div>;
  }

  return (
    <div className="profile-view" style={{ 
      '--theme-color': profileData.visual.themeColor,
      '--profile-layout': `var(--layout-${profileData.visual.profileLayout})`
    } as React.CSSProperties}>
      <div 
        className="profile-banner"
        style={{ backgroundImage: `url(${profileData.basic.banner})` }}
      >
        <div 
          className={`profile-avatar frame-${profileData.visual.avatarFrame}`}
          style={{ backgroundImage: `url(${profileData.basic.avatar})` }}
        ></div>
      </div>
      
      <div className="profile-header">
        <div className="profile-info">
          <h2 className={`profile-name font-${profileData.visual.nameFont}`}>
            {profileData.basic.displayName}
          </h2>
          <p className="profile-tagline">{profileData.basic.tagline}</p>
          
          <div className="profile-badges">
            {profileData.badges.showcase.map((badge: string) => (
              <div key={badge} className={`badge badge-${badge}`} title={badge.replace('_', ' ')}></div>
            ))}
          </div>
          
          {profileData.clan && (
            <div className="profile-clan">
              <img src={profileData.clan.emblem} alt={profileData.clan.name} className="clan-emblem" />
              <span className="clan-info">
                <span className="clan-tag">[{profileData.clan.tag}]</span>
                <span className="clan-name">{profileData.clan.name}</span>
                <span className="clan-role">({profileData.clan.role})</span>
              </span>
            </div>
          )}
        </div>
        
        <div className="profile-actions">
          {isCurrentUser ? (
            <button className="edit-profile-button" onClick={onEditProfile}>
              <i className="icon-edit"></i>
              Editar Perfil
            </button>
          ) : (
            <button className="follow-button">
              <i className="icon-plus"></i>
              Seguir
            </button>
          )}
        </div>
      </div>
      
      <div className="profile-social">
        <div className="profile-status">
          <i className="icon-activity"></i>
          <span>{profileData.social.status}</span>
        </div>
        
        <div className="profile-games">
          {profileData.social.favoriteGames.map((game: string, index: number) => (
            <span key={index} className="game-tag">{game}</span>
          ))}
        </div>
        
        <div className="profile-links">
          {profileData.social.socialLinks.twitch && (
            <a href={`https://twitch.tv/${profileData.social.socialLinks.twitch}`} target="_blank" rel="noopener noreferrer" className="social-link twitch">
              <i className="icon-twitch"></i>
            </a>
          )}
          {profileData.social.socialLinks.youtube && (
            <a href={`https://youtube.com/@${profileData.social.socialLinks.youtube}`} target="_blank" rel="noopener noreferrer" className="social-link youtube">
              <i className="icon-youtube"></i>
            </a>
          )}
          {profileData.social.socialLinks.twitter && (
            <a href={`https://twitter.com/${profileData.social.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="social-link twitter">
              <i className="icon-twitter"></i>
            </a>
          )}
          {profileData.social.socialLinks.instagram && (
            <a href={`https://instagram.com/${profileData.social.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="social-link instagram">
              <i className="icon-instagram"></i>
            </a>
          )}
        </div>
      </div>
      
      <div className="profile-tabs">
        <div 
          className={`tab ${activeTab === 'clips' ? 'active' : ''}`}
          onClick={() => handleTabChange('clips')}
        >
          <i className="icon-video"></i>
          <span>Clipes</span>
        </div>
        <div 
          className={`tab ${activeTab === 'loadouts' ? 'active' : ''}`}
          onClick={() => handleTabChange('loadouts')}
        >
          <i className="icon-target"></i>
          <span>Arsenal</span>
        </div>
        <div 
          className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => handleTabChange('achievements')}
        >
          <i className="icon-award"></i>
          <span>Conquistas</span>
        </div>
        <div 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => handleTabChange('stats')}
        >
          <i className="icon-bar-chart"></i>
          <span>Estatísticas</span>
        </div>
      </div>
      
      <div className="profile-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProfileView;

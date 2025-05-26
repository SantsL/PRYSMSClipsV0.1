import React, { useState, useEffect } from 'react';
import './ActivityFeed.css';

interface ActivityFeedProps {
  userId?: string; // Se fornecido, mostra apenas atividades deste usuário
  friendsOnly?: boolean; // Se true, mostra apenas atividades de amigos
  limit?: number; // Número máximo de atividades a exibir
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  userId, 
  friendsOnly = true, 
  limit = 20 
}) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Carregar atividades
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    const fetchActivities = async () => {
      try {
        // Simular carregamento de dados
        setTimeout(() => {
          // Dados simulados
          const mockActivities = generateMockActivities(userId, friendsOnly, filter, page, limit);
          
          if (page === 0) {
            setActivities(mockActivities);
          } else {
            setActivities(prev => [...prev, ...mockActivities]);
          }
          
          // Simular fim dos dados após algumas páginas
          setHasMore(page < 3);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar atividades:', error);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchActivities();
  }, [userId, friendsOnly, filter, page, limit]);

  // Gerar dados simulados
  const generateMockActivities = (
    userId?: string, 
    friendsOnly?: boolean, 
    filter?: string, 
    page?: number, 
    limit?: number
  ) => {
    const activityTypes = [
      'clip_upload', 'clip_like', 'achievement', 'loadout_create', 
      'loadout_vote', 'friend_add', 'profile_update', 'event_join'
    ];
    
    // Filtrar tipos de atividade se necessário
    const filteredTypes = filter === 'all' 
      ? activityTypes 
      : activityTypes.filter(type => type.startsWith(filter));
    
    // Gerar atividades aleatórias
    return Array.from({ length: limit || 20 }, (_, i) => {
      const type = filteredTypes[Math.floor(Math.random() * filteredTypes.length)];
      const timestamp = new Date(Date.now() - Math.random() * 604800000); // Últimos 7 dias
      const userId = `user-${Math.floor(Math.random() * 10) + 1}`;
      const userName = `Jogador${Math.floor(Math.random() * 100) + 1}`;
      const userAvatar = `https://picsum.photos/id/${100 + Math.floor(Math.random() * 100)}/64/64`;
      
      // Base da atividade
      const activity = {
        id: `activity-${page * limit + i + 1}`,
        type,
        timestamp,
        user: {
          id: userId,
          name: userName,
          avatar: userAvatar
        },
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20),
        userHasLiked: Math.random() > 0.7
      };
      
      // Adicionar detalhes específicos por tipo
      switch (type) {
        case 'clip_upload':
          return {
            ...activity,
            content: {
              clipId: `clip-${Math.floor(Math.random() * 1000)}`,
              title: `Jogada épica em ${['Dust 2', 'Mirage', 'Inferno', 'Nuke', 'Overpass'][Math.floor(Math.random() * 5)]}`,
              thumbnail: `https://picsum.photos/id/${200 + Math.floor(Math.random() * 100)}/320/180`,
              views: Math.floor(Math.random() * 1000),
              tags: [
                ['CS2', 'Headshot', 'Clutch'][Math.floor(Math.random() * 3)],
                ['FiveM', 'RP', 'PVP'][Math.floor(Math.random() * 3)]
              ]
            }
          };
        
        case 'clip_like':
          return {
            ...activity,
            content: {
              clipId: `clip-${Math.floor(Math.random() * 1000)}`,
              title: `Jogada incrível em ${['Dust 2', 'Mirage', 'Inferno', 'Nuke', 'Overpass'][Math.floor(Math.random() * 5)]}`,
              thumbnail: `https://picsum.photos/id/${300 + Math.floor(Math.random() * 100)}/320/180`,
              originalUser: {
                id: `user-${Math.floor(Math.random() * 10) + 11}`,
                name: `Jogador${Math.floor(Math.random() * 100) + 101}`
              }
            }
          };
        
        case 'achievement':
          return {
            ...activity,
            content: {
              achievementId: `achievement-${Math.floor(Math.random() * 100)}`,
              name: [
                'Primeiro Clipe', 
                'Mestre dos Headshots', 
                'Rei do Clutch', 
                'Colecionador de PRYSMS',
                'Vencedor do Torneio'
              ][Math.floor(Math.random() * 5)],
              icon: ['trophy', 'medal', 'star', 'crown', 'badge'][Math.floor(Math.random() * 5)],
              rarity: ['comum', 'incomum', 'raro', 'épico', 'lendário'][Math.floor(Math.random() * 5)]
            }
          };
        
        case 'loadout_create':
          return {
            ...activity,
            content: {
              loadoutId: `loadout-${Math.floor(Math.random() * 1000)}`,
              name: `${['AK-47', 'M4A4', 'AWP', 'Desert Eagle', 'USP-S'][Math.floor(Math.random() * 5)]} ${['Neon', 'Fogo', 'Gelo', 'Dragão', 'Sombra'][Math.floor(Math.random() * 5)]}`,
              thumbnail: `https://picsum.photos/id/${400 + Math.floor(Math.random() * 100)}/320/180`,
              votes: Math.floor(Math.random() * 100)
            }
          };
        
        case 'loadout_vote':
          return {
            ...activity,
            content: {
              loadoutId: `loadout-${Math.floor(Math.random() * 1000)}`,
              name: `${['AK-47', 'M4A4', 'AWP', 'Desert Eagle', 'USP-S'][Math.floor(Math.random() * 5)]} ${['Neon', 'Fogo', 'Gelo', 'Dragão', 'Sombra'][Math.floor(Math.random() * 5)]}`,
              thumbnail: `https://picsum.photos/id/${500 + Math.floor(Math.random() * 100)}/320/180`,
              originalUser: {
                id: `user-${Math.floor(Math.random() * 10) + 21}`,
                name: `Jogador${Math.floor(Math.random() * 100) + 201}`
              }
            }
          };
        
        case 'friend_add':
          return {
            ...activity,
            content: {
              friendId: `user-${Math.floor(Math.random() * 10) + 31}`,
              friendName: `Jogador${Math.floor(Math.random() * 100) + 301}`,
              friendAvatar: `https://picsum.photos/id/${600 + Math.floor(Math.random() * 100)}/64/64`
            }
          };
        
        case 'profile_update':
          return {
            ...activity,
            content: {
              updateType: ['avatar', 'banner', 'info'][Math.floor(Math.random() * 3)],
              newAvatar: activity.content?.updateType === 'avatar' ? `https://picsum.photos/id/${700 + Math.floor(Math.random() * 100)}/128/128` : undefined,
              newBanner: activity.content?.updateType === 'banner' ? `https://picsum.photos/id/${800 + Math.floor(Math.random() * 100)}/1200/300` : undefined
            }
          };
        
        case 'event_join':
          return {
            ...activity,
            content: {
              eventId: `event-${Math.floor(Math.random() * 100)}`,
              eventName: [
                'Torneio de CS2', 
                'Campeonato FiveM', 
                'Desafio Semanal', 
                'Evento de Verão',
                'Competição de Clipes'
              ][Math.floor(Math.random() * 5)],
              eventImage: `https://picsum.photos/id/${900 + Math.floor(Math.random() * 100)}/320/180`,
              participants: Math.floor(Math.random() * 100) + 50
            }
          };
        
        default:
          return activity;
      }
    });
  };

  // Manipuladores de eventos
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(0);
    setHasMore(true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const handleLikeActivity = (activityId: string) => {
    setActivities(prev => 
      prev.map(activity => {
        if (activity.id === activityId) {
          const userHasLiked = !activity.userHasLiked;
          return {
            ...activity,
            likes: userHasLiked ? activity.likes + 1 : activity.likes - 1,
            userHasLiked
          };
        }
        return activity;
      })
    );
  };

  // Renderizar atividade com base no tipo
  const renderActivity = (activity: any) => {
    const { type, user, timestamp, likes, comments, userHasLiked, content } = activity;
    
    // Formatar data relativa
    const formatRelativeTime = (date: Date) => {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      
      if (diffDay > 0) {
        return `${diffDay}d atrás`;
      } else if (diffHour > 0) {
        return `${diffHour}h atrás`;
      } else if (diffMin > 0) {
        return `${diffMin}m atrás`;
      } else {
        return 'agora';
      }
    };
    
    // Componente base para todas as atividades
    const ActivityBase = (
      <div className="activity-header">
        <img src={user.avatar} alt={user.name} className="user-avatar" />
        <div className="activity-info">
          <span className="user-name">{user.name}</span>
          <span className="activity-time">{formatRelativeTime(new Date(timestamp))}</span>
        </div>
      </div>
    );
    
    // Componente de ações para todas as atividades
    const ActivityActions = (
      <div className="activity-actions">
        <button 
          className={`like-button ${userHasLiked ? 'liked' : ''}`}
          onClick={() => handleLikeActivity(activity.id)}
        >
          <i className={`icon-${userHasLiked ? 'heart-filled' : 'heart'}`}></i>
          <span>{likes}</span>
        </button>
        <button className="comment-button">
          <i className="icon-comment"></i>
          <span>{comments}</span>
        </button>
        <button className="share-button">
          <i className="icon-share"></i>
        </button>
      </div>
    );
    
    // Renderizar conteúdo específico por tipo
    switch (type) {
      case 'clip_upload':
        return (
          <div className="activity-item clip-upload">
            {ActivityBase}
            <div className="activity-content">
              <p className="activity-text">
                <strong>{user.name}</strong> enviou um novo clipe: <strong>{content.title}</strong>
              </p>
              <div className="clip-preview">
                <img src={content.thumbnail} alt={content.title} className="clip-thumbnail" />
                <div className="clip-overlay">
                  <i className="icon-play"></i>
                  <span className="clip-views">{content.views} visualizações</span>
                </div>
              </div>
              <div className="clip-tags">
                {content.tags.map((tag: string, index: number) => (
                  <span key={index} className="clip-tag">{tag}</span>
                ))}
              </div>
            </div>
            {ActivityActions}
          </div>
        );
      
      case 'clip_like':
        return (
          <div className="activity-item clip-like">
            {ActivityBase}
            <div className="activity-content">
              <p className="activity-text">
                <strong>{user.name}</strong> curtiu o clipe <strong>{content.title}</strong> de <strong>{content.originalUser.name}</strong>
              </p>
              <div className="clip-preview">
                <img src={content.thumbnail} alt={content.title} className="clip-thumbnail" />
                <div className="clip-overlay">
                  <i className="icon-play"></i>
                </div>
              </div>
            </div>
            {ActivityActions}
          </div>
        );
      
      case 'achievement':
        return (
          <div className="activity-item achievement">
            {ActivityBase}
            <div className="activity-content">
              <p className="activity-text">
                <strong>{user.name}</strong> desbloqueou a conquista <strong>{content.name}</strong>
              </p>
              <div className={`achievement-badge ${content.rarity}`}>
                <i className={`icon-${content.icon}`}></i>
                <div className="achievement-info">
                  <span className="achievement-name">{content.name}</span>
                  <span className="achievement-rarity">{content.rarity}</span>
                </div>
              </div>
            </div>
            {ActivityActions}
          </div>
        );
      
      case 'loadout_create':
        return (
          <div className="activity-item loadout-create">
            {ActivityBase}
            <div className="activity-content">
              <p className="activity-text">
                <strong>{user.name}</strong> criou um novo loadout: <strong>{content.name}</strong>
              </p>
              <div className="loadout-preview">
                <img src={content.thumbnail} alt={content.name} className="loadout-thumbnail" />
                <div className="loadout-overlay">
                  <span className="loadout-votes">{content.votes} votos</span>
                </div>
              </div>
            </div>
            {ActivityActions}
          </div>
        );
      
      case 'loadout_vote':
        return (
          <div className="activity-item loadout-vote">
            {ActivityBase}
            <div className="activity-content">
              <p className="activity-text">
                <strong>{user.name}</strong> votou no loadout <strong>{content.name}</strong> de <strong>{content.originalUser.name}</strong>
              </p>
              <div className="loadout-preview">
                <img src={content.thumbnail} alt={content.name} className="loadout-thumbnail" />
              </div>
            </div>
            {ActivityActions}
          </div>
        );
      
      case 'friend_add':
        return (
          <div className="activity-item friend-add">
            {ActivityBase}
            <div className="activity-content">
              <p className="activity-text">
                <strong>{user.name}</strong> e <strong>{content.friendName}</strong> agora são amigos
              </p>
              <div className="friend-preview">
                <div className="friend-avatars">
                  <img src={user.avatar} alt={user.name} className="friend-avatar" />
                  <img src={content.friendAvatar} alt={content.friendName} className="friend-avatar" />
                </div>
              </div>
            </div>
            {ActivityActions}
          </div>
        );
      
      case 'profile_update':
        return (
          <div className="activity-item profile-update">
            {ActivityBase}
            <div className="activity-content">
              <p className="activity-text">
                <strong>{user.name}</strong> atualizou seu {
                  content.updateType === 'avatar' ? 'avatar' : 
                  content.updateType === 'banner' ? 'banner' : 
                  'perfil'
                }
              </p>
              {content.updateType === 'avatar' && content.newAvatar && (
                <div className="profile-update-preview">
                  <img src={content.newAvatar} alt="Novo avatar" className="new-avatar" />
                </div>
              )}
              {content.updateType === 'banner' && content.newBanner && (
                <div className="profile-update-preview">
                  <img src={content.newBanner} alt="Novo banner" className="new-banner" />
                </div>
              )}
            </div>
            {ActivityActions}
          </div>
        );
      
      case 'event_join':
        return (
          <div className="activity-item event-join">
            {ActivityBase}
            <div className="activity-content">
              <p className="activity-text">
                <strong>{user.name}</strong> está participando do evento <strong>{content.eventName}</strong>
              </p>
              <div className="event-preview">
                <img src={content.eventImage} alt={content.eventName} className="event-thumbnail" />
                <div className="event-overlay">
                  <span className="event-participants">{content.participants} participantes</span>
                </div>
              </div>
            </div>
            {ActivityActions}
          </div>
        );
      
      default:
        return (
          <div className="activity-item">
            {ActivityBase}
            <div className="activity-content">
              <p className="activity-text">
                <strong>{user.name}</strong> realizou uma atividade
              </p>
            </div>
            {ActivityActions}
          </div>
        );
    }
  };

  return (
    <div className="activity-feed">
      <div className="feed-header">
        <h2>{friendsOnly ? 'Feed de Amigos' : 'Feed de Atividades'}</h2>
        <div className="feed-filters">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            Todos
          </button>
          <button 
            className={`filter-button ${filter === 'clip' ? 'active' : ''}`}
            onClick={() => handleFilterChange('clip')}
          >
            Clipes
          </button>
          <button 
            className={`filter-button ${filter === 'loadout' ? 'active' : ''}`}
            onClick={() => handleFilterChange('loadout')}
          >
            Arsenal
          </button>
          <button 
            className={`filter-button ${filter === 'achievement' ? 'active' : ''}`}
            onClick={() => handleFilterChange('achievement')}
          >
            Conquistas
          </button>
          <button 
            className={`filter-button ${filter === 'event' ? 'active' : ''}`}
            onClick={() => handleFilterChange('event')}
          >
            Eventos
          </button>
        </div>
      </div>
      
      <div className="feed-content">
        {activities.length > 0 ? (
          <>
            {activities.map(activity => (
              <div key={activity.id} className="activity-container">
                {renderActivity(activity)}
              </div>
            ))}
            
            {hasMore && (
              <div className="load-more-container">
                <button 
                  className="load-more-button"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? 'Carregando...' : 'Carregar Mais'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-feed">
            {loading ? (
              <p>Carregando atividades...</p>
            ) : (
              <>
                <i className="icon-activity-empty"></i>
                <p>Nenhuma atividade encontrada.</p>
                {friendsOnly && (
                  <p>Adicione amigos para ver suas atividades aqui!</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;

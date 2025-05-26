import React, { useState, useEffect } from 'react';
import './EventSystem.css';

interface EventSystemProps {
  userId: string;
}

const EventSystem: React.FC<EventSystemProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userMissions, setUserMissions] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  // Carregar eventos
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    const fetchEvents = async () => {
      try {
        // Simular carregamento de dados
        setTimeout(() => {
          // Dados simulados
          const mockEvents = [
            {
              id: 'event-1',
              title: 'Semana de Headshots',
              type: 'weekly',
              description: 'Mostre sua precisão com headshots em seus clipes favoritos!',
              image: 'https://picsum.photos/id/237/800/400',
              startDate: new Date(Date.now() - 259200000), // 3 dias atrás
              endDate: new Date(Date.now() + 345600000), // 4 dias no futuro
              participants: 1243,
              rewards: [
                { type: 'prysms', amount: 500, icon: 'prysms' },
                { type: 'badge', name: 'Mestre dos Headshots', icon: 'badge-headshot' },
                { type: 'item', name: 'Moldura Dourada', icon: 'frame-gold' }
              ],
              missions: [
                { 
                  id: 'mission-1-1', 
                  title: 'Envie um clipe com headshot', 
                  description: 'Envie um clipe onde você acerta um headshot em qualquer jogo',
                  reward: { type: 'prysms', amount: 100 },
                  progress: 0,
                  target: 1,
                  completed: false
                },
                { 
                  id: 'mission-1-2', 
                  title: 'Receba 10 curtidas em seu clipe de headshot', 
                  description: 'Seu clipe de headshot deve receber pelo menos 10 curtidas',
                  reward: { type: 'prysms', amount: 150 },
                  progress: 0,
                  target: 10,
                  completed: false
                },
                { 
                  id: 'mission-1-3', 
                  title: 'Vença uma partida no PRYSMS Arsenal', 
                  description: 'Vença uma partida no minigame PRYSMS Arsenal',
                  reward: { type: 'prysms', amount: 250 },
                  progress: 0,
                  target: 1,
                  completed: false
                }
              ]
            },
            {
              id: 'event-2',
              title: 'Desafio de Desarme',
              type: 'special',
              description: 'Teste suas habilidades no PRYSMS Defuser e ganhe recompensas exclusivas!',
              image: 'https://picsum.photos/id/1015/800/400',
              startDate: new Date(Date.now() - 86400000), // 1 dia atrás
              endDate: new Date(Date.now() + 518400000), // 6 dias no futuro
              participants: 876,
              rewards: [
                { type: 'prysms', amount: 750, icon: 'prysms' },
                { type: 'badge', name: 'Mestre do Desarme', icon: 'badge-defuser' },
                { type: 'item', name: 'Skin Exclusiva', icon: 'skin-special' }
              ],
              missions: [
                { 
                  id: 'mission-2-1', 
                  title: 'Complete 3 desarmes no modo fácil', 
                  description: 'Complete com sucesso 3 desarmes no modo fácil do PRYSMS Defuser',
                  reward: { type: 'prysms', amount: 150 },
                  progress: 1,
                  target: 3,
                  completed: false
                },
                { 
                  id: 'mission-2-2', 
                  title: 'Complete 1 desarme no modo difícil', 
                  description: 'Complete com sucesso 1 desarme no modo difícil do PRYSMS Defuser',
                  reward: { type: 'prysms', amount: 250 },
                  progress: 0,
                  target: 1,
                  completed: false
                },
                { 
                  id: 'mission-2-3', 
                  title: 'Jogue 1 partida no modo cooperativo', 
                  description: 'Jogue uma partida no modo cooperativo do PRYSMS Defuser',
                  reward: { type: 'prysms', amount: 350 },
                  progress: 0,
                  target: 1,
                  completed: false
                }
              ]
            },
            {
              id: 'event-3',
              title: 'Desafio Diário',
              type: 'daily',
              description: 'Complete missões diárias para ganhar PRYSMS extras!',
              image: 'https://picsum.photos/id/1019/800/400',
              startDate: new Date(Date.now()), // Hoje
              endDate: new Date(Date.now() + 86400000), // 1 dia no futuro
              participants: 3421,
              rewards: [
                { type: 'prysms', amount: 200, icon: 'prysms' }
              ],
              missions: [
                { 
                  id: 'mission-3-1', 
                  title: 'Envie um clipe', 
                  description: 'Envie qualquer clipe para a plataforma',
                  reward: { type: 'prysms', amount: 50 },
                  progress: 0,
                  target: 1,
                  completed: false
                },
                { 
                  id: 'mission-3-2', 
                  title: 'Curta 5 clipes', 
                  description: 'Curta 5 clipes de outros usuários',
                  reward: { type: 'prysms', amount: 50 },
                  progress: 3,
                  target: 5,
                  completed: false
                },
                { 
                  id: 'mission-3-3', 
                  title: 'Jogue qualquer minigame', 
                  description: 'Jogue uma partida em qualquer minigame',
                  reward: { type: 'prysms', amount: 100 },
                  progress: 0,
                  target: 1,
                  completed: false
                }
              ]
            },
            {
              id: 'event-4',
              title: 'Torneio de Clãs',
              type: 'clan',
              description: 'Participe com seu clã neste torneio especial e ganhe recompensas exclusivas!',
              image: 'https://picsum.photos/id/1035/800/400',
              startDate: new Date(Date.now() + 172800000), // 2 dias no futuro
              endDate: new Date(Date.now() + 777600000), // 9 dias no futuro
              participants: 42,
              clansOnly: true,
              rewards: [
                { type: 'prysms', amount: 2000, icon: 'prysms' },
                { type: 'badge', name: 'Campeão de Clã', icon: 'badge-clan' },
                { type: 'item', name: 'Banner Exclusivo', icon: 'banner-special' }
              ],
              missions: [
                { 
                  id: 'mission-4-1', 
                  title: 'Envie 10 clipes como clã', 
                  description: 'Membros do clã devem enviar um total de 10 clipes',
                  reward: { type: 'prysms', amount: 500 },
                  progress: 0,
                  target: 10,
                  completed: false
                },
                { 
                  id: 'mission-4-2', 
                  title: 'Acumule 100 curtidas nos clipes do clã', 
                  description: 'Os clipes do clã devem receber um total de 100 curtidas',
                  reward: { type: 'prysms', amount: 750 },
                  progress: 0,
                  target: 100,
                  completed: false
                },
                { 
                  id: 'mission-4-3', 
                  title: 'Vença 5 partidas em minigames', 
                  description: 'Membros do clã devem vencer um total de 5 partidas em qualquer minigame',
                  reward: { type: 'prysms', amount: 750 },
                  progress: 0,
                  target: 5,
                  completed: false
                }
              ]
            },
            {
              id: 'event-5',
              title: 'Festival de Desenho',
              type: 'special',
              description: 'Mostre seu talento artístico no PRYSMS Draw e ganhe recompensas criativas!',
              image: 'https://picsum.photos/id/1036/800/400',
              startDate: new Date(Date.now() - 172800000), // 2 dias atrás
              endDate: new Date(Date.now() + 432000000), // 5 dias no futuro
              participants: 654,
              rewards: [
                { type: 'prysms', amount: 600, icon: 'prysms' },
                { type: 'badge', name: 'Artista PRYSMS', icon: 'badge-artist' },
                { type: 'item', name: 'Pacote de Cores Premium', icon: 'colors-premium' }
              ],
              missions: [
                { 
                  id: 'mission-5-1', 
                  title: 'Jogue 5 rodadas de PRYSMS Draw', 
                  description: 'Participe de 5 rodadas completas do minigame PRYSMS Draw',
                  reward: { type: 'prysms', amount: 150 },
                  progress: 2,
                  target: 5,
                  completed: false
                },
                { 
                  id: 'mission-5-2', 
                  title: 'Acerte 10 desenhos', 
                  description: 'Adivinhe corretamente 10 desenhos no PRYSMS Draw',
                  reward: { type: 'prysms', amount: 200 },
                  progress: 4,
                  target: 10,
                  completed: false
                },
                { 
                  id: 'mission-5-3', 
                  title: 'Faça 3 desenhos que sejam adivinhados', 
                  description: 'Seus desenhos devem ser adivinhados corretamente 3 vezes',
                  reward: { type: 'prysms', amount: 250 },
                  progress: 1,
                  target: 3,
                  completed: false
                }
              ]
            }
          ];
          
          setEvents(mockEvents);
          
          // Simular missões do usuário
          const userMissionData = mockEvents.flatMap(event => 
            event.missions.map((mission: any) => ({
              ...mission,
              eventId: event.id,
              eventTitle: event.title,
              eventType: event.type,
              eventImage: event.image,
              progress: Math.floor(Math.random() * (mission.target + 1)),
              completed: Math.random() > 0.7
            }))
          );
          
          // Atualizar status de conclusão com base no progresso
          const updatedMissions = userMissionData.map(mission => ({
            ...mission,
            completed: mission.progress >= mission.target
          }));
          
          setUserMissions(updatedMissions);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  // Filtrar eventos com base na aba ativa
  const getFilteredEvents = () => {
    const now = new Date();
    
    switch (activeTab) {
      case 'active':
        return events.filter(event => 
          event.startDate <= now && event.endDate >= now
        );
      case 'upcoming':
        return events.filter(event => 
          event.startDate > now
        );
      case 'completed':
        return events.filter(event => 
          event.endDate < now
        );
      case 'clan':
        return events.filter(event => 
          event.type === 'clan'
        );
      default:
        return events;
    }
  };

  // Calcular progresso de um evento
  const calculateEventProgress = (eventId: string) => {
    const eventMissions = userMissions.filter(mission => mission.eventId === eventId);
    if (eventMissions.length === 0) return 0;
    
    const completedMissions = eventMissions.filter(mission => mission.completed).length;
    return Math.round((completedMissions / eventMissions.length) * 100);
  };

  // Formatar tempo restante
  const formatTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Encerrado';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h restantes`;
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m restantes`;
    }
  };

  // Abrir detalhes do evento
  const handleOpenEventDetails = (event: any) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Fechar detalhes do evento
  const handleCloseEventDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  // Participar de um evento
  const handleJoinEvent = (eventId: string) => {
    // Em um ambiente de produção, isso seria uma chamada à API
    console.log('Participando do evento:', eventId);
    
    // Atualizar UI
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, userJoined: true, participants: event.participants + 1 } 
          : event
      )
    );
  };

  // Completar uma missão
  const handleCompleteMission = (missionId: string) => {
    // Em um ambiente de produção, isso seria uma chamada à API
    console.log('Simulando conclusão da missão:', missionId);
    
    // Atualizar UI
    setUserMissions(prev => 
      prev.map(mission => 
        mission.id === missionId 
          ? { ...mission, progress: mission.target, completed: true } 
          : mission
      )
    );
  };

  // Renderizar card de evento
  const renderEventCard = (event: any) => {
    const progress = calculateEventProgress(event.id);
    const timeRemaining = formatTimeRemaining(new Date(event.endDate));
    const isActive = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date();
    const isUpcoming = new Date(event.startDate) > new Date();
    
    return (
      <div key={event.id} className="event-card">
        <div className="event-image">
          <img src={event.image} alt={event.title} />
          <div className="event-type-badge">{event.type}</div>
        </div>
        
        <div className="event-content">
          <h3 className="event-title">{event.title}</h3>
          <p className="event-description">{event.description}</p>
          
          <div className="event-meta">
            <div className="event-participants">
              <i className="icon-users"></i>
              <span>{event.participants} participantes</span>
            </div>
            <div className="event-time">
              <i className="icon-clock"></i>
              <span>{timeRemaining}</span>
            </div>
          </div>
          
          {isActive && (
            <div className="event-progress">
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-text">{progress}% concluído</div>
            </div>
          )}
          
          <div className="event-rewards">
            <span className="rewards-label">Recompensas:</span>
            <div className="rewards-list">
              {event.rewards.map((reward: any, index: number) => (
                <div key={index} className="reward-item">
                  <i className={`icon-${reward.icon}`}></i>
                  {reward.type === 'prysms' && <span>{reward.amount} PRYSMS</span>}
                  {reward.type !== 'prysms' && <span>{reward.name}</span>}
                </div>
              ))}
            </div>
          </div>
          
          <div className="event-actions">
            <button 
              className="details-button"
              onClick={() => handleOpenEventDetails(event)}
            >
              Ver Detalhes
            </button>
            
            {isActive && !event.userJoined && (
              <button 
                className="join-button"
                onClick={() => handleJoinEvent(event.id)}
              >
                Participar
              </button>
            )}
            
            {isActive && event.userJoined && (
              <button 
                className="view-missions-button"
                onClick={() => handleOpenEventDetails(event)}
              >
                Ver Missões
              </button>
            )}
            
            {isUpcoming && (
              <button className="reminder-button">
                <i className="icon-bell"></i>
                Lembrar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar modal de detalhes do evento
  const renderEventDetailsModal = () => {
    if (!selectedEvent) return null;
    
    const eventMissions = userMissions.filter(mission => mission.eventId === selectedEvent.id);
    const completedMissions = eventMissions.filter(mission => mission.completed).length;
    const progress = Math.round((completedMissions / eventMissions.length) * 100);
    
    return (
      <div className="modal-overlay">
        <div className="event-details-modal">
          <div className="modal-header">
            <h2>{selectedEvent.title}</h2>
            <button className="close-button" onClick={handleCloseEventDetails}>
              &times;
            </button>
          </div>
          
          <div className="modal-content">
            <div className="event-banner">
              <img src={selectedEvent.image} alt={selectedEvent.title} />
              <div className="event-type-badge large">{selectedEvent.type}</div>
            </div>
            
            <div className="event-info">
              <p className="event-description">{selectedEvent.description}</p>
              
              <div className="event-dates">
                <div className="date-item">
                  <span className="date-label">Início:</span>
                  <span className="date-value">{new Date(selectedEvent.startDate).toLocaleDateString()}</span>
                </div>
                <div className="date-item">
                  <span className="date-label">Término:</span>
                  <span className="date-value">{new Date(selectedEvent.endDate).toLocaleDateString()}</span>
                </div>
                <div className="date-item">
                  <span className="date-label">Tempo Restante:</span>
                  <span className="date-value">{formatTimeRemaining(new Date(selectedEvent.endDate))}</span>
                </div>
              </div>
              
              <div className="event-progress-details">
                <h3>Seu Progresso</h3>
                <div className="progress-bar large">
                  <div 
                    className="progress" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {completedMissions} de {eventMissions.length} missões concluídas ({progress}%)
                </div>
              </div>
              
              <div className="event-rewards-details">
                <h3>Recompensas</h3>
                <div className="rewards-grid">
                  {selectedEvent.rewards.map((reward: any, index: number) => (
                    <div key={index} className="reward-card">
                      <div className="reward-icon">
                        <i className={`icon-${reward.icon}`}></i>
                      </div>
                      <div className="reward-info">
                        {reward.type === 'prysms' && (
                          <>
                            <div className="reward-amount">{reward.amount}</div>
                            <div className="reward-type">PRYSMS</div>
                          </>
                        )}
                        {reward.type !== 'prysms' && (
                          <>
                            <div className="reward-name">{reward.name}</div>
                            <div className="reward-type">{reward.type === 'badge' ? 'Emblema' : 'Item'}</div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="event-missions">
                <h3>Missões</h3>
                <div className="missions-list">
                  {eventMissions.map((mission: any) => (
                    <div key={mission.id} className={`mission-item ${mission.completed ? 'completed' : ''}`}>
                      <div className="mission-header">
                        <h4 className="mission-title">{mission.title}</h4>
                        <div className="mission-reward">
                          <i className="icon-prysms"></i>
                          <span>{mission.reward.amount}</span>
                        </div>
                      </div>
                      
                      <p className="mission-description">{mission.description}</p>
                      
                      <div className="mission-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress" 
                            style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                          ></div>
                        </div>
                        <div className="progress-text">
                          {mission.progress}/{mission.target} {mission.completed && <i className="icon-check"></i>}
                        </div>
                      </div>
                      
                      {!mission.completed && (
                        <button 
                          className="complete-mission-button"
                          onClick={() => handleCompleteMission(mission.id)}
                        >
                          Simular Conclusão
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            {!selectedEvent.userJoined ? (
              <button 
                className="join-button large"
                onClick={() => handleJoinEvent(selectedEvent.id)}
              >
                Participar do Evento
              </button>
            ) : (
              <button className="share-button">
                <i className="icon-share"></i>
                Compartilhar Evento
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar componente principal
  return (
    <div className="event-system">
      <div className="event-system-header">
        <h1>Eventos</h1>
        <p>Participe de eventos, complete missões e ganhe recompensas exclusivas!</p>
      </div>
      
      <div className="event-tabs">
        <div 
          className={`tab-item ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <i className="icon-calendar-check"></i>
          <span>Ativos</span>
        </div>
        <div 
          className={`tab-item ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          <i className="icon-calendar-plus"></i>
          <span>Próximos</span>
        </div>
        <div 
          className={`tab-item ${activeTab === 'clan' ? 'active' : ''}`}
          onClick={() => setActiveTab('clan')}
        >
          <i className="icon-users"></i>
          <span>Clãs</span>
        </div>
        <div 
          className={`tab-item ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <i className="icon-calendar-x"></i>
          <span>Encerrados</span>
        </div>
      </div>
      
      <div className="event-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando eventos...</p>
          </div>
        ) : (
          <>
            <div className="events-list">
              {getFilteredEvents().length > 0 ? (
                getFilteredEvents().map(event => renderEventCard(event))
              ) : (
                <div className="no-events">
                  <i className="icon-calendar-empty"></i>
                  <p>Nenhum evento {
                    activeTab === 'active' ? 'ativo' : 
                    activeTab === 'upcoming' ? 'próximo' : 
                    activeTab === 'clan' ? 'de clã' : 
                    'encerrado'
                  } no momento.</p>
                </div>
              )}
            </div>
            
            <div className="user-missions">
              <h2>Suas Missões</h2>
              
              {userMissions.filter(mission => !mission.completed).length > 0 ? (
                <div className="missions-summary">
                  {userMissions
                    .filter(mission => !mission.completed)
                    .slice(0, 3)
                    .map(mission => (
                      <div key={mission.id} className="mission-summary-item">
                        <div className="mission-event-info">
                          <img 
                            src={mission.eventImage} 
                            alt={mission.eventTitle} 
                            className="mission-event-image" 
                          />
                          <span className="mission-event-title">{mission.eventTitle}</span>
                        </div>
                        
                        <div className="mission-summary-content">
                          <h4>{mission.title}</h4>
                          <div className="mission-progress">
                            <div className="progress-bar">
                              <div 
                                className="progress" 
                                style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                              ></div>
                            </div>
                            <div className="progress-text">
                              {mission.progress}/{mission.target}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mission-reward">
                          <i className="icon-prysms"></i>
                          <span>{mission.reward.amount}</span>
                        </div>
                      </div>
                    ))
                  }
                  
                  {userMissions.filter(mission => !mission.completed).length > 3 && (
                    <div className="more-missions">
                      +{userMissions.filter(mission => !mission.completed).length - 3} mais missões
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-missions">
                  <i className="icon-check-circle"></i>
                  <p>Você completou todas as suas missões!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {showEventDetails && renderEventDetailsModal()}
    </div>
  );
};

export default EventSystem;

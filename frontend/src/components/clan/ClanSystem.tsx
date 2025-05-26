import React, { useState, useEffect } from 'react';
import './ClanSystem.css';

interface ClanSystemProps {
  userId: string;
}

const ClanSystem: React.FC<ClanSystemProps> = ({ userId }) => {
  const [userClan, setUserClan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clanSearchQuery, setClanSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Carregar dados do clã do usuário
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    const fetchUserClan = async () => {
      try {
        // Simular carregamento de dados
        setTimeout(() => {
          // Dados simulados - usuário pode estar em um clã ou não
          const mockUserClan = Math.random() > 0.5 ? {
            id: 'clan-123',
            name: 'Elite Gamers',
            tag: 'ELITE',
            description: 'Somos um clã dedicado a jogadores competitivos que buscam melhorar suas habilidades e compartilhar momentos épicos.',
            emblem: 'https://picsum.photos/id/237/200/200',
            banner: 'https://picsum.photos/id/1018/1200/300',
            colors: {
              primary: '#4f46e5',
              secondary: '#818cf8'
            },
            createdAt: new Date(Date.now() - 7776000000), // 90 dias atrás
            memberCount: 28,
            maxMembers: 50,
            level: 5,
            experience: 2800,
            nextLevelExperience: 5000,
            userRole: ['leader', 'officer', 'member'][Math.floor(Math.random() * 3)],
            stats: {
              totalClips: 342,
              totalViews: 28500,
              totalLikes: 4320,
              eventsWon: 3,
              ranking: 24
            }
          } : null;
          
          setUserClan(mockUserClan);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar dados do clã:', error);
        setLoading(false);
      }
    };

    fetchUserClan();
  }, [userId]);

  // Buscar clãs
  const handleClanSearch = () => {
    if (!clanSearchQuery.trim()) return;
    
    setSearchLoading(true);
    
    // Simular busca de clãs
    setTimeout(() => {
      const mockResults = Array.from({ length: 5 }, (_, i) => ({
        id: `clan-${i + 1}`,
        name: `${clanSearchQuery} ${['Squad', 'Team', 'Gamers', 'Legends', 'Pros'][i]}`,
        tag: clanSearchQuery.substring(0, 3).toUpperCase() + i,
        emblem: `https://picsum.photos/id/${200 + i}/100/100`,
        memberCount: Math.floor(Math.random() * 45) + 5,
        maxMembers: 50,
        level: Math.floor(Math.random() * 10) + 1,
        isOpen: Math.random() > 0.5
      }));
      
      setSearchResults(mockResults);
      setSearchLoading(false);
    }, 800);
  };

  // Criar novo clã
  const handleCreateClan = (clanData: any) => {
    // Em um ambiente de produção, isso seria uma chamada à API
    console.log('Criando clã:', clanData);
    
    // Simular criação de clã
    setTimeout(() => {
      const newClan = {
        id: `clan-${Date.now()}`,
        name: clanData.name,
        tag: clanData.tag,
        description: clanData.description,
        emblem: clanData.emblem || 'https://picsum.photos/id/237/200/200',
        banner: 'https://picsum.photos/id/1018/1200/300',
        colors: {
          primary: clanData.primaryColor || '#4f46e5',
          secondary: clanData.secondaryColor || '#818cf8'
        },
        createdAt: new Date(),
        memberCount: 1,
        maxMembers: 30,
        level: 1,
        experience: 0,
        nextLevelExperience: 1000,
        userRole: 'leader',
        stats: {
          totalClips: 0,
          totalViews: 0,
          totalLikes: 0,
          eventsWon: 0,
          ranking: 0
        }
      };
      
      setUserClan(newClan);
      setShowCreateModal(false);
    }, 1500);
  };

  // Solicitar entrada em um clã
  const handleJoinRequest = (clanId: string) => {
    // Em um ambiente de produção, isso seria uma chamada à API
    console.log('Solicitando entrada no clã:', clanId);
    
    // Atualizar UI para mostrar solicitação pendente
    setSearchResults(prev => 
      prev.map(clan => 
        clan.id === clanId 
          ? { ...clan, requestPending: true } 
          : clan
      )
    );
  };

  // Sair do clã
  const handleLeaveClan = () => {
    if (!userClan) return;
    
    // Confirmar antes de sair
    if (!window.confirm('Tem certeza que deseja sair do clã? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    // Em um ambiente de produção, isso seria uma chamada à API
    console.log('Saindo do clã:', userClan.id);
    
    // Simular saída do clã
    setTimeout(() => {
      setUserClan(null);
    }, 1000);
  };

  // Renderizar conteúdo com base na aba ativa
  const renderTabContent = () => {
    if (!userClan) return null;
    
    switch (activeTab) {
      case 'overview':
        return (
          <div className="clan-overview">
            <div className="clan-stats">
              <div className="stat-card">
                <h3>Membros</h3>
                <div className="stat-value">{userClan.memberCount}/{userClan.maxMembers}</div>
              </div>
              <div className="stat-card">
                <h3>Nível</h3>
                <div className="stat-value">{userClan.level}</div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${(userClan.experience / userClan.nextLevelExperience) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {userClan.experience}/{userClan.nextLevelExperience} XP
                </div>
              </div>
              <div className="stat-card">
                <h3>Ranking</h3>
                <div className="stat-value">#{userClan.stats.ranking}</div>
              </div>
              <div className="stat-card">
                <h3>Eventos Vencidos</h3>
                <div className="stat-value">{userClan.stats.eventsWon}</div>
              </div>
            </div>
            
            <div className="clan-description">
              <h3>Sobre</h3>
              <p>{userClan.description}</p>
            </div>
            
            <div className="clan-activity">
              <h3>Atividade Recente</h3>
              <div className="activity-list">
                {/* Atividades simuladas */}
                <div className="activity-item">
                  <img src="https://picsum.photos/id/1001/32/32" alt="Avatar" className="activity-avatar" />
                  <div className="activity-content">
                    <p><strong>JogadorPro</strong> enviou um novo clipe</p>
                    <span className="activity-time">2h atrás</span>
                  </div>
                </div>
                <div className="activity-item">
                  <img src="https://picsum.photos/id/1002/32/32" alt="Avatar" className="activity-avatar" />
                  <div className="activity-content">
                    <p><strong>GameMaster</strong> conquistou um troféu</p>
                    <span className="activity-time">5h atrás</span>
                  </div>
                </div>
                <div className="activity-item">
                  <img src="https://picsum.photos/id/1003/32/32" alt="Avatar" className="activity-avatar" />
                  <div className="activity-content">
                    <p><strong>SnipeKing</strong> criou um novo loadout</p>
                    <span className="activity-time">8h atrás</span>
                  </div>
                </div>
                <div className="activity-item">
                  <img src="https://picsum.photos/id/1004/32/32" alt="Avatar" className="activity-avatar" />
                  <div className="activity-content">
                    <p>O clã participou de um evento</p>
                    <span className="activity-time">1d atrás</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'members':
        return (
          <div className="clan-members">
            <div className="members-header">
              <h3>Membros do Clã ({userClan.memberCount})</h3>
              {userClan.userRole === 'leader' && (
                <button className="invite-button">
                  <i className="icon-plus"></i>
                  Convidar Jogadores
                </button>
              )}
            </div>
            
            <div className="members-list">
              {/* Membros simulados */}
              <div className="member-item leader">
                <img src="https://picsum.photos/id/1005/48/48" alt="Avatar" className="member-avatar" />
                <div className="member-info">
                  <div className="member-name">GameMaster</div>
                  <div className="member-role">Líder</div>
                </div>
                <div className="member-stats">
                  <div className="member-stat">
                    <i className="icon-clip"></i>
                    <span>42</span>
                  </div>
                  <div className="member-stat">
                    <i className="icon-trophy"></i>
                    <span>8</span>
                  </div>
                </div>
                <div className="member-status online"></div>
              </div>
              
              <div className="member-item officer">
                <img src="https://picsum.photos/id/1006/48/48" alt="Avatar" className="member-avatar" />
                <div className="member-info">
                  <div className="member-name">SnipeKing</div>
                  <div className="member-role">Oficial</div>
                </div>
                <div className="member-stats">
                  <div className="member-stat">
                    <i className="icon-clip"></i>
                    <span>36</span>
                  </div>
                  <div className="member-stat">
                    <i className="icon-trophy"></i>
                    <span>5</span>
                  </div>
                </div>
                <div className="member-status online"></div>
              </div>
              
              <div className="member-item officer">
                <img src="https://picsum.photos/id/1008/48/48" alt="Avatar" className="member-avatar" />
                <div className="member-info">
                  <div className="member-name">HeadshotPro</div>
                  <div className="member-role">Oficial</div>
                </div>
                <div className="member-stats">
                  <div className="member-stat">
                    <i className="icon-clip"></i>
                    <span>29</span>
                  </div>
                  <div className="member-stat">
                    <i className="icon-trophy"></i>
                    <span>4</span>
                  </div>
                </div>
                <div className="member-status offline"></div>
              </div>
              
              {/* Gerar mais membros simulados */}
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="member-item">
                  <img src={`https://picsum.photos/id/${1010 + i}/48/48`} alt="Avatar" className="member-avatar" />
                  <div className="member-info">
                    <div className="member-name">{`Jogador${i + 1}`}</div>
                    <div className="member-role">Membro</div>
                  </div>
                  <div className="member-stats">
                    <div className="member-stat">
                      <i className="icon-clip"></i>
                      <span>{Math.floor(Math.random() * 30) + 5}</span>
                    </div>
                    <div className="member-stat">
                      <i className="icon-trophy"></i>
                      <span>{Math.floor(Math.random() * 5)}</span>
                    </div>
                  </div>
                  <div className={`member-status ${Math.random() > 0.5 ? 'online' : 'offline'}`}></div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'content':
        return (
          <div className="clan-content">
            <div className="content-header">
              <h3>Conteúdo do Clã</h3>
              <div className="content-filters">
                <button className="filter-button active">Todos</button>
                <button className="filter-button">Clipes</button>
                <button className="filter-button">Loadouts</button>
                <button className="filter-button">Conquistas</button>
              </div>
            </div>
            
            <div className="content-grid">
              {/* Clipes simulados */}
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="content-card clip">
                  <div className="content-thumbnail">
                    <img src={`https://picsum.photos/id/${500 + i}/320/180`} alt="Thumbnail" />
                    <div className="content-overlay">
                      <i className="icon-play"></i>
                    </div>
                  </div>
                  <div className="content-info">
                    <div className="content-title">Jogada épica em Dust 2</div>
                    <div className="content-meta">
                      <span className="content-author">por JogadorPro</span>
                      <span className="content-stats">
                        <i className="icon-eye"></i> {Math.floor(Math.random() * 1000) + 100}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loadouts simulados */}
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="content-card loadout">
                  <div className="content-thumbnail">
                    <img src={`https://picsum.photos/id/${600 + i}/320/180`} alt="Thumbnail" />
                    <div className="content-overlay">
                      <i className="icon-loadout"></i>
                    </div>
                  </div>
                  <div className="content-info">
                    <div className="content-title">AK-47 | Fogo Neon</div>
                    <div className="content-meta">
                      <span className="content-author">por SnipeKing</span>
                      <span className="content-stats">
                        <i className="icon-vote"></i> {Math.floor(Math.random() * 100) + 10}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="clan-settings">
            {userClan.userRole === 'leader' ? (
              <>
                <h3>Configurações do Clã</h3>
                
                <div className="settings-section">
                  <h4>Informações Básicas</h4>
                  <div className="form-group">
                    <label>Nome do Clã</label>
                    <input type="text" defaultValue={userClan.name} />
                  </div>
                  <div className="form-group">
                    <label>Tag do Clã</label>
                    <input type="text" defaultValue={userClan.tag} maxLength={5} />
                  </div>
                  <div className="form-group">
                    <label>Descrição</label>
                    <textarea defaultValue={userClan.description} rows={4}></textarea>
                  </div>
                </div>
                
                <div className="settings-section">
                  <h4>Personalização</h4>
                  <div className="form-group">
                    <label>Emblema</label>
                    <div className="emblem-upload">
                      <img src={userClan.emblem} alt="Emblema" className="current-emblem" />
                      <button className="upload-button">Alterar Emblema</button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Banner</label>
                    <div className="banner-upload">
                      <img src={userClan.banner} alt="Banner" className="current-banner" />
                      <button className="upload-button">Alterar Banner</button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cores do Clã</label>
                    <div className="color-pickers">
                      <div className="color-picker">
                        <span>Cor Primária</span>
                        <input type="color" defaultValue={userClan.colors.primary} />
                      </div>
                      <div className="color-picker">
                        <span>Cor Secundária</span>
                        <input type="color" defaultValue={userClan.colors.secondary} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="settings-section">
                  <h4>Privacidade e Acesso</h4>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      <span>Clã aberto para solicitações</span>
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      <span>Perfil público do clã</span>
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      <span>Mostrar clã no ranking global</span>
                    </label>
                  </div>
                </div>
                
                <div className="settings-actions">
                  <button className="save-button">Salvar Alterações</button>
                </div>
                
                <div className="settings-section danger-zone">
                  <h4>Zona de Perigo</h4>
                  <p>Estas ações são irreversíveis e afetam todos os membros do clã.</p>
                  <button className="danger-button">Dissolver Clã</button>
                </div>
              </>
            ) : (
              <div className="member-options">
                <h3>Opções de Membro</h3>
                <p>Você é um {userClan.userRole === 'officer' ? 'oficial' : 'membro'} deste clã.</p>
                <button className="leave-button" onClick={handleLeaveClan}>
                  Sair do Clã
                </button>
              </div>
            )}
          </div>
        );
      
      default:
        return <div>Selecione uma aba para visualizar.</div>;
    }
  };

  // Renderizar componente de criação de clã
  const renderCreateClanModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      tag: '',
      description: '',
      primaryColor: '#4f46e5',
      secondaryColor: '#818cf8',
      emblem: ''
    });
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<any>({});
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const validateStep = () => {
      const newErrors: any = {};
      
      if (step === 1) {
        if (!formData.name.trim()) {
          newErrors.name = 'Nome do clã é obrigatório';
        } else if (formData.name.length < 3) {
          newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
        }
        
        if (!formData.tag.trim()) {
          newErrors.tag = 'Tag do clã é obrigatória';
        } else if (formData.tag.length < 2 || formData.tag.length > 5) {
          newErrors.tag = 'Tag deve ter entre 2 e 5 caracteres';
        }
        
        if (!formData.description.trim()) {
          newErrors.description = 'Descrição é obrigatória';
        }
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleNextStep = () => {
      if (validateStep()) {
        setStep(prev => prev + 1);
      }
    };
    
    const handlePrevStep = () => {
      setStep(prev => prev - 1);
    };
    
    const handleSubmit = () => {
      if (validateStep()) {
        handleCreateClan(formData);
      }
    };
    
    return (
      <div className="modal-overlay">
        <div className="create-clan-modal">
          <div className="modal-header">
            <h2>Criar Novo Clã</h2>
            <button className="close-button" onClick={() => setShowCreateModal(false)}>
              &times;
            </button>
          </div>
          
          <div className="modal-progress">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>
          
          <div className="modal-content">
            {step === 1 && (
              <div className="step-content">
                <h3>Informações Básicas</h3>
                
                <div className="form-group">
                  <label htmlFor="clan-name">Nome do Clã</label>
                  <input
                    type="text"
                    id="clan-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Elite Gamers"
                    maxLength={30}
                  />
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="clan-tag">Tag do Clã</label>
                  <input
                    type="text"
                    id="clan-tag"
                    name="tag"
                    value={formData.tag}
                    onChange={handleInputChange}
                    placeholder="Ex: ELITE"
                    maxLength={5}
                  />
                  {errors.tag && <div className="error-message">{errors.tag}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="clan-description">Descrição</label>
                  <textarea
                    id="clan-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descreva seu clã em algumas palavras..."
                    rows={4}
                    maxLength={200}
                  ></textarea>
                  {errors.description && <div className="error-message">{errors.description}</div>}
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="step-content">
                <h3>Personalização</h3>
                
                <div className="form-group">
                  <label>Emblema do Clã</label>
                  <div className="emblem-upload">
                    {formData.emblem ? (
                      <img src={formData.emblem} alt="Emblema" className="preview-emblem" />
                    ) : (
                      <div className="emblem-placeholder">
                        <i className="icon-image"></i>
                        <span>Nenhum emblema selecionado</span>
                      </div>
                    )}
                    <button className="upload-button">Escolher Imagem</button>
                  </div>
                  <p className="form-hint">Recomendado: imagem quadrada, pelo menos 200x200px</p>
                </div>
                
                <div className="form-group">
                  <label>Cores do Clã</label>
                  <div className="color-pickers">
                    <div className="color-picker">
                      <span>Cor Primária</span>
                      <input
                        type="color"
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="color-picker">
                      <span>Cor Secundária</span>
                      <input
                        type="color"
                        name="secondaryColor"
                        value={formData.secondaryColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="color-preview">
                  <div className="preview-header">Visualização</div>
                  <div 
                    className="preview-content"
                    style={{ 
                      background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})` 
                    }}
                  >
                    <div className="preview-tag">{formData.tag || 'TAG'}</div>
                  </div>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="step-content">
                <h3>Confirmar e Criar</h3>
                
                <div className="clan-preview">
                  <div className="preview-header">
                    <div className="preview-name">{formData.name || 'Nome do Clã'}</div>
                    <div className="preview-tag">{formData.tag || 'TAG'}</div>
                  </div>
                  
                  <div className="preview-emblem">
                    {formData.emblem ? (
                      <img src={formData.emblem} alt="Emblema" />
                    ) : (
                      <div className="default-emblem" style={{ backgroundColor: formData.primaryColor }}>
                        {formData.tag?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  
                  <div className="preview-description">
                    {formData.description || 'Descrição do clã...'}
                  </div>
                  
                  <div className="preview-colors">
                    <div className="color-sample" style={{ backgroundColor: formData.primaryColor }}></div>
                    <div className="color-sample" style={{ backgroundColor: formData.secondaryColor }}></div>
                  </div>
                </div>
                
                <div className="cost-info">
                  <h4>Custo de Criação</h4>
                  <div className="cost-amount">
                    <i className="icon-prysms"></i>
                    <span>1000 PRYSMS</span>
                  </div>
                  <p className="cost-note">
                    A criação de um clã requer um investimento inicial de PRYSMS.
                    Este valor é usado para estabelecer seu clã no sistema.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            {step > 1 && (
              <button className="back-button" onClick={handlePrevStep}>
                Voltar
              </button>
            )}
            
            {step < 3 ? (
              <button className="next-button" onClick={handleNextStep}>
                Próximo
              </button>
            ) : (
              <button className="create-button" onClick={handleSubmit}>
                Criar Clã
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar componente principal
  return (
    <div className="clan-system">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando informações do clã...</p>
        </div>
      ) : userClan ? (
        // Usuário tem um clã
        <div className="clan-container">
          <div className="clan-header" style={{ 
            backgroundImage: `url(${userClan.banner})`,
            backgroundColor: userClan.colors.primary
          }}>
            <div className="clan-header-overlay"></div>
            <div className="clan-header-content">
              <div className="clan-emblem">
                <img src={userClan.emblem} alt={userClan.name} />
              </div>
              <div className="clan-info">
                <h1 className="clan-name">{userClan.name}</h1>
                <div className="clan-tag">[{userClan.tag}]</div>
                <div className="clan-meta">
                  <span className="clan-members">
                    <i className="icon-users"></i> {userClan.memberCount} membros
                  </span>
                  <span className="clan-created">
                    <i className="icon-calendar"></i> Criado em {userClan.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="clan-role">
                {userClan.userRole === 'leader' && <span className="role leader">Líder</span>}
                {userClan.userRole === 'officer' && <span className="role officer">Oficial</span>}
                {userClan.userRole === 'member' && <span className="role member">Membro</span>}
              </div>
            </div>
          </div>
          
          <div className="clan-navigation">
            <div 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="icon-home"></i>
              <span>Visão Geral</span>
            </div>
            <div 
              className={`nav-item ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              <i className="icon-users"></i>
              <span>Membros</span>
            </div>
            <div 
              className={`nav-item ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <i className="icon-folder"></i>
              <span>Conteúdo</span>
            </div>
            <div 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="icon-settings"></i>
              <span>Configurações</span>
            </div>
          </div>
          
          <div className="clan-content-container">
            {renderTabContent()}
          </div>
        </div>
      ) : (
        // Usuário não tem um clã
        <div className="no-clan-container">
          <div className="no-clan-header">
            <h2>Você ainda não faz parte de um clã</h2>
            <p>Junte-se a um clã existente ou crie o seu próprio para desbloquear benefícios exclusivos!</p>
          </div>
          
          <div className="clan-options">
            <div className="option-card">
              <div className="option-icon">
                <i className="icon-search"></i>
              </div>
              <h3>Encontrar um Clã</h3>
              <p>Procure por clãs existentes e envie solicitações para se juntar.</p>
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Buscar clãs..." 
                  value={clanSearchQuery}
                  onChange={(e) => setClanSearchQuery(e.target.value)}
                />
                <button onClick={handleClanSearch}>Buscar</button>
              </div>
              
              {searchLoading ? (
                <div className="search-loading">
                  <div className="loading-spinner small"></div>
                  <span>Buscando clãs...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="search-results">
                  {searchResults.map(clan => (
                    <div key={clan.id} className="clan-result">
                      <img src={clan.emblem} alt={clan.name} className="result-emblem" />
                      <div className="result-info">
                        <div className="result-name">{clan.name}</div>
                        <div className="result-meta">
                          <span className="result-tag">[{clan.tag}]</span>
                          <span className="result-members">
                            <i className="icon-users"></i> {clan.memberCount}/{clan.maxMembers}
                          </span>
                          <span className="result-level">
                            <i className="icon-star"></i> Nível {clan.level}
                          </span>
                        </div>
                      </div>
                      <button 
                        className={`join-button ${clan.requestPending ? 'pending' : ''}`}
                        onClick={() => handleJoinRequest(clan.id)}
                        disabled={clan.requestPending}
                      >
                        {clan.requestPending ? 'Solicitação Enviada' : clan.isOpen ? 'Entrar' : 'Solicitar Entrada'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : clanSearchQuery ? (
                <div className="no-results">
                  Nenhum clã encontrado com "{clanSearchQuery}"
                </div>
              ) : null}
            </div>
            
            <div className="option-card">
              <div className="option-icon">
                <i className="icon-plus"></i>
              </div>
              <h3>Criar um Clã</h3>
              <p>Crie seu próprio clã, personalize-o e convide seus amigos.</p>
              <ul className="benefits-list">
                <li>
                  <i className="icon-check"></i>
                  <span>Emblema e cores personalizados</span>
                </li>
                <li>
                  <i className="icon-check"></i>
                  <span>Chat privado do clã</span>
                </li>
                <li>
                  <i className="icon-check"></i>
                  <span>Eventos exclusivos para clãs</span>
                </li>
                <li>
                  <i className="icon-check"></i>
                  <span>Bônus de PRYSMS em grupo</span>
                </li>
              </ul>
              <button className="create-clan-button" onClick={() => setShowCreateModal(true)}>
                Criar Clã
              </button>
              <div className="cost-note">
                <i className="icon-info"></i>
                <span>Custo: 1000 PRYSMS</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showCreateModal && renderCreateClanModal()}
    </div>
  );
};

export default ClanSystem;

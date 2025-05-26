import React, { useState, useEffect } from 'react';
import './AIModeration.css';

interface AIModerationProps {
  userId?: string;
}

const AIModeration: React.FC<AIModerationProps> = ({ userId }) => {
  const [settings, setSettings] = useState({
    textModeration: {
      enabled: true,
      sensitivity: 75,
      autoRemove: false,
      notifyModerators: true
    },
    imageModeration: {
      enabled: true,
      sensitivity: 80,
      autoRemove: true,
      notifyModerators: true
    },
    clipModeration: {
      enabled: true,
      sensitivity: 70,
      autoRemove: false,
      notifyModerators: true
    }
  });
  
  const [stats, setStats] = useState({
    totalScanned: 0,
    flaggedContent: 0,
    autoRemoved: 0,
    falsePositives: 0,
    accuracy: 0
  });
  
  const [recentDetections, setRecentDetections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('settings');

  // Carregar configurações e estatísticas
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    const fetchData = async () => {
      try {
        // Simular carregamento de dados
        setTimeout(() => {
          // Estatísticas simuladas
          setStats({
            totalScanned: 12487,
            flaggedContent: 342,
            autoRemoved: 187,
            falsePositives: 23,
            accuracy: 93.2
          });
          
          // Detecções recentes simuladas
          const mockDetections = [
            {
              id: 'det-1',
              type: 'text',
              content: 'Comentário com linguagem ofensiva',
              confidence: 92.5,
              timestamp: new Date(Date.now() - 3600000 * 2), // 2 horas atrás
              status: 'removed',
              user: 'user123'
            },
            {
              id: 'det-2',
              type: 'image',
              content: 'Imagem com conteúdo impróprio',
              confidence: 87.3,
              timestamp: new Date(Date.now() - 3600000 * 5), // 5 horas atrás
              status: 'removed',
              user: 'user456'
            },
            {
              id: 'det-3',
              type: 'clip',
              content: 'Clipe com violência excessiva',
              confidence: 76.8,
              timestamp: new Date(Date.now() - 3600000 * 12), // 12 horas atrás
              status: 'flagged',
              user: 'user789'
            },
            {
              id: 'det-4',
              type: 'text',
              content: 'Comentário com spam',
              confidence: 95.1,
              timestamp: new Date(Date.now() - 3600000 * 24), // 24 horas atrás
              status: 'removed',
              user: 'user234'
            },
            {
              id: 'det-5',
              type: 'image',
              content: 'Sticker com conteúdo impróprio',
              confidence: 82.7,
              timestamp: new Date(Date.now() - 3600000 * 36), // 36 horas atrás
              status: 'false_positive',
              user: 'user567'
            }
          ];
          
          setRecentDetections(mockDetections);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar dados de moderação:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Salvar configurações
  const handleSaveSettings = () => {
    // Em um ambiente de produção, isso seria uma chamada à API
    console.log('Salvando configurações:', settings);
    
    // Simular salvamento bem-sucedido
    alert('Configurações salvas com sucesso!');
  };

  // Atualizar configuração
  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  // Treinar modelo de IA
  const handleTrainModel = () => {
    // Em um ambiente de produção, isso seria uma chamada à API
    console.log('Iniciando treinamento do modelo');
    
    // Simular início de treinamento
    alert('Treinamento do modelo iniciado. Este processo pode levar algumas horas.');
  };

  // Formatar data
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return `${Math.floor(diffHours)}h atrás`;
    } else {
      return `${Math.floor(diffHours / 24)}d atrás`;
    }
  };

  // Renderizar aba de configurações
  const renderSettingsTab = () => {
    return (
      <div className="ai-settings-tab">
        <div className="settings-section">
          <h3>Moderação de Texto</h3>
          <p className="section-description">
            Configurações para comentários, nomes de usuário, descrições e outros conteúdos textuais.
          </p>
          
          <div className="setting-item">
            <div className="setting-label">
              <span>Ativar moderação de texto</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.textModeration.enabled}
                  onChange={(e) => handleSettingChange('textModeration', 'enabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">
              <span>Sensibilidade</span>
              <span className="setting-value">{settings.textModeration.sensitivity}%</span>
            </div>
            <div className="setting-control">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={settings.textModeration.sensitivity}
                onChange={(e) => handleSettingChange('textModeration', 'sensitivity', parseInt(e.target.value))}
                disabled={!settings.textModeration.enabled}
              />
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">
              <span>Remover automaticamente</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.textModeration.autoRemove}
                  onChange={(e) => handleSettingChange('textModeration', 'autoRemove', e.target.checked)}
                  disabled={!settings.textModeration.enabled}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">
              <span>Notificar moderadores</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.textModeration.notifyModerators}
                  onChange={(e) => handleSettingChange('textModeration', 'notifyModerators', e.target.checked)}
                  disabled={!settings.textModeration.enabled}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Moderação de Imagens</h3>
          <p className="section-description">
            Configurações para avatares, banners, stickers e outras imagens enviadas pelos usuários.
          </p>
          
          <div className="setting-item">
            <div className="setting-label">
              <span>Ativar moderação de imagens</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.imageModeration.enabled}
                  onChange={(e) => handleSettingChange('imageModeration', 'enabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">
              <span>Sensibilidade</span>
              <span className="setting-value">{settings.imageModeration.sensitivity}%</span>
            </div>
            <div className="setting-control">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={settings.imageModeration.sensitivity}
                onChange={(e) => handleSettingChange('imageModeration', 'sensitivity', parseInt(e.target.value))}
                disabled={!settings.imageModeration.enabled}
              />
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">
              <span>Remover automaticamente</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.imageModeration.autoRemove}
                  onChange={(e) => handleSettingChange('imageModeration', 'autoRemove', e.target.checked)}
                  disabled={!settings.imageModeration.enabled}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">
              <span>Notificar moderadores</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.imageModeration.notifyModerators}
                  onChange={(e) => handleSettingChange('imageModeration', 'notifyModerators', e.target.checked)}
                  disabled={!settings.imageModeration.enabled}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Moderação de Clipes</h3>
          <p className="section-description">
            Configurações para clipes de jogos enviados pelos usuários.
          </p>
          
          <div className="setting-item">
            <div className="setting-label">
              <span>Ativar moderação de clipes</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.clipModeration.enabled}
                  onChange={(e) => handleSettingChange('clipModeration', 'enabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">
              <span>Sensibilidade</span>
              <span className="setting-value">{settings.clipModeration.sensitivity}%</span>
            </div>
            <div className="setting-control">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={settings.clipModeration.sensitivity}
                onChange={(e) => handleSettingChange('clipModeration', 'sensitivity', parseInt(e.target.value))}
                disabled={!settings.clipModeration.enabled}
              />
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">
              <span>Remover automaticamente</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.clipModeration.autoRemove}
                  onChange={(e) => handleSettingChange('clipModeration', 'autoRemove', e.target.checked)}
                  disabled={!settings.clipModeration.enabled}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">
              <span>Notificar moderadores</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.clipModeration.notifyModerators}
                  onChange={(e) => handleSettingChange('clipModeration', 'notifyModerators', e.target.checked)}
                  disabled={!settings.clipModeration.enabled}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="settings-actions">
          <button 
            className="train-model-button"
            onClick={handleTrainModel}
          >
            Treinar Modelo de IA
          </button>
          
          <button 
            className="save-settings-button"
            onClick={handleSaveSettings}
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    );
  };

  // Renderizar aba de estatísticas
  const renderStatsTab = () => {
    return (
      <div className="ai-stats-tab">
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-value">{stats.totalScanned.toLocaleString()}</div>
            <div className="stat-label">Conteúdos Analisados</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.flaggedContent.toLocaleString()}</div>
            <div className="stat-label">Conteúdos Sinalizados</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.autoRemoved.toLocaleString()}</div>
            <div className="stat-label">Remoções Automáticas</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.falsePositives.toLocaleString()}</div>
            <div className="stat-label">Falsos Positivos</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.accuracy.toFixed(1)}%</div>
            <div className="stat-label">Precisão do Modelo</div>
          </div>
        </div>
        
        <div className="stats-charts">
          <div className="chart-container">
            <h3>Detecções por Categoria</h3>
            <div className="chart-placeholder">
              [Gráfico de Pizza: Texto 45%, Imagem 30%, Clipe 25%]
            </div>
          </div>
          
          <div className="chart-container">
            <h3>Detecções ao Longo do Tempo</h3>
            <div className="chart-placeholder">
              [Gráfico de Linha: Últimos 30 dias]
            </div>
          </div>
        </div>
        
        <div className="stats-export">
          <button className="export-button">
            Exportar Relatório
          </button>
        </div>
      </div>
    );
  };

  // Renderizar aba de detecções recentes
  const renderDetectionsTab = () => {
    return (
      <div className="ai-detections-tab">
        <div className="detections-filters">
          <div className="filter-group">
            <label>Tipo:</label>
            <select>
              <option value="all">Todos</option>
              <option value="text">Texto</option>
              <option value="image">Imagem</option>
              <option value="clip">Clipe</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select>
              <option value="all">Todos</option>
              <option value="flagged">Sinalizados</option>
              <option value="removed">Removidos</option>
              <option value="false_positive">Falsos Positivos</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Período:</label>
            <select>
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="all">Todo o período</option>
            </select>
          </div>
        </div>
        
        <div className="detections-list">
          {recentDetections.map(detection => (
            <div 
              key={detection.id} 
              className={`detection-item ${detection.type} ${detection.status}`}
            >
              <div className="detection-icon">
                {detection.type === 'text' && <i className="icon-text"></i>}
                {detection.type === 'image' && <i className="icon-image"></i>}
                {detection.type === 'clip' && <i className="icon-video"></i>}
              </div>
              
              <div className="detection-info">
                <div className="detection-content">
                  {detection.content}
                </div>
                <div className="detection-meta">
                  <span className="detection-user">Usuário: {detection.user}</span>
                  <span className="detection-time">{formatDate(detection.timestamp)}</span>
                </div>
              </div>
              
              <div className="detection-status">
                <div className="confidence-meter">
                  <div 
                    className="confidence-level"
                    style={{ width: `${detection.confidence}%` }}
                  ></div>
                </div>
                <div className="confidence-value">
                  {detection.confidence.toFixed(1)}% de confiança
                </div>
                <div className="status-badge">
                  {detection.status === 'removed' && 'Removido'}
                  {detection.status === 'flagged' && 'Sinalizado'}
                  {detection.status === 'false_positive' && 'Falso Positivo'}
                </div>
              </div>
              
              <div className="detection-actions">
                <button className="view-button">Ver</button>
                {detection.status !== 'removed' && (
                  <button className="remove-button">Remover</button>
                )}
                {detection.status !== 'false_positive' && (
                  <button className="mark-false-button">Marcar como Falso</button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="detections-pagination">
          <button className="pagination-button">&laquo; Anterior</button>
          <span className="pagination-info">Página 1 de 5</span>
          <button className="pagination-button">Próxima &raquo;</button>
        </div>
      </div>
    );
  };

  // Renderizar componente principal
  return (
    <div className="ai-moderation">
      <div className="ai-moderation-header">
        <h2>Moderação por Inteligência Artificial</h2>
        <p>Configure e monitore o sistema de moderação automática por IA</p>
      </div>
      
      <div className="ai-moderation-tabs">
        <div 
          className={`tab-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <i className="icon-settings"></i>
          <span>Configurações</span>
        </div>
        <div 
          className={`tab-item ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <i className="icon-chart"></i>
          <span>Estatísticas</span>
        </div>
        <div 
          className={`tab-item ${activeTab === 'detections' ? 'active' : ''}`}
          onClick={() => setActiveTab('detections')}
        >
          <i className="icon-alert"></i>
          <span>Detecções Recentes</span>
        </div>
      </div>
      
      <div className="ai-moderation-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando dados de moderação...</p>
          </div>
        ) : (
          <>
            {activeTab === 'settings' && renderSettingsTab()}
            {activeTab === 'stats' && renderStatsTab()}
            {activeTab === 'detections' && renderDetectionsTab()}
          </>
        )}
      </div>
    </div>
  );
};

export default AIModeration;

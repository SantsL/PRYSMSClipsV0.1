import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AIModeration.css';

// Componentes
import AISettings from '../../components/ai/AISettings';
import AITraining from '../../components/ai/AITraining';
import AIStats from '../../components/ai/AIStats';
import AILogs from '../../components/ai/AILogs';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const AIModeration = () => {
  const { hasPermission } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('settings');
  const [aiSettings, setAISettings] = useState({
    enabled: true,
    contentTypes: ['clips', 'comments', 'usernames', 'chat'],
    detectionCategories: {
      violence: { enabled: true, sensitivity: 0.7, autoAction: 'flag' },
      hate_speech: { enabled: true, sensitivity: 0.8, autoAction: 'flag' },
      nudity: { enabled: true, sensitivity: 0.9, autoAction: 'remove' },
      harassment: { enabled: true, sensitivity: 0.7, autoAction: 'flag' },
      spam: { enabled: true, sensitivity: 0.6, autoAction: 'flag' },
      copyright: { enabled: true, sensitivity: 0.5, autoAction: 'flag' }
    },
    autoModeration: {
      enableAutoActions: true,
      requireConfirmation: true,
      notifyModerators: true,
      confidenceThreshold: 0.85
    },
    processingLimits: {
      maxQueueSize: 1000,
      prioritizeReported: true,
      processingInterval: 60 // segundos
    }
  });
  const [aiStats, setAIStats] = useState({
    processed: {
      total: 0,
      today: 0,
      week: 0,
      month: 0
    },
    detected: {
      total: 0,
      byCategory: {
        violence: 0,
        hate_speech: 0,
        nudity: 0,
        harassment: 0,
        spam: 0,
        copyright: 0
      }
    },
    accuracy: {
      overall: 0,
      byCategory: {
        violence: 0,
        hate_speech: 0,
        nudity: 0,
        harassment: 0,
        spam: 0,
        copyright: 0
      }
    },
    actions: {
      flagged: 0,
      removed: 0,
      approved: 0
    }
  });
  const [aiLogs, setAILogs] = useState([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ status: '', message: '' });

  // Carregar dados da IA
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    const fetchAIData = async () => {
      try {
        // Simular carregamento de dados
        setTimeout(() => {
          // Dados simulados para estatísticas
          setAIStats({
            processed: {
              total: 24567,
              today: 342,
              week: 2156,
              month: 8976
            },
            detected: {
              total: 1234,
              byCategory: {
                violence: 356,
                hate_speech: 289,
                nudity: 178,
                harassment: 245,
                spam: 132,
                copyright: 34
              }
            },
            accuracy: {
              overall: 0.92,
              byCategory: {
                violence: 0.94,
                hate_speech: 0.89,
                nudity: 0.97,
                harassment: 0.88,
                spam: 0.91,
                copyright: 0.85
              }
            },
            actions: {
              flagged: 876,
              removed: 245,
              approved: 113
            }
          });

          // Dados simulados para logs
          const mockLogs = Array.from({ length: 50 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 7));
            date.setHours(Math.floor(Math.random() * 24));
            date.setMinutes(Math.floor(Math.random() * 60));
            
            const contentTypes = ['clip', 'comment', 'username', 'chat'];
            const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
            
            const categories = ['violence', 'hate_speech', 'nudity', 'harassment', 'spam', 'copyright'];
            const category = categories[Math.floor(Math.random() * categories.length)];
            
            const actions = ['flag', 'remove', 'approve', 'pending'];
            const action = actions[Math.floor(Math.random() * actions.length)];
            
            const confidence = Math.random() * 0.5 + 0.5; // 0.5 a 1.0
            
            return {
              id: `ai-log-${i + 1}`,
              timestamp: date.toISOString(),
              contentId: `${contentType}-${Math.floor(Math.random() * 1000)}`,
              contentType,
              category,
              confidence,
              action,
              reviewedBy: action !== 'pending' ? ['admin', 'moderator1', 'moderator2', null][Math.floor(Math.random() * 4)] : null,
              reviewTimestamp: action !== 'pending' ? new Date(date.getTime() + Math.floor(Math.random() * 3600000)).toISOString() : null,
              finalAction: action !== 'pending' ? action : null
            };
          });
          
          // Ordenar por data (mais recente primeiro)
          mockLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
          setAILogs(mockLogs);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar dados da IA:', error);
        setLoading(false);
      }
    };

    fetchAIData();
  }, []);

  // Manipuladores de eventos
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSettingChange = (category, key, value) => {
    if (category === 'root') {
      setAISettings(prev => ({
        ...prev,
        [key]: value
      }));
    } else if (category === 'detectionCategories') {
      const [categoryName, setting] = key.split('.');
      setAISettings(prev => ({
        ...prev,
        detectionCategories: {
          ...prev.detectionCategories,
          [categoryName]: {
            ...prev.detectionCategories[categoryName],
            [setting]: value
          }
        }
      }));
    } else if (category === 'autoModeration' || category === 'processingLimits') {
      setAISettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      }));
    }
  };

  const handleSaveSettings = () => {
    // Verificar se o usuário tem permissão
    if (!hasPermission('manage_settings')) {
      setSaveStatus({
        status: 'error',
        message: 'Você não tem permissão para salvar configurações.'
      });
      return;
    }

    // Preparar alterações para confirmação
    setPendingChanges({ type: 'settings' });
    setConfirmModalOpen(true);
  };

  const handleRetrainModel = () => {
    // Verificar se o usuário tem permissão
    if (!hasPermission('manage_settings')) {
      setSaveStatus({
        status: 'error',
        message: 'Você não tem permissão para treinar o modelo.'
      });
      return;
    }

    // Preparar alterações para confirmação
    setPendingChanges({ type: 'retrain' });
    setConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    // Em um ambiente de produção, isso seria uma chamada à API
    
    // Simular ação
    setTimeout(() => {
      if (pendingChanges.type === 'settings') {
        setSaveStatus({
          status: 'success',
          message: 'Configurações da IA salvas com sucesso.'
        });
      } else if (pendingChanges.type === 'retrain') {
        setSaveStatus({
          status: 'success',
          message: 'Treinamento do modelo iniciado com sucesso. Este processo pode levar algumas horas.'
        });
      }
      
      // Limpar status após alguns segundos
      setTimeout(() => {
        setSaveStatus({ status: '', message: '' });
      }, 3000);
      
      setConfirmModalOpen(false);
      setPendingChanges(null);
    }, 1000);
  };

  // Renderizar conteúdo com base na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <AISettings
            settings={aiSettings}
            onSettingChange={handleSettingChange}
            onSave={handleSaveSettings}
            saveStatus={saveStatus}
          />
        );
      case 'training':
        return (
          <AITraining
            onRetrainModel={handleRetrainModel}
            saveStatus={saveStatus}
          />
        );
      case 'stats':
        return (
          <AIStats
            stats={aiStats}
          />
        );
      case 'logs':
        return (
          <AILogs
            logs={aiLogs}
          />
        );
      default:
        return <div>Selecione uma aba.</div>;
    }
  };

  if (loading) {
    return <div className="ai-moderation-loading">Carregando dados da IA...</div>;
  }

  return (
    <div className="ai-moderation">
      <div className="ai-moderation-header">
        <h1>Moderação por Inteligência Artificial</h1>
        <p className="ai-moderation-description">
          Configure e monitore o sistema de moderação automática baseado em IA.
        </p>
      </div>

      <div className="ai-moderation-tabs">
        <div 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleTabChange('settings')}
        >
          <i className="icon-settings"></i>
          <span>Configurações</span>
        </div>
        <div 
          className={`tab ${activeTab === 'training' ? 'active' : ''}`}
          onClick={() => handleTabChange('training')}
        >
          <i className="icon-brain"></i>
          <span>Treinamento</span>
        </div>
        <div 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => handleTabChange('stats')}
        >
          <i className="icon-chart"></i>
          <span>Estatísticas</span>
        </div>
        <div 
          className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => handleTabChange('logs')}
        >
          <i className="icon-list"></i>
          <span>Logs</span>
        </div>
      </div>

      <div className="ai-moderation-content">
        {renderContent()}
      </div>

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={
          pendingChanges?.type === 'settings' ? 'Salvar Configurações da IA' :
          pendingChanges?.type === 'retrain' ? 'Treinar Modelo de IA' : ''
        }
        message={
          pendingChanges?.type === 'settings' ? 'Tem certeza que deseja salvar as alterações nas configurações da IA? Isso pode afetar o comportamento da moderação automática.' :
          pendingChanges?.type === 'retrain' ? 'Tem certeza que deseja iniciar o treinamento do modelo de IA? Este processo pode levar várias horas e consumir recursos significativos do sistema.' : ''
        }
        confirmText={
          pendingChanges?.type === 'settings' ? 'Salvar' :
          pendingChanges?.type === 'retrain' ? 'Iniciar Treinamento' : 'Confirmar'
        }
        confirmColor={
          pendingChanges?.type === 'settings' ? 'blue' :
          pendingChanges?.type === 'retrain' ? 'purple' : 'green'
        }
      />
    </div>
  );
};

export default AIModeration;

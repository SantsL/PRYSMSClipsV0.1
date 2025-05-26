import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Settings.css';

// Componentes
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsForm from '../../components/settings/SettingsForm';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const Settings = () => {
  const { hasPermission } = useAuth();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    economy: {
      dailyPrysmsLimit: 500,
      clipUploadReward: 10,
      commentReward: 2,
      minigameWinReward: 50,
      minigameParticipationReward: 5,
      referralReward: 100,
      exchangeRate: 100 // 100 PRYSMS = $1
    },
    content: {
      maxClipDuration: 60, // segundos
      maxClipSize: 50, // MB
      allowedFormats: ['mp4', 'webm', 'mov'],
      autoModeration: true,
      moderationSensitivity: 0.7, // 0-1
      requireApproval: false
    },
    users: {
      requireEmailVerification: true,
      maxLoginAttempts: 5,
      sessionTimeout: 24, // horas
      passwordMinLength: 8,
      passwordRequireSpecialChars: true
    },
    tags: {
      allowUserCreatedTags: true,
      maxTagsPerClip: 10,
      featuredTags: ['FiveM', 'RP', 'PVP', 'NoPixel', 'Eclipse', 'Cidade Alta', 'Complexo', 'GTA', 'CS2', 'Valorant']
    },
    notifications: {
      enableEmailNotifications: true,
      enablePushNotifications: true,
      digestFrequency: 'daily' // daily, weekly, never
    }
  });
  const [activeSection, setActiveSection] = useState('economy');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ status: '', message: '' });

  // Carregar configurações
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    const fetchSettings = async () => {
      try {
        // Simular carregamento de dados
        setTimeout(() => {
          // Dados já estão definidos no estado inicial
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Manipuladores de eventos
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = (section) => {
    // Verificar se o usuário tem permissão
    if (!hasPermission('manage_settings')) {
      setSaveStatus({
        status: 'error',
        message: 'Você não tem permissão para salvar configurações.'
      });
      return;
    }

    // Preparar alterações para confirmação
    setPendingChanges({ section });
    setConfirmModalOpen(true);
  };

  const handleConfirmSave = () => {
    // Em um ambiente de produção, isso seria uma chamada à API
    
    // Simular salvamento
    setTimeout(() => {
      setSaveStatus({
        status: 'success',
        message: `Configurações de ${pendingChanges.section} salvas com sucesso.`
      });
      
      // Limpar status após alguns segundos
      setTimeout(() => {
        setSaveStatus({ status: '', message: '' });
      }, 3000);
      
      setConfirmModalOpen(false);
      setPendingChanges(null);
    }, 1000);
  };

  // Renderizar formulários com base na seção ativa
  const renderSettingsForm = () => {
    switch (activeSection) {
      case 'economy':
        return (
          <SettingsForm
            title="Configurações de Economia"
            description="Ajuste os parâmetros da economia virtual do PRYSMSCLIPS."
            settings={settings.economy}
            onSettingChange={(key, value) => handleSettingChange('economy', key, value)}
            onSave={() => handleSaveSettings('economy')}
            fields={[
              { key: 'dailyPrysmsLimit', label: 'Limite Diário de PRYSMS', type: 'number', min: 0, max: 10000 },
              { key: 'clipUploadReward', label: 'Recompensa por Upload de Clipe', type: 'number', min: 0, max: 1000 },
              { key: 'commentReward', label: 'Recompensa por Comentário', type: 'number', min: 0, max: 100 },
              { key: 'minigameWinReward', label: 'Recompensa por Vitória em Minigame', type: 'number', min: 0, max: 1000 },
              { key: 'minigameParticipationReward', label: 'Recompensa por Participação em Minigame', type: 'number', min: 0, max: 500 },
              { key: 'referralReward', label: 'Recompensa por Indicação', type: 'number', min: 0, max: 1000 },
              { key: 'exchangeRate', label: 'Taxa de Câmbio (PRYSMS por $1)', type: 'number', min: 1, max: 10000 }
            ]}
            saveStatus={saveStatus}
          />
        );
      case 'content':
        return (
          <SettingsForm
            title="Configurações de Conteúdo"
            description="Defina os parâmetros para upload e moderação de conteúdo."
            settings={settings.content}
            onSettingChange={(key, value) => handleSettingChange('content', key, value)}
            onSave={() => handleSaveSettings('content')}
            fields={[
              { key: 'maxClipDuration', label: 'Duração Máxima de Clipe (segundos)', type: 'number', min: 10, max: 300 },
              { key: 'maxClipSize', label: 'Tamanho Máximo de Clipe (MB)', type: 'number', min: 5, max: 500 },
              { key: 'allowedFormats', label: 'Formatos Permitidos', type: 'multiselect', options: ['mp4', 'webm', 'mov', 'avi', 'gif'] },
              { key: 'autoModeration', label: 'Moderação Automática', type: 'toggle' },
              { key: 'moderationSensitivity', label: 'Sensibilidade da Moderação', type: 'slider', min: 0, max: 1, step: 0.1 },
              { key: 'requireApproval', label: 'Exigir Aprovação para Todos os Clipes', type: 'toggle' }
            ]}
            saveStatus={saveStatus}
          />
        );
      case 'users':
        return (
          <SettingsForm
            title="Configurações de Usuários"
            description="Configure os parâmetros de segurança e autenticação."
            settings={settings.users}
            onSettingChange={(key, value) => handleSettingChange('users', key, value)}
            onSave={() => handleSaveSettings('users')}
            fields={[
              { key: 'requireEmailVerification', label: 'Exigir Verificação de Email', type: 'toggle' },
              { key: 'maxLoginAttempts', label: 'Máximo de Tentativas de Login', type: 'number', min: 1, max: 20 },
              { key: 'sessionTimeout', label: 'Tempo Limite de Sessão (horas)', type: 'number', min: 1, max: 168 },
              { key: 'passwordMinLength', label: 'Comprimento Mínimo de Senha', type: 'number', min: 6, max: 30 },
              { key: 'passwordRequireSpecialChars', label: 'Exigir Caracteres Especiais em Senhas', type: 'toggle' }
            ]}
            saveStatus={saveStatus}
          />
        );
      case 'tags':
        return (
          <SettingsForm
            title="Configurações de Tags"
            description="Gerencie as tags e categorias do sistema."
            settings={settings.tags}
            onSettingChange={(key, value) => handleSettingChange('tags', key, value)}
            onSave={() => handleSaveSettings('tags')}
            fields={[
              { key: 'allowUserCreatedTags', label: 'Permitir Tags Criadas por Usuários', type: 'toggle' },
              { key: 'maxTagsPerClip', label: 'Máximo de Tags por Clipe', type: 'number', min: 1, max: 50 },
              { key: 'featuredTags', label: 'Tags em Destaque', type: 'taglist' }
            ]}
            saveStatus={saveStatus}
          />
        );
      case 'notifications':
        return (
          <SettingsForm
            title="Configurações de Notificações"
            description="Configure as preferências de notificação do sistema."
            settings={settings.notifications}
            onSettingChange={(key, value) => handleSettingChange('notifications', key, value)}
            onSave={() => handleSaveSettings('notifications')}
            fields={[
              { key: 'enableEmailNotifications', label: 'Habilitar Notificações por Email', type: 'toggle' },
              { key: 'enablePushNotifications', label: 'Habilitar Notificações Push', type: 'toggle' },
              { key: 'digestFrequency', label: 'Frequência de Resumo', type: 'select', options: [
                { value: 'daily', label: 'Diário' },
                { value: 'weekly', label: 'Semanal' },
                { value: 'never', label: 'Nunca' }
              ]}
            ]}
            saveStatus={saveStatus}
          />
        );
      default:
        return <div>Selecione uma seção de configurações.</div>;
    }
  };

  if (loading) {
    return <div className="settings-loading">Carregando configurações...</div>;
  }

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Configurações do Sistema</h1>
        <p className="settings-description">
          Configure os parâmetros do PRYSMSCLIPS para otimizar a experiência dos usuários e a operação da plataforma.
        </p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <SettingsSection
            sections={[
              { id: 'economy', label: 'Economia', icon: 'dollar-sign' },
              { id: 'content', label: 'Conteúdo', icon: 'film' },
              { id: 'users', label: 'Usuários', icon: 'users' },
              { id: 'tags', label: 'Tags', icon: 'tag' },
              { id: 'notifications', label: 'Notificações', icon: 'bell' }
            ]}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
        </div>

        <div className="settings-content">
          {renderSettingsForm()}
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmSave}
        title="Salvar Configurações"
        message={`Tem certeza que deseja salvar as alterações nas configurações de ${pendingChanges?.section}? Isso pode afetar o funcionamento da plataforma.`}
        confirmText="Salvar"
        confirmColor="blue"
      />
    </div>
  );
};

export default Settings;

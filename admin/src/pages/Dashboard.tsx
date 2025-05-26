import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

// Componentes
import StatCard from '../../components/dashboard/StatCard';
import AlertsList from '../../components/dashboard/AlertsList';
import ActivityChart from '../../components/dashboard/ActivityChart';
import RecentActions from '../../components/dashboard/RecentActions';

const Dashboard = () => {
  const { currentUser, userRole } = useAuth();
  const [stats, setStats] = useState({
    activeUsers: { daily: 0, weekly: 0, monthly: 0 },
    newRegistrations: { daily: 0, weekly: 0, monthly: 0 },
    clipsUploaded: { daily: 0, weekly: 0, monthly: 0 },
    reportedContent: { pending: 0, total: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [recentActions, setRecentActions] = useState([]);

  // Carregar dados do dashboard
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    const fetchDashboardData = async () => {
      try {
        // Simular carregamento de dados
        setTimeout(() => {
          // Dados simulados
          setStats({
            activeUsers: { daily: 1245, weekly: 8732, monthly: 24567 },
            newRegistrations: { daily: 87, weekly: 543, monthly: 2134 },
            clipsUploaded: { daily: 342, weekly: 2156, monthly: 8976 },
            reportedContent: { pending: 23, total: 156 }
          });

          setActivityData([
            { date: '2025-05-19', users: 1150, clips: 320, minigames: 876 },
            { date: '2025-05-20', users: 1230, clips: 350, minigames: 920 },
            { date: '2025-05-21', users: 1180, clips: 310, minigames: 890 },
            { date: '2025-05-22', users: 1320, clips: 380, minigames: 950 },
            { date: '2025-05-23', users: 1400, clips: 410, minigames: 1020 },
            { date: '2025-05-24', users: 1280, clips: 360, minigames: 980 },
            { date: '2025-05-25', users: 1245, clips: 342, minigames: 910 }
          ]);

          setAlerts([
            { id: 1, type: 'warning', message: 'Conteúdo reportado aguardando revisão', count: 23, link: '/admin/content?filter=reported' },
            { id: 2, type: 'info', message: 'Novos usuários registrados hoje', count: 87, link: '/admin/users?filter=new' },
            { id: 3, type: 'success', message: 'Clipes aprovados nas últimas 24h', count: 156, link: '/admin/content?filter=approved' },
            { id: 4, type: 'error', message: 'Tentativas de login suspeitas', count: 5, link: '/admin/logs?filter=security' }
          ]);

          setRecentActions([
            { id: 1, user: 'Moderador1', action: 'Removeu clipe', target: 'Clipe #12345', timestamp: '2025-05-25T14:32:15Z' },
            { id: 2, user: 'Admin', action: 'Baniu usuário', target: 'User123', timestamp: '2025-05-25T13:45:22Z' },
            { id: 3, user: 'Moderador2', action: 'Aprovou clipe', target: 'Clipe #12346', timestamp: '2025-05-25T13:12:05Z' },
            { id: 4, user: 'Admin', action: 'Criou evento', target: 'Evento de Verão', timestamp: '2025-05-25T12:30:18Z' },
            { id: 5, user: 'Moderador1', action: 'Enviou aviso', target: 'User456', timestamp: '2025-05-25T11:22:45Z' }
          ]);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Carregando dados do dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-welcome">
          <p>Bem-vindo, <strong>{currentUser?.name}</strong> | <span className="user-role">{userRole === 'admin' ? 'Administrador' : 'Moderador'}</span></p>
        </div>
      </div>

      <div className="dashboard-stats">
        <StatCard 
          title="Usuários Ativos" 
          icon="users"
          primary={stats.activeUsers.daily}
          primaryLabel="Hoje"
          secondary={[
            { value: stats.activeUsers.weekly, label: 'Semana' },
            { value: stats.activeUsers.monthly, label: 'Mês' }
          ]}
          color="blue"
        />
        
        <StatCard 
          title="Novos Registros" 
          icon="user-plus"
          primary={stats.newRegistrations.daily}
          primaryLabel="Hoje"
          secondary={[
            { value: stats.newRegistrations.weekly, label: 'Semana' },
            { value: stats.newRegistrations.monthly, label: 'Mês' }
          ]}
          color="green"
        />
        
        <StatCard 
          title="Clipes Enviados" 
          icon="video"
          primary={stats.clipsUploaded.daily}
          primaryLabel="Hoje"
          secondary={[
            { value: stats.clipsUploaded.weekly, label: 'Semana' },
            { value: stats.clipsUploaded.monthly, label: 'Mês' }
          ]}
          color="purple"
        />
        
        <StatCard 
          title="Conteúdo Reportado" 
          icon="alert-triangle"
          primary={stats.reportedContent.pending}
          primaryLabel="Pendentes"
          secondary={[
            { value: stats.reportedContent.total, label: 'Total' }
          ]}
          color="red"
          link="/admin/content?filter=reported"
          linkText="Ver todos"
        />
      </div>

      <div className="dashboard-main">
        <div className="dashboard-chart">
          <h2>Atividade da Plataforma (7 dias)</h2>
          <ActivityChart data={activityData} />
        </div>

        <div className="dashboard-sidebar">
          <div className="dashboard-alerts">
            <h2>Alertas</h2>
            <AlertsList alerts={alerts} />
          </div>

          <div className="dashboard-recent">
            <h2>Ações Recentes</h2>
            <RecentActions actions={recentActions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

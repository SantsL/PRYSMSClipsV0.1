import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Logs.css';

// Componentes
import LogFilters from '../../components/logs/LogFilters';
import LogTable from '../../components/logs/LogTable';
import LogDetails from '../../components/logs/LogDetails';

const Logs = () => {
  const { hasPermission } = useAuth();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    severity: 'all',
    user: 'all',
    dateRange: 'week'
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 20
  });

  // Carregar logs
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    const fetchLogs = async () => {
      try {
        // Simular carregamento de dados
        setTimeout(() => {
          // Dados simulados
          const mockLogs = Array.from({ length: 200 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            date.setHours(Math.floor(Math.random() * 24));
            date.setMinutes(Math.floor(Math.random() * 60));
            
            const types = ['auth', 'content', 'user', 'system', 'security'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            const severities = ['info', 'warning', 'error', 'critical'];
            const severity = severities[Math.floor(Math.random() * severities.length)];
            
            const users = ['admin', 'moderator1', 'moderator2', 'system', null];
            const user = users[Math.floor(Math.random() * users.length)];
            
            let action, details;
            
            switch (type) {
              case 'auth':
                action = ['login', 'logout', 'failed_login', 'password_reset'][Math.floor(Math.random() * 4)];
                details = {
                  ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                  success: action !== 'failed_login'
                };
                break;
              case 'content':
                action = ['create', 'update', 'delete', 'report', 'approve', 'reject'][Math.floor(Math.random() * 6)];
                details = {
                  contentId: `clip-${Math.floor(Math.random() * 1000)}`,
                  contentType: 'clip',
                  reason: action === 'report' || action === 'reject' ? ['inappropriate', 'spam', 'violence'][Math.floor(Math.random() * 3)] : null
                };
                break;
              case 'user':
                action = ['create', 'update', 'delete', 'ban', 'suspend', 'promote'][Math.floor(Math.random() * 6)];
                details = {
                  targetUserId: `user-${Math.floor(Math.random() * 100)}`,
                  reason: action === 'ban' || action === 'suspend' ? 'Violação dos termos de serviço' : null,
                  duration: action === 'suspend' ? [24, 48, 72, 168][Math.floor(Math.random() * 4)] : null
                };
                break;
              case 'system':
                action = ['config_change', 'backup', 'maintenance', 'error'][Math.floor(Math.random() * 4)];
                details = {
                  component: ['database', 'server', 'cache', 'storage'][Math.floor(Math.random() * 4)],
                  status: action === 'error' ? 'failed' : 'success'
                };
                break;
              case 'security':
                action = ['suspicious_activity', 'rate_limit', 'ip_block', 'vulnerability_scan'][Math.floor(Math.random() * 4)];
                details = {
                  ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                  attempts: action === 'rate_limit' ? Math.floor(Math.random() * 100) + 10 : null,
                  source: ['api', 'web', 'unknown'][Math.floor(Math.random() * 3)]
                };
                break;
              default:
                action = 'unknown';
                details = {};
            }
            
            return {
              id: `log-${i + 1}`,
              timestamp: date.toISOString(),
              type,
              severity,
              user,
              action,
              message: generateLogMessage(type, action, user),
              details
            };
          });
          
          // Ordenar por data (mais recente primeiro)
          mockLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
          setLogs(mockLogs);
          setFilteredLogs(mockLogs);
          setPagination(prev => ({
            ...prev,
            totalPages: Math.ceil(mockLogs.length / prev.itemsPerPage)
          }));
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar logs:', error);
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Gerar mensagem de log com base no tipo e ação
  const generateLogMessage = (type, action, user) => {
    const userStr = user ? `Usuário ${user}` : 'Sistema';
    
    switch (type) {
      case 'auth':
        switch (action) {
          case 'login': return `${userStr} realizou login com sucesso`;
          case 'logout': return `${userStr} realizou logout`;
          case 'failed_login': return `Tentativa de login falhou para ${user}`;
          case 'password_reset': return `${userStr} solicitou redefinição de senha`;
          default: return `${userStr} realizou ação de autenticação`;
        }
      case 'content':
        switch (action) {
          case 'create': return `${userStr} criou novo conteúdo`;
          case 'update': return `${userStr} atualizou conteúdo`;
          case 'delete': return `${userStr} removeu conteúdo`;
          case 'report': return `${userStr} reportou conteúdo`;
          case 'approve': return `${userStr} aprovou conteúdo`;
          case 'reject': return `${userStr} rejeitou conteúdo`;
          default: return `${userStr} realizou ação em conteúdo`;
        }
      case 'user':
        switch (action) {
          case 'create': return `${userStr} criou nova conta`;
          case 'update': return `${userStr} atualizou perfil`;
          case 'delete': return `${userStr} removeu conta`;
          case 'ban': return `${userStr} baniu usuário`;
          case 'suspend': return `${userStr} suspendeu usuário`;
          case 'promote': return `${userStr} promoveu usuário a moderador`;
          default: return `${userStr} realizou ação em usuário`;
        }
      case 'system':
        switch (action) {
          case 'config_change': return `${userStr} alterou configurações do sistema`;
          case 'backup': return `Backup do sistema realizado`;
          case 'maintenance': return `Manutenção do sistema iniciada`;
          case 'error': return `Erro de sistema detectado`;
          default: return `Evento de sistema registrado`;
        }
      case 'security':
        switch (action) {
          case 'suspicious_activity': return `Atividade suspeita detectada`;
          case 'rate_limit': return `Limite de taxa excedido`;
          case 'ip_block': return `IP bloqueado por atividade suspeita`;
          case 'vulnerability_scan': return `Tentativa de scan de vulnerabilidade detectada`;
          default: return `Evento de segurança registrado`;
        }
      default:
        return `Evento desconhecido registrado`;
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let result = [...logs];
    
    // Filtrar por busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(log => 
        log.message.toLowerCase().includes(searchLower) ||
        (log.user && log.user.toLowerCase().includes(searchLower))
      );
    }
    
    // Filtrar por tipo
    if (filters.type !== 'all') {
      result = result.filter(log => log.type === filters.type);
    }
    
    // Filtrar por severidade
    if (filters.severity !== 'all') {
      result = result.filter(log => log.severity === filters.severity);
    }
    
    // Filtrar por usuário
    if (filters.user !== 'all') {
      if (filters.user === 'system') {
        result = result.filter(log => !log.user);
      } else {
        result = result.filter(log => log.user === filters.user);
      }
    }
    
    // Filtrar por data
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case 'week':
          cutoffDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          cutoffDate = null;
      }
      
      if (cutoffDate) {
        result = result.filter(log => new Date(log.timestamp) >= cutoffDate);
      }
    }
    
    setFilteredLogs(result);
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalPages: Math.ceil(result.length / prev.itemsPerPage)
    }));
  }, [filters, logs]);

  // Manipuladores de eventos
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleViewLog = (logId) => {
    const log = logs.find(l => l.id === logId);
    setSelectedLog(log);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedLog(null);
  };

  // Paginação
  const paginatedLogs = filteredLogs.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  // Obter usuários únicos para o filtro
  const uniqueUsers = ['all', 'system', ...new Set(logs.filter(log => log.user).map(log => log.user))];

  if (loading) {
    return <div className="logs-loading">Carregando logs...</div>;
  }

  return (
    <div className="logs">
      <div className="logs-header">
        <h1>Logs e Auditoria</h1>
        <div className="logs-stats">
          <div className="stat">
            <span className="stat-value">{logs.filter(l => l.severity === 'critical').length}</span>
            <span className="stat-label">Críticos</span>
          </div>
          <div className="stat">
            <span className="stat-value">{logs.filter(l => l.severity === 'error').length}</span>
            <span className="stat-label">Erros</span>
          </div>
          <div className="stat">
            <span className="stat-value">{logs.filter(l => l.severity === 'warning').length}</span>
            <span className="stat-label">Avisos</span>
          </div>
          <div className="stat">
            <span className="stat-value">{logs.filter(l => l.severity === 'info').length}</span>
            <span className="stat-label">Informações</span>
          </div>
        </div>
      </div>

      <LogFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        uniqueUsers={uniqueUsers}
      />

      <div className="logs-table-container">
        <LogTable 
          logs={paginatedLogs}
          onViewLog={handleViewLog}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {detailsOpen && selectedLog && (
        <LogDetails 
          log={selectedLog} 
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default Logs;

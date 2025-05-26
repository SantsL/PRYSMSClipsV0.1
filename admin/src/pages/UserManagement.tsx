import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserManagement.css';

// Componentes
import UserTable from '../../components/users/UserTable';
import UserFilters from '../../components/users/UserFilters';
import UserModal from '../../components/users/UserModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const UserManagement = () => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    role: 'all',
    dateRange: 'all'
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: '', userId: null });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10
  });

  // Carregar dados de usuários
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    const fetchUsers = async () => {
      try {
        // Simular carregamento de dados
        setTimeout(() => {
          // Dados simulados
          const mockUsers = Array.from({ length: 50 }, (_, i) => ({
            id: `user-${i + 1}`,
            username: `user${i + 1}`,
            email: `user${i + 1}@example.com`,
            displayName: `Usuário ${i + 1}`,
            role: i === 0 ? 'admin' : i < 5 ? 'moderator' : 'user',
            status: i % 10 === 0 ? 'banned' : i % 15 === 0 ? 'suspended' : 'active',
            registrationDate: new Date(2025, 0, i + 1).toISOString(),
            lastLogin: new Date(2025, 4, Math.max(1, 25 - i)).toISOString(),
            clipsCount: Math.floor(Math.random() * 50),
            reportsCount: Math.floor(Math.random() * 10),
            prysmsBalance: Math.floor(Math.random() * 5000)
          }));
          
          setUsers(mockUsers);
          setFilteredUsers(mockUsers);
          setPagination(prev => ({
            ...prev,
            totalPages: Math.ceil(mockUsers.length / prev.itemsPerPage)
          }));
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let result = [...users];
    
    // Filtrar por busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(user => 
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.displayName.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrar por status
    if (filters.status !== 'all') {
      result = result.filter(user => user.status === filters.status);
    }
    
    // Filtrar por papel
    if (filters.role !== 'all') {
      result = result.filter(user => user.role === filters.role);
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
        result = result.filter(user => new Date(user.registrationDate) >= cutoffDate);
      }
    }
    
    setFilteredUsers(result);
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalPages: Math.ceil(result.length / prev.itemsPerPage)
    }));
  }, [filters, users]);

  // Manipuladores de eventos
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleViewUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleBanUser = (userId) => {
    setConfirmAction({ type: 'ban', userId });
    setConfirmModalOpen(true);
  };

  const handleSuspendUser = (userId) => {
    setConfirmAction({ type: 'suspend', userId });
    setConfirmModalOpen(true);
  };

  const handlePromoteUser = (userId) => {
    setConfirmAction({ type: 'promote', userId });
    setConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    // Em um ambiente de produção, isso seria uma chamada à API
    
    // Atualizar estado local para simular a ação
    const updatedUsers = users.map(user => {
      if (user.id === confirmAction.userId) {
        switch (confirmAction.type) {
          case 'ban':
            return { ...user, status: 'banned' };
          case 'suspend':
            return { ...user, status: 'suspended' };
          case 'promote':
            return { ...user, role: 'moderator' };
          default:
            return user;
        }
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setConfirmModalOpen(false);
    setConfirmAction({ type: '', userId: null });
  };

  // Paginação
  const paginatedUsers = filteredUsers.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  if (loading) {
    return <div className="user-management-loading">Carregando usuários...</div>;
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1>Gerenciamento de Usuários</h1>
        <div className="user-stats">
          <div className="stat">
            <span className="stat-value">{users.filter(u => u.status === 'active').length}</span>
            <span className="stat-label">Ativos</span>
          </div>
          <div className="stat">
            <span className="stat-value">{users.filter(u => u.status === 'suspended').length}</span>
            <span className="stat-label">Suspensos</span>
          </div>
          <div className="stat">
            <span className="stat-value">{users.filter(u => u.status === 'banned').length}</span>
            <span className="stat-label">Banidos</span>
          </div>
          <div className="stat">
            <span className="stat-value">{users.filter(u => u.role === 'moderator').length}</span>
            <span className="stat-label">Moderadores</span>
          </div>
        </div>
      </div>

      <UserFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      <div className="user-table-container">
        <UserTable 
          users={paginatedUsers}
          onViewUser={handleViewUser}
          onBanUser={hasPermission('manage_users') ? handleBanUser : null}
          onSuspendUser={hasPermission('manage_users') || hasPermission('temp_suspend_users') ? handleSuspendUser : null}
          onPromoteUser={hasPermission('manage_moderators') ? handlePromoteUser : null}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {modalOpen && selectedUser && (
        <UserModal 
          user={selectedUser} 
          onClose={handleCloseModal}
          onBan={hasPermission('manage_users') ? () => handleBanUser(selectedUser.id) : null}
          onSuspend={hasPermission('manage_users') || hasPermission('temp_suspend_users') ? () => handleSuspendUser(selectedUser.id) : null}
          onPromote={hasPermission('manage_moderators') ? () => handlePromoteUser(selectedUser.id) : null}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={
          confirmAction.type === 'ban' ? 'Banir Usuário' :
          confirmAction.type === 'suspend' ? 'Suspender Usuário' :
          confirmAction.type === 'promote' ? 'Promover a Moderador' : ''
        }
        message={
          confirmAction.type === 'ban' ? 'Tem certeza que deseja banir permanentemente este usuário? Esta ação não pode ser desfeita.' :
          confirmAction.type === 'suspend' ? 'Tem certeza que deseja suspender temporariamente este usuário?' :
          confirmAction.type === 'promote' ? 'Tem certeza que deseja promover este usuário a moderador? Ele terá acesso a funções de moderação.' : ''
        }
        confirmText={
          confirmAction.type === 'ban' ? 'Banir' :
          confirmAction.type === 'suspend' ? 'Suspender' :
          confirmAction.type === 'promote' ? 'Promover' : 'Confirmar'
        }
        confirmColor={
          confirmAction.type === 'ban' ? 'red' :
          confirmAction.type === 'suspend' ? 'orange' :
          confirmAction.type === 'promote' ? 'blue' : 'green'
        }
      />
    </div>
  );
};

export default UserManagement;

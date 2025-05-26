import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ContentModeration.css';

// Componentes
import ContentFilters from '../../components/content/ContentFilters';
import ContentTable from '../../components/content/ContentTable';
import ContentViewer from '../../components/content/ContentViewer';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const ContentModeration = () => {
  const { hasPermission } = useAuth();
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'reported',
    type: 'all',
    dateRange: 'all'
  });
  const [selectedContent, setSelectedContent] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: '', contentId: null });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10
  });

  // Carregar dados de conteúdo
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    const fetchContent = async () => {
      try {
        // Simular carregamento de dados
        setTimeout(() => {
          // Dados simulados
          const mockContent = Array.from({ length: 50 }, (_, i) => ({
            id: `clip-${i + 1}`,
            title: `Clipe #${i + 1} - Jogada Incrível`,
            type: i % 5 === 0 ? 'comment' : 'clip',
            status: i % 3 === 0 ? 'reported' : i % 7 === 0 ? 'removed' : 'approved',
            reportReason: i % 3 === 0 ? ['inappropriate', 'spam', 'violence'][i % 3] : null,
            reportCount: i % 3 === 0 ? Math.floor(Math.random() * 10) + 1 : 0,
            uploadDate: new Date(2025, 4, Math.max(1, 25 - i)).toISOString(),
            author: {
              id: `user-${i % 20 + 1}`,
              username: `user${i % 20 + 1}`,
              displayName: `Usuário ${i % 20 + 1}`
            },
            views: Math.floor(Math.random() * 10000),
            likes: Math.floor(Math.random() * 1000),
            thumbnailUrl: `https://picsum.photos/id/${(i % 30) + 100}/320/180`,
            contentUrl: `https://example.com/clips/clip-${i + 1}.mp4`,
            aiDetection: i % 5 === 0 ? {
              score: Math.random(),
              flags: ['violence', 'inappropriate_language']
            } : null
          }));
          
          setContent(mockContent);
          
          // Aplicar filtro inicial para mostrar apenas conteúdo reportado
          const initialFiltered = mockContent.filter(item => item.status === 'reported');
          setFilteredContent(initialFiltered);
          
          setPagination(prev => ({
            ...prev,
            totalPages: Math.ceil(initialFiltered.length / prev.itemsPerPage)
          }));
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error);
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let result = [...content];
    
    // Filtrar por busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.author.username.toLowerCase().includes(searchLower) ||
        item.author.displayName.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrar por status
    if (filters.status !== 'all') {
      result = result.filter(item => item.status === filters.status);
    }
    
    // Filtrar por tipo
    if (filters.type !== 'all') {
      result = result.filter(item => item.type === filters.type);
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
        result = result.filter(item => new Date(item.uploadDate) >= cutoffDate);
      }
    }
    
    setFilteredContent(result);
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalPages: Math.ceil(result.length / prev.itemsPerPage)
    }));
  }, [filters, content]);

  // Manipuladores de eventos
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleViewContent = (contentId) => {
    const contentItem = content.find(c => c.id === contentId);
    setSelectedContent(contentItem);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
    setSelectedContent(null);
  };

  const handleApproveContent = (contentId) => {
    setConfirmAction({ type: 'approve', contentId });
    setConfirmModalOpen(true);
  };

  const handleRemoveContent = (contentId) => {
    setConfirmAction({ type: 'remove', contentId });
    setConfirmModalOpen(true);
  };

  const handleWarnAuthor = (contentId) => {
    setConfirmAction({ type: 'warn', contentId });
    setConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    // Em um ambiente de produção, isso seria uma chamada à API
    
    // Atualizar estado local para simular a ação
    const updatedContent = content.map(item => {
      if (item.id === confirmAction.contentId) {
        switch (confirmAction.type) {
          case 'approve':
            return { ...item, status: 'approved', reportCount: 0, reportReason: null };
          case 'remove':
            return { ...item, status: 'removed' };
          case 'warn':
            // Apenas simulação, na prática enviaria aviso ao autor
            return item;
          default:
            return item;
        }
      }
      return item;
    });
    
    setContent(updatedContent);
    setConfirmModalOpen(false);
    setConfirmAction({ type: '', contentId: null });
    
    // Se o visualizador estiver aberto, feche-o após a ação
    if (viewerOpen) {
      setViewerOpen(false);
      setSelectedContent(null);
    }
  };

  // Paginação
  const paginatedContent = filteredContent.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  if (loading) {
    return <div className="content-moderation-loading">Carregando conteúdo...</div>;
  }

  return (
    <div className="content-moderation">
      <div className="content-moderation-header">
        <h1>Moderação de Conteúdo</h1>
        <div className="content-stats">
          <div className="stat">
            <span className="stat-value">{content.filter(c => c.status === 'reported').length}</span>
            <span className="stat-label">Reportados</span>
          </div>
          <div className="stat">
            <span className="stat-value">{content.filter(c => c.status === 'approved').length}</span>
            <span className="stat-label">Aprovados</span>
          </div>
          <div className="stat">
            <span className="stat-value">{content.filter(c => c.status === 'removed').length}</span>
            <span className="stat-label">Removidos</span>
          </div>
          <div className="stat">
            <span className="stat-value">{content.filter(c => c.aiDetection).length}</span>
            <span className="stat-label">Sinalizados por IA</span>
          </div>
        </div>
      </div>

      <ContentFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      <div className="content-table-container">
        <ContentTable 
          content={paginatedContent}
          onViewContent={handleViewContent}
          onApproveContent={hasPermission('manage_content') ? handleApproveContent : null}
          onRemoveContent={hasPermission('manage_content') ? handleRemoveContent : null}
          onWarnAuthor={hasPermission('issue_warnings') ? handleWarnAuthor : null}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {viewerOpen && selectedContent && (
        <ContentViewer 
          content={selectedContent} 
          onClose={handleCloseViewer}
          onApprove={hasPermission('manage_content') ? () => handleApproveContent(selectedContent.id) : null}
          onRemove={hasPermission('manage_content') ? () => handleRemoveContent(selectedContent.id) : null}
          onWarn={hasPermission('issue_warnings') ? () => handleWarnAuthor(selectedContent.id) : null}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={
          confirmAction.type === 'approve' ? 'Aprovar Conteúdo' :
          confirmAction.type === 'remove' ? 'Remover Conteúdo' :
          confirmAction.type === 'warn' ? 'Enviar Aviso ao Autor' : ''
        }
        message={
          confirmAction.type === 'approve' ? 'Tem certeza que deseja aprovar este conteúdo? Isso removerá todas as denúncias.' :
          confirmAction.type === 'remove' ? 'Tem certeza que deseja remover este conteúdo? Ele não será mais visível para os usuários.' :
          confirmAction.type === 'warn' ? 'Tem certeza que deseja enviar um aviso ao autor deste conteúdo?' : ''
        }
        confirmText={
          confirmAction.type === 'approve' ? 'Aprovar' :
          confirmAction.type === 'remove' ? 'Remover' :
          confirmAction.type === 'warn' ? 'Enviar Aviso' : 'Confirmar'
        }
        confirmColor={
          confirmAction.type === 'approve' ? 'green' :
          confirmAction.type === 'remove' ? 'red' :
          confirmAction.type === 'warn' ? 'orange' : 'blue'
        }
      />
    </div>
  );
};

export default ContentModeration;

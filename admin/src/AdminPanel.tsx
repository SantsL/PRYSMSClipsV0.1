import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './AdminPanel.css';

// Componentes de layout
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Páginas do painel
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ContentModeration from './pages/ContentModeration';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Logs from './pages/Logs';
import Login from './pages/Login';

// Contexto de autenticação
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Componente de rota protegida
const ProtectedRoute = ({ element, requiredRole, ...rest }) => {
  const { currentUser, userRole, loading } = useAuth();
  
  // Enquanto verifica autenticação, mostra loading
  if (loading) {
    return <div className="loading-screen">Carregando...</div>;
  }
  
  // Se não estiver autenticado, redireciona para login
  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }
  
  // Se não tiver permissão necessária, redireciona para dashboard ou página de acesso negado
  if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }
  
  // Se tudo estiver ok, renderiza o componente
  return element;
};

// Layout principal do painel administrativo
const AdminLayout = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }
  
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <main className="admin-main">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

// Componente principal do painel administrativo
const AdminPanel = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminLayout>
                <ProtectedRoute element={<Dashboard />} />
              </AdminLayout>
            } 
          />
          
          <Route 
            path="/admin/users" 
            element={
              <AdminLayout>
                <ProtectedRoute element={<UserManagement />} />
              </AdminLayout>
            } 
          />
          
          <Route 
            path="/admin/content" 
            element={
              <AdminLayout>
                <ProtectedRoute element={<ContentModeration />} />
              </AdminLayout>
            } 
          />
          
          <Route 
            path="/admin/statistics" 
            element={
              <AdminLayout>
                <ProtectedRoute element={<Statistics />} requiredRole="admin" />
              </AdminLayout>
            } 
          />
          
          <Route 
            path="/admin/settings" 
            element={
              <AdminLayout>
                <ProtectedRoute element={<Settings />} requiredRole="admin" />
              </AdminLayout>
            } 
          />
          
          <Route 
            path="/admin/logs" 
            element={
              <AdminLayout>
                <ProtectedRoute element={<Logs />} requiredRole="admin" />
              </AdminLayout>
            } 
          />
          
          {/* Rota para qualquer outro caminho dentro de /admin */}
          <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AdminPanel;

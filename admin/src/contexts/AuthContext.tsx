import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Criar contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Simular verificação de autenticação ao carregar
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    // para verificar o token de autenticação armazenado
    const checkAuth = async () => {
      try {
        // Verificar se há token no localStorage
        const token = localStorage.getItem('adminToken');
        
        if (token) {
          // Simular validação do token
          // Em produção, isso seria uma chamada à API para validar o token
          setTimeout(() => {
            // Dados simulados do usuário autenticado
            const userData = {
              id: '1',
              name: 'Admin Principal',
              email: 'admin@prysmsclips.com',
              role: 'admin'
            };
            
            setCurrentUser(userData);
            setUserRole(userData.role);
            setLoading(false);
          }, 1000);
        } else {
          setCurrentUser(null);
          setUserRole(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        setCurrentUser(null);
        setUserRole(null);
        setError('Falha ao verificar autenticação');
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Função de login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      
      // Em um ambiente de produção, isso seria uma chamada à API
      // para autenticar o usuário e obter um token
      
      // Simulação de autenticação
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Verificar credenciais (simulado)
          if (email === 'admin@prysmsclips.com' && password === 'admin123') {
            // Admin
            const userData = {
              id: '1',
              name: 'Admin Principal',
              email: 'admin@prysmsclips.com',
              role: 'admin'
            };
            
            // Salvar token no localStorage (simulado)
            localStorage.setItem('adminToken', 'fake-jwt-token-admin');
            
            setCurrentUser(userData);
            setUserRole('admin');
            setLoading(false);
            resolve(userData);
          } else if (email === 'mod@prysmsclips.com' && password === 'mod123') {
            // Moderador
            const userData = {
              id: '2',
              name: 'Moderador',
              email: 'mod@prysmsclips.com',
              role: 'moderator'
            };
            
            // Salvar token no localStorage (simulado)
            localStorage.setItem('adminToken', 'fake-jwt-token-moderator');
            
            setCurrentUser(userData);
            setUserRole('moderator');
            setLoading(false);
            resolve(userData);
          } else {
            // Credenciais inválidas
            setError('Email ou senha incorretos');
            setLoading(false);
            reject(new Error('Email ou senha incorretos'));
          }
        }, 1000);
      });
    } catch (err) {
      setError(err.message || 'Falha ao fazer login');
      setLoading(false);
      throw err;
    }
  };
  
  // Função de logout
  const logout = () => {
    localStorage.removeItem('adminToken');
    setCurrentUser(null);
    setUserRole(null);
  };
  
  // Verificar se o usuário tem uma determinada permissão
  const hasPermission = (permission) => {
    // Lista de permissões por papel
    const permissions = {
      admin: [
        'manage_users',
        'manage_moderators',
        'manage_content',
        'view_statistics',
        'manage_settings',
        'view_logs',
        'manage_events',
        'manage_economy'
      ],
      moderator: [
        'manage_content',
        'view_reports',
        'issue_warnings',
        'temp_suspend_users'
      ]
    };
    
    // Se for admin, tem todas as permissões
    if (userRole === 'admin') {
      return true;
    }
    
    // Verificar se o papel do usuário tem a permissão específica
    return userRole && permissions[userRole] && permissions[userRole].includes(permission);
  };
  
  // Valor do contexto
  const value = {
    currentUser,
    userRole,
    loading,
    error,
    login,
    logout,
    hasPermission
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

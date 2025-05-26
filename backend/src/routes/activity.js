import React, { useState, useEffect } from 'react';
import './ActivityRoutes.js';

// Rotas para API de feed de atividades
const activityRoutes = (app, db, io) => {
  // Middleware para verificar autenticação
  const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    next();
  };

  // Obter feed de atividades (amigos ou global)
  app.get('/api/activities', authMiddleware, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { 
        friendsOnly = 'true', 
        filter = 'all',
        page = 0,
        limit = 20
      } = req.query;
      
      // Converter parâmetros
      const parsedFriendsOnly = friendsOnly === 'true';
      const parsedPage = parseInt(page);
      const parsedLimit = parseInt(limit);
      const skip = parsedPage * parsedLimit;
      
      // Construir filtro de consulta
      let query = {};
      
      // Filtrar por tipo de atividade
      if (filter !== 'all') {
        query.type = { $regex: `^${filter}` };
      }
      
      // Filtrar por amigos ou global
      if (parsedFriendsOnly) {
        // Buscar lista de amigos
        const friendships = await db.collection('friendships').find({
          $or: [
            { user1: userId, status: 'accepted' },
            { user2: userId, status: 'accepted' }
          ]
        }).toArray();
        
        // Extrair IDs dos amigos
        const friendIds = friendships.map(friendship => 
          friendship.user1 === userId ? friendship.user2 : friendship.user1
        );
        
        // Incluir próprio usuário no feed
        friendIds.push(userId);
        
        // Filtrar atividades dos amigos
        query.userId = { $in: friendIds };
      }
      
      // Buscar atividades
      const activities = await db.collection('activities')
        .find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .toArray();
      
      // Contar total para paginação
      const total = await db.collection('activities').countDocuments(query);
      
      // Enriquecer atividades com dados de usuário
      const enrichedActivities = await Promise.all(activities.map(async (activity) => {
        // Buscar dados do usuário
        const user = await db.collection('users').findOne(
          { _id: activity.userId },
          { projection: { displayName: 1, profile: 1 } }
        );
        
        // Adicionar dados do usuário à atividade
        return {
          ...activity,
          user: {
            id: activity.userId,
            name: user?.displayName || 'Usuário desconhecido',
            avatar: user?.profile?.basic?.avatar || '/default-avatar.png'
          },
          // Verificar se o usuário atual curtiu esta atividade
          userHasLiked: activity.likes && activity.likes.includes(userId)
        };
      }));
      
      res.json({
        activities: enrichedActivities,
        pagination: {
          total,
          page: parsedPage,
          limit: parsedLimit,
          hasMore: total > (skip + parsedLimit)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar feed de atividades:', error);
      res.status(500).json({ error: 'Erro ao buscar feed de atividades' });
    }
  });

  // Obter atividades de um usuário específico
  app.get('/api/users/:targetUserId/activities', authMiddleware, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { targetUserId } = req.params;
      const { page = 0, limit = 20 } = req.query;
      
      // Converter parâmetros
      const parsedPage = parseInt(page);
      const parsedLimit = parseInt(limit);
      const skip = parsedPage * parsedLimit;
      
      // Verificar se o usuário existe
      const targetUser = await db.collection('users').findOne({ _id: targetUserId });
      if (!targetUser) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      // Verificar permissões de visualização
      if (targetUser.privacy && targetUser.privacy.profileVisibility === 'friends' && userId !== targetUserId) {
        // Verificar se são amigos
        const areFriends = await db.collection('friendships').findOne({
          $or: [
            { user1: userId, user2: targetUserId, status: 'accepted' },
            { user1: targetUserId, user2: userId, status: 'accepted' }
          ]
        });
        
        if (!areFriends) {
          return res.status(403).json({ error: 'Você não tem permissão para ver as atividades deste usuário' });
        }
      }
      
      // Buscar atividades do usuário
      const activities = await db.collection('activities')
        .find({ userId: targetUserId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .toArray();
      
      // Contar total para paginação
      const total = await db.collection('activities').countDocuments({ userId: targetUserId });
      
      // Enriquecer atividades com dados de usuário
      const enrichedActivities = activities.map(activity => ({
        ...activity,
        user: {
          id: targetUserId,
          name: targetUser.displayName || 'Usuário desconhecido',
          avatar: targetUser.profile?.basic?.avatar || '/default-avatar.png'
        },
        userHasLiked: activity.likes && activity.likes.includes(userId)
      }));
      
      res.json({
        activities: enrichedActivities,
        pagination: {
          total,
          page: parsedPage,
          limit: parsedLimit,
          hasMore: total > (skip + parsedLimit)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar atividades do usuário:', error);
      res.status(500).json({ error: 'Erro ao buscar atividades do usuário' });
    }
  });

  // Curtir/descurtir uma atividade
  app.post('/api/activities/:activityId/like', authMiddleware, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { activityId } = req.params;
      
      // Buscar atividade
      const activity = await db.collection('activities').findOne({ _id: activityId });
      
      if (!activity) {
        return res.status(404).json({ error: 'Atividade não encontrada' });
      }
      
      // Verificar se o usuário já curtiu
      const likes = activity.likes || [];
      const alreadyLiked = likes.includes(userId);
      
      // Atualizar curtidas
      if (alreadyLiked) {
        // Remover curtida
        await db.collection('activities').updateOne(
          { _id: activityId },
          { $pull: { likes: userId } }
        );
      } else {
        // Adicionar curtida
        await db.collection('activities').updateOne(
          { _id: activityId },
          { $addToSet: { likes: userId } }
        );
        
        // Criar notificação para o dono da atividade (se não for o próprio usuário)
        if (activity.userId !== userId) {
          // Buscar nome do usuário que curtiu
          const user = await db.collection('users').findOne(
            { _id: userId },
            { projection: { displayName: 1 } }
          );
          
          const notification = {
            userId: activity.userId,
            type: 'activity_like',
            activityId,
            fromUserId: userId,
            fromUserName: user?.displayName || 'Alguém',
            read: false,
            timestamp: new Date()
          };
          
          await db.collection('notifications').insertOne(notification);
          
          // Notificar em tempo real se o usuário estiver online
          io.to(`user-${activity.userId}`).emit('notification', notification);
        }
      }
      
      // Retornar novo estado
      const updatedActivity = await db.collection('activities').findOne({ _id: activityId });
      
      res.json({
        liked: !alreadyLiked,
        likesCount: (updatedActivity.likes || []).length
      });
    } catch (error) {
      console.error('Erro ao curtir/descurtir atividade:', error);
      res.status(500).json({ error: 'Erro ao curtir/descurtir atividade' });
    }
  });

  // Comentar em uma atividade
  app.post('/api/activities/:activityId/comments', authMiddleware, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { activityId } = req.params;
      const { text } = req.body;
      
      // Validações
      if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Comentário não pode estar vazio' });
      }
      
      // Buscar atividade
      const activity = await db.collection('activities').findOne({ _id: activityId });
      
      if (!activity) {
        return res.status(404).json({ error: 'Atividade não encontrada' });
      }
      
      // Criar comentário
      const comment = {
        id: `comment-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId,
        text: text.trim(),
        timestamp: new Date()
      };
      
      // Adicionar comentário à atividade
      await db.collection('activities').updateOne(
        { _id: activityId },
        { $push: { comments: comment } }
      );
      
      // Buscar dados do usuário que comentou
      const user = await db.collection('users').findOne(
        { _id: userId },
        { projection: { displayName: 1, profile: 1 } }
      );
      
      // Enriquecer comentário com dados do usuário
      const enrichedComment = {
        ...comment,
        user: {
          id: userId,
          name: user?.displayName || 'Usuário desconhecido',
          avatar: user?.profile?.basic?.avatar || '/default-avatar.png'
        }
      };
      
      // Criar notificação para o dono da atividade (se não for o próprio usuário)
      if (activity.userId !== userId) {
        const notification = {
          userId: activity.userId,
          type: 'activity_comment',
          activityId,
          commentId: comment.id,
          fromUserId: userId,
          fromUserName: user?.displayName || 'Alguém',
          commentText: text.length > 50 ? `${text.substring(0, 50)}...` : text,
          read: false,
          timestamp: new Date()
        };
        
        await db.collection('notifications').insertOne(notification);
        
        // Notificar em tempo real se o usuário estiver online
        io.to(`user-${activity.userId}`).emit('notification', notification);
      }
      
      res.status(201).json(enrichedComment);
    } catch (error) {
      console.error('Erro ao comentar em atividade:', error);
      res.status(500).json({ error: 'Erro ao comentar em atividade' });
    }
  });

  // Obter comentários de uma atividade
  app.get('/api/activities/:activityId/comments', async (req, res) => {
    try {
      const { activityId } = req.params;
      
      // Buscar atividade
      const activity = await db.collection('activities').findOne(
        { _id: activityId },
        { projection: { comments: 1 } }
      );
      
      if (!activity) {
        return res.status(404).json({ error: 'Atividade não encontrada' });
      }
      
      const comments = activity.comments || [];
      
      // Enriquecer comentários com dados dos usuários
      const enrichedComments = await Promise.all(comments.map(async (comment) => {
        // Buscar dados do usuário
        const user = await db.collection('users').findOne(
          { _id: comment.userId },
          { projection: { displayName: 1, profile: 1 } }
        );
        
        // Adicionar dados do usuário ao comentário
        return {
          ...comment,
          user: {
            id: comment.userId,
            name: user?.displayName || 'Usuário desconhecido',
            avatar: user?.profile?.basic?.avatar || '/default-avatar.png'
          }
        };
      }));
      
      res.json(enrichedComments);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      res.status(500).json({ error: 'Erro ao buscar comentários' });
    }
  });

  // Registrar nova atividade (função auxiliar para uso interno)
  const createActivity = async (userId, type, content) => {
    try {
      const activity = {
        _id: `activity-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId,
        type,
        content,
        timestamp: new Date(),
        likes: [],
        comments: []
      };
      
      await db.collection('activities').insertOne(activity);
      
      // Notificar amigos em tempo real
      const friendships = await db.collection('friendships').find({
        $or: [
          { user1: userId, status: 'accepted' },
          { user2: userId, status: 'accepted' }
        ]
      }).toArray();
      
      // Extrair IDs dos amigos
      const friendIds = friendships.map(friendship => 
        friendship.user1 === userId ? friendship.user2 : friendship.user1
      );
      
      // Buscar dados do usuário
      const user = await db.collection('users').findOne(
        { _id: userId },
        { projection: { displayName: 1, profile: 1 } }
      );
      
      // Enriquecer atividade com dados do usuário
      const enrichedActivity = {
        ...activity,
        user: {
          id: userId,
          name: user?.displayName || 'Usuário desconhecido',
          avatar: user?.profile?.basic?.avatar || '/default-avatar.png'
        }
      };
      
      // Notificar amigos
      friendIds.forEach(friendId => {
        io.to(`user-${friendId}`).emit('new_activity', enrichedActivity);
      });
      
      return activity;
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      throw error;
    }
  };

  // Exportar função para uso em outras rotas
  app.locals.createActivity = createActivity;
};

export default activityRoutes;

import React, { useState, useEffect } from 'react';
import './StickersBackend.js';

// Rotas para API de stickers
const stickersRoutes = (app, db, upload, io) => {
  // Middleware para verificar autenticação
  const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    next();
  };

  // Middleware para verificar permissões de moderador
  const moderatorMiddleware = async (req, res, next) => {
    try {
      const user = await db.collection('users').findOne({ _id: req.session.userId });
      if (!user || !['admin', 'moderator'].includes(user.role)) {
        return res.status(403).json({ error: 'Permissão negada' });
      }
      next();
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  // Obter todos os stickers (com filtros)
  app.get('/api/stickers', async (req, res) => {
    try {
      const { category, search, limit = 50, skip = 0 } = req.query;
      
      // Construir filtro
      const filter = {};
      if (category && category !== 'all') {
        filter.category = category;
      }
      
      // Adicionar filtro de busca se fornecido
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }
      
      // Adicionar filtro de status (apenas aprovados para usuários normais)
      if (!req.session.userId || !(await isModeratorOrAdmin(req.session.userId, db))) {
        filter.status = 'approved';
      }
      
      // Buscar stickers
      const stickers = await db.collection('stickers')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .toArray();
      
      // Contar total para paginação
      const total = await db.collection('stickers').countDocuments(filter);
      
      res.json({
        stickers,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: total > (parseInt(skip) + parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Erro ao buscar stickers:', error);
      res.status(500).json({ error: 'Erro ao buscar stickers' });
    }
  });

  // Obter stickers de um usuário específico
  app.get('/api/users/:userId/stickers', async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit = 20, skip = 0 } = req.query;
      
      // Verificar se o usuário existe
      const user = await db.collection('users').findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      // Filtro para stickers do usuário
      const filter = { createdBy: userId };
      
      // Adicionar filtro de status (apenas aprovados para usuários normais)
      if (!req.session.userId || req.session.userId !== userId) {
        if (!(await isModeratorOrAdmin(req.session.userId, db))) {
          filter.status = 'approved';
        }
      }
      
      // Buscar stickers
      const stickers = await db.collection('stickers')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .toArray();
      
      res.json(stickers);
    } catch (error) {
      console.error('Erro ao buscar stickers do usuário:', error);
      res.status(500).json({ error: 'Erro ao buscar stickers do usuário' });
    }
  });

  // Obter detalhes de um sticker específico
  app.get('/api/stickers/:stickerId', async (req, res) => {
    try {
      const { stickerId } = req.params;
      
      // Buscar sticker
      const sticker = await db.collection('stickers').findOne({ _id: stickerId });
      
      if (!sticker) {
        return res.status(404).json({ error: 'Sticker não encontrado' });
      }
      
      // Verificar permissões para stickers não aprovados
      if (sticker.status !== 'approved') {
        // Apenas o criador ou moderadores podem ver stickers não aprovados
        if (!req.session.userId || 
            (req.session.userId !== sticker.createdBy && 
             !(await isModeratorOrAdmin(req.session.userId, db)))) {
          return res.status(403).json({ error: 'Permissão negada' });
        }
      }
      
      res.json(sticker);
    } catch (error) {
      console.error('Erro ao buscar sticker:', error);
      res.status(500).json({ error: 'Erro ao buscar sticker' });
    }
  });

  // Criar novo sticker
  app.post('/api/stickers', authMiddleware, upload.single('image'), async (req, res) => {
    try {
      const { name, tags, category } = req.body;
      const userId = req.session.userId;
      
      // Validações
      if (!name || !req.file) {
        return res.status(400).json({ error: 'Nome e imagem são obrigatórios' });
      }
      
      // Processar tags
      const processedTags = tags ? 
        (Array.isArray(tags) ? tags : JSON.parse(tags)) : [];
      
      // Verificar limites
      const userStickersCount = await db.collection('stickers').countDocuments({ 
        createdBy: userId,
        createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Últimas 24h
      });
      
      // Limite de 10 stickers por dia para usuários normais
      if (userStickersCount >= 10 && !(await isModeratorOrAdmin(userId, db))) {
        return res.status(429).json({ 
          error: 'Limite de criação de stickers atingido. Tente novamente amanhã.' 
        });
      }
      
      // Processar imagem (em um ambiente real, isso seria feito com uma biblioteca como Sharp)
      const imageUrl = `/uploads/stickers/${req.file.filename}`;
      
      // Criar sticker
      const newSticker = {
        _id: `sticker-${Date.now()}`,
        name,
        tags: processedTags,
        category: category || 'custom',
        imageUrl,
        createdBy: userId,
        createdAt: new Date(),
        status: 'pending_approval',
        usageCount: 0,
        favoritedBy: []
      };
      
      await db.collection('stickers').insertOne(newSticker);
      
      // Notificar moderadores sobre novo sticker para aprovação
      io.to('moderators').emit('new_sticker_for_approval', {
        stickerId: newSticker._id,
        name: newSticker.name,
        createdBy: userId
      });
      
      res.status(201).json(newSticker);
    } catch (error) {
      console.error('Erro ao criar sticker:', error);
      res.status(500).json({ error: 'Erro ao criar sticker' });
    }
  });

  // Aprovar/rejeitar sticker (apenas moderadores)
  app.patch('/api/stickers/:stickerId/moderate', authMiddleware, moderatorMiddleware, async (req, res) => {
    try {
      const { stickerId } = req.params;
      const { action, reason } = req.body;
      
      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({ error: 'Ação inválida' });
      }
      
      // Buscar sticker
      const sticker = await db.collection('stickers').findOne({ _id: stickerId });
      
      if (!sticker) {
        return res.status(404).json({ error: 'Sticker não encontrado' });
      }
      
      // Atualizar status
      const status = action === 'approve' ? 'approved' : 'rejected';
      
      await db.collection('stickers').updateOne(
        { _id: stickerId },
        { 
          $set: { 
            status,
            moderatedBy: req.session.userId,
            moderatedAt: new Date(),
            rejectionReason: status === 'rejected' ? reason : null
          } 
        }
      );
      
      // Notificar criador
      const notification = {
        userId: sticker.createdBy,
        type: 'sticker_moderation',
        title: status === 'approved' ? 'Sticker aprovado!' : 'Sticker rejeitado',
        message: status === 'approved' 
          ? `Seu sticker "${sticker.name}" foi aprovado e agora está disponível para uso.`
          : `Seu sticker "${sticker.name}" foi rejeitado. Motivo: ${reason || 'Não especificado'}`,
        read: false,
        createdAt: new Date()
      };
      
      await db.collection('notifications').insertOne(notification);
      
      // Notificar usuário em tempo real se estiver online
      io.to(`user-${sticker.createdBy}`).emit('notification', notification);
      
      res.json({ success: true, status });
    } catch (error) {
      console.error('Erro ao moderar sticker:', error);
      res.status(500).json({ error: 'Erro ao moderar sticker' });
    }
  });

  // Favoritar/desfavoritar sticker
  app.post('/api/stickers/:stickerId/favorite', authMiddleware, async (req, res) => {
    try {
      const { stickerId } = req.params;
      const userId = req.session.userId;
      
      // Verificar se o sticker existe e está aprovado
      const sticker = await db.collection('stickers').findOne({ _id: stickerId });
      
      if (!sticker) {
        return res.status(404).json({ error: 'Sticker não encontrado' });
      }
      
      if (sticker.status !== 'approved') {
        return res.status(400).json({ error: 'Apenas stickers aprovados podem ser favoritados' });
      }
      
      // Verificar se já está nos favoritos
      const isFavorited = sticker.favoritedBy && sticker.favoritedBy.includes(userId);
      
      // Atualizar lista de favoritos
      if (isFavorited) {
        // Remover dos favoritos
        await db.collection('stickers').updateOne(
          { _id: stickerId },
          { $pull: { favoritedBy: userId } }
        );
      } else {
        // Adicionar aos favoritos
        await db.collection('stickers').updateOne(
          { _id: stickerId },
          { $addToSet: { favoritedBy: userId } }
        );
        
        // Verificar limite de favoritos (máximo 20)
        const userFavorites = await db.collection('stickers').countDocuments({
          favoritedBy: userId
        });
        
        if (userFavorites > 20) {
          // Remover o favorito mais antigo
          const oldestFavorite = await db.collection('stickers')
            .find({ favoritedBy: userId })
            .sort({ createdAt: 1 })
            .limit(1)
            .toArray();
          
          if (oldestFavorite.length > 0) {
            await db.collection('stickers').updateOne(
              { _id: oldestFavorite[0]._id },
              { $pull: { favoritedBy: userId } }
            );
          }
        }
      }
      
      res.json({ success: true, favorited: !isFavorited });
    } catch (error) {
      console.error('Erro ao favoritar sticker:', error);
      res.status(500).json({ error: 'Erro ao favoritar sticker' });
    }
  });

  // Obter stickers favoritos do usuário
  app.get('/api/users/me/favorite-stickers', authMiddleware, async (req, res) => {
    try {
      const userId = req.session.userId;
      
      // Buscar stickers favoritos
      const favorites = await db.collection('stickers')
        .find({ 
          favoritedBy: userId,
          status: 'approved'
        })
        .sort({ createdAt: -1 })
        .toArray();
      
      res.json(favorites);
    } catch (error) {
      console.error('Erro ao buscar stickers favoritos:', error);
      res.status(500).json({ error: 'Erro ao buscar stickers favoritos' });
    }
  });

  // Função auxiliar para verificar se um usuário é moderador ou admin
  async function isModeratorOrAdmin(userId, db) {
    if (!userId) return false;
    
    const user = await db.collection('users').findOne({ _id: userId });
    return user && ['admin', 'moderator'].includes(user.role);
  }
};

export default stickersRoutes;

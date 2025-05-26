import React, { useState, useEffect } from 'react';
import './TagsRoutes.js';

// Rotas para API de tags de servidores
const tagsRoutes = (app, db) => {
  // Middleware para verificar autenticação
  const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    next();
  };

  // Obter todas as tags de servidores
  app.get('/api/server-tags', async (req, res) => {
    try {
      const { query = '', type, sort = 'popularity', limit = 50 } = req.query;
      
      // Construir filtro de consulta
      let filter = {};
      
      if (query) {
        filter.name = { $regex: query, $options: 'i' };
      }
      
      if (type && ['rp', 'pvp', 'category'].includes(type)) {
        filter.type = type;
      }
      
      // Definir ordenação
      let sortOption = {};
      switch (sort) {
        case 'popularity':
          sortOption = { popularity: -1 };
          break;
        case 'name':
          sortOption = { name: 1 };
          break;
        case 'recent':
          sortOption = { createdAt: -1 };
          break;
        default:
          sortOption = { popularity: -1 };
      }
      
      // Buscar tags
      const tags = await db.collection('server_tags')
        .find(filter)
        .sort(sortOption)
        .limit(parseInt(limit))
        .toArray();
      
      res.json(tags);
    } catch (error) {
      console.error('Erro ao buscar tags de servidores:', error);
      res.status(500).json({ error: 'Erro ao buscar tags de servidores' });
    }
  });

  // Obter tags populares
  app.get('/api/server-tags/popular', async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      
      // Buscar tags populares
      const popularTags = await db.collection('server_tags')
        .find({ status: 'approved' })
        .sort({ popularity: -1 })
        .limit(parseInt(limit))
        .toArray();
      
      res.json(popularTags);
    } catch (error) {
      console.error('Erro ao buscar tags populares:', error);
      res.status(500).json({ error: 'Erro ao buscar tags populares' });
    }
  });

  // Obter tags por tipo
  app.get('/api/server-tags/by-type/:type', async (req, res) => {
    try {
      const { type } = req.params;
      const { limit = 20 } = req.query;
      
      if (!['rp', 'pvp', 'category'].includes(type)) {
        return res.status(400).json({ error: 'Tipo de tag inválido' });
      }
      
      // Buscar tags por tipo
      const tags = await db.collection('server_tags')
        .find({ type, status: 'approved' })
        .sort({ popularity: -1 })
        .limit(parseInt(limit))
        .toArray();
      
      res.json(tags);
    } catch (error) {
      console.error('Erro ao buscar tags por tipo:', error);
      res.status(500).json({ error: 'Erro ao buscar tags por tipo' });
    }
  });

  // Sugerir tags para um clipe
  app.post('/api/clips/:clipId/suggest-tags', authMiddleware, async (req, res) => {
    try {
      const { clipId } = req.params;
      
      // Buscar clipe
      const clip = await db.collection('clips').findOne({ _id: clipId });
      
      if (!clip) {
        return res.status(404).json({ error: 'Clipe não encontrado' });
      }
      
      // Em um ambiente real, aqui usaríamos análise de conteúdo ou IA
      // para sugerir tags com base no conteúdo do clipe
      
      // Por enquanto, vamos retornar algumas tags populares
      const popularTags = await db.collection('server_tags')
        .find({ status: 'approved' })
        .sort({ popularity: -1 })
        .limit(5)
        .toArray();
      
      res.json({
        suggestions: popularTags.map(tag => ({
          id: tag._id,
          name: tag.name,
          type: tag.type,
          confidence: Math.random() * 0.5 + 0.5 // Simulação de confiança entre 0.5 e 1.0
        }))
      });
    } catch (error) {
      console.error('Erro ao sugerir tags:', error);
      res.status(500).json({ error: 'Erro ao sugerir tags' });
    }
  });

  // Adicionar tags a um clipe
  app.post('/api/clips/:clipId/tags', authMiddleware, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { clipId } = req.params;
      const { tags } = req.body;
      
      // Validações
      if (!Array.isArray(tags)) {
        return res.status(400).json({ error: 'Tags devem ser um array' });
      }
      
      if (tags.length > 5) {
        return res.status(400).json({ error: 'Máximo de 5 tags permitidas' });
      }
      
      // Buscar clipe
      const clip = await db.collection('clips').findOne({ _id: clipId });
      
      if (!clip) {
        return res.status(404).json({ error: 'Clipe não encontrado' });
      }
      
      // Verificar se o usuário é o dono do clipe
      if (clip.userId !== userId) {
        return res.status(403).json({ error: 'Você não tem permissão para editar este clipe' });
      }
      
      // Verificar se as tags existem e estão aprovadas
      const tagNames = tags.map(tag => tag.trim());
      const existingTags = await db.collection('server_tags')
        .find({ 
          name: { $in: tagNames },
          status: 'approved'
        })
        .toArray();
      
      const validTagNames = existingTags.map(tag => tag.name);
      
      // Verificar se há tags novas que precisam ser criadas
      const newTagNames = tagNames.filter(tag => !validTagNames.includes(tag));
      
      // Criar novas tags (com status pendente para moderação)
      if (newTagNames.length > 0) {
        const newTags = newTagNames.map(name => ({
          _id: `tag-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name,
          type: 'category', // Padrão para tags criadas por usuários
          popularity: 1,
          status: 'pending',
          createdBy: userId,
          createdAt: new Date()
        }));
        
        await db.collection('server_tags').insertMany(newTags);
        
        // Adicionar à lista de tags válidas
        validTagNames.push(...newTagNames);
      }
      
      // Atualizar clipe com as tags
      await db.collection('clips').updateOne(
        { _id: clipId },
        { $set: { tags: validTagNames } }
      );
      
      // Incrementar popularidade das tags existentes
      if (existingTags.length > 0) {
        await db.collection('server_tags').updateMany(
          { name: { $in: validTagNames } },
          { $inc: { popularity: 1 } }
        );
      }
      
      res.json({
        success: true,
        tags: validTagNames,
        pendingTags: newTagNames
      });
    } catch (error) {
      console.error('Erro ao adicionar tags ao clipe:', error);
      res.status(500).json({ error: 'Erro ao adicionar tags ao clipe' });
    }
  });

  // Buscar clipes por tag
  app.get('/api/clips/by-tag/:tagName', async (req, res) => {
    try {
      const { tagName } = req.params;
      const { page = 0, limit = 20, sort = 'recent' } = req.query;
      
      // Converter parâmetros
      const parsedPage = parseInt(page);
      const parsedLimit = parseInt(limit);
      const skip = parsedPage * parsedLimit;
      
      // Definir ordenação
      let sortOption = {};
      switch (sort) {
        case 'recent':
          sortOption = { createdAt: -1 };
          break;
        case 'popular':
          sortOption = { views: -1 };
          break;
        case 'likes':
          sortOption = { likesCount: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
      
      // Buscar clipes com a tag especificada
      const clips = await db.collection('clips')
        .find({ 
          tags: tagName,
          status: 'approved'
        })
        .sort(sortOption)
        .skip(skip)
        .limit(parsedLimit)
        .toArray();
      
      // Contar total para paginação
      const total = await db.collection('clips').countDocuments({ 
        tags: tagName,
        status: 'approved'
      });
      
      // Enriquecer clipes com dados dos usuários
      const enrichedClips = await Promise.all(clips.map(async (clip) => {
        // Buscar dados do usuário
        const user = await db.collection('users').findOne(
          { _id: clip.userId },
          { projection: { displayName: 1, profile: 1 } }
        );
        
        // Adicionar dados do usuário ao clipe
        return {
          ...clip,
          user: {
            id: clip.userId,
            name: user?.displayName || 'Usuário desconhecido',
            avatar: user?.profile?.basic?.avatar || '/default-avatar.png'
          }
        };
      }));
      
      res.json({
        clips: enrichedClips,
        pagination: {
          total,
          page: parsedPage,
          limit: parsedLimit,
          hasMore: total > (skip + parsedLimit)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar clipes por tag:', error);
      res.status(500).json({ error: 'Erro ao buscar clipes por tag' });
    }
  });

  // Sugerir nova tag (para moderação)
  app.post('/api/server-tags/suggest', authMiddleware, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { name, type = 'category', description } = req.body;
      
      // Validações
      if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Nome da tag deve ter pelo menos 2 caracteres' });
      }
      
      if (!['rp', 'pvp', 'category'].includes(type)) {
        return res.status(400).json({ error: 'Tipo de tag inválido' });
      }
      
      // Verificar se a tag já existe
      const existingTag = await db.collection('server_tags').findOne({
        name: { $regex: `^${name.trim()}$`, $options: 'i' }
      });
      
      if (existingTag) {
        return res.status(409).json({ error: 'Esta tag já existe' });
      }
      
      // Criar nova tag com status pendente
      const newTag = {
        _id: `tag-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: name.trim(),
        type,
        description: description?.trim() || '',
        popularity: 0,
        status: 'pending',
        createdBy: userId,
        createdAt: new Date()
      };
      
      await db.collection('server_tags').insertOne(newTag);
      
      res.status(201).json({
        success: true,
        message: 'Tag sugerida com sucesso e aguardando aprovação',
        tag: newTag
      });
    } catch (error) {
      console.error('Erro ao sugerir nova tag:', error);
      res.status(500).json({ error: 'Erro ao sugerir nova tag' });
    }
  });

  // Rota para moderadores aprovarem/rejeitarem tags
  app.patch('/api/admin/server-tags/:tagId/status', authMiddleware, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { tagId } = req.params;
      const { status, reason } = req.body;
      
      // Verificar se o usuário é moderador
      const user = await db.collection('users').findOne({ _id: userId });
      
      if (!user || !user.roles || !user.roles.includes('moderator')) {
        return res.status(403).json({ error: 'Você não tem permissão para moderar tags' });
      }
      
      // Validar status
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }
      
      // Buscar tag
      const tag = await db.collection('server_tags').findOne({ _id: tagId });
      
      if (!tag) {
        return res.status(404).json({ error: 'Tag não encontrada' });
      }
      
      // Atualizar status da tag
      await db.collection('server_tags').updateOne(
        { _id: tagId },
        { 
          $set: { 
            status,
            moderatedBy: userId,
            moderatedAt: new Date(),
            rejectionReason: status === 'rejected' ? reason : undefined
          }
        }
      );
      
      // Notificar usuário que criou a tag
      if (tag.createdBy) {
        const notification = {
          userId: tag.createdBy,
          type: 'tag_moderation',
          tagId,
          tagName: tag.name,
          status,
          reason: status === 'rejected' ? reason : undefined,
          read: false,
          timestamp: new Date()
        };
        
        await db.collection('notifications').insertOne(notification);
      }
      
      res.json({
        success: true,
        message: `Tag ${status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso`
      });
    } catch (error) {
      console.error('Erro ao moderar tag:', error);
      res.status(500).json({ error: 'Erro ao moderar tag' });
    }
  });
};

export default tagsRoutes;

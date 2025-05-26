import React, { useState, useEffect } from 'react';
import './ProfileRoutes.js';

// Rotas para API de perfis
const profileRoutes = (app, db, upload, io) => {
  // Middleware para verificar autenticação
  const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    next();
  };

  // Obter perfil público de um usuário
  app.get('/api/users/:userId/profile', async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Buscar usuário
      const user = await db.collection('users').findOne({ _id: userId });
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      // Verificar configurações de privacidade
      if (user.privacy && user.privacy.profileVisibility === 'friends') {
        // Verificar se o usuário logado é amigo
        if (!req.session.userId) {
          return res.status(403).json({ error: 'Este perfil é privado' });
        }
        
        const friendship = await db.collection('friendships').findOne({
          $or: [
            { user1: req.session.userId, user2: userId },
            { user1: userId, user2: req.session.userId }
          ],
          status: 'accepted'
        });
        
        if (!friendship) {
          return res.status(403).json({ error: 'Este perfil é visível apenas para amigos' });
        }
      } else if (user.privacy && user.privacy.profileVisibility === 'registered' && !req.session.userId) {
        return res.status(403).json({ error: 'Este perfil é visível apenas para usuários registrados' });
      }
      
      // Construir objeto de perfil público
      const profile = {
        userId: user._id,
        basic: {
          displayName: user.displayName || user.username,
          tagline: user.profile?.tagline || '',
          avatar: user.profile?.avatar || '/default-avatar.png',
          banner: user.profile?.banner || '/default-banner.png',
        },
        visual: {
          themeColor: user.profile?.visual?.themeColor || '#4f46e5',
          avatarFrame: user.profile?.visual?.avatarFrame || 'default',
          nameFont: user.profile?.visual?.nameFont || 'default',
          profileLayout: user.profile?.visual?.profileLayout || 'standard',
        },
        social: {
          status: user.profile?.social?.status || '',
          favoriteGames: user.profile?.social?.favoriteGames || [],
          socialLinks: user.profile?.social?.socialLinks || {},
          showStats: user.profile?.social?.showStats !== false,
        },
        badges: {
          showcase: user.profile?.badges?.showcase || []
        },
        joinDate: user.createdAt,
        lastActive: user.lastActive
      };
      
      // Adicionar informações de clã se o usuário pertencer a um
      if (user.clanId) {
        const clan = await db.collection('clans').findOne({ _id: user.clanId });
        if (clan) {
          profile.clan = {
            id: clan._id,
            name: clan.name,
            tag: clan.tag,
            emblem: clan.emblem,
            role: clan.members.find(m => m.userId === userId)?.role || 'Membro'
          };
        }
      }
      
      // Adicionar estatísticas se permitido
      if (profile.social.showStats) {
        // Buscar estatísticas
        const stats = await db.collection('user_stats').findOne({ userId });
        
        if (stats) {
          profile.stats = {
            clipsUploaded: stats.clipsUploaded || 0,
            clipsLiked: stats.clipsLiked || 0,
            totalViews: stats.totalViews || 0,
            prysmsEarned: stats.prysmsEarned || 0,
            rank: stats.rank || 'Bronze',
            rankPosition: stats.rankPosition || 0
          };
        }
      }
      
      // Buscar conteúdo do usuário (clipes, loadouts, conquistas)
      // Clipes
      if (!user.privacy?.hideClips) {
        const clips = await db.collection('clips')
          .find({ userId, status: 'approved' })
          .sort({ createdAt: -1 })
          .limit(6)
          .toArray();
        
        profile.content = {
          clips: clips.map(clip => ({
            id: clip._id,
            title: clip.title,
            thumbnail: clip.thumbnail,
            views: clip.views || 0,
            likes: clip.likes?.length || 0,
            date: clip.createdAt
          }))
        };
      }
      
      // Loadouts
      if (!user.privacy?.hideLoadouts) {
        const loadouts = await db.collection('loadouts')
          .find({ userId })
          .sort({ votes: -1 })
          .limit(4)
          .toArray();
        
        profile.content = {
          ...profile.content,
          loadouts: loadouts.map(loadout => ({
            id: loadout._id,
            name: loadout.name,
            thumbnail: loadout.thumbnail,
            votes: loadout.votes || 0,
            date: loadout.createdAt
          }))
        };
      }
      
      // Conquistas
      const achievements = await db.collection('user_achievements')
        .find({ userId })
        .sort({ unlockedAt: -1 })
        .limit(10)
        .toArray();
      
      profile.content = {
        ...profile.content,
        achievements: achievements.map(achievement => ({
          id: achievement.achievementId,
          name: achievement.name,
          icon: achievement.icon,
          date: achievement.unlockedAt
        }))
      };
      
      res.json(profile);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
  });

  // Obter perfil completo do usuário atual (para edição)
  app.get('/api/users/me/profile', authMiddleware, async (req, res) => {
    try {
      const userId = req.session.userId;
      
      // Buscar usuário com todas as informações
      const user = await db.collection('users').findOne({ _id: userId });
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      // Construir objeto de perfil completo
      const profile = {
        userId: user._id,
        basic: {
          displayName: user.displayName || user.username,
          tagline: user.profile?.tagline || '',
          avatar: user.profile?.avatar || '/default-avatar.png',
          banner: user.profile?.banner || '/default-banner.png',
        },
        visual: {
          themeColor: user.profile?.visual?.themeColor || '#4f46e5',
          avatarFrame: user.profile?.visual?.avatarFrame || 'default',
          nameFont: user.profile?.visual?.nameFont || 'default',
          profileLayout: user.profile?.visual?.profileLayout || 'standard',
        },
        social: {
          status: user.profile?.social?.status || '',
          favoriteGames: user.profile?.social?.favoriteGames || [],
          socialLinks: user.profile?.social?.socialLinks || {},
          showStats: user.profile?.social?.showStats !== false,
        },
        badges: {
          selected: user.profile?.badges?.selected || [],
          showcase: user.profile?.badges?.showcase || []
        },
        privacy: user.privacy || {
          profileVisibility: 'public',
          hideClips: false,
          hideLoadouts: false,
          hideStats: false
        },
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        lastActive: user.lastActive
      };
      
      // Buscar stickers favoritos
      const favoriteStickers = await db.collection('stickers')
        .find({ 
          favoritedBy: userId,
          status: 'approved'
        })
        .sort({ createdAt: -1 })
        .toArray();
      
      profile.stickers = {
        favorites: favoriteStickers.map(s => s._id),
        recent: [] // Seria preenchido com base no histórico de uso
      };
      
      // Buscar stickers criados pelo usuário
      const createdStickers = await db.collection('stickers')
        .find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .toArray();
      
      profile.stickers.created = createdStickers.map(s => s._id);
      
      // Buscar conquistas disponíveis
      const achievements = await db.collection('user_achievements')
        .find({ userId })
        .toArray();
      
      profile.achievements = achievements.map(a => ({
        id: a.achievementId,
        name: a.name,
        icon: a.icon,
        description: a.description,
        unlockedAt: a.unlockedAt
      }));
      
      res.json(profile);
    } catch (error) {
      console.error('Erro ao buscar perfil completo:', error);
      res.status(500).json({ error: 'Erro ao buscar perfil completo' });
    }
  });

  // Atualizar perfil do usuário
  app.patch('/api/users/me/profile', authMiddleware, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { basic, visual, social, badges, privacy } = req.body;
      
      // Validações
      if (basic?.displayName && (basic.displayName.length < 3 || basic.displayName.length > 20)) {
        return res.status(400).json({ error: 'Nome de exibição deve ter entre 3 e 20 caracteres' });
      }
      
      if (basic?.tagline && basic.tagline.length > 50) {
        return res.status(400).json({ error: 'Tagline deve ter no máximo 50 caracteres' });
      }
      
      // Verificar palavras proibidas (em um ambiente real, isso seria mais robusto)
      const prohibitedWords = ['palavrão1', 'palavrão2', 'ofensa1', 'ofensa2'];
      
      if (basic?.displayName && prohibitedWords.some(word => basic.displayName.toLowerCase().includes(word))) {
        return res.status(400).json({ error: 'Nome de exibição contém palavras proibidas' });
      }
      
      if (basic?.tagline && prohibitedWords.some(word => basic.tagline.toLowerCase().includes(word))) {
        return res.status(400).json({ error: 'Tagline contém palavras proibidas' });
      }
      
      // Construir objeto de atualização
      const updateObj = { $set: { } };
      
      if (basic) {
        updateObj.$set['profile.basic'] = basic;
        
        // Atualizar displayName separadamente (é usado em várias partes do sistema)
        if (basic.displayName) {
          updateObj.$set.displayName = basic.displayName;
        }
      }
      
      if (visual) {
        updateObj.$set['profile.visual'] = visual;
      }
      
      if (social) {
        // Limitar número de jogos favoritos
        if (social.favoriteGames && social.favoriteGames.length > 5) {
          social.favoriteGames = social.favoriteGames.slice(0, 5);
        }
        
        updateObj.$set['profile.social'] = social;
      }
      
      if (badges) {
        // Limitar número de badges em destaque
        if (badges.showcase && badges.showcase.length > 3) {
          badges.showcase = badges.showcase.slice(0, 3);
        }
        
        updateObj.$set['profile.badges'] = badges;
      }
      
      if (privacy) {
        updateObj.$set.privacy = privacy;
      }
      
      // Atualizar perfil
      await db.collection('users').updateOne(
        { _id: userId },
        updateObj
      );
      
      // Atualizar lastActive
      await db.collection('users').updateOne(
        { _id: userId },
        { $set: { lastActive: new Date() } }
      );
      
      res.json({ success: true, message: 'Perfil atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  });

  // Upload de avatar
  app.post('/api/users/me/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    try {
      const userId = req.session.userId;
      
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }
      
      // Em um ambiente real, processaríamos a imagem aqui (redimensionar, otimizar, etc.)
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      
      // Atualizar avatar do usuário
      await db.collection('users').updateOne(
        { _id: userId },
        { $set: { 'profile.basic.avatar': avatarUrl } }
      );
      
      res.json({ success: true, avatarUrl });
    } catch (error) {
      console.error('Erro ao fazer upload de avatar:', error);
      res.status(500).json({ error: 'Erro ao fazer upload de avatar' });
    }
  });

  // Upload de banner
  app.post('/api/users/me/banner', authMiddleware, upload.single('banner'), async (req, res) => {
    try {
      const userId = req.session.userId;
      
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }
      
      // Em um ambiente real, processaríamos a imagem aqui (redimensionar, otimizar, etc.)
      const bannerUrl = `/uploads/banners/${req.file.filename}`;
      
      // Atualizar banner do usuário
      await db.collection('users').updateOne(
        { _id: userId },
        { $set: { 'profile.basic.banner': bannerUrl } }
      );
      
      res.json({ success: true, bannerUrl });
    } catch (error) {
      console.error('Erro ao fazer upload de banner:', error);
      res.status(500).json({ error: 'Erro ao fazer upload de banner' });
    }
  });

  // Obter badges disponíveis para o usuário
  app.get('/api/users/me/available-badges', authMiddleware, async (req, res) => {
    try {
      const userId = req.session.userId;
      
      // Buscar conquistas do usuário
      const userAchievements = await db.collection('user_achievements')
        .find({ userId })
        .toArray();
      
      // Buscar badges disponíveis para compra
      const storeBadges = await db.collection('store_items')
        .find({ 
          type: 'badge',
          available: true
        })
        .toArray();
      
      // Verificar quais badges da loja o usuário já possui
      const userItems = await db.collection('user_items')
        .find({ 
          userId,
          itemType: 'badge'
        })
        .toArray();
      
      const purchasedBadgeIds = userItems.map(item => item.itemId);
      
      // Combinar badges de conquistas e da loja
      const badges = [
        ...userAchievements.map(achievement => ({
          id: achievement.achievementId,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          type: 'achievement',
          unlockedAt: achievement.unlockedAt
        })),
        ...storeBadges
          .filter(badge => purchasedBadgeIds.includes(badge._id))
          .map(badge => ({
            id: badge._id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            type: 'store',
            purchasedAt: userItems.find(item => item.itemId === badge._id)?.purchasedAt
          }))
      ];
      
      res.json(badges);
    } catch (error) {
      console.error('Erro ao buscar badges disponíveis:', error);
      res.status(500).json({ error: 'Erro ao buscar badges disponíveis' });
    }
  });
};

export default profileRoutes;

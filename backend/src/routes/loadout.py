from flask import Blueprint, request, jsonify, session
import json

loadout_bp = Blueprint('loadout', __name__, url_prefix='/api/loadout')

# Simulação de banco de dados de armas
weapons_db = [
    {
        "id": "weapon1",
        "name": "AK-47",
        "type": "Rifle",
        "image": "/static/assets/weapons/ak47.png"
    },
    {
        "id": "weapon2",
        "name": "M4A4",
        "type": "Rifle",
        "image": "/static/assets/weapons/m4a4.png"
    },
    {
        "id": "weapon3",
        "name": "AWP",
        "type": "Sniper",
        "image": "/static/assets/weapons/awp.png"
    },
    {
        "id": "weapon4",
        "name": "Desert Eagle",
        "type": "Pistol",
        "image": "/static/assets/weapons/deagle.png"
    }
]

# Simulação de banco de dados de skins
skins_db = [
    {
        "id": "skin1",
        "name": "Neon Rider",
        "weapon_id": "weapon1",
        "rarity": "Covert",
        "image": "/static/assets/skins/ak47_neon_rider.png"
    },
    {
        "id": "skin2",
        "name": "Asiimov",
        "weapon_id": "weapon2",
        "rarity": "Covert",
        "image": "/static/assets/skins/m4a4_asiimov.png"
    },
    {
        "id": "skin3",
        "name": "Dragon Lore",
        "weapon_id": "weapon3",
        "rarity": "Covert",
        "image": "/static/assets/skins/awp_dragon_lore.png"
    },
    {
        "id": "skin4",
        "name": "Blaze",
        "weapon_id": "weapon4",
        "rarity": "Restricted",
        "image": "/static/assets/skins/deagle_blaze.png"
    }
]

# Simulação de banco de dados de stickers
stickers_db = [
    {
        "id": "sticker1",
        "name": "Miamo Flow (Holo)",
        "rarity": "Exotic",
        "image": "/static/assets/stickers/miamo_flow_holo.png"
    },
    {
        "id": "sticker2",
        "name": "Entropiq (Holo)",
        "rarity": "Exotic",
        "image": "/static/assets/stickers/entropiq_holo.png"
    },
    {
        "id": "sticker3",
        "name": "Lit (Holo)",
        "rarity": "Exotic",
        "image": "/static/assets/stickers/lit_holo.png"
    }
]

# Simulação de banco de dados de loadouts criados pelos usuários
loadouts_db = [
    {
        "id": "loadout1",
        "user_id": "user1",
        "username": "ProGamer123",
        "weapon_id": "weapon1",
        "skin_id": "skin1",
        "stickers": ["sticker1", "sticker3"],
        "color": "#FF5500",
        "votes": 120,
        "created_at": "2025-05-20T14:30:00Z"
    }
]

@loadout_bp.route('/weapons', methods=['GET'])
def get_weapons():
    return jsonify({
        "status": "success",
        "weapons": weapons_db
    })

@loadout_bp.route('/skins', methods=['GET'])
def get_skins():
    weapon_id = request.args.get('weapon_id', None)
    
    if weapon_id:
        filtered_skins = [skin for skin in skins_db if skin['weapon_id'] == weapon_id]
    else:
        filtered_skins = skins_db
    
    return jsonify({
        "status": "success",
        "skins": filtered_skins
    })

@loadout_bp.route('/stickers', methods=['GET'])
def get_stickers():
    return jsonify({
        "status": "success",
        "stickers": stickers_db
    })

@loadout_bp.route('/loadouts', methods=['GET'])
def get_loadouts():
    return jsonify({
        "status": "success",
        "loadouts": loadouts_db
    })

@loadout_bp.route('/loadouts', methods=['POST'])
def create_loadout():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Usuário não autenticado"
        }), 401
    
    data = request.get_json()
    weapon_id = data.get('weapon_id')
    skin_id = data.get('skin_id')
    stickers = data.get('stickers', [])
    color = data.get('color', "#FFFFFF")
    
    # Validar se a arma e a skin existem
    weapon_exists = any(weapon['id'] == weapon_id for weapon in weapons_db)
    skin_exists = any(skin['id'] == skin_id for skin in skins_db)
    
    if not weapon_exists or not skin_exists:
        return jsonify({
            "status": "error",
            "message": "Arma ou skin inválida"
        }), 400
    
    # Criar novo loadout
    new_loadout = {
        "id": f"loadout{len(loadouts_db) + 1}",
        "user_id": user_id,
        "username": "Username do Usuário",  # Em uma implementação real, seria obtido do banco de dados
        "weapon_id": weapon_id,
        "skin_id": skin_id,
        "stickers": stickers,
        "color": color,
        "votes": 0,
        "created_at": "2025-05-25T00:00:00Z"  # Em uma implementação real, seria a data atual
    }
    
    loadouts_db.append(new_loadout)
    
    return jsonify({
        "status": "success",
        "message": "Loadout criado com sucesso",
        "loadout": new_loadout
    }), 201

@loadout_bp.route('/loadouts/<loadout_id>/vote', methods=['POST'])
def vote_loadout(loadout_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Usuário não autenticado"
        }), 401
    
    for loadout in loadouts_db:
        if loadout['id'] == loadout_id:
            loadout['votes'] += 1
            return jsonify({
                "status": "success",
                "message": "Voto registrado com sucesso",
                "votes": loadout['votes']
            })
    
    return jsonify({
        "status": "error",
        "message": "Loadout não encontrado"
    }), 404
